"use client"

import Image from "next/image";
import Link from "next/link";

const MainFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-auto flex items-center justify-center bg-white rounded-lg p-2">
                <Image
                  src="/careerthingslogo.png"
                  width={160}
                  height={30}
                  alt="CareerThings AI"
                />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              AI-powered resume and cover letter builder helping professionals land their dream jobs.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.tiktok.com/@careerthings?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-1-6.72-2.91-1.89-1.91-2.93-4.36-2.91-7.01.02-2.62 1.12-5.04 2.91-6.85 1.83-1.85 4.26-2.91 6.78-2.91.04.44.07.88.11 1.32.02.24.03.48.05.72-.42.02-.85.04-1.27.06-1.33.05-2.65.39-3.83 1.03-1.18.64-2.22 1.52-2.96 2.65-.74 1.13-1.18 2.47-1.16 3.87.03 2.8.96 5.37 2.89 7.23 1.93 1.85 4.5 2.78 7.12 2.78 2.58 0 5.03-1 6.84-2.85 1.25-1.28 2.05-2.89 2.29-4.66.02-.25.03-.5.05-.75v-5.18c-.8.15-1.6.24-2.4.33-.8.08-1.6.1-2.4.05-.12-1.84-.26-3.69-.4-5.53z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/careerthings_ai/?next=%2F&hl=en" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.553 0-3.957.015-5.228.077-2.92.132-4.143 1.354-4.275 4.275-.062 1.27-.077 1.673-.077 5.228s.015 3.957.077 5.228c.132 2.92 1.354 4.143 4.275 4.275 1.27.062 1.673.077 5.228.077s3.957-.015 5.228-.077c2.92-.132 4.143-1.354 4.275-4.275.062-1.27.077-1.673.077-5.228s-.015-3.957-.077-5.228c-.132-2.92-1.354-4.143-4.275-4.275-1.27-.062-1.673-.077-5.228-.077zm0 2.999a5.042 5.042 0 100 10.084 5.042 5.042 0 000-10.084zM12 15a3 3 0 110-6 3 3 0 010 6zm4.5-9.3a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61578935445042" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
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

export default MainFooter;