"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { 
  FileText, 
  Upload, 
  Download, 
  Sparkles, 
  Briefcase, 
  Search, 
  MessagesSquare, 
  ScanSearch, 
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
  MailCheck
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { FeatureAuthModal } from "@/components/FeatureAuthModal";

const FeaturesPage = () => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [returnTo, setReturnTo] = useState("");

  const handleFeatureClick = (path: string) => {
    if (!user) {
      setReturnTo(path);
      setModalOpen(true);
    } else {
      // If user is logged in, you might want to directly navigate them
      // For now, let's assume direct navigation for logged-in users
      window.location.href = path;
    }
  };

  const features = [
    {
      title: "AI Cover Letter Generator",
      description: "Generate tailored cover letters that match job descriptions. Our AI analyzes job requirements and your experience to create compelling applications.",
      icon: <FileText className="h-8 w-8 text-orange-600" />,
      bgColor: "bg-orange-100",
      buttonText: "Try Cover Letter Generator",
      path: "/dashboard/cover-letters?tab=create",
      listItems: ["Perfect keyword matching", "Multiple tone options", "Instant generation", "Perfectly formatted"]
    },
    {
      title: "Smart Resume Builder",
      description: "Create professional resumes with our intuitive builder. Import existing CVs, customize templates, and export in multiple formats.",
      icon: <FileSpreadsheet className="h-8 w-8 text-blue-600" />,
      bgColor: "bg-blue-100",
      buttonText: "Build Your Resume",
      path: "/dashboard/resumes/new",
      listItems: ["ATS-optimized templates", "PDF & DOCX export", "LinkedIn integration", "One-click tailoring"]
    },
    {
      title: "ATS Scanner",
      description: "Get your resume past applicant tracking systems with our scanner. Analyze compatibility and get suggestions for improvements.",
      icon: <ScanSearch className="h-8 w-8 text-purple-600" />,
      bgColor: "bg-purple-100",
      buttonText: "Scan Your Resume",
      path: "/dashboard/ats-scanner",
      listItems: ["Keyword analysis", "Formatting check", "Compatibility score", "Detailed feedback"]
    }
  ];

  const secondaryFeatures = [
    {
      title: "Interview Buddy",
      description: "Practice for interviews with AI-generated questions based on your resume and job description.",
      icon: <MessagesSquare className="h-6 w-6 text-indigo-600" />,
      bgColor: "bg-indigo-100",
      path: "/dashboard/interview-buddy"
    },
    {
      title: "Smart Job Search",
      description: "Find relevant job opportunities and get suggestions based on your skills and preferences.",
      icon: <Briefcase className="h-6 w-6 text-amber-600" />,
      bgColor: "bg-amber-100",
      path: "/dashboard/jobs"
    },
    {
      title: "Follow-Up Emails",
      description: "Create professional follow-up emails to increase your chances of getting a response.",
      icon: <MailCheck className="h-6 w-6 text-green-600" />,
      bgColor: "bg-green-100",
      path: "/dashboard/cover-letters?tab=follow-up"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-white py-16 md:py-24">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container relative mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 tracking-tight text-gray-900 lg:text-5xl">
              Powerful Features for Your Job Applications
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Our AI-powered tools help you create professional applications, prepare for interviews, and improve your chances of landing your dream job.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white">
                  Get Started - It's Free
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-orange-200 text-gray-700 hover:text-orange-700 hover:bg-orange-50 hover:border-orange-300">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Comprehensive Job Application Tools</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides everything you need to create standout job applications and prepare for interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow group">
                <div className={`h-3 ${index === 0 ? 'bg-orange-600' : index === 1 ? 'bg-blue-600' : 'bg-purple-600'} w-full`}></div>
                <div className="p-6">
                  <div className={`${feature.bgColor} rounded-full p-3 w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-opacity-80 transition-colors`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-2 mb-6">
                    {feature.listItems.map((item, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button onClick={() => handleFeatureClick(feature.path)} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                    {feature.buttonText}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Secondary Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {secondaryFeatures.map((feature, index) => (
              <Card key={index} className="overflow-hidden border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all p-6">
                <div className="flex items-start mb-4">
                  <div className={`${feature.bgColor} rounded-lg p-3 mr-4`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
                <Button onClick={() => handleFeatureClick(feature.path)} variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50" size="sm">
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to create professional job application materials in just a few steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="relative">
                <div className="bg-orange-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-orange-600" />
                </div>
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-orange-500 to-transparent -z-10"></div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">1. Upload your resume</h3>
              <p className="text-gray-600">
                Import your existing resume or create a new one using our builder
              </p>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="bg-orange-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-orange-600" />
                </div>
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-orange-500 to-transparent -z-10"></div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">2. Paste job description</h3>
              <p className="text-gray-600">
                Our AI analyzes requirements and matches them to your experience
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">3. Get your documents</h3>
              <p className="text-gray-600">
                Download perfectly tailored cover letters and resumes ready to submit
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Highlight */}
      <section className="py-20 bg-gradient-to-r from-orange-900 to-orange-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Advanced AI-Powered Features</h2>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                Our platform uses cutting-edge AI to analyze job listings and optimize your applications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex">
                <div className="mr-6">
                  <div className="bg-orange-700 p-4 rounded-lg">
                    <Sparkles className="h-8 w-8 text-orange-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Keyword Optimization</h3>
                  <p className="text-orange-100">
                    Our AI identifies key skills and requirements from job descriptions and seamlessly incorporates them into your cover letters and resumes.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="mr-6">
                  <div className="bg-orange-700 p-4 rounded-lg">
                    <ScanSearch className="h-8 w-8 text-orange-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">ATS Compatibility Analysis</h3>
                  <p className="text-orange-100">
                    Get detailed feedback on how well your resume will perform with applicant tracking systems and suggestions for improvements.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="mr-6">
                  <div className="bg-orange-700 p-4 rounded-lg">
                    <MessagesSquare className="h-8 w-8 text-orange-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Interview Question Prediction</h3>
                  <p className="text-orange-100">
                    Our system analyzes job descriptions to predict likely interview questions and helps you prepare compelling answers.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="mr-6">
                  <div className="bg-orange-700 p-4 rounded-lg">
                    <MailCheck className="h-8 w-8 text-orange-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Follow-Up Email Generation</h3>
                  <p className="text-orange-100">
                    Create professional follow-up emails at the perfect time to increase your chances of getting a response.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-50">
                Explore All Features
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to elevate your job applications?</h2>
            <p className="text-xl mb-8 text-orange-50">
              Join thousands of job seekers who have improved their application success rate with our AI-powered tools
            </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-orange-700 hover:bg-orange-50">
                  Get Started - It's Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-orange-600">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <FeatureAuthModal open={modalOpen} onOpenChange={setModalOpen} returnTo={returnTo} />
    </>
  );
};

export default FeaturesPage;