"use client"

import Image from "next/image"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  User,
  Briefcase,
  Menu,
  Home,
  FileOutput,
  LayoutTemplate,
  History,
  ChevronLeft,
  ChevronRight,
  MessagesSquare,
  X,
  FileSpreadsheet,
  ScanSearch, // Added ScanSearch icon for ATS
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


 const navItems = [
    {
      title: "Home",
      href: "/dashboard",
      icon: Home,
    },

    {
      title: "Cover Letters",
      href: "/dashboard/cover-letters",
      icon: FileOutput,
    },
    {
      title: "Resumes",
      href: "/dashboard/resumes",
      icon: FileSpreadsheet,
    },
    {
      title: "Jobs",
      href: "/dashboard/jobs",
      icon: Briefcase,
    },
    {
      title: "Interview Buddy",
      href: "/dashboard/interview-buddy",
      icon: MessagesSquare,
    },
    {
      title: "ATS Scanner",
      href: "/dashboard/ats-scanner",
      icon: ScanSearch,
    },

    // {
    // title: "Templates",
    // href: "/dashboard/templates",
    // icon: LayoutTemplate,
    // },

    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
  ];


const AuthLayout=({children}:{children:React.ReactNode})=>{

        const {user,signOut} = useAuth()
        const pathname = usePathname();
        const router = useRouter();
        const { toast } = useToast();


      const [isMobileOpen, setIsMobileOpen] = useState(false);
      const [isCollapsed, setIsCollapsed] = useState(false);
      const [signOutLoading, setSignOutLoading] = useState(false);
      const [dropdownOpen, setDropdownOpen] = useState(false);


       const handleSignOut = async () => {
    setSignOutLoading(true);
    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSignOutLoading(false);
    }
  };


    return(
     <div className="min-h-screen max-h-screen flex flex-col bg-orange-50/20">
            {/* lg header */}

      <div className=" sticky top-0 left-0 right-0 w-full min-h-[80px]  bg-white border-b border-gray-100 hidden lg:flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="h-8 w-auto rounded-lg flex items-center justify-center">
            <Image
              src="/careerthingslogo.png"
              width={200}
              height={36}
              alt="CareerThings AI"
            />
          </div>

          <div onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-orange-600" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-orange-600" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="relative group">
              <button
                id="avatarButton"
                type="button"
                data-dropdown-toggle="userDropdown"
                data-dropdown-placement="bottom-start"
                className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-lg shadow hover:shadow-md transition relative focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                aria-label="User menu"
                tabIndex={0}
                onClick={() => setDropdownOpen((open) => !open)}
              >
                {user.user_metadata?.full_name?.[0]?.toUpperCase() ||
                  user.email?.[0]?.toUpperCase() ||
                  "U"}
              </button>
            
              <div
                id="userDropdown"
                className={`z-10 absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-md dark:bg-gray-700 dark:divide-gray-600 transition-all ${
                  dropdownOpen ? "block" : "hidden"
                }`}
              >
                <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  <div className="font-medium truncate">
                    {user && user.email}
                  </div>
                </div>
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="avatarButton"
                >
        
                </ul>
                <div className="p-2">
                  <Button
                    className="w-full text-left px-4 py-2 text-white hover:text-gray-800 hover:bg-orange-50 rounded-b-lg focus:outline-none"
                    onClick={handleSignOut}
                    disabled={signOutLoading}
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

        {/* Mobile Header - Always visible on mobile and small screens */}
      <header className="border-b sticky top-0 z-40 bg-white shadow-sm lg:hidden">
        <div className="flex h-16 items-center px-4 justify-between w-full">
          <div className="flex items-center justify-between relative w-full">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <div className="h-8 w-auto rounded-lg flex items-center justify-center">
                <Image
                  src="/careerthingslogo.png"
                  width={200}
                  height={36}
                  alt="CareerThings AI"
                />
              </div>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700 hover:text-orange-600 absolute right-0 top-0"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[250px] bg-white">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between h-16 border-b px-4 bg-orange-50">
                    <Link
                      href="/"
                      className="flex items-center"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <div className="h-8 w-auto rounded-lg flex items-center justify-center">
                        <Image
                          src="/careerthingslogo.png"
                          width={200}
                          height={36}
                          alt="CareerThings AI"
                        />
                      </div>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileOpen(false)}
                      className="text-gray-700 hover:text-orange-600"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <nav className="flex-1 overflow-auto py-4 bg-white">
                    <ul className="space-y-2 px-2">
                      {navItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                          >
                            <Button
                              variant={
                                pathname === item.href ? "secondary" : "ghost"
                              }
                              className={cn(
                                "w-full justify-start",
                                pathname === item.href
                                  ? "bg-orange-100 text-orange-700 font-medium hover:bg-orange-200"
                                  : "text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-normal"
                              )}
                            >
                              <item.icon className="mr-2 h-5 w-5" />
                              {item.title}
                            </Button>
                          </Link>
                        </li>
                      ))}
                      <div className="p-2">
                        <Button
                          className="w-full text-left px-4 py-2 text-white hover:text-gray-800 hover:bg-orange-50 rounded-b-lg focus:outline-none"
                          onClick={handleSignOut}
                          disabled={signOutLoading}
                        >
                          Log Out
                        </Button>
                      </div>
                    </ul>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {/* <div className="flex items-center bg-green-100">
            <FileText className="h-6 w-6 text-orange-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">CareerThings </h1>
          </div> */}
          <div className="w-10"></div> {/* Placeholder for alignment */}
        </div>
      </header>

       <div className="flex-1 flex">
         {/* Sidebar Navigation - Desktop Only (Hidden on mobile/small screens) */}
        <aside
          className={cn(
            "hidden lg:flex h-screen flex-col border-r fixed transition-all duration-300 ease-in-out bg-white shadow-sm",
            isCollapsed ? "w-16" : "w-52"
          )}
        >
          <nav className="flex-1 overflow-auto py-4 px-2 bg-white">
            <ul className="space-y-2 px-1">
              <TooltipProvider>
                {navItems.map((item) => (
                  <li key={item.href}>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={item.href}>
                            <Button
                              variant={
                                pathname === item.href ? "secondary" : "ghost"
                              }
                              size="icon"
                              className={cn(
                                "w-full h-10",
                                pathname === item.href
                                  ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                              )}
                            >
                              <item.icon className="h-5 w-5" />
                              <span className="sr-only">{item.title}</span>
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="bg-gray-800 text-white"
                        >
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Link href={item.href}>
                        <Button
                          variant={
                            pathname === item.href ? "secondary" : "ghost"
                          }
                          className={cn(
                            "w-full justify-start",
                            pathname === item.href
                              ? "bg-orange-100 text-orange-700 font-medium hover:bg-orange-200"
                              : "text-gray-600 hover:text-orange-600 hover:bg-orange-50 font-normal"
                          )}
                        >
                          <item.icon className="mr-2 h-5 w-5" />
                          {item.title}
                        </Button>
                      </Link>
                    )}
                  </li>
                ))}
              </TooltipProvider>
            </ul>
          </nav>
        </aside>
        

         {/* Main Content - with thin teal-gray margins */}
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:pl-16" : "lg:pl-52"
        )}>
          {/* Content wrapper with thin teal-gray colored margins */}
          <div className="w-full flex">
            {/* Thin margin left - teal-gray color */}
            <div className="w-1 bg-teal-100/30"></div>
            
            {/* Main content area */}
            <div className="flex-1 bg-white px-10">
              {children}
            </div>
            
            {/* Thin margin right - teal-gray color */}
            <div className="w-1 bg-teal-100/30"></div>
          </div>
        </main>

      </div>

          
        </div>
    )
}

export default AuthLayout