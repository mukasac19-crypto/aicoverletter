//project\app\layout.tsx

"use client";

import "./globals.css";
// Metadata is handled differently in client components, often in a parent server component or page.
// import type { Metadata } from "next"; 
import { Montserrat } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ImpersonationBanner } from "@/components/ImpersonationBanner";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AuthModal } from "@/components/AuthModal/AuthModal";
import { useAuthStore } from "@/stores/authstore";
import MainHeader from "@/components/MainHeader";
import { useUiStore } from "@/stores/uistore";
import MainFooter from "@/components/MainFooter";
import GoogleAnalytics from "@/components/GoogleAnalytics"; // Import the new component

const montserrat = Montserrat({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { toggleAuthModal, isAuthModalOpen } = useUiStore();
  const isDashboard = pathname?.startsWith("/dashboard");
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <html lang="en">
      <body className={montserrat.className}>
        {/* Add Google Analytics component here */}
        <GoogleAnalytics />

        <ImpersonationBanner />
        {!isDashboard && <MainHeader />}
        <main className={!isDashboard ? "min-h-screen" : ""}>{children}</main>
        {!isDashboard && <MainFooter />}
        <Toaster />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={(open) => toggleAuthModal()}
        />
      </body>
    </html>
  );
}