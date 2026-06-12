'use client';

import { motion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Shared text-enter / text-exit variants                            */
/*  Exit: zoom-out (scale 1 → 1.1) + fade-out                         */
/*  Enter: zoom-in (scale 0.95 → 1) + fade-in                         */
/* ------------------------------------------------------------------ */
const textContainerVariants = {
  initial: {
    scale: 0.95,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.83, 0, 0.17, 1] as const,
    },
  },
  exit: {
    scale: 1.1,
    opacity: 0,
    transition: {
      duration: 0.8,
      ease: [0.83, 0, 0.17, 1] as const,
    },
  },
};

/* ------------------------------------------------------------------ */
/*  ArrivalScene — Scene 2 text content                                */
/*  Rendered inside AnimatePresence by SceneTransitionManager.         */
/*  mix-blend-difference keeps the text reactive to the video behind.  */
/* ------------------------------------------------------------------ */
export default function ArrivalScene() {
  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 mix-blend-difference"
      variants={textContainerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <p className="text-white/50 text-[11px] sm:text-xs uppercase tracking-[0.35em] mb-6 font-sans select-none">
        Cross the ridge.
      </p>
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-light italic tracking-[0.12em] font-serif leading-[1.05] text-center select-none">
        And then,
        <br />
        the horizon ignites.
      </h1>
    </motion.div>
  );
}
