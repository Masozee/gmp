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
  colorVariant = "green",
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

    // Get the color from our colors object
    const color = {
      green: COLORS.GREEN,
      yellow: COLORS.YELLOW,
      blue: COLORS.BLUE,
      pink: COLORS.PINK,
    }[colorVariant];

    // Get text color - dark text on yellow, white on others
    const textColor = colorVariant === "yellow" ? "text-black" : "text-white";

    // Return appropriate classes based on variant
    return cn({
      [`bg-[${color}] ${textColor} hover:bg-opacity-90`]: variant === "solid",
      [`border border-[${color}] text-[${color}] hover:bg-[${color}] hover:bg-opacity-10`]: variant === "outline",
      [`text-[${color}] hover:bg-[${color}] hover:bg-opacity-10`]: variant === "ghost",
      [`text-[${color}] underline-offset-4 hover:underline`]: variant === "link",
    });
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