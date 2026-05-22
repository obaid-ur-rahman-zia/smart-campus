"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  startOnMount?: boolean;
}

export function CountUp({
  from = 0,
  to,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  startOnMount = true,
}: CountUpProps) {
  const [shouldCount, setShouldCount] = useState(startOnMount);
  const ref = useRef<HTMLSpanElement>(null);

  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => {
    return prefix + latest.toFixed(decimals) + suffix;
  });

  useEffect(() => {
    if (!shouldCount) return;

    const controls = animate(count, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => controls.stop();
  }, [count, to, shouldCount, duration]);

  return (
    <motion.span
      ref={ref}
      className={className}
      onViewportEnter={() => setShouldCount(true)}
      viewport={{ once: true, amount: 0.5 }}
    >
      {rounded}
    </motion.span>
  );
}
