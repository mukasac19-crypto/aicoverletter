// components/FeatureGate.tsx
import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Sparkles, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  soft?: boolean; // Show content but with overlay
  showUpgradePrompt?: boolean;
  className?: string;
}

export function FeatureGate({
  feature,
  children,
  fallback,
  soft = false,
  showUpgradePrompt = true,
  className,
}: FeatureGateProps) {
  const { hasFeatureAccess, subscription, isLoading } = useSubscription();
  const hasAccess = hasFeatureAccess(feature);

  // While loading, show children to prevent layout shift
  if (isLoading) {
    return (
      <div className={cn('relative', className)}>
        {children}
      </div>
    );
  }

  // User has access - show content normally
  if (hasAccess) {
    return <>{children}</>;
  }

  // Custom fallback provided
  if (fallback && !soft) {
    return <>{fallback}</>;
  }

  // Soft gate - show content with overlay
  if (soft) {
    return (
      <div className={cn('relative', className)}>
        <div className="opacity-50 pointer-events-none select-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <UpgradePrompt feature={feature} />
        </div>
      </div>
    );
  }

  // Hard gate - show upgrade prompt instead of content
  if (showUpgradePrompt) {
    return (
      <div className={cn('w-full', className)}>
        <UpgradePrompt feature={feature} />
      </div>
    );
  }

  // No access and no fallback - render nothing
  return null;
}

// Upgrade prompt component
function UpgradePrompt({ feature }: { feature: string }) {
  const { subscription } = useSubscription();
  
  const featureInfo = getFeatureInfo(feature);
  const requiredTier = getRequiredTier(feature);

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="pt-6 text-center">
        <div className="mb-4">
          {requiredTier === 'PREMIUM' ? (
            <Crown className="h-12 w-12 text-yellow-500 mx-auto" />
          ) : (
            <Sparkles className="h-12 w-12 text-purple-500 mx-auto" />
          )}
        </div>
        
        <h3 className="text-xl font-semibold mb-2">
          Upgrade to {requiredTier === 'PREMIUM' ? 'Premium' : 'Professional'}
        </h3>
        
        <p className="text-muted-foreground mb-6">
          {featureInfo.description}
        </p>
        
        <div className="flex flex-col gap-3">
          <Button asChild>
            <a href="/dashboard/billing?upgrade=true">
              <Lock className="h-4 w-4 mr-2" />
              Upgrade Now
            </a>
          </Button>
          
          <Button variant="ghost" asChild>
            <a href="/pricing">View All Plans</a>
          </Button>
        </div>
        
        {subscription.tier === 'FREE' && (
          <p className="text-xs text-muted-foreground mt-4">
            Currently on Free plan
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Feature information mapping
function getFeatureInfo(feature: string) {
  const features: Record<string, { name: string; description: string }> = {
    unlimited_resumes: {
      name: 'Unlimited Resumes',
      description: 'Create unlimited resumes with advanced templates and customization options.',
    },
    unlimited_cover_letters: {
      name: 'Unlimited Cover Letters',
      description: 'Generate unlimited AI-powered cover letters tailored to each job application.',
    },
    ats_scanner: {
      name: 'ATS Scanner',
      description: 'Analyze your resume for ATS compatibility and get optimization suggestions.',
    },
    interview_buddy: {
      name: 'Interview Buddy',
      description: 'Practice with AI-powered mock interviews tailored to your resume and job.',
    },
    advanced_templates: {
      name: 'Premium Templates',
      description: 'Access our full library of professional and creative templates.',
    },
    bulk_export: {
      name: 'Bulk Export',
      description: 'Export multiple documents at once in various formats.',
    },
  };

  return features[feature] || {
    name: 'Premium Feature',
    description: 'Unlock this feature with a premium subscription.',
  };
}

// Get required tier for a feature
function getRequiredTier(feature: string): 'PROFESSIONAL' | 'PREMIUM' {
  const premiumFeatures = ['interview_buddy', 'team_collaboration', 'priority_support'];
  return premiumFeatures.includes(feature) ? 'PREMIUM' : 'PROFESSIONAL';
}

// Usage limit component for free tier
interface UsageLimitProps {
  feature: string;
  current: number;
  limit: number;
  className?: string;
}

export function UsageLimit({ feature, current, limit, className }: UsageLimitProps) {
  const percentage = (current / limit) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = current >= limit;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          {getFeatureInfo(feature).name}
        </span>
        <span className={cn(
          'font-medium',
          isAtLimit && 'text-destructive',
          isNearLimit && !isAtLimit && 'text-yellow-600'
        )}>
          {current} / {limit}
        </span>
      </div>
      
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300',
            isAtLimit && 'bg-destructive',
            isNearLimit && !isAtLimit && 'bg-yellow-600',
            !isNearLimit && 'bg-primary'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      {isAtLimit && (
        <p className="text-xs text-destructive">
          You've reached your limit. <a href="/dashboard/billing" className="underline">Upgrade to continue</a>
        </p>
      )}
    </div>
  );
}