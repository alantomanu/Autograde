"use client"

import { useState } from "react"
import {
  motion,
  AnimationOptions,
  stagger,
  useAnimate,
} from "motion/react"
import { debounce } from "lodash"

interface VariableFontHoverByLetterProps {
  children: string
  className?: string
  fromFontVariationSettings: string
  toFontVariationSettings: string
  transition?: AnimationOptions
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center" | number
}

export function VariableFontHoverByLetter({
  children,
  className,
  fromFontVariationSettings,
  toFontVariationSettings,
  transition = {
    duration: 0.3,
    ease: "easeInOut",
  },
  staggerDuration = 0.03,
  staggerFrom = "first",
}: VariableFontHoverByLetterProps) {
  const [scope, animate] = useAnimate()
  const [isHovered, setIsHovered] = useState(false)

  const mergeTransition = (baseTransition: AnimationOptions) => ({
    ...baseTransition,
    delay: stagger(staggerDuration, {
      from: staggerFrom,
    }),
  })

  const hoverStart = debounce(
    () => {
      if (isHovered) return
      setIsHovered(true)

      animate(
        ".letter",
        { fontVariationSettings: toFontVariationSettings },
        mergeTransition(transition)
      )
    },
    100,
    { leading: true, trailing: true }
  )

  const hoverEnd = debounce(
    () => {
      setIsHovered(false)

      animate(
        ".letter",
        { fontVariationSettings: fromFontVariationSettings },
        mergeTransition(transition)
      )
    },
    100,
    { leading: true, trailing: true }
  )

  return (
    <motion.span
      className={`${className}`}
      onHoverStart={hoverStart}
      onHoverEnd={hoverEnd}
      ref={scope}
    >
      <span className="sr-only">{children}</span>

      {children.split("").map((letter: string, i: number) => {
        return (
          <motion.span
            key={i}
            className="inline-block whitespace-pre letter"
            aria-hidden="true"
          >
            {letter}
          </motion.span>
        )
      })}
    </motion.span>
  )
}
