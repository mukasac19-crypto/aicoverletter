//C:\Users\mukas\Downloads\project-bolt-sb1-guerg2d9\project\app\layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { Montserrat } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ImpersonationBanner } from "@/components/ImpersonationBanner";

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CareerThings',
  description: 'Create professional resumes, cover letters with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      
        {/* Only use the one context provider we have been debugging */}
      <body className={montserrat.className}>
        <AuthProvider>
          <ImpersonationBanner />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}