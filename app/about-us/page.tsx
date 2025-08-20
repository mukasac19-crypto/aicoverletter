import { NextPage } from 'next';
import { Lightbulb, Zap, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const AboutUsPage: NextPage = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-orange-50 via-white to-white">
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            The Story Behind Your Next Career Move
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600">
            The modern job market is a maze of automated systems, intense competition, and the constant pressure to stand out. We believe talent, not tediousness, should define your journey. That’s why we built CareerThings AI.
          </p>
        </div>
      </section>

      {/* Mission Section with Image */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="prose lg:prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900">Our Mission: To Empower Job Seekers with AI</h2>
            <p>
              We saw brilliant professionals struggling to translate their experience onto paper. We watched as qualified candidates were filtered out by impersonal Applicant Tracking Systems (ATS). We knew there had to be a smarter, more humane way.
            </p>
            <p>
              Our mission is to level the playing field. We use the power of artificial intelligence to demystify the hiring process, giving you the tools to build job-winning applications with confidence and speed. We handle the busywork so you can focus on what matters: landing the job you deserve.
            </p>
          </div>
          <div className="aspect-w-4 aspect-h-3">
             {/* **ACTION REQUIRED:** 1. Add an image to your `/public` folder.
              2. Replace the `src` below with your image path. Example: `/my-team-photo.jpg`
            */}
            <Image
              src="/about-us-mission.jpg" // <-- REPLACE THIS PATH
              alt="Team at CareerThings AI collaborating"
              width={1200}
              height={900}
              className="object-cover rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Values Section (Dark Theme) */}
      <section className="bg-slate-900 text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold">What Drives Us</h2>
          <p className="mt-4 text-lg text-slate-300">Our values are at the core of everything we build.</p>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Value Card 1 */}
            <div className="p-8 bg-slate-800 rounded-lg transform hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center justify-center h-14 w-14 mx-auto rounded-full bg-orange-600">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">User Empowerment</h3>
              <p className="mt-2 text-slate-400">Your career is in your hands. Our tools just make you faster, smarter, and more confident in your search.</p>
            </div>
            {/* Value Card 2 */}
            <div className="p-8 bg-slate-800 rounded-lg transform hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center justify-center h-14 w-14 mx-auto rounded-full bg-orange-600">
                <Lightbulb className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Cutting-Edge Innovation</h3>
              <p className="mt-2 text-slate-400">We live and breathe technology. We are committed to leveraging the latest in AI to give you a real competitive edge.</p>
            </div>
            {/* Value Card 3 */}
            <div className="p-8 bg-slate-800 rounded-lg transform hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center justify-center h-14 w-14 mx-auto rounded-full bg-orange-600">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Simplicity and Speed</h3>
              <p className="mt-2 text-slate-400">Powerful tools shouldn't be complicated. Get from a blank page to a job-ready application in minutes, not hours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-xl p-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to Take Control of Your Career?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-orange-100">
            Stop wrestling with templates and start building with intelligence. Your next opportunity is waiting.
          </p>
          <div className="mt-8">
            <Link
              href="/dashboard/resumes"
              className="inline-block bg-white text-orange-600 font-bold py-3 px-8 rounded-lg hover:bg-orange-50 transition-transform transform hover:scale-105 duration-300"
            >
              Build Your Resume Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;