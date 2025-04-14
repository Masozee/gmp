"use client";

import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { COLORS } from "@/styles/colors";
import { cn } from "@/lib/utils";

type ColorVariant = "green" | "yellow" | "blue" | "pink" | "default";
type ButtonVariant = "solid" | "outline" | "ghost" | "link";

interface CompanyButtonProps extends Omit<ButtonProps, "variant"> {
  colorVariant?: ColorVariant;
  variant?: ButtonVariant;
}

export function CompanyButton({
  colorVariant = "yellow",
  variant = "solid",
  className,
  ...props
}: CompanyButtonProps) {
  // Get the appropriate color based on the variant
  const getColorClasses = () => {
    // Default shadcn button styling
    if (colorVariant === "default") {
      return cn({
        "bg-primary text-primary-foreground hover:bg-primary/90": variant === "solid",
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
        "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
        "text-primary underline-offset-4 hover:underline": variant === "link",
      });
    }

    // Use our color scheme based on colorVariant
    switch (colorVariant) {
      case "yellow":
        return cn({
          "bg-brand-yellow text-black hover:bg-brand-yellow/90": variant === "solid",
          "border border-brand-yellow text-brand-yellow hover:bg-brand-yellow/10": variant === "outline",
          "text-brand-yellow hover:bg-brand-yellow/10": variant === "ghost",
          "text-brand-yellow underline-offset-4 hover:underline": variant === "link",
        });
      case "pink":
        return cn({
          "bg-brand-pink text-white hover:bg-brand-pink/90": variant === "solid",
          "border border-brand-pink text-brand-pink hover:bg-brand-pink/10": variant === "outline",
          "text-brand-pink hover:bg-brand-pink/10": variant === "ghost",
          "text-brand-pink underline-offset-4 hover:underline": variant === "link",
        });
      case "blue":
        return cn({
          "bg-brand-blue text-white hover:bg-brand-blue/90": variant === "solid",
          "border border-brand-blue text-brand-blue hover:bg-brand-blue/10": variant === "outline",
          "text-brand-blue hover:bg-brand-blue/10": variant === "ghost",
          "text-brand-blue underline-offset-4 hover:underline": variant === "link",
        });
      case "green":
        return cn({
          "bg-green-600 text-white hover:bg-green-600/90": variant === "solid",
          "border border-green-600 text-green-600 hover:bg-green-600/10": variant === "outline",
          "text-green-600 hover:bg-green-600/10": variant === "ghost",
          "text-green-600 underline-offset-4 hover:underline": variant === "link",
        });
      default:
        return "";
    }
  };

  // Get the appropriate shadcn button variant
  const getShadcnVariant = (): ButtonProps["variant"] => {
    switch (variant) {
      case "solid":
        return colorVariant === "default" ? "default" : null;
      case "outline":
        return colorVariant === "default" ? "outline" : null;
      case "ghost":
        return colorVariant === "default" ? "ghost" : null;
      case "link":
        return colorVariant === "default" ? "link" : null;
      default:
        return "default";
    }
  };

  // Combine classes
  const buttonClasses = cn(getColorClasses(), className);

  return (
    <Button 
      className={buttonClasses}
      variant={getShadcnVariant()}
      {...props}
    />
  );
} 