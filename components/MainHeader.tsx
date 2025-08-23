// project/components/MainHeader.tsx

"use client"

import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";
import { useAuthStore } from "@/stores/authstore";
import { useUiStore } from "@/stores/uistore";

const MainHeader = () => {
  const { user } = useAuthStore();
  const { toggleAuthModal } = useUiStore();
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
                  alt="CareerThings AI"
                  // 👇 FIX: Apply responsive classes here
                  className="h-full w-auto object-contain" 
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
              <Button
                onClick={() => toggleAuthModal()}
                className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25"
              >
                Log In
              </Button>
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
};

export default MainHeader;