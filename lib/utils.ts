//C:\Users\mukas\OneDrive\Desktop\aicoverletter-work\lib\utils.ts

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add this new function to the file
export function getSiteURL() {
  // Use the VERCEL_URL or RAILWAY_STATIC_URL environment variable in production
  const url =
    process.env.NEXT_PUBLIC_SITE_URL || // 1. Your custom variable
    process.env.RAILWAY_STATIC_URL ||   // 2. Railway's variable
    process.env.VERCEL_URL ||           // 3. Vercel's variable
    'http://localhost:3000';            // 4. Fallback for local dev

  // Ensure it starts with https:// for production URLs
  return url.startsWith('http') ? url : `https://` + url;
}