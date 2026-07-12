"use client"

import { motion, useReducedMotion } from "framer-motion"

type MotionWrapperProps = {
  children: React.ReactNode
  className?: string
  delay?: number
}

export default function MotionWrapper({
  children,
  className = "",
  delay = 0,
}: MotionWrapperProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.7,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
