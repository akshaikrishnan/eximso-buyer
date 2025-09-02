// /lib/utils/motion/fade-in-right.ts
import type { Variants } from "framer-motion";

export const fadeInRight = (duration = 0.3): Variants => ({
  from: {
    x: 300, // slide in from right
    transition: { type: "tween", duration, ease: "easeInOut" },
  },
  to: {
    x: 0,
    transition: { type: "tween", duration, ease: "easeInOut" },
  },
});
