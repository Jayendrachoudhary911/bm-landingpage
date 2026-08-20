import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: "0%",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3.5px",
        background: "linear-gradient(90deg, #38bdf8 0%, #818cf8 50%, #6366f1 100%)",
        boxShadow: "0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(99, 102, 241, 0.4)",
        zIndex: 10000,
      }}
    />
  );
}
