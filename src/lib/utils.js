import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useToast as useShadcnToast } from "@/components/ui/use-toast";

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const useBetaFeatureToast = () => {
  const { toast: shadcnToast } = useShadcnToast();

  const showBetaToast = (customTitle, customDescription) => {
    shadcnToast({
      title: customTitle || "Beta Feature Notice",
      description: customDescription || "This functionality is part of the Trainava Beta and is under active development. Some aspects may be placeholders or incomplete. Thanks for your understanding!",
      duration: 7000,
      className: "bg-blue-600/20 border-blue-500 text-slate-200 backdrop-blur-lg",
    });
  };

  return { showBetaToast };
};
