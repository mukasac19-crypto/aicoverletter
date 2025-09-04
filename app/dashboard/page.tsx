"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { createBrowserClient } from '@/lib/supabase';
import { useProfile } from '@/lib/hooks/useProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UsageLimit } from '@/components/FeatureGate';
import { getTierDisplayName, getTierBadgeColor } from '@/lib/subscription-client';
import { 
  Plus, FileText, Mail, Download, TrendingUp, Clock, Users, Zap,
  ChevronRight, Star, Shield, ArrowUpRight, Sparkles, Crown
} from 'lucide-react';

interface DashboardStats {
  totalResumes: number;
  totalCoverLetters: number;
  totalExports: number;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    date: string;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { isPro, isLoading: subscriptionLoading } = useSubscription();
  const resumeUsage = useUsageTracking('resumes');
  const coverLetterUsage = useUsageTracking('cover_letters');
  const exportUsage = useUsageTracking('exports_per_month');
  const supabase = createBrowserClient();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalResumes: 0,
    totalCoverLetters: 0,
    totalExports: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchDashboardStats();
  }, [user]);

  const fetchDashboardStats = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Fetch resume count
      const { count: resumeCount } = await supabase
        .from('resumes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      // Fetch cover letter count
      const { count: coverLetterCount } = await supabase
        .from('cover_letters')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      // Fetch export count
      const { count: exportCount } = await supabase
        .from('exports')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      // Fetch recent activity
      const { data: recentResumes } = await supabase
        .from('resumes')
        .select('id, title, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(3);
      
      const { data: recentCoverLetters } = await supabase
        .from('cover_letters')
        .select('id, job_title, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(3);
      
      // Combine and sort recent activity
      const activity = [
        ...(recentResumes || []).map(r => ({
          id: r.id,
          type: 'resume',
          title: r.title || 'Untitled Resume',
          date: r.updated_at || ''
        })),
        ...(recentCoverLetters || []).map(c => ({
          id: c.id,
          type: 'cover-letter',
          title: c.job_title || 'Untitled Cover Letter',
          date: c.updated_at || ''
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
      
      setStats({
        totalResumes: resumeCount || 0,
        totalCoverLetters: coverLetterCount || 0,
        totalExports: exportCount || 0,
        recentActivity: activity
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {getGreeting()}, {profile?.first_name || 'there'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your career tools today.
          </p>
        </div>
        
         {/* Subscription Badge */}
        <div className="flex items-center gap-4">
          <Badge className={getTierBadgeColor(isPro ? 'PRO' : 'FREE')}>
            {isPro && <Crown className="h-3 w-3 mr-1" />}
            {getTierDisplayName(isPro ? 'PRO' : 'FREE')} Plan
          </Badge>
          {!isPro && (
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/billing')}>
              <Zap className="h-4 w-4 mr-2" />
              Upgrade
            </Button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Mobile: Horizontal compact layout */}
        <div className="md:hidden">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center space-x-4">
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Resumes</p>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalResumes}</p>
                  {!isPro && resumeUsage.usage && (
                    <Progress 
                      value={(resumeUsage.usage.used_count / resumeUsage.usage.limit_count) * 100} 
                      className="mt-2 h-1"
                    />
                  )}
                </div>
                
                <div className="h-12 w-px bg-border" />
                
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Cover Letters</p>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalCoverLetters}</p>
                  {!isPro && coverLetterUsage.usage && (
                    <Progress 
                      value={(coverLetterUsage.usage.used_count / coverLetterUsage.usage.limit_count) * 100} 
                      className="mt-2 h-1"
                    />
                  )}
                </div>
                
                <div className="h-12 w-px bg-border" />
                
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Exports</p>
                  </div>
                  <p className="text-2xl font-bold">{exportUsage.usage?.used_count || 0}</p>
                  {!isPro && exportUsage.usage && (
                    <Progress 
                      value={exportUsage.percentageUsed} 
                      className="mt-2 h-1"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desktop: Keep existing card layout */}
        <Card className="hidden md:block">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResumes}</div>
            {!isPro && resumeUsage.usage && (
              <Progress 
                value={(resumeUsage.usage.used_count / resumeUsage.usage.limit_count) * 100} 
                className="mt-2 h-2"
              />
            )}
          </CardContent>
        </Card>
        
        <Card className="hidden md:block">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cover Letters</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCoverLetters}</div>
            {!isPro && coverLetterUsage.usage && (
              <Progress 
                value={(coverLetterUsage.usage.used_count / coverLetterUsage.usage.limit_count) * 100} 
                className="mt-2 h-2"
              />
            )}
          </CardContent>
        </Card>
        
        <Card className="hidden md:block">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exports This Month</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exportUsage.usage?.used_count || 0}</div>
            {!isPro && exportUsage.usage && (
              <Progress 
                value={exportUsage.percentageUsed} 
                className="mt-2 h-2"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Usage Limits for Free Users */}
      {!isPro && (
        <Card>
          <CardHeader>
            <CardTitle>Usage Limits</CardTitle>
            <CardDescription>Track your monthly usage and limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UsageLimit
              feature="resumes"
            />
            <UsageLimit
              feature="cover_letters"
            />
            <UsageLimit
              feature="exports_per_month"
            />
            <div className="pt-4">
              <Button className="w-full" onClick={() => router.push('/dashboard/billing')}>
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade for Unlimited Access
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="quick-actions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
          <TabsTrigger value="recent-activity">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quick-actions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Create Resume
                </CardTitle>
                <CardDescription>
                  Build a professional resume with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => router.push('/dashboard/resumes/new')}
                  disabled={!resumeUsage.canUseFeature}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Resume
                </Button>
                {!resumeUsage.canUseFeature && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Upgrade to create more resumes
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Write Cover Letter
                </CardTitle>
                <CardDescription>
                  Generate a tailored cover letter for your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => router.push('/dashboard/cover-letters?tab=create')}
                  disabled={!coverLetterUsage.canUseFeature}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Cover Letter
                </Button>
                {!coverLetterUsage.canUseFeature && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Upgrade to create more cover letters
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Career Tools
                </CardTitle>
                <CardDescription>
                  Access premium features to advance your career
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/dashboard/ats-scanner')}
                    disabled={!isPro}
                  >
                    {!isPro && <Shield className="h-4 w-4 mr-2" />}
                    ATS Scanner
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/dashboard/interview-buddy')}
                    disabled={!isPro}
                  >
                    {!isPro && <Crown className="h-4 w-4 mr-2" />}
                    Interview Buddy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="recent-activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest documents and edits</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentActivity.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => {
                        if (item.type === 'resume') {
                          router.push(`/dashboard/resumes/${item.id}/edit`);
                        } else {
                          router.push(`/dashboard/cover-letters/${item.id}`);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {item.type === 'resume' ? (
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Mail className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(item.date)}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent activity</p>
                  <Button variant="outline" className="mt-4" onClick={() => router.push('/dashboard/resumes/new')}>
                    Create Your First Resume
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upgrade CTA for Free Users */}
      {!isPro && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Unlock Premium Features</h3>
              <p className="text-sm text-muted-foreground">
                Get unlimited resumes, cover letters, and access to advanced features
              </p>
            </div>
            <Button onClick={() => router.push('/pricing')}>
              View Plans
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Getting Started Guide for New Users */}
      {stats.totalResumes === 0 && stats.totalCoverLetters === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Getting Started
            </CardTitle>
            <CardDescription>
              Complete these steps to build your professional profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Create Your First Resume</h4>
                  <p className="text-sm text-muted-foreground">
                    Build a professional resume with our AI-powered builder
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto mt-1" 
                    onClick={() => router.push('/dashboard/resumes/new')}
                  >
                    Start now →
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Write a Cover Letter</h4>
                  <p className="text-sm text-muted-foreground">
                    Generate tailored cover letters for each application
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto mt-1" 
                    onClick={() => router.push('/dashboard/cover-letters?tab=create')}
                  >
                    Create cover letter →
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Connect LinkedIn</h4>
                  <p className="text-sm text-muted-foreground">
                    Import your professional experience from LinkedIn
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto mt-1" 
                    onClick={() => router.push('/dashboard/settings')}
                  >
                    Connect account →
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Premium Features Preview */}
      {!isPro && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Premium Features</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Badge variant="secondary">Professional</Badge>
              </div>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>ATS Scanner</CardTitle>
                <CardDescription>
                  Optimize your resume for applicant tracking systems
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Badge variant="secondary">Premium</Badge>
              </div>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Interview Buddy</CardTitle>
                <CardDescription>
                  Practice with AI-powered mock interviews
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Badge variant="secondary">Professional</Badge>
              </div>
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Unlimited Exports</CardTitle>
                <CardDescription>
                  Export your documents in any format without limits
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}