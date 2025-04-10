"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholders?: string[];
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, placeholders = [], ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    const [currentPlaceholder, setCurrentPlaceholder] = React.useState(0);

    React.useEffect(() => {
      if (placeholders.length > 0 && !hasValue && !isFocused) {
        const interval = setInterval(() => {
          setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
      }
    }, [placeholders, hasValue, isFocused]);

    return (
      <div className="relative group">
        <div className="relative">
          <input
            type={type}
            className={cn(
              "peer w-full bg-transparent",
              "px-4 py-2 text-sm rounded-md",
              "border-2 border-gray-200 dark:border-gray-800",
              "transition-all duration-300 ease-in-out",
              "placeholder:text-transparent",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "dark:bg-zinc-800/50 dark:text-white",
              "dark:focus:ring-primary/20 dark:focus:border-primary",
              className
            )}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              setHasValue(e.target.value.length > 0);
            }}
            onChange={(e) => {
              setHasValue(e.target.value.length > 0);
              props.onChange?.(e);
            }}
            {...props}
          />

          {/* Floating Label/Placeholder */}
          <AnimatePresence mode="wait">
            {(label || (!hasValue && !isFocused && placeholders.length > 0)) && (
              <motion.label
                initial={{ y: 0, scale: 1 }}
                animate={{
                  y: isFocused || hasValue ? -24 : 0,
                  scale: isFocused || hasValue ? 0.85 : 1,
                  color: isFocused 
                    ? "var(--primary)" 
                    : hasValue 
                    ? "var(--muted-foreground)" 
                    : "var(--muted-foreground)",
                }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ 
                  duration: 0.2,
                  ease: "easeInOut"
                }}
                className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2",
                  "pointer-events-none origin-left",
                  "text-muted-foreground dark:text-gray-400",
                  "transition-colors duration-200",
                  "mb-1"
                )}
              >
                {label || placeholders[currentPlaceholder]}
              </motion.label>
            )}
          </AnimatePresence>

          {/* Active Input Highlight */}
          <motion.div
            initial={false}
            animate={{
              scaleX: isFocused ? 1 : 0,
              opacity: isFocused ? 1 : 0
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut"
            }}
            className={cn(
              "absolute -bottom-[2px] left-[4px] h-0.5",
              "w-[calc(100%-7px)] rounded-full",
              "bg-primary/60 dark:bg-primary/60",
              "origin-left"
            )}
          />
        </div>

        {/* Background Highlight Effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-lg -z-10",
            "bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20",
            "opacity-0 transition-opacity duration-300",
            "group-hover:opacity-100",
            isFocused ? "opacity-100" : ""
          )}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
