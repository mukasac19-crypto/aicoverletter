"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/client-side-client';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function ImpersonatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!token) {
      setError('No impersonation token provided.');
      setIsLoading(false);
      return;
    }

    const impersonate = async () => {
      try {
        const response = await fetch('/api/oslo/auth/impersonate-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to impersonate user');
        }

        const { session } = await response.json();

        // Set the new session
        await supabase.auth.setSession(session);

        // Redirect to the dashboard
        router.push('/dashboard');
      } catch (err: any) {
        setError(err.message || 'Failed to impersonate user');
        setIsLoading(false);
      }
    };

    impersonate();
  }, [token, router, supabase.auth]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        {isLoading && (
          <>
            <LoadingSpinner className="h-8 w-8 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold">Impersonating User...</h1>
            <p className="text-gray-600">Please wait while we log you in.</p>
          </>
        )}
        {error && (
          <>
            <h1 className="text-2xl font-semibold text-red-600">Impersonation Failed</h1>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => router.push('/oslo/users')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Return to User List
            </button>
          </>
        )}
      </div>
    </div>
  );
}

