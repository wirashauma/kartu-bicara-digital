"use client";

import React from "react";
import { HelpCircle, Lightbulb, MessageSquare, Repeat2 } from "lucide-react";
import { TokenType, TOKEN_DEFINITIONS } from "@/types/session";
import { cn } from "@/lib/utils";

export interface TokenBadgeProps {
  type: TokenType;
  size?: "xs" | "sm" | "md" | "lg" | "interactive";
  showIcon?: boolean;
  showLabel?: boolean;
  showCount?: boolean;
  count?: number;
  isSelected?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TokenBadge({
  type,
  size = "md",
  showIcon = true,
  showLabel = true,
  showCount = false,
  count,
  isSelected = false,
  interactive = false,
  onClick,
  className,
}: TokenBadgeProps) {
  const meta = TOKEN_DEFINITIONS[type];

  const renderIcon = (iconSizeClass: string) => {
    switch (meta.iconName) {
      case "HelpCircle":
        return <HelpCircle className={iconSizeClass} />;
      case "Lightbulb":
        return <Lightbulb className={iconSizeClass} />;
      case "MessageSquare":
        return <MessageSquare className={iconSizeClass} />;
      case "Repeat2":
        return <Repeat2 className={iconSizeClass} />;
      default:
        return <HelpCircle className={iconSizeClass} />;
    }
  };

  // Specific sizing presets
  const sizeStyles = {
    xs: {
      container: "px-1.5 py-0.5 text-[10px] gap-1 rounded-md font-medium",
      icon: "w-3 h-3",
      countBadge: "w-3.5 h-3.5 text-[9px]",
    },
    sm: {
      container: "px-2 py-0.5 text-xs gap-1.5 rounded-lg font-medium",
      icon: "w-3.5 h-3.5",
      countBadge: "w-4 h-4 text-[10px]",
    },
    md: {
      container: "px-3 py-1.5 text-xs sm:text-sm gap-2 rounded-xl font-semibold",
      icon: "w-4 h-4",
      countBadge: "w-5 h-5 text-xs",
    },
    lg: {
      container: "px-4 py-2 text-sm sm:text-base gap-2.5 rounded-2xl font-bold shadow-sm",
      icon: "w-5 h-5",
      countBadge: "w-6 h-6 text-xs",
    },
    interactive: {
      container:
        "px-4 py-3 text-sm sm:text-base gap-3 rounded-2xl font-bold transition-all duration-200 transform active:scale-95 cursor-pointer shadow-sm hover:shadow-md",
      icon: "w-5 h-5",
      countBadge: "w-6 h-6 text-xs",
    },
  }[size];

  // Colors per type
  const colorStyles: Record<
    TokenType,
    {
      light: string;
      active: string;
      border: string;
      solidBg: string;
      text: string;
      countBg: string;
    }
  > = {
    BERTANYA: {
      light: "bg-pink-50 hover:bg-pink-100/80 text-pink-700 border-pink-200",
      active: "bg-pink-500 text-white border-pink-500 shadow-pink-200 shadow-md",
      border: "border-pink-300",
      solidBg: "bg-pink-500",
      text: "text-pink-600",
      countBg: "bg-pink-200 text-pink-800",
    },
    MENJAWAB: {
      light: "bg-amber-50 hover:bg-amber-100/80 text-amber-800 border-amber-200",
      active: "bg-amber-500 text-white border-amber-500 shadow-amber-200 shadow-md",
      border: "border-amber-300",
      solidBg: "bg-amber-500",
      text: "text-amber-600",
      countBg: "bg-amber-200 text-amber-800",
    },
    BERPENDAPAT: {
      light: "bg-cyan-50 hover:bg-cyan-100/80 text-cyan-800 border-cyan-200",
      active: "bg-cyan-500 text-white border-cyan-500 shadow-cyan-200 shadow-md",
      border: "border-cyan-300",
      solidBg: "bg-cyan-500",
      text: "text-cyan-600",
      countBg: "bg-cyan-200 text-cyan-800",
    },
    MENANGGAPI: {
      light: "bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border-emerald-200",
      active: "bg-emerald-500 text-white border-emerald-500 shadow-emerald-200 shadow-md",
      border: "border-emerald-300",
      solidBg: "bg-emerald-500",
      text: "text-emerald-600",
      countBg: "bg-emerald-200 text-emerald-800",
    },
  };

  const currentTheme = colorStyles[type];
  const isClickable = interactive || !!onClick;

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.();
        }
      }}
      title={`${meta.label}: ${meta.description}`}
      className={cn(
        "inline-flex items-center justify-center border select-none transition-colors",
        sizeStyles.container,
        isSelected ? currentTheme.active : currentTheme.light,
        isClickable && "cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1",
        isClickable && !isSelected && "hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      {showIcon && (
        <span
          className={cn(
            "flex items-center justify-center shrink-0",
            isSelected ? "text-white" : currentTheme.text
          )}
        >
          {renderIcon(sizeStyles.icon)}
        </span>
      )}

      {showLabel && <span className="tracking-tight">{meta.label}</span>}

      {showCount && typeof count === "number" && (
        <span
          className={cn(
            "ml-0.5 inline-flex items-center justify-center rounded-full font-bold",
            sizeStyles.countBadge,
            isSelected ? "bg-white/25 text-white" : currentTheme.countBg
          )}
        >
          {count}
        </span>
      )}
    </div>
  );
}
export default TokenBadge;

