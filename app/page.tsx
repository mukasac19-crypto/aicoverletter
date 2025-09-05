//C:\Users\mukas\Downloads\project-bolt-sb1-guerg2d9\project\app\page.tsx

"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Upload, ArrowRight, CheckCircle, Sparkles, ChevronRight, Star, Zap, Shield, Globe, Users, TrendingUp, Award, Clock, Target, Briefcase, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/hooks/useAuth"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-client"

import DocumentExamples from "@/components/DocumentExamples"
import { useState } from "react"

// FAQ data structure
const faqData = [
  {
    question: "How does the AI personalization work?",
    answer: "Our AI analyzes the job description and your experience to create perfectly matched content. It identifies key requirements, extracts relevant keywords, and tailors your achievements to align with what employers are looking for."
  },
  {
    question: "Is my data safe and private?",
    answer: "Absolutely. CareerThings AI use bank-level encryption for all data. Your information is never shared with third parties, and you can delete your data anytime. We're fully GDPR and CCPA compliant."
  },
  {
    question: "Can I use CareerThings AI for multiple job applications?",
    answer: "Yes! You can create unlimited tailored resumes and cover letters for different positions. Our system saves your base profile and creates new versions optimized for each specific job."
  },
  {
    question: "What makes this better than other resume builders?",
    answer: "Unlike template-based builders, CareerThings uses advanced AI to create truly personalized content. Each document is uniquely tailored to the specific job, not just filled with generic text. Plus, our ATS optimization ensures your resume gets seen."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with our service, contact support for a full refund."
  }
]


export default function LandingPage() {
  const { user } = useAuth()

    const [scrollPosition, setScrollPosition] = useState(0)
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index)
  }

  return (
    <main className="min-h-screen bg-teal-50/20">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-teal-100 bg-white shadow-sm backdrop_blur supports-[backdrop-filter]:bg-white/90">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600 mr-1 sm:mr-2" />
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">Resume Mate AI </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Navigation links */}
            <Link href="/pricing" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
              Pricing
            </Link>
            <Link href="/features" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
              Features
            </Link>

            {user ? (
              <Link href="/dashboard">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="hidden sm:block">
                  <Button
                    variant="outline"
                    className="border-teal-200 text-gray-700 hover:text-teal-700 hover:bg-teal-50 hover:border-teal-300"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

     {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 bg-gradient-to-b from-slate-50 via-white to-orange-50/20">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 h-72 w-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 h-72 w-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 h-72 w-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2 mb-6">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-orange-800">Rated 4.9/5 by 10,000+ professionals</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Land Your Dream Job with
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
                Our AI-Powered Tools
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              From job hunting,resume,cover letter creation,to preparing for your interview, follow up emails. Join over 100,000 professionals who've successfully landed jobs at top companies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {/* <Link href="/auth/register"> */}
                <Button 
                onClick={() => {
                  // toggleAuthModal(true);
                  // toggleShowLoginContent(false); // show sign up form
                }}
                size="lg" 
                className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white shadow-xl shadow-orange-500/25 px-8"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Start Free - No Card Required
                </Button>
              {/* </Link> */}
            </div>
            
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-orange-500" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-orange-500" />
                <span>No credit card needed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-orange-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos Section - Animated Slider */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500 mb-6 font-medium">
            OVER 100,000 USERS LANDED JOBS AT LEADING COMPANIES
          </p>
          <div className="relative overflow-hidden">
            <div className="flex items-center gap-4 animate-scroll" style={{ transform: `translateX(-${scrollPosition}px)` }}>
              {/* Duplicate logos for seamless scrolling */}
              {/* {[...companyLogos, ...companyLogos].map((company, index) => (
                <div key={index} className="h-[80px] min-w-[80px] flex items-center justify-center px-1 py-1 rounded-lg">
                  <Image
                    src={`${company.logo}`}
                    alt={`${company.name} logo`}
                    width={100}
                    height={80}
                    className='w-full h-full object-contain'
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.src = `https://via.placeholder.com/120x40/CCCCCC/666666?text=${company.name}`;
                    }}
                  />
                </div>
              ))} */}
            </div>
            {/* Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">100K+</div>
              <div className="text-orange-100">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">1.5M+</div>
              <div className="text-orange-100">Documents Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">85%</div>
              <div className="text-orange-100">Interview Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-orange-100">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-800 mb-4">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Three Simple Steps to Your Dream Job
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI technology makes creating professional applications faster than ever before
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-20 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200"></div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Paste Job Description</h3>
                <p className="text-gray-600 text-center mb-4">
                  Simply paste the job posting URL or text. Our AI instantly analyzes requirements and keywords.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Auto-extracts key requirements</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Identifies important keywords</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Understands company culture</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Upload Your Experience</h3>
                <p className="text-gray-600 text-center mb-4">
                  Upload your existing resume or connect LinkedIn. We'll extract and optimize your experience.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">LinkedIn one-click import</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">PDF/Word resume upload</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Smart experience matching</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Get Tailored Documents</h3>
                <p className="text-gray-600 text-center mb-4">
                  Receive perfectly tailored resume & cover letter. Edit, customize, and download instantly.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">ATS-optimized formatting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Multiple export formats</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Real-time editing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            {/* <Link href="/auth/register"> */}
              <Button
              onClick={() => {
                // toggleAuthModal(true);
                // toggleShowLoginContent(false); // show sign up form
              }} 
              size="lg" className="bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white shadow-xl shadow-orange-500/25 px-8">
                Try It Now - Free Forever Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            {/* </Link> */}
          </div>
        </div>
      </section>

      {/* Document Examples Section */}
      <DocumentExamples />

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800 mb-4">
              SUCCESS STORIES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Thousands Who've Landed Their Dream Jobs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Landed my dream job at Google within 2 weeks of using CareerThings AI. The ATS optimization was a game-changer!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div>
                  <div className="font-semibold">Sarah Chen</div>
                  <div className="text-sm text-gray-500">Software Engineer at Google</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The AI understood exactly what Tesla was looking for. My tailored resume got me an interview on the first try!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <div className="font-semibold">Michael Rodriguez</div>
                  <div className="text-sm text-gray-500">Product Manager at Tesla</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "From 50+ rejections to 5 interviews in a month. This tool completely transformed my job search strategy!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <div className="font-semibold">Amanda Foster</div>
                  <div className="text-sm text-gray-500">Marketing Director at Meta</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-gradient-to-r from-orange-100 to-orange-100 px-4 py-2 text-sm font-semibold text-orange-800 mb-4">
              SIMPLE PRICING
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Path to Success
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade as you grow. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {Object.entries(SUBSCRIPTION_PLANS).map(([tier, plan], index) => (
              <div
                key={tier}
                className={`relative ${tier === "PRO" ? "md:-mt-4" : ""}`}
              >
                {tier === "PRO" && (
                  <div className="absolute -top-5 left-0 right-0 flex justify-center">
                    <span className="bg-gradient-to-r from-orange-600 to-orange-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card
                  className={`h-full ${
                    tier === "PRO"
                      ? "border-2 border-orange-500 shadow-2xl scale-105"
                      : "border border-gray-200 shadow-lg"
                  } hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-hidden`}
                >
                  <div className={`p-8 ${
                    tier === "FREE" 
                      ? "bg-gradient-to-br from-gray-50 to-white"
                      : tier === "PRO"
                      ? "bg-gradient-to-br from-orange-50 to-white"
                      : "bg-gradient-to-br from-purple-50 to-white"
                  }`}>
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-gray-600 text-sm">{plan.description}</p>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold">
                          ${plan.price.monthly}
                        </span>
                        {plan.price.monthly > 0 && (
                          <span className="text-gray-500 ml-2">/month</span>
                        )}
                      </div>
                      {tier === "PRO" && (
                        <p className="text-sm text-orange-600 mt-2">
                          Save 20% with annual billing
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.slice(0, 6).map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${
                            tier === "FREE" 
                              ? "text-gray-400"
                              : tier === "PRO"
                              ? "text-orange-500"
                              : "text-purple-500"
                          }`} />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* <Link href="/auth/register" className="block"> */}
                      <Button
                        onClick={() => {
                          // toggleAuthModal(true);
                          // toggleShowLoginContent(false); // show sign up form
                        }}
                        className={`w-full py-6 text-base font-semibold ${
                          tier === "FREE"
                            ? "bg-gray-900 hover:bg-gray-800"
                            : tier === "PRO"
                            ? "bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 shadow-lg shadow-orange-500/25"
                            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        }`}
                      >
                        {tier === "FREE" ? "Start Free" : tier === "PRO" ? "Get Pro Access" : "Contact Sales"}
                      </Button>
                    {/* </Link> */}
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              All plans include: Unlimited downloads • 24/7 support • SSL encryption
            </p>
            <Link href="/pricing" className="text-orange-600 hover:text-orange-700 font-medium">
              View detailed feature comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section with Collapsible Cards */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800 mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Card 
                key={index} 
                className={`border transition-all duration-300 ${
                  openFAQIndex === index 
                    ? 'border-orange-400 shadow-lg' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg"
                >
                  <h3 className="text-lg font-semibold pr-4">
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 transition-transform duration-300 ${
                    openFAQIndex === index ? 'rotate-180' : ''
                  }`}>
                    <ChevronDown className="h-5 w-5 text-orange-500" />
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${
                  openFAQIndex === index ? 'max-h-96' : 'max-h-0'
                }`}>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link href="/support">
              <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                Contact Support Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-600 via-orange-600 to-orange-700 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Limited Time: 50% OFF Pro Plans</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to 10x Your Job Search Success?
            </h2>
            <p className="text-xl mb-8 text-orange-50 max-w-2xl mx-auto">
              Join over 100,000 professionals who've landed their dream jobs. Start creating winning applications in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {/* <Link href="/auth/register"> */}
                <Button 
                onClick={() => {
                  // toggleAuthModal(true);
                  // toggleShowLoginContent(false); // show sign up form
                }}
                size="lg" className="bg-white text-orange-700 hover:bg-gray-100 shadow-2xl px-8 py-6 text-lg font-semibold">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Free Trial Now
                </Button>
              {/* </Link> */}
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Setup in 30 seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Join 100,000+ users</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-grid-white\\/10 {
          background-image: url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.1'%3e%3cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e");
        }
      `}</style>


      {/* Footer with updated design */}
      <footer className="border-t border-teal-100 bg-white">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FileText className="h-5 w-5 text-teal-600 mr-2" />
              <span className="font-semibold text-gray-800">Resume Mate AI</span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-8 text-sm text-gray-600">
              <Link href="#" className="hover:text-teal-600 transition">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-teal-600 transition">
                Privacy Policy
              </Link>
              <Link href="/pricing" className="hover:text-teal-600 transition">
                Pricing
              </Link>
              <Link href="/features" className="hover:text-teal-600 transition">
                Features
              </Link>
              <Link href="#" className="hover:text-teal-600 transition">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Resume Mate AI. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
