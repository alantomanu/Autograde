"use client";

import { cn } from "@/lib/utils";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 h-screen w-screen bg-white">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-transparent to-blue-50" />
      <InteractiveGridPattern
        className="absolute inset-0"
        squaresClassName="stroke-blue-500/20 hover:fill-blue-500/20"
        width={40}
        height={40}
        squares={[32, 32]}
      />
    </div>
  );
}
