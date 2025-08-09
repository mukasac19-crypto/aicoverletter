import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-client";
import { SubscriptionStatus as SubscriptionStatusType } from "@/types/subscription";
import { CreditCard, CalendarDays, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';
import BillingPortalButton from '@/components/BillingPortalButton';

interface SubscriptionStatusProps {
  subscription: SubscriptionStatusType;
  usageStats?: {
    coverLetters: { used: number; limit: number; unlimited: boolean };
    resumes: { used: number; limit: number; unlimited: boolean };
    atsScans: { used: number; limit: number; unlimited: boolean };
    interviewSessions: { used: number; limit: number; unlimited: boolean };
  };
}

export default function SubscriptionStatus({ subscription, usageStats }: SubscriptionStatusProps) {
  const { tier, interval, currentPeriodEnd, cancelAtPeriodEnd, status } = subscription;
  const plan = SUBSCRIPTION_PLANS[tier];
  
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };
  
  const getDaysRemaining = (dateStr?: string) => {
    if (!dateStr) return 0;
    const diffTime = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const daysRemaining = getDaysRemaining(currentPeriodEnd);
  
  const formatInterval = (interval?: string) => {
    return interval ? interval.charAt(0).toUpperCase() + interval.slice(1) : '';
  };
  
  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1 || limit === 0) return 0;
    return Math.min(100, Math.round((used / limit) * 100));
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      case 'trialing': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'past_due': case 'unpaid': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const USAGE_ITEMS = [
    { key: 'resumes', name: 'Resumes' },
    { key: 'coverLetters', name: 'Cover Letters' },
    { key: 'atsScans', name: 'ATS Scans' },
    { key: 'interviewSessions', name: 'Interview Sessions' },
  ] as const;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-teal-600" />
            	Subscription
          	</CardTitle>
          	<CardDescription>Your current subscription plan and usage</CardDescription>
        	</div>
        	<Badge variant="outline" className={getStatusColor(status)}>
        		{status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
        	</Badge>
      	</div>
    	</CardHeader>
    	
    	<CardContent className="space-y-4">
    		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-muted rounded-md">
    			<div>
    				<h3 className="font-medium text-base">{plan.name} {interval && `(${formatInterval(interval)})`}</h3>
    				<p className="text-sm text-muted-foreground">{plan.description}</p>
    			</div>
    			{status === 'active' && currentPeriodEnd && (
    				<div className="text-sm flex items-center shrink-0">
    					<CalendarDays className="h-4 w-4 mr-1 text-muted-foreground" />
    					{cancelAtPeriodEnd ? (
    						<span className="text-amber-600">Cancels on {formatDate(currentPeriodEnd)}</span>
    					) : (
    						<span>Renews on {formatDate(currentPeriodEnd)}</span>
    					)}
    				</div>
    			)}
    		</div>

  		{cancelAtPeriodEnd && (
  			<div className="flex items-start p-3 bg-amber-50 border border-amber-200 rounded-md">
  				<AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
  				<div className="text-sm">
  					<span className="font-medium">Your subscription is set to cancel.</span>
  					<p className="text-muted-foreground">You&apos;ll lose access to {plan.name} features in {daysRemaining} days.</p>
  				</div>
  			</div>
  		)}
  		
  		{usageStats && tier !== 'BUSINESS' && (
  			<div className="space-y-3 mt-2">
  				<h4 className="text-sm font-medium">Current Usage</h4>
				{USAGE_ITEMS.map(item => {
				const usage = usageStats[item.key as keyof typeof usageStats];
				const limit = plan.limits[item.key];
				if (typeof limit !== 'number') return null;

				return (
					<div className="space-y-1" key={item.key}>
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">{item.name}</span>
						<span className="font-medium">
						{usage?.unlimited ? 'Unlimited' : `${usage?.used ?? 0} / ${limit}`}
						</span>
					</div>
					{!usage?.unlimited && (
						<Progress 
						value={getUsagePercentage(usage?.used ?? 0, limit)} 
						className="h-2"
						/>
					)}
					</div>
				);
				})}
  			</div>
  		)}
  		
  		{tier === 'BUSINESS' && (
  			<div className="flex items-start p-3 bg-green-50 border border-green-200 rounded-md">
  				<CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
  				<p className="text-sm">You have unlimited access to all features with your Business plan.</p>
  			</div>
  		)}
  	</CardContent>
  	
  	<CardFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
  		{tier !== 'FREE' && (
  			<BillingPortalButton
  				label="Manage Subscription"
  				size="sm"
  				className="w-full sm:w-auto"
  			/>
  		)}
  		{tier !== 'BUSINESS' && (
  			<Button 
  				size="sm" 
  				className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700"
  				asChild
  			>
  				<Link href="/pricing">
					{/* FINAL FIX: Wrap the children in a single <span> to guarantee one child element */}
					<span className="flex items-center justify-center">
						<Sparkles className="mr-2 h-4 w-4" />
						{tier === 'FREE' ? 'Upgrade Plan' : 'Change Plan'}
					</span>
  				</Link>
  			</Button>
  		)}
  	</CardFooter>
  </Card>
  );
}