// app/oslo/settings/change-password/page.tsx - UPDATED VERSION WITH BETTER ERROR HANDLING
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useOsloAuth } from "@/hooks/useOsloAuth";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const { user } = useOsloAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    
    // Validate NEW password strength (not current password)
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }
    
    // Check if NEW password contains at least one number and one letter
    if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(newPassword)) {
      setError("New password must contain at least one letter and one number");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/oslo/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }
      
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Show success message for 2 seconds then redirect
      setTimeout(() => {
        router.push('/oslo/settings');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Change Password</h1>
        <p className="text-muted-foreground mt-2">
          Update your admin account password
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-600" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Ensure your admin account remains secure by using a strong password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Info Alert for Legacy Passwords */}
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Note:</strong> If your current password is numbers-only, you can still use it to authenticate. 
              Your new password must meet the updated security requirements.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
              <AlertDescription>
                Password changed successfully! Redirecting to settings...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter your current password"
                  className="pl-10"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Enter your current password (can be numbers-only if that's what you're using)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter your new password"
                  className="pl-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Must be at least 8 characters with letters and numbers
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your new password"
                  className="pl-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                className="bg-orange-600 hover:bg-orange-700" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/oslo/settings')}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>New Password Requirements:</strong>
            </p>
            <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>At least 8 characters long</li>
              <li>Contains at least one letter</li>
              <li>Contains at least one number</li>
              <li>Avoid using common words or patterns</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}