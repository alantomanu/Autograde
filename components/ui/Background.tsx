"use client";

import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/magicui/grid-pattern";

interface BackgroundProps {
  children: React.ReactNode;
}

export function Background({ children }: BackgroundProps) {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="fixed inset-0 w-full h-full z-0">
        <GridPattern
          squares={[
       
            [3, 8],
            [4, 14],
            [3, 20],
            

            [12, 15],
            [12, 12],
            [12, 18],
            [12, 24],

            [19, 10],
            [19, 14],
            [19, 20],
            [19, 26],
            
    
            [26, 10],
            [26, 16],
            [26, 22],

            [33, 10],
            [34, 16],
            [35, 22],
            [34, 28],
            [33, 34],
          ]}
          className={cn(
            "[mask-image:radial-gradient(1600px_circle_at_center,white,transparent)]",
            "absolute inset-0 w-full h-full",
            "opacity-40",
            "stroke-gray-300",
            
          )}
          style={{
            strokeWidth: 1.25,
          }}
        />
      </div>
      <div className="relative z-1">
        {children}
      </div>
    </div>
  );
}
