"use client";

import { Button } from './ui/button';
import { useAuthStore } from '@/stores/authstore';

export function ImpersonationBanner() {
 
  const {user,impersonated,exitImpersonation} = useAuthStore()

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

