'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';
import HeroScene from './Hero';
import ArrivalScene from './Arrival';
import PulseScene from './PulseScene';
import ActivitiesReel from './ActivitiesReel';

/* ------------------------------------------------------------------ */
/*  Spring config — gentle, cinematic response                        */
/* ------------------------------------------------------------------ */
const SPRING = { stiffness: 80, damping: 30, mass: 0.3 };

/* ------------------------------------------------------------------ */
/*  Reusable nav-link hover style (Tailwind classes)                   */
/* ------------------------------------------------------------------ */
const NAV_LINK =
  'relative text-white/70 text-[10px] sm:text-xs uppercase tracking-[0.22em] font-sans font-medium transition-colors duration-400 hover:text-white';

/* ------------------------------------------------------------------ */
/*  SceneTransitionManager (page-level scroll-driven, 3 scenes)        */
/*                                                                     */
/*  Three sections at 300vh each extend the page to 900vh, creating    */
/*  800vh of scroll range. scroll-snap lives on <html>.                */
/*  A fixed overlay carries all visual content — videos, gradient,     */
/*  text, and persistent UI — driven by useScroll() (page scroll).    */
/*                                                                     */
/*  scrollYProgress 0.0   = snapped to Scene 1 (Hero)                  */
/*  scrollYProgress ~0.33 = snapped to Scene 2 (Arrival)               */
/*  scrollYProgress ~0.67 = snapped to Scene 3 (Pulse)                 */
/*  scrollYProgress 1.0   = bottom                                     */
/* ------------------------------------------------------------------ */
export default function SceneTransitionManager() {
  const [mounted, setMounted] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [scene4Vibe, setScene4Vibe] = useState<'rush' | 'rhythm' | 'roots' | null>(null);
  const [pulseKey, setPulseKey] = useState(0);

  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const arrivalVideoRef = useRef<HTMLVideoElement>(null);

  /* ---- SSR guard ---- */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---- Page-level scroll tracking ---- */
  const { scrollYProgress } = useScroll();

  /* ── Raw transforms ───────────────────────────────────────────── */

  // Scene 1 (Hero) — holds through first snap, exits by ~0.28
  const heroScaleRaw = useTransform(scrollYProgress, [0, 0.28], [1, 1.2]);
  const heroOpacityRaw = useTransform(scrollYProgress, [0, 0.26], [1, 0]);

  // Scene 2 (Arrival) — enters around 0.22, holds through middle snap, exits by ~0.72
  const arrivalScaleRaw = useTransform(
    scrollYProgress,
    [0, 0.22, 0.33, 0.72],
    [0.95, 1, 1, 1.2],
  );
  const arrivalOpacityRaw = useTransform(
    scrollYProgress,
    [0, 0.18, 0.33, 0.7],
    [0, 1, 1, 0],
  );

  // Scene 3 (Pulse) — enters around 0.6, settles by 0.8
  const pulseScaleRaw = useTransform(scrollYProgress, [0.6, 0.8], [0.95, 1]);
  const pulseOpacityRaw = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);

  // Videos — hero fades out by 0.3, arrival cross-fades 0.15→0.72, pulse fades in 0.55→0.8
  const heroVideoOpacityRaw = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const arrivalVideoOpacityRaw = useTransform(
    scrollYProgress,
    [0, 0.15, 0.33, 0.72],
    [0, 1, 1, 0],
  );
  const pulseVideoOpacityRaw = useTransform(scrollYProgress, [0.55, 0.8], [0, 1]);

  // Scroll progress indicator (0% → 100% across all scenes)
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  /* ── Spring-smoothed values ───────────────────────────────────── */
  const heroScale = useSpring(heroScaleRaw, SPRING);
  const heroOpacity = useSpring(heroOpacityRaw, SPRING);
  const arrivalScale = useSpring(arrivalScaleRaw, SPRING);
  const arrivalOpacity = useSpring(arrivalOpacityRaw, SPRING);
  const pulseScale = useSpring(pulseScaleRaw, SPRING);
  const pulseOpacity = useSpring(pulseOpacityRaw, SPRING);
  const heroVideoOpacity = useSpring(heroVideoOpacityRaw, SPRING);
  const arrivalVideoOpacity = useSpring(arrivalVideoOpacityRaw, SPRING);
  const pulseVideoOpacity = useSpring(pulseVideoOpacityRaw, SPRING);

  /* ---- Sound toggle ---- */
  useEffect(() => {
    if (heroVideoRef.current) heroVideoRef.current.muted = !soundOn;
    if (arrivalVideoRef.current) arrivalVideoRef.current.muted = !soundOn;
  }, [soundOn]);

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => !prev);
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  }, []);

  const handlePulseSelect = useCallback(
    (vibe: 'rush' | 'rhythm' | 'roots') => {
      setScene4Vibe(vibe);
    },
    [],
  );

  const handleScene4Back = useCallback(() => {
    setScene4Vibe(null);
    setPulseKey((k) => k + 1); // force-remount PulseScene to reset takeover state
  }, []);

  /* ---- Fallback before client hydration ---- */
  if (!mounted) {
    return <div className="h-screen w-full bg-black" />;
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          SCROLL DRIVER (page-level, 3 scenes)
          Three sections at 300vh each extend the page to 900vh.
          scroll-snap-type lives on <html> via globals.css.
          scrollYProgress 0.0  = Scene 1  |  ~0.33 = Scene 2  |  ~0.67 = Scene 3
          ═══════════════════════════════════════════════════ */}
      <section
        className="snap-section h-[300vh] w-full"
        aria-label="Scene 1 — The Desert Begins"
      />
      <section
        className="snap-section h-[300vh] w-full"
        aria-label="Scene 2 — The Horizon Ignites"
      />
      <section
        className="snap-section h-[300vh] w-full"
        aria-label="Scene 3 — The Pulse"
      />

      {/* ═══════════════════════════════════════════════════
          FIXED VISUAL OVERLAY
          ═══════════════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none">
        {/* ── LAYER 0: Cross-fading background videos ── */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: heroVideoOpacity }}
        >
          <video
            ref={heroVideoRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            playsInline
            muted
            preload="auto"
            src="/videos/Liwa-Village-Recap-v2_1.webm"
          />
        </motion.div>

        <motion.div
          className="absolute inset-0"
          style={{ opacity: arrivalVideoOpacity }}
        >
          <video
            ref={arrivalVideoRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            playsInline
            muted
            preload="auto"
            src="/videos/scene2.webm"
          />
        </motion.div>

        {/* ── LAYER 1: Gradient overlay (no blur — keeps UI crisp) ── */}
        <div
          className="absolute inset-0 z-1 bg-linear-to-b from-black/60 via-transparent to-black/60"
          aria-hidden="true"
        />

        {/* ── LAYER 10: Scene text (scale + opacity from scroll) ── */}
        <HeroScene scale={heroScale} opacity={heroOpacity} />
        <ArrivalScene scale={arrivalScale} opacity={arrivalOpacity} />

        <motion.div
          className="absolute inset-0 pointer-events-auto"
          style={{ opacity: pulseOpacity }}
        >
          <PulseScene key={pulseKey} onSceneComplete={handlePulseSelect} />
        </motion.div>

        {/* ── SCENE 4: Activities Reel (click-driven takeover) ── */}
        {scene4Vibe && (
          <ActivitiesReel selection={scene4Vibe} onBack={handleScene4Back} />
        )}

        {/* ── LAYER 20: Persistent viewfinder UI ──
            Wrapped in a z-20 container so these elements always
            paint ABOVE the gradient and text layers — keeping
            them crisp and un-blurred.                                  */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* ── Top Left: Brand Logo ── */}
          <div className="absolute top-6 left-6 sm:top-10 sm:left-10">
            <img
              src="/images/logo-white.png"
              alt="Liwa Village Logo"
              className="h-5 sm:h-18 object-contain"
            />
          </div>

          {/* ── Top Right: Navigation + Language Toggle ── */}
          <div className="absolute top-6 right-6 sm:top-10 sm:right-10 pointer-events-auto flex items-center gap-4 sm:gap-8">
            {/* Desktop nav links */}
            <nav className="hidden sm:flex items-center gap-6" aria-label="Main navigation">
              <a href="#village" className={`${NAV_LINK} after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-400 hover:after:w-full`}>
                The Village
              </a>
              <a href="#contact" className={`${NAV_LINK} after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-400 hover:after:w-full`}>
                Contact Us
              </a>
              <a href="#visit" className={`${NAV_LINK} after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-400 hover:after:w-full`}>
                Visit us
              </a>
            </nav>

            {/* Divider */}
            <span className="hidden sm:block w-px h-4 bg-white/20" aria-hidden="true" />

            {/* Language toggle */}
            <button
              type="button"
              onClick={toggleLang}
              className="text-white/70 hover:text-white text-[10px] sm:text-xs uppercase tracking-[0.15em] font-sans font-medium transition-colors duration-400"
              aria-label={`Switch language to ${lang === 'en' ? 'Arabic' : 'English'}`}
            >
              <span className={lang === 'en' ? 'text-white' : ''}>EN</span>
              <span className="mx-1 text-white/30">|</span>
              <span className={lang === 'ar' ? 'text-white' : ''}>ع</span>
            </button>
          </div>

          {/* ── Bottom Left: Audio Toggle ── */}
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 pointer-events-auto">
            <button
              type="button"
              onClick={toggleSound}
              className="flex items-center gap-3 group"
              aria-label={soundOn ? 'Mute audio' : 'Unmute audio'}
            >
              <span className="text-white/70 group-hover:text-white text-[10px] sm:text-xs uppercase tracking-[0.25em] font-sans transition-colors duration-300">
                [ {soundOn ? 'Sound On' : 'Sound Off'} ]
              </span>

              {/* 3-Bar Audio Visualizer */}
              <div className="flex items-end gap-0.5 h-3" aria-hidden="true">
                {[
                  { anim: 'audio-bar-1 0.8s ease-in-out infinite', h: '2px' },
                  { anim: 'audio-bar-2 0.8s ease-in-out 0.15s infinite', h: '2px' },
                  { anim: 'audio-bar-3 0.8s ease-in-out 0.3s infinite', h: '3px' },
                ].map((bar, i) => (
                  <span
                    key={i}
                    className="block w-0.75 bg-white/70 transition-all duration-300"
                    style={{
                      height: soundOn ? undefined : bar.h,
                      animation: soundOn ? bar.anim : 'none',
                    }}
                  />
                ))}
              </div>
            </button>
          </div>

          {/* ── Bottom Center: Scroll Progress Indicator ── */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:bottom-10 flex flex-col items-center gap-2.5">
            <span className="text-white/40 text-[10px] sm:text-xs uppercase tracking-[0.35em] font-sans select-none">
              Scroll
            </span>
            <div className="relative w-px h-10 bg-white/10" aria-hidden="true">
              <motion.div
                className="absolute inset-x-0 bottom-0 w-full bg-linear-to-b from-white/70 via-white/40 to-transparent"
                style={{ height: progressHeight }}
              />
            </div>
          </div>

          {/* ── Bottom Right: Coordinate Stamp (hidden on mobile) ── */}
          <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 hidden sm:block">
            <span className="text-white/25 text-[10px] sm:text-xs font-mono tracking-[0.15em] select-none">
              23.1181&deg; N, 53.7611&deg; E
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
