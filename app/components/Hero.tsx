'use client';

import { motion, type MotionValue } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  HeroScene — Scene 1 text content                                  */
/*  Receives scale & opacity as MotionValues from the parent's         */
/*  useScroll → useTransform → useSpring pipeline.                    */
/*  mix-blend-difference keeps the text reactive to the video behind.  */
/* ------------------------------------------------------------------ */

interface HeroSceneProps {
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
}

export default function HeroScene({ scale, opacity }: HeroSceneProps) {
  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 mix-blend-difference"
      style={{ scale, opacity }}
    >
      <p className="text-white/50 text-[11px] sm:text-xs uppercase tracking-[0.35em] mb-6 font-sans select-none">
        The city fades.
      </p>
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-light italic tracking-[0.12em] font-serif leading-[1.05] text-center select-none">
        The Desert
        <br />
        Begins.
      </h1>
    </motion.div>
  );
}
