// project/components/MainFooter.tsx

"use client"

import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";

const MainFooter = () => {
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
              {/* TikTok Icon (Custom SVG) */}
              <a href="https://www.tiktok.com/@careerthings?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-1-6.72-2.91-1.89-1.91-2.93-4.36-2.91-7.01.02-2.62 1.12-5.04 2.91-6.85 1.83-1.85 4.26-2.91 6.78-2.91.04.44.07.88.11 1.32.02.24.03.48.05.72-.42.02-.85.04-1.27.06-1.33.05-2.65.39-3.83 1.03-1.18.64-2.22 1.52-2.96 2.65-.74 1.13-1.18 2.47-1.16 3.87.03 2.8.96 5.37 2.89 7.23 1.93 1.85 4.5 2.78 7.12 2.78 2.58 0 5.03-1 6.84-2.85 1.25-1.28 2.05-2.89 2.29-4.66.02-.25.03-.5.05-.75v-5.18c-.8.15-1.6.24-2.4.33-.8.08-1.6.1-2.4.05-.12-1.84-.26-3.69-.4-5.53z"/>
                </svg>
              </a>
              {/* Instagram Icon (Lucide) */}
              <a href="https://www.instagram.com/careerthings_ai/?next=%2F&hl=en" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              {/* Facebook Icon (Lucide) */}
              <a href="https://www.facebook.com/profile.php?id=61578935445042" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product, Resources, Company links... */}
          {/* ... (rest of the file is the same) ... */}
           <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/features" className="hover:text-orange-400 transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-orange-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-orange-400 transition-colors">Blog</Link></li>
              <li><Link href="/help" className="hover:text-orange-400 transition-colors">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about-us" className="hover:text-orange-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact-us" className="hover:text-orange-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

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

export default MainFooter;