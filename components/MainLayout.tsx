"use client"

import { usePathname } from "next/navigation";
import MainHeader from "./MainHeader/MainHeader";
import MainFooter from "./MainFooter";


const MainLayout=({children}:{children:React.ReactNode})=>{
     const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");
    return (
       <div className="w-full h-full">
        {!isDashboard && <MainHeader />}
        {children}
        {!isDashboard && <MainFooter />}
        
       </div>
    )
}

export default MainLayout