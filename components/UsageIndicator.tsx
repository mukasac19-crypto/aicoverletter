// components/UsageIndicator.tsx
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Progress } from '@/components/ui/progress';

export function UsageIndicator({ feature }: { feature: string }) {
  const { isPro, usage } = useSubscription();
  
  if (isPro) return null; // No limits for PRO
  
  const featureUsage = usage[feature];
  if (!featureUsage) return null;
  
  const percentage = (featureUsage.used / featureUsage.limit) * 100;
  
  return (
    <div className="text-sm text-gray-600">
      {featureUsage.used} / {featureUsage.limit} used
      <Progress value={percentage} className="h-1 mt-1" />
    </div>
  );
}