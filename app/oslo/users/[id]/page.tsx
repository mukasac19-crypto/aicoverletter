"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<any[]>([]);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [auditLog, setAuditLog] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(`/api/oslo/users/${params.id}`);
      const data = await response.json();
      setUser(data.user);
      setSubscriptionHistory(data.subscriptionHistory);
      setActivityLog(data.activityLog);
      setAuditLog(data.auditLog);
    };
    fetchUserData();
  }, [params.id]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user?.avatar_url} />
          <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{user?.full_name}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>User Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {/* User details go here */}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Subscription History</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {subscriptionHistory.map((subscription) => (
                  <li key={subscription.id}>
                    {subscription.plan_id} - {subscription.status}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {activityLog.map((activity) => (
                  <li key={activity.id}>
                    {activity.event_type} - {new Date(activity.created_at).toLocaleString()}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {auditLog.map((audit) => (
                  <li key={audit.id}>
                    {audit.action} - {new Date(audit.created_at).toLocaleString()}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}