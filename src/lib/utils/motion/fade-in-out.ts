// /lib/utils/motion/fade-in-out.ts
import type { Variants } from "framer-motion";

export const fadeInOut = (duration = 0.2): Variants => ({
  from: {
    opacity: 0,
    transition: { type: "tween", duration, ease: "easeInOut" },
  },
  to: {
    opacity: 1,
    transition: { type: "tween", duration, ease: "easeInOut" },
  },
});
