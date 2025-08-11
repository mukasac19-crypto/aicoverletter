import React from "react";
import { FileText } from "lucide-react";

const SplashScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
        <FileText className="w-8 h-8 text-orange-600" />
      </div>
      <span className="text-2xl font-bold text-orange-600 tracking-tight">CareerThings AI</span>
    </div>
  );
};

export default SplashScreen;
