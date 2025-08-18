"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ImpersonationBanner } from "@/components/ImpersonationBanner";
import { usePathname } from "next/navigation";
import { useEffect} from "react";
import { AuthModal } from "@/components/AuthModal/AuthModal";
import { useAuthStore } from "@/stores/authstore";
import MainHeader from "@/components/MainHeader";
import { useUiStore } from "@/stores/uistore";
import MainFooter from "@/components/MainFooter";

const montserrat = Montserrat({ subsets: ["latin"] });

// Moved metadata to a separate file, as it is not needed in a 'use client' component
// and should be handled in a static metadata object if possible.
// export const metadata: Metadata = {
//   title: 'CareerThings',
//   description: 'Create professional resumes, cover letters with AI',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { toggleAuthModal, isAuthModalOpen } = useUiStore();

  // Check if we're on a dashboard route
  const isDashboard = pathname?.startsWith("/dashboard");

  // Get the initializeAuth function from the store
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  // Initialize the auth state when the component mounts
  // This will set up the Supabase listener once.
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <html lang="en">
      <body className={montserrat.className}>
        <ImpersonationBanner />
        {/* Conditionally render header */}
        {!isDashboard && <MainHeader />}

        {/* Main content */}
        <main className={!isDashboard ? "min-h-screen" : ""}>{children}</main>

        {/* Conditionally render footer */}
        {!isDashboard && <MainFooter />}
        <Toaster />
        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={(open) => toggleAuthModal()}
        />
      </body>
    </html>
  );
}
