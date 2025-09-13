"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import {
  RefreshCw,
  Search,
  Users,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  User,
  Calendar,
  Clock,
  AlertTriangle,
  CreditCard,
  CalendarClock,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// ---- Types -----------------------------------------------------------------------------

// Matches DB after migration: stripe_subscription_id can be null for one-time purchases.
// Optional purchase_type for clarity ('subscription' | 'one_time').
interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  interval: string;
  current_period_end: string;
  current_period_start: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null; // <-- important
  purchase_type?: "subscription" | "one_time";
  // tolerated optional fields:
  is_in_trial?: boolean | null;
  trial_start?: string | null;
  trial_end?: string | null;
  metadata?: Record<string, unknown> | null;
}

interface User {
  id: string;
  email: string | null;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
}

interface SubscriptionWithUser extends Subscription {
  user: User | null;
}

// ---- Component -------------------------------------------------------------------------

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithUser[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<SubscriptionWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [intervalFilter, setIntervalFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    canceled: 0,
    pro: 0,
    business: 0,
    monthly: 0,
    annually: 0,
    quarterlyRevenue: 0,
    annualRevenue: 0,
    cancelNextPeriod: 0,
  });

  const router = useRouter();
  const supabase = createBrowserClient();

  // Stats (case-insensitive plan ids)
  const calculateStats = useCallback((subs: SubscriptionWithUser[]) => {
    const statsData = {
      total: subs.length,
      active: subs.filter((s) => s.status === "active").length,
      canceled: subs.filter((s) => s.status === "canceled").length,
      pro: subs.filter((s) => s.plan_id?.toLowerCase() === "pro").length,
      business: subs.filter((s) => s.plan_id?.toLowerCase() === "business").length,
      monthly: subs.filter((s) => s.interval === "monthly").length,
      annually: subs.filter((s) => s.interval === "annually").length,
      cancelNextPeriod: subs.filter((s) => s.cancel_at_period_end).length,
      quarterlyRevenue: 0,
      annualRevenue: 0,
    };

    // Placeholder prices (adjust to your real numbers if needed)
    const proPriceMonthly = 9.99;
    const businessPriceMonthly = 19.99;

    subs.forEach((s) => {
      if (s.status === "active") {
        const planKey = s.plan_id?.toLowerCase();
        const monthlyPrice =
          planKey === "pro" ? proPriceMonthly : planKey === "business" ? businessPriceMonthly : 0;

        const monthMultiplier =
          s.interval === "monthly"
            ? 1
            : s.interval === "quarterly"
            ? 3
            : s.interval === "annually"
            ? 12
            : 1;

        statsData.quarterlyRevenue += monthlyPrice * Math.min(3, monthMultiplier);
        statsData.annualRevenue += monthlyPrice * Math.min(12, monthMultiplier);
      }
    });

    statsData.quarterlyRevenue = Math.round(statsData.quarterlyRevenue * 100) / 100;
    statsData.annualRevenue = Math.round(statsData.annualRevenue * 100) / 100;

    setStats(statsData);
  }, []);

  // Apply filters to subscriptions
  const applyFilters = useCallback(
    (
      subs: SubscriptionWithUser[],
      search: string,
      status: string,
      plan: string,
      interval: string
    ) => {
      let filtered = [...subs];

      // search by email, full_name, subscription id (safe with nulls)
      if (search) {
        const lowerSearch = search.toLowerCase();
        filtered = filtered.filter(
          (sub) =>
            (sub.user?.email?.toLowerCase().includes(lowerSearch) ?? false) ||
            (sub.user?.full_name?.toLowerCase().includes(lowerSearch) ?? false) ||
            ((sub.stripe_subscription_id ?? "").toLowerCase().includes(lowerSearch))
        );
      }

      // status filter
      if (status !== "all") {
        if (status === "expiring_soon") {
          const sevenDaysFromNow = new Date();
          sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

          filtered = filtered.filter((sub) => {
            const endDate = new Date(sub.current_period_end);
            return endDate <= sevenDaysFromNow && sub.status === "active";
          });
        } else {
          filtered = filtered.filter((sub) => sub.status === status);
        }
      }

      // plan filter (case-insensitive)
      if (plan !== "all") {
        filtered = filtered.filter((sub) => sub.plan_id?.toLowerCase() === plan.toLowerCase());
      }

      // interval filter
      if (interval !== "all") {
        filtered = filtered.filter((sub) => sub.interval === interval);
      }

      // pagination
      const totalFilteredPages = Math.ceil(filtered.length / itemsPerPage);
      setTotalPages(totalFilteredPages || 1);

      if (currentPage > totalFilteredPages) {
        setCurrentPage(1);
      }

      setFilteredSubscriptions(filtered);
    },
    [currentPage, itemsPerPage]
  );

  // Fetch subscriptions with user info
  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select(
          `
          *,
          user:user_id (
            id,
            email,
            full_name,
            first_name,
            last_name
          )
        `
        )
        .order("created_at", { ascending: false });

      if (subscriptionError) throw subscriptionError;

      const processed: SubscriptionWithUser[] = (subscriptionData || []).map((sub: any) => ({
        ...sub,
        user: sub.user && typeof sub.user === "object" ? (sub.user as User) : null,
      }));

      setSubscriptions(processed);

      // initial filter + stats
      applyFilters(processed, searchTerm, statusFilter, planFilter, intervalFilter);
      calculateStats(processed);
    } catch (err: any) {
      console.error("Error fetching subscriptions:", err);
      setError(err.message || "Failed to load subscriptions");
    } finally {
      setIsLoading(false);
    }
  }, [supabase, searchTerm, statusFilter, planFilter, intervalFilter, applyFilters, calculateStats]);

  // Refresh button handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchSubscriptions();
    setIsRefreshing(false);
  }, [fetchSubscriptions]);

  // ---- Action handlers (added back) ----------------------------------------------------

  const handleCancelSubscription = useCallback(
    async (subscription: SubscriptionWithUser) => {
      try {
        const response = await fetch(`/api/oslo/subscriptions?id=${subscription.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cancelAtPeriodEnd: true, updateStripe: true }),
        });
        if (!response.ok) throw new Error("Failed to cancel subscription");
        await fetchSubscriptions();
      } catch (err: any) {
        console.error("Error cancelling subscription:", err);
        setError(err.message || "Failed to cancel subscription");
      }
    },
    [fetchSubscriptions]
  );

  const handleExtendSubscription = useCallback(
    async (subscription: SubscriptionWithUser) => {
      try {
        const response = await fetch(`/api/oslo/subscriptions?id=${subscription.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ extendPeriod: true, extendDays: 30 }),
        });
        if (!response.ok) throw new Error("Failed to extend subscription");
        await fetchSubscriptions();
      } catch (err: any) {
        console.error("Error extending subscription:", err);
        setError(err.message || "Failed to extend subscription");
      }
    },
    [fetchSubscriptions]
  );

  // On mount & when deps change per useCallback
  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Re-apply filters if inputs change
  useEffect(() => {
    applyFilters(subscriptions, searchTerm, statusFilter, planFilter, intervalFilter);
  }, [searchTerm, statusFilter, planFilter, intervalFilter, subscriptions, applyFilters]);

  // Pagination helpers
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubscriptions = filteredSubscriptions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => setCurrentPage(page);

  // Navigation helpers
  const handleViewUser = (userId: string) => router.push(`/oslo/users/${userId}`);
  const handleViewSubscription = (subscriptionId: string) => router.push(`/oslo/subscriptions/${subscriptionId}`);

  // Utils
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  const getDaysRemaining = (endDateStr: string) => {
    const endDate = new Date(endDateStr);
    const currentDate = new Date();
    endDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    const timeDiff = endDate.getTime() - currentDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner className="h-8 w-8 mr-3" />
        <p className="text-lg">Loading subscriptions...</p>
      </div>
    );
  }

  // ---- UI ------------------------------------------------------------------------------

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground">Manage and monitor user subscriptions</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" className="h-9 w-full sm:w-auto">
          {isRefreshing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active: {stats.active} | Canceled: {stats.canceled}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pro vs Business</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.pro} / {stats.business}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pro: {stats.pro} | Business: {stats.business}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.quarterlyRevenue / 3).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Quarterly: ${stats.quarterlyRevenue.toFixed(2)} | Annual: ${stats.annualRevenue.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cancellations</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cancelNextPeriod}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.cancelNextPeriod} subscriptions will end at period end
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by email or subscription ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
              <SelectItem value="past_due">Past Due</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
              <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
            </SelectContent>
          </Select>

          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>

          <Select value={intervalFilter} onValueChange={setIntervalFilter}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Intervals</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Subscriptions</CardTitle>
            <CardDescription>
              {filteredSubscriptions.length} {filteredSubscriptions.length === 1 ? "subscription" : "subscriptions"} found
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-sm">User</th>
                  <th className="text-left p-3 font-medium text-sm">Plan</th>
                  <th className="text-left p-3 font-medium text-sm">Status</th>
                  <th className="text-left p-3 font-medium text-sm">Period</th>
                  <th className="text-right p-3 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubscriptions.length > 0 ? (
                  paginatedSubscriptions.map((subscription) => {
                    const planKey = subscription.plan_id?.toLowerCase?.() ?? subscription.plan_id;
                    return (
                      <tr key={subscription.id} className="border-b hover:bg-muted/30">
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center mr-3 text-muted-foreground">
                              {subscription.user?.first_name?.charAt(0) ||
                                subscription.user?.email?.charAt(0)?.toUpperCase() ||
                                "U"}
                            </div>
                            <div>
                              <p className="font-medium">
                                {subscription.user?.full_name ||
                                  `${subscription.user?.first_name || ""} ${subscription.user?.last_name || ""}`.trim() ||
                                  "Unnamed User"}
                              </p>
                              <p className="text-sm text-muted-foreground">{subscription.user?.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3">
                          <Badge
                            variant={
                              planKey === "pro" ? "default" : planKey === "business" ? "outline" : "secondary"
                            }
                            className={
                              planKey === "pro"
                                ? "bg-orange-500"
                                : planKey === "business"
                                ? "border-purple-500 text-purple-500"
                                : ""
                            }
                          >
                            {planKey?.toUpperCase?.() ?? subscription.plan_id}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {subscription.interval.charAt(0).toUpperCase() + subscription.interval.slice(1)}
                          </div>
                        </td>

                        <td className="p-3">
                          <Badge
                            variant={
                              subscription.status === "active"
                                ? "default"
                                : subscription.status === "canceled"
                                ? "destructive"
                                : subscription.status === "past_due"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {subscription.status.toUpperCase()}
                          </Badge>
                          {subscription.cancel_at_period_end && (
                            <div className="text-xs text-amber-600 mt-1 flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Cancels at period end
                            </div>
                          )}
                        </td>

                        <td className="p-3">
                          <div className="text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{formatDate(subscription.current_period_end)}</span>
                            </div>
                            <div className="flex items-center text-xs mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{getDaysRemaining(subscription.current_period_end)} days left</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewSubscription(subscription.id)}>
                                  <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                                  View Subscription
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewUser(subscription.user_id)}>
                                  <User className="h-4 w-4 mr-2 text-amber-500" />
                                  View User
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleExtendSubscription(subscription)}>
                                  <CalendarClock className="h-4 w-4 mr-2 text-indigo-500" />
                                  Extend Period
                                </DropdownMenuItem>
                                {!subscription.cancel_at_period_end && (
                                  <DropdownMenuItem onClick={() => handleCancelSubscription(subscription)}>
                                    <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                                    Cancel Subscription
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-muted-foreground">
                      No subscriptions found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                // Simple ellipsis model
                let pageNum = i + 1;

                if (totalPages > 5 && currentPage > 3) {
                  pageNum = Math.min(totalPages - 4 + i, totalPages) + Math.max(0, currentPage - (totalPages - 2));
                }

                if (totalPages > 5 && i === 0 && currentPage > 3) {
                  return (
                    <PaginationItem key="ellipsis-start">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                if (totalPages > 5 && i === 4 && currentPage < totalPages - 2) {
                  return (
                    <PaginationItem key="ellipsis-end">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink onClick={() => handlePageChange(pageNum)} isActive={currentPage === pageNum}>
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
