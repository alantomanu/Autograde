"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    return (
      <div className="relative">
        {label && (
          <label
            className={cn(
              "absolute left-0 transition-all duration-300",
              (isFocused || hasValue) 
                ? "-top-6 text-sm text-primary" 
                : "top-2 text-muted-foreground",
            )}
          >
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex w-full border-0 border-b-2 border-muted bg-transparent px-0 py-2 text-sm",
            "placeholder:text-transparent", // Hide placeholder when label is shown
            "focus:border-primary focus:outline-none focus:ring-0",
            "transition-all duration-300",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            setHasValue(e.target.value.length > 0);
          }}
          onChange={(e) => setHasValue(e.target.value.length > 0)}
          {...props}
        />
        <div
          className={cn(
            "absolute bottom-0 left-0 h-0.5 w-0 bg-primary",
            "transition-all duration-300",
            isFocused ? "w-full" : "w-0"
          )}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
