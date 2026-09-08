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
        { color: "#C9A15A", size: 520, top: "-12%", left: "-8%", delay: 0 },
        { color: "#0FA968", size: 420, top: "55%", left: "62%", delay: 2 },
        { color: "#A67F3D", size: 380, top: "8%", left: "72%", delay: 4 },
      ]
    : [
        { color: "#DEBD84", size: 480, top: "-10%", left: "5%", delay: 0 },
        { color: "#C9A15A", size: 380, top: "40%", left: "75%", delay: 1.6 },
        { color: "#0E1526", size: 340, top: "70%", left: "10%", delay: 3.2 },
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
            opacity: isDark ? 0.16 : 0.08,
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
