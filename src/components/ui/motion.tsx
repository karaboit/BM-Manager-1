import { motion, AnimatePresence } from "framer-motion";

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const slideIn = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
  transition: { duration: 0.2 },
};

export const FadeIn = ({ children }: { children: React.ReactNode }) => (
  <AnimatePresence mode="wait">
    <motion.div {...fadeIn}>{children}</motion.div>
  </AnimatePresence>
);

export const SlideIn = ({ children }: { children: React.ReactNode }) => (
  <AnimatePresence mode="wait">
    <motion.div {...slideIn}>{children}</motion.div>
  </AnimatePresence>
);
