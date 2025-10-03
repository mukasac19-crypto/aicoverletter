"use client";

import { useState } from 'react';
import { NextPage } from 'next';
import { Mail, HelpCircle, Clock, Copy, Check, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';

const ContactUsPage: NextPage = () => {
  const [isCopied, setIsCopied] = useState(false);
  const supportEmail = "support@careerthings.co";

  // Logic for the copy-to-clipboard button
  const handleCopy = () => {
    navigator.clipboard.writeText(supportEmail).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  // Dynamic office hours logic
  const now = new Date();
  const dayOfWeek = now.getDay(); // Sunday = 0, Monday = 1, etc.
  const hour = now.getHours();
  // Using CEST (Central European Summer Time) which is UTC+2
  // We'll approximate by checking against UTC hours. This may need adjustment depending on server location.
  const isOfficeHours = dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 7 && hour < 15; // 9 AM-5 PM CEST is 7-15 UTC

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            We're Here to Help
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
            Your success is our priority. Find the best way to get the support you need below.
          </p>
        </div>
      </section>

      {/* Main Contact Options Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* Block 1: Direct Email Support */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 lg:p-12 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-orange-100 text-orange-600">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Direct Support</h2>
            </div>
            <p className="mt-4 text-gray-600">
              For technical support, billing questions, or other inquiries, please email our team. We'll get back to you as soon as possible.
            </p>
            <div className="mt-6 bg-slate-100 rounded-lg p-4 flex items-center justify-between">
              <span className="text-lg font-medium text-slate-700 select-all">{supportEmail}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-800 transition-colors"
                aria-label="Copy email address"
              >
                {isCopied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                {isCopied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Block 2: Help Center & FAQ */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 lg:p-12 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-gray-800 text-white">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Instant Answers</h2>
            </div>
            <p className="mt-4 text-gray-600">
              Many common questions are already answered in our Help Center. It's the fastest way to find the information you need.
            </p>
            <Link
              href="/#faq"
              className="mt-6 w-full inline-block bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg text-center hover:bg-gray-900 transition-colors"
            >
              Visit Help Center
            </Link>
          </div>

        </div>
      </section>

      {/* Footer Info Section */}
      <section className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-12 text-center">
            {/* Office Hours */}
            <div className="flex justify-center items-center gap-3 text-gray-600 mb-4">
                <Clock className="h-6 w-6" />
                <h3 className="text-xl font-bold text-gray-900">Our Support Hours</h3>
            </div>
            <p className="text-gray-600">
                Available Monday to Friday, 9:00 AM – 5:00 PM (CEST).
            </p>
            {isOfficeHours ? (
              <p className="text-sm text-green-600 font-semibold">Our team is currently online.</p>
            ) : (
              <p className="text-sm text-gray-500">Our team is currently offline. We'll respond within 24 business hours.</p>
            )}
            
            {/* Social Media */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Connect With Us</h3>
              <div className="mt-4 flex justify-center space-x-6">
                  <a href="https://www.tiktok.com/@careerthings?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-600 transition-colors" aria-label="TikTok">
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-1-6.72-2.91-1.89-1.91-2.93-4.36-2.91-7.01.02-2.62 1.12-5.04 2.91-6.85 1.83-1.85 4.26-2.91 6.78-2.91.04.44.07.88.11 1.32.02.24.03.48.05.72-.42.02-.85.04-1.27.06-1.33.05-2.65.39-3.83 1.03-1.18.64-2.22 1.52-2.96 2.65-.74 1.13-1.18 2.47-1.16 3.87.03 2.8.96 5.37 2.89 7.23 1.93 1.85 4.5 2.78 7.12 2.78 2.58 0 5.03-1 6.84-2.85 1.25-1.28 2.05-2.89 2.29-4.66.02-.25.03-.5.05-.75v-5.18c-.8.15-1.6.24-2.4.33-.8.08-1.6.1-2.4.05-.12-1.84-.26-3.69-.4-5.53z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/careerthings_ai/?next=%2F&hl=en" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-600 transition-colors" aria-label="Instagram">
                      <Instagram className="h-8 w-8" />
                  </a>
                  <a href="https://www.facebook.com/profile.php?id=61578935445042" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-600 transition-colors" aria-label="Facebook">
                      <Facebook className="h-8 w-8" />
                  </a>
              </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;