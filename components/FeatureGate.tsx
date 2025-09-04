// components/FeatureGate.tsx
import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface FeatureGateProps {
  feature?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  soft?: boolean; // Show content but with overlay
  showUpgradePrompt?: boolean;
  className?: string;
  requiresPro?: boolean; // Simple boolean check
}

export function FeatureGate({
  feature,
  children,
  fallback,
  soft = false,
  showUpgradePrompt = true,
  className,
  requiresPro = true, // Default to requiring PRO
}: FeatureGateProps) {
  const { isPro, isLoading, canUseFeature } = useSubscription();
  
  // If a feature is specified, check if user can use it
  // Otherwise, just check if they need PRO
  const hasAccess = feature ? canUseFeature(feature) : (requiresPro ? isPro : true);

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

// Simplified upgrade prompt component
function UpgradePrompt({ feature }: { feature?: string }) {
  const featureInfo = feature ? getFeatureInfo(feature) : {
    name: 'PRO Feature',
    description: 'Upgrade to PRO to unlock this feature and many more.'
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="pt-6 text-center">
        <div className="mb-4">
          <Sparkles className="h-12 w-12 text-purple-500 mx-auto" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">
          Upgrade to PRO
        </h3>
        
        <p className="text-muted-foreground mb-6">
          {featureInfo.description}
        </p>
        
        <div className="flex flex-col gap-3">
          <Button asChild>
            <Link href={`/pricing${feature ? `?feature=${feature}` : ''}`}>
              <Sparkles className="h-4 w-4 mr-2" />
              Upgrade Now
            </Link>
          </Button>
          
          <Button variant="ghost" asChild>
            <Link href="/pricing">View All Plans</Link>
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-4">
          Currently on Free plan
        </p>
      </CardContent>
    </Card>
  );
}

// Simplified feature information mapping
function getFeatureInfo(feature: string) {
  const features: Record<string, { name: string; description: string }> = {
    resumes: {
      name: 'Unlimited Resumes',
      description: 'Free users can create up to 3 resumes. Upgrade to PRO for unlimited resumes.',
    },
    coverLetters: {
      name: 'Unlimited Cover Letters',
      description: 'Free users get 5 cover letters per month. Upgrade to PRO for unlimited.',
    },
    ats_scanner: {
      name: 'ATS Scanner',
      description: 'Analyze your resume for ATS compatibility with our PRO scanner.',
    },
    templates: {
      name: 'Premium Templates',
      description: 'Access our full library of professional templates with PRO.',
    },
    exports: {
      name: 'Unlimited Exports',
      description: 'Free users get 10 exports per month. Upgrade to PRO for unlimited.',
    },
  };

  return features[feature] || {
    name: 'Premium Feature',
    description: 'Unlock this feature with a PRO subscription.',
  };
}

// Usage limit component for free tier
export function UsageLimit({ 
  feature, 
  className 
}: { 
  feature: string;
  className?: string;
}) {
  const { isPro, usage } = useSubscription();
  
  if (isPro) return null; // PRO users have no limits
  
  const featureUsage = usage[feature];
  if (!featureUsage) return null;
  
  const percentage = (featureUsage.used / featureUsage.limit) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = featureUsage.used >= featureUsage.limit;
  
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
          {featureUsage.used} / {featureUsage.limit}
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
          You've reached your limit. 
          <Link href="/pricing" className="underline ml-1">
            Upgrade to continue
          </Link>
        </p>
      )}
    </div>
  );
}