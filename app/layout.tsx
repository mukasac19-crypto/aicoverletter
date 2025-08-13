"use client"

import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { Montserrat } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ImpersonationBanner } from "@/components/ImpersonationBanner";
import { usePathname } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Menu, X } from "lucide-react";
import { useState } from 'react';
import { useAuth } from "@/lib/hooks/useAuth";

const montserrat = Montserrat({ subsets: ['latin'] });

// Move metadata outside the component
// export const metadata: Metadata = {
//   title: 'CareerThings',
//   description: 'Create professional resumes, cover letters with AI',
// };

function Header() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-auto rounded-lg flex items-center justify-center">
                <Image
                  src="/careerthingslogo.png"
                  width={200}
                  height={36}
                  alt='CareerThings AI logo'
                />
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/features" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">
                Pricing
              </Link>
              
              <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">
                Resources
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25">
                  Log In
                </Button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <Link href="/features" className="block py-2 text-sm font-medium text-gray-600 hover:text-orange-600">
              Features
            </Link>
            <Link href="/pricing" className="block py-2 text-sm font-medium text-gray-600 hover:text-orange-600">
              Pricing
            </Link>
            
            <Link href="/blog" className="block py-2 text-sm font-medium text-gray-600 hover:text-orange-600">
              Resources
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-auto flex items-center justify-center">
                <Image
                  src="/careerthingslogo.png"
                  width={160}
                  height={30}
                  alt='CareerThings AI logo'
                  className="brightness-0 invert"
                />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              AI-powered resume and cover letter builder helping professionals land their dream jobs.
            </p>
            <div className="flex space-x-4">
              {/* Facebook Link */}
              <a 
                href="https://www.facebook.com/profile.php?id=61578935445042" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-orange-400 transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* Instagram Link */}
              <a 
                href="https://www.instagram.com/careerthings_ai/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-orange-400 transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/>
                </svg>
              </a>
              {/* TikTok Link */}
              <a 
                href="https://www.tiktok.com/@careerthings" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-orange-400 transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91.02 2.5.06 4.91.22 6.34 2.15.6.8.96 1.76.96 2.73 0 1.94-.01 3.89-.02 5.83-.01 1.02.01 2.05.02 3.07.01 1.73-.55 3.07-2.12 3.96-1.01.55-2.13.78-3.3.82-2.33.08-4.66.07-6.99.02-1.83-.04-3.45-.44-4.83-1.62-1.12-.96-1.6-2.28-1.6-3.71 0-2.32.01-4.63.02-6.95.01-1.92.01-3.85.02-5.77.01-1.51.6-2.77 2-3.68 1.03-.67 2.23-.93 3.53-1 .54-.03 1.08-.03 1.62-.03zm.82 2.2c-1.37.01-2.73.01-4.1.02-1.37 0-2.61.27-3.55 1.43-.65.83-.8 1.84-.8 2.85 0 2.22.01 4.43.01 6.65.01 1.25.26 2.37 1.25 3.25.96.85 2.16 1.11 3.48 1.11 2.33.01 4.66.01 6.99 0 1.28-.01 2.45-.35 3.32-1.3.69-.78 1-1.74 1-2.82.01-2.27 0-4.54.01-6.81 0-1.43-.4-2.62-1.55-3.45-.96-.69-2.09-.95-3.3-.95-1.29-.01-2.58-.01-3.87-.01zm.11 6.78c.01 2.21-.01 4.41 0 6.62.01 1.45.92 2.48 2.38 2.48 1.45 0 2.37-1.03 2.37-2.48.01-2.21-.01-4.41 0-6.62-.01-1.45-.92-2.48-2.38-2.48-1.45 0-2.37 1.03-2.37 2.48z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/features" className="hover:text-orange-400 transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-orange-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-orange-400 transition-colors">Blog</Link></li>
              <li><Link href="/help" className="hover:text-orange-400 transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about-us" className="hover:text-orange-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact-us" className="hover:text-orange-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} CareerThings. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/legal/privacy-policy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link>
              <Link href="/legal/terms-of-use" className="hover:text-orange-400 transition-colors">Terms of Service</Link>
              <Link href="/legal/cookie-policy" className="hover:text-orange-400 transition-colors">Cookie Policy</Link>
              <Link href="/sitemap" className="hover:text-orange-400 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if we're on a dashboard route
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <html lang="en">
      <body className={montserrat.className}>
        <AuthProvider>
          <ImpersonationBanner />
          {/* Conditionally render header */}
          {!isDashboard && <Header />}
          
          {/* Main content */}
          <main className={!isDashboard ? "min-h-screen" : ""}>
            {children}
          </main>
          
          {/* Conditionally render footer */}
          {!isDashboard && <Footer />}
          
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}