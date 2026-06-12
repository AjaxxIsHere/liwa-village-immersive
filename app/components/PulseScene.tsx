'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Panel definitions                                                  */
/* ------------------------------------------------------------------ */
const PANELS = [
  {
    id: 'rush',
    title: 'Adrenaline',
    description: 'High-energy attractions, motorsports, rides, and adrenaline experiences.',
    video: '/videos/pulse-rush.webm',
  },
  {
    id: 'rhythm',
    title: 'Concert',
    description: 'Entertainment, games, performances, and family fun.',
    video: '/videos/pulse-rhythm.webm',
  },
  {
    id: 'roots',
    title: 'Liwa Souk',
    description: 'Authentic Emirati heritage, craftsmanship, food, and traditions.',
    video: '/videos/pulse-roots.webm',
  },
] as const;

type PanelId = (typeof PANELS)[number]['id'];

/* ------------------------------------------------------------------ */
/*  Transition presets                                                 */
/* ------------------------------------------------------------------ */
const HOVER_SPRING = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 20,
  mass: 0.8,
};

/** Assertive tween — deliberate, powerful takeover feel */
const TAKEOVER_TWEEN = {
  type: 'tween' as const,
  ease: [0.25, 1, 0.5, 1] as const,
  duration: 0.8,
};

/** Fast ejection for the text block on click */
const TEXT_EJECT = {
  duration: 0.3,
  ease: [0.25, 1, 0.5, 1] as const,
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface PulseSceneProps {
  /** Called 800ms after a panel is clicked, once the takeover
   *  animation completes. The selected panel id is passed so Scene 4
   *  knows which experience to render. */
  onSceneComplete?: (panelId: PanelId) => void;
}

/* ------------------------------------------------------------------ */
/*  PulseScene — Scene 3: interactive three-panel system              */
/*                                                                     */
/*  Hover  → spring-based layout resize (55% / 22.5% / 22.5%).        */
/*  Click  → full-screen takeover with a tween curve, text ejection,   */
/*           and a callback to the parent when the animation ends.     */
/* ------------------------------------------------------------------ */
export default function PulseScene({ onSceneComplete }: PulseSceneProps) {
  const [hoveredPanel, setHoveredPanel] = useState<PanelId | null>(null);
  const [selectedPanel, setSelectedPanel] = useState<PanelId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  /* Keep a ref to the latest callback so the effect below stays stable */
  const onSceneCompleteRef = useRef(onSceneComplete);
  onSceneCompleteRef.current = onSceneComplete;

  /* ── Fire onSceneComplete after the takeover tween ends ────────── */
  useEffect(() => {
    if (!selectedPanel || !isTransitioning) return;
    const timer = setTimeout(() => {
      onSceneCompleteRef.current?.(selectedPanel);
    }, 800); // matches TAKEOVER_TWEEN.duration
    return () => clearTimeout(timer);
  }, [selectedPanel, isTransitioning]);

  /* ── Handlers ──────────────────────────────────────────────────── */
  const clearHover = useCallback(() => {
    if (!isTransitioning) setHoveredPanel(null);
  }, [isTransitioning]);

  const handlePanelClick = useCallback(
    (panelId: PanelId) => {
      if (isTransitioning) return;
      setSelectedPanel(panelId);
      setIsTransitioning(true);
      setHoveredPanel(null); // freeze hover state
    },
    [isTransitioning],
  );

  /* ── Render ────────────────────────────────────────────────────── */
  return (
    <div className="absolute inset-0 z-10 flex flex-row overflow-hidden">
      {PANELS.map((panel) => {
        const isHovered = hoveredPanel === panel.id;
        const isOthersHovered = hoveredPanel !== null && hoveredPanel !== panel.id;
        const isSelected = selectedPanel === panel.id;
        const isDismissed = selectedPanel !== null && selectedPanel !== panel.id;

        /* ── flex-basis for each interaction mode ────────────────── */
        let flexBasis: string;
        if (isSelected) {
          flexBasis = '100%';
        } else if (isDismissed) {
          flexBasis = '0%';
        } else if (isHovered) {
          flexBasis = '55%';
        } else if (isOthersHovered) {
          flexBasis = '22.5%';
        } else {
          flexBasis = '33.333%';
        }

        /* ── Video & overlay visibility ──────────────────────────── */
        const showFullColor = isHovered || isSelected;

        /* ── Transition: spring for hover, tween for takeover ────── */
        const transition = selectedPanel ? TAKEOVER_TWEEN : HOVER_SPRING;

        return (
          <motion.div
            key={panel.id}
            layout
            className="relative h-full overflow-hidden"
            animate={{
              /* Dismissed panels fade to 0 alongside their width shrink */
              opacity: isDismissed ? 0 : 1,
            }}
            transition={transition}
            style={{ flexBasis }}
            /* ---- Interaction (blocked during takeover) ---- */
            onMouseEnter={() => {
              if (!isTransitioning) setHoveredPanel(panel.id);
            }}
            onMouseLeave={clearHover}
            onClick={() => handlePanelClick(panel.id)}
            role="button"
            tabIndex={isTransitioning ? -1 : 0}
            aria-label={`${panel.title} — ${panel.description}`}
          >
            {/* ═══════════════════════════════════════════════════
                BACKGROUND VIDEO
                Grayscale by default; full color + slight zoom on
                hover, and full color during takeover.
                ═══════════════════════════════════════════════════ */}
            <video
              className="absolute inset-0 h-full w-full object-cover transition-all duration-700"
              autoPlay
              loop
              playsInline
              muted
              preload="auto"
              src={panel.video}
              style={{
                filter: showFullColor ? 'grayscale(0%)' : 'grayscale(100%)',
                transform: showFullColor ? 'scale(1.05)' : 'scale(1)',
              }}
            />

            {/* ═══════════════════════════════════════════════════
                DARK OVERLAY
                Removed on hover; stays off during takeover.
                ═══════════════════════════════════════════════════ */}
            <div
              className="absolute inset-0 bg-black/55 transition-opacity duration-700"
              style={{ opacity: showFullColor ? 0 : 1 }}
              aria-hidden="true"
            />

            {/* ═══════════════════════════════════════════════════
                TYPOGRAPHY BLOCK
                - Rest:     low opacity, pushed down 18px
                - Hover:    full opacity, at rest position
                - Selected: scale ×1.5, fade out, lift up
                - Dismissed:  fade out with parent
                ═══════════════════════════════════════════════════ */}
            <motion.div
              className="absolute bottom-12 left-8 z-20 pointer-events-none origin-bottom-left"
              animate={{
                opacity: isSelected ? 0 : isDismissed ? 0 : isHovered ? 1 : 0.35,
                scale: isSelected ? 1.5 : 1,
                y: isSelected ? -24 : isHovered ? 0 : 18,
              }}
              transition={isSelected ? TEXT_EJECT : { duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-[0.03em] font-sans uppercase mb-1.5">
                {panel.title}
              </h2>
              <p className="text-white/70 text-sm sm:text-base font-serif italic tracking-[0.04em] max-w-xs">
                {panel.description}
              </p>
            </motion.div>

            {/* ═══════════════════════════════════════════════════
                Left-edge depth gradient
                ═══════════════════════════════════════════════════ */}
            <div
              className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-black/30 to-transparent pointer-events-none"
              aria-hidden="true"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
