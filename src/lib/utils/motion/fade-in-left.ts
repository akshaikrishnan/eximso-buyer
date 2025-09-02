// /lib/utils/motion/fade-in-left.ts
import type { Variants } from "framer-motion";

export const fadeInLeft = (duration = 0.3): Variants => ({
  from: {
    x: -300, // slide in from left
    transition: { type: "tween", duration, ease: "easeInOut" },
  },
  to: {
    x: 0,
    transition: { type: "tween", duration, ease: "easeInOut" },
  },
});
