"use client";

import { motion } from "framer-motion";

/**
 * Soft, slow-moving blurred color fields. Purely decorative — sits behind
 * content with pointer-events disabled.
 */
export default function GradientMesh({ variant = "light" }) {
  const isDark = variant === "dark";

  const blobs = isDark
    ? [
        { color: "#B8863B", size: 520, top: "-12%", left: "-8%", delay: 0 },
        { color: "#2F6844", size: 420, top: "55%", left: "60%", delay: 2 },
        { color: "#8E661F", size: 380, top: "10%", left: "70%", delay: 4 },
      ]
    : [
        { color: "#D2A55E", size: 480, top: "-10%", left: "5%", delay: 0 },
        { color: "#B8863B", size: 380, top: "40%", left: "75%", delay: 1.6 },
        { color: "#121B2E", size: 340, top: "70%", left: "10%", delay: 3.2 },
      ];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            background: b.color,
            opacity: isDark ? 0.14 : 0.08,
            filter: "blur(90px)",
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
          }}
          transition={{
            duration: 18 + i * 3,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
