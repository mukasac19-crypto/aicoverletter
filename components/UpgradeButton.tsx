// components/UpgradeButton.tsx
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export function UpgradeButton({ 
  feature, 
  className = "" 
}: { 
  feature?: string; 
  className?: string;
}) {
  return (
    <Button asChild className={className}>
      <Link href={`/pricing${feature ? `?feature=${feature}` : ''}`}>
        <Sparkles className="h-4 w-4 mr-2" />
        Upgrade to PRO
      </Link>
    </Button>
  );
}
