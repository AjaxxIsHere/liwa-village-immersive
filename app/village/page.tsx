'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────
   Village — Al Marmoom 2026
   The "page 2" section: cinematic video hero → content columns
   Route: /village
   ────────────────────────────────────────────────────────────── */

const STATS = [
  { num: '28°',  label: 'Average Perfect Winter Temperature' },
  { num: '40k+', label: 'Hectares of Protected Desert Wilderness' },
  { num: '12',   label: 'Live Heritage Celebrations & Main Stages' },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: i * 0.14 },
  }),
};

export default function VillagePage() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  /* Parallax: video moves slower than scroll */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  if (!mounted) return <div className="h-screen w-full bg-[#1A1514]" />;

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen bg-[#1A1514] text-[#F4E3D7] overflow-x-hidden"
      style={{ fontFamily: "'Tajawal', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* ══════════════════════════════════════════════
          SECTION 1 — CINEMATIC VIDEO HERO
          ══════════════════════════════════════════════ */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Parallax video layer */}
        <motion.div
          className="absolute inset-0 scale-[1.12]"
          style={{ y: videoY }}
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            {/* Use available scene1 video; swap with silver-lc.mp4 when uploaded */}
            <source src="/videos/scene1.webm" type="video/webm" />
          </video>
        </motion.div>

        {/* Gradient scrim */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(26,21,20,0.55) 0%, transparent 30%, rgba(26,21,20,0.28) 60%, rgba(26,21,20,0.92) 100%)',
          }}
        />
        {/* Left-side fade for text legibility */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(26,21,20,0.7) 0%, transparent 55%)',
          }}
        />

        {/* Logo / nav strip */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 sm:px-14 pt-8 sm:pt-10">
          <span
            className="uppercase tracking-[0.38em] text-[10px] sm:text-xs text-white/60"
            style={{ letterSpacing: '0.38em' }}
          >
            Al Marmoom
          </span>
          <a
            href="/"
            className="uppercase tracking-[0.25em] text-[10px] sm:text-xs text-white/50 hover:text-white transition-colors duration-300"
          >
            ← Back
          </a>
        </div>

        {/* Hero title copy */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end px-8 sm:px-14 md:px-20 pb-16 sm:pb-20">
          <motion.p
            className="uppercase tracking-[0.42em] text-[10px] sm:text-xs mb-4"
            style={{ color: '#C9A96E' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            The Winter Capital
          </motion.p>

          <motion.h1
            className="font-light leading-[1.02] tracking-[0.06em]"
            style={{
              fontSize: 'clamp(3rem, 7vw + 0.5rem, 7.5rem)',
              fontWeight: 300,
            }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            Al Marmoom{' '}
            <span style={{ color: '#C9A96E' }}>2026</span>
          </motion.h1>

          {/* Thin gold rule */}
          <motion.div
            className="mt-7 h-px w-16"
            style={{ background: '#C9A96E' }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2.5">
          <span className="text-white/30 text-[10px] uppercase tracking-[0.35em] select-none">
            Scroll
          </span>
          <div className="relative w-px h-10 overflow-hidden">
            <div
              className="absolute inset-x-0 top-0 h-full"
              style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)',
                animation: 'scroll-line-pulse 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2 — CONTENT: experience + stats
          ══════════════════════════════════════════════ */}
      <section className="relative z-10 px-8 sm:px-14 md:px-20 py-20 sm:py-28">
        {/* Ambient gold glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 65% 45% at 50% 0%, rgba(201,169,110,0.10) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          {/* Two-column layout: text left, stats right */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-0 items-start">

            {/* ── Left: Experience copy ── */}
            <motion.div
              className="flex-1 md:pr-16"
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
            >
              <p
                className="uppercase tracking-[0.38em] text-[10px] sm:text-xs mb-5"
                style={{ color: '#C9A96E' }}
              >
                The Experience
              </p>
              <h2
                className="font-light leading-[1.15] mb-6"
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
                  fontWeight: 300,
                }}
              >
                Where <em>Legends</em>
                <br />Meet the Dunes
              </h2>
              <p
                className="leading-[1.8] max-w-[44ch]"
                style={{
                  fontSize: 'clamp(0.9rem, 1.1vw, 1.1rem)',
                  color: 'rgba(244,227,215,0.70)',
                }}
              >
                A destination crafted for those who see adventure as a heritage.
                Across the endless dunes of Al Marmoom, modern luxury meets
                untamed landscape, presenting a winter playground unlike any
                other on earth.
              </p>
            </motion.div>

            {/* Vertical divider (desktop only) */}
            <div
              className="hidden md:block self-stretch w-px mx-4 flex-none"
              style={{ background: 'rgba(201,169,110,0.22)' }}
            />

            {/* ── Right: Stats ── */}
            <div className="flex-1 md:pl-16 flex flex-col gap-9">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.num}
                  className="flex items-baseline gap-5"
                  custom={i + 1}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <span
                    className="font-light tabular-nums flex-none"
                    style={{
                      fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
                      color: '#C9A96E',
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                      fontWeight: 300,
                    }}
                  >
                    {s.num}
                  </span>
                  <span
                    className="leading-[1.45] max-w-[28ch]"
                    style={{
                      fontSize: 'clamp(0.78rem, 0.95vw, 0.95rem)',
                      color: 'rgba(244,227,215,0.58)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Horizontal rule */}
          <motion.div
            className="mt-20 h-px w-full"
            style={{ background: 'rgba(201,169,110,0.15)' }}
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════ */}
      <footer
        className="relative z-10 px-8 sm:px-14 md:px-20 py-10 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid rgba(201,169,110,0.12)' }}
      >
        <motion.span
          className="uppercase tracking-[0.42em] text-xs"
          style={{ color: '#C9A96E' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          AL MARMOOM
        </motion.span>
        <motion.span
          className="text-xs italic"
          style={{ color: 'rgba(244,227,215,0.38)', letterSpacing: '0.06em' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.22 }}
        >
          The Desert&#39;s Grand Stage © 2026
        </motion.span>
      </footer>
    </main>
  );
}
