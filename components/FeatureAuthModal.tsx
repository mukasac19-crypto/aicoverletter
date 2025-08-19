"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, LogIn } from "lucide-react";
import { useUiStore } from "@/stores/uistore";

interface FeatureAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnTo?: string;
}

export const FeatureAuthModal = ({ open, onOpenChange, returnTo }: FeatureAuthModalProps) => {
  const router = useRouter();
  const {toggleAuthModal,toggleShowLoginContent} = useUiStore()

  const handleRedirect = (path: string) => {
    let url = path;
    if (returnTo) {
      url += `?returnTo=${encodeURIComponent(returnTo)}`;
    }
    router.push(url);
  };

  //handle show auth modal

  const handleShowAuthModal = (isLogin: boolean) => {
    onOpenChange(false);
    toggleAuthModal(true);
    toggleShowLoginContent(isLogin);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Unlock This Feature</DialogTitle>
          <DialogDescription className="text-center">
            Please log in or create an account to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={() => {
            handleShowAuthModal(true);
            // handleRedirect("/auth/login")}
            }}
            size="lg"
            >
            <LogIn className="mr-2 h-4 w-4" /> Log In
          </Button>
          <Button onClick={() => {
            handleShowAuthModal(false);
            // handleRedirect("/auth/register")
          }} variant="outline" size="lg">
            Sign Up Free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
