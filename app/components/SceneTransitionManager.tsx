'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HeroScene from './Hero';
import ArrivalScene from './Arrival';

/* ------------------------------------------------------------------ */
/*  Cross-fade timing — matched to text zoom duration for cohesion    */
/* ------------------------------------------------------------------ */
const VIDEO_CROSSFADE = { duration: 1.4, ease: [0.83, 0, 0.17, 1] as const };

/* ------------------------------------------------------------------ */
/*  SceneTransitionManager                                            */
/*  Owns: both video layers, gradient, persistent viewfinder UI,      */
/*  and the AnimatePresence shell that swaps scene text content.      */
/* ------------------------------------------------------------------ */
export default function SceneTransitionManager() {
  const [mounted, setMounted] = useState(false);
  const [currentScene, setCurrentScene] = useState<'hero' | 'arrival'>('hero');
  const [soundOn, setSoundOn] = useState(false);

  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const arrivalVideoRef = useRef<HTMLVideoElement>(null);

  /* ---- SSR guard for media elements ---- */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---- Demo: auto-transition after 6 seconds ---- */
  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => {
      setCurrentScene('arrival');
    }, 6_000);
    return () => clearTimeout(timer);
  }, [mounted]);

  /* ---- Keep both videos in sync with the sound toggle ---- */
  useEffect(() => {
    if (heroVideoRef.current) heroVideoRef.current.muted = !soundOn;
    if (arrivalVideoRef.current) arrivalVideoRef.current.muted = !soundOn;
  }, [soundOn]);

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => !prev);
  }, []);

  const goToScene = useCallback((scene: 'hero' | 'arrival') => {
    setCurrentScene(scene);
  }, []);

  /* ---- Fallback before client hydration ---- */
  if (!mounted) {
    return <div className="h-screen w-full bg-black" />;
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black select-none">
      {/* ═══════════════════════════════════════════════════
          LAYER 0 — CROSS-FADING BACKGROUND VIDEOS
          Both videos are always mounted so the cross-fade
          is seamless; opacity is driven by currentScene.
          ═══════════════════════════════════════════════════ */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: currentScene === 'hero' ? 1 : 0 }}
        transition={VIDEO_CROSSFADE}
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
        initial={{ opacity: 0 }}
        animate={{ opacity: currentScene === 'arrival' ? 1 : 0 }}
        transition={VIDEO_CROSSFADE}
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

      {/* ═══════════════════════════════════════════════════
          LAYER 1 — GRADIENT OVERLAY + MICRO BLUR (shared)
          ═══════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-1 bg-linear-to-b from-black/60 via-transparent to-black/60 backdrop-blur-[1px]"
        aria-hidden="true"
      />

      {/* ═══════════════════════════════════════════════════
          LAYER 10 — SCENE TEXT CONTENT (AnimatePresence)
          Zoom-out/fade-out on exit, zoom-in/fade-in on enter.
          ═══════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {currentScene === 'hero' && (
          <HeroScene key="hero-scene" />
        )}
        {currentScene === 'arrival' && (
          <ArrivalScene key="arrival-scene" />
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════
          LAYER 20 — PERSISTENT VIEWFINDER UI
          Rendered outside AnimatePresence so these elements
          stay fixed and undisturbed during scene transitions.
          ═══════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* ── Top Left: Brand Logo ── */}
        <div className="absolute top-6 left-6 sm:top-10 sm:left-10">
          <img
            src="/images/logo-white.png"
            alt="Liwa Village Logo"
            className="h-5 sm:h-18 object-contain"
          />
        </div>

        {/* ── Top Right: CTA Button ── */}
        <div className="absolute top-6 right-6 sm:top-10 sm:right-10 pointer-events-auto">
          <button
            type="button"
            onClick={() => goToScene(currentScene === 'hero' ? 'arrival' : 'hero')}
            className="relative text-white/80 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-sans
                       border border-white/25 bg-white/4 backdrop-blur-xl
                       px-5 py-2.5
                       transition-all duration-700
                       hover:bg-white hover:text-black hover:border-white
                       focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60"
          >
            Reserve a Moment
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

            {/* ── 3-Bar Audio Visualizer ── */}
            <div className="flex items-end gap-0.5 h-3" aria-hidden="true">
              <span
                className="block w-0.75 bg-white/70 transition-all duration-300"
                style={{
                  height: soundOn ? undefined : '2px',
                  animation: soundOn
                    ? 'audio-bar-1 0.8s ease-in-out infinite'
                    : 'none',
                }}
              />
              <span
                className="block w-0.75 bg-white/70 transition-all duration-300"
                style={{
                  height: soundOn ? undefined : '2px',
                  animation: soundOn
                    ? 'audio-bar-2 0.8s ease-in-out 0.15s infinite'
                    : 'none',
                }}
              />
              <span
                className="block w-0.75 bg-white/70 transition-all duration-300"
                style={{
                  height: soundOn ? undefined : '3px',
                  animation: soundOn
                    ? 'audio-bar-3 0.8s ease-in-out 0.3s infinite'
                    : 'none',
                }}
              />
            </div>
          </button>
        </div>

        {/* ── Bottom Center: Scroll Indicator ── */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:bottom-10 flex flex-col items-center gap-2.5">
          <span className="text-white/40 text-[10px] sm:text-xs uppercase tracking-[0.35em] font-sans select-none">
            Scroll
          </span>
          <div className="relative w-px h-10 overflow-hidden" aria-hidden="true">
            <div
              className="absolute inset-x-0 top-0 h-full bg-linear-to-b from-white/60 via-white/30 to-transparent"
              style={{ animation: 'scroll-line-pulse 2s ease-in-out infinite' }}
            />
          </div>
        </div>

        {/* ── Bottom Right: Coordinate Stamp ── */}
        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 hidden sm:block">
          <span className="text-white/25 text-[10px] sm:text-xs font-mono tracking-[0.15em] select-none">
            23.1181&deg; N, 53.7611&deg; E
          </span>
        </div>
      </div>
    </section>
  );
}
