"use client";

import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from './ui/button';

export function ImpersonationBanner() {
  const { user, impersonated, exitImpersonation } = useAuth();

  if (!impersonated) {
    return null;
  }

  return (
    <div className="bg-yellow-400 text-black p-2 text-center text-sm">
      You are currently impersonating {user?.email}.
      <Button
        variant="link"
        className="text-black underline ml-2"
        onClick={exitImpersonation}
      >
        Switch back to your account
      </Button>
    </div>
  );
}

