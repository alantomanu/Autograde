"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.8,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1.2,
        delay: stagger(0.4),
      }
    );
  }, [animate, filter, duration]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="tracking-wide">
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="opacity-0 font-semibold"
              style={{
                filter: filter ? "blur(10px)" : "none",
                display: "inline-block",
                marginRight: "0.3em"
              }}
            >
              {word}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      {renderWords()}
    </div>
  );
};
