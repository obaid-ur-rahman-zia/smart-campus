"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "size-8",
        md: "size-10",
        lg: "size-12",
        xl: "size-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  fallback?: string;
}

export function Avatar({ className, size, fallback, children, ...props }: AvatarProps) {
  return (
    <div className={cn(avatarVariants({ size, className }))} {...props}>
      {children ? (
        children
      ) : fallback ? (
        <div className="flex h-full w-full items-center justify-center bg-slate-200 font-bold text-slate-600">
          {fallback.charAt(0).toUpperCase()}
        </div>
      ) : null}
    </div>
  );
}
