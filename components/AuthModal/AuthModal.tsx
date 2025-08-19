// components/AuthModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import React from "react";
import LoginPageContent from "../LoginPageContent/LoginPageContent";
import { useUiStore } from "@/stores/uistore";
import RegisterPageContent from "../RegisterPageContent/RegisterPageContent";

interface AuthModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void; // For future auth forms
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {

  const {isShowLoginContent} = useUiStore()
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        // Responsive classes for full viewport on small screens
        className="
          w-full h-full max-w-full md:w-[40%] md:h-[80%] rounded-none bg-white p-6 flex flex-col overflow-auto
        "
      >
        <DialogHeader className="relative flex-row justify-between items-center mb-4"></DialogHeader>
        <div className="flex-grow">{
          isShowLoginContent ? <LoginPageContent /> : <RegisterPageContent />
          }</div>
      </DialogContent>
    </Dialog>
  );
}
