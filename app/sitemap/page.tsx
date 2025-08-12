import { NextPage } from 'next';
import Link from 'next/link';

const SitemapPage: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Sitemap</h1>
      <div className="prose lg:prose-xl">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about-us">About Us</Link></li>
          <li><Link href="/legal/terms-of-use">Terms of Use</Link></li>
          <li><Link href="/legal/privacy-policy">Privacy Policy</Link></li>
          <li><Link href="/legal/cookie-policy">Cookie Policy</Link></li>
          <li><Link href="/contact-us">Contact Us</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default SitemapPage;
