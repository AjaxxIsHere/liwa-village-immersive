"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Type definitions                                                   */
/* ------------------------------------------------------------------ */
type Vibe = "rush" | "rhythm" | "roots";

interface Activity {
  title: string;
  description: string;
  image: string;
}

interface CategoryData {
  label: string;
  backgroundVideo: string;
  activities: Activity[];
}

/* ------------------------------------------------------------------ */
/* Catalogue — one entry per vibe from Scene 3                       */
/* ------------------------------------------------------------------ */
const CATALOG: Record<Vibe, CategoryData> = {
  rush: {
    label: "RUSH",
    backgroundVideo: "/videos/pulse-rush.webm",
    activities: [
      {
        title: "Go Water Kart",
        description:
          "Dive into adventure with the Go Water Kart Experience, where speed meets splash! Enjoy a thrilling yet safe ride that combines the excitement of karting with the rush of jet-skiing. Perfect for families and friends.",
        image:
          "https://liwavillage.ae/wp-content/uploads/2025/11/Water-Kart.webp",
      },
      {
        title: "Smash Room",
        description:
          "Unleash your energy at the Smash Room, where thrill meets freedom in a rush of excitement and adrenaline. Smash, break, and shatter your stress away in a safe, electrifying space that captures the adventurous and vibrant spirit of Liwa Village.",
        image:
          "https://liwavillage.ae/wp-content/uploads/2025/11/Smash-Room-1.webp",
      },
      {
        title: "4×4 Track",
        description:
          "Experience the thrill of the 4x4 Track, where Liwa's desert spirit meets family-friendly adventure and fun. Navigate sandy trails in a mini jeep for an unforgettable ride filled with excitement and energy.",
        image: "https://liwavillage.ae/wp-content/uploads/2025/11/n3.webp",
      },

      {
        title: "Desert Rally",
        description:
          "Feel the roar of engines and the power of the dunes beneath your wheels. This ultimate off-road rally captures the spirit of Liwa's wild adventure, blending thrill, and desert freedom.",
        image: "https://liwavillage.ae/wp-content/uploads/2025/11/c1.webp",
      },

    ],
  },
  rhythm: {
    label: "RHYTHM",
    backgroundVideo: "/videos/pulse-rhythm.webm",
    activities: [
      {
        title: "New Year's Eve",
        description:
          "Celebrate New Year's Eve at Liwa Village, a dazzling fusion of culture, music, and desert splendour beneath a sky ablaze with fireworks, lights, and dreams that never fade away — a night to remember.",
        image: "https://liwavillage.ae/wp-content/uploads/2025/11/n4.webp",
      },
    ],
  },
  roots: {
    label: "ROOTS",
    backgroundVideo: "/videos/pulse-roots.webm",
    activities: [
      {
        title: "Pony Grove",
        description:
          "A charming new addition to the Petting Zoo, saddle up for a gentle trot across Liwa's sands. A timeless activity that blends the region's equestrian heritage with unforgettable childhood joy.",
        image:
          "https://liwavillage.ae/wp-content/uploads/2025/11/Pony-Groove.png",
      },
      {
        title: "Skyline",
        description:
          "Take a thrilling flight across the desert sky and glide over Liwa Village, a breathtaking adventure for kids and adults, where adrenaline, freedom, and unforgettable views meet.",
        image: "https://liwavillage.ae/wp-content/uploads/2025/11/c3.webp",
      },
            {
        title: "RC Race",
        description:
          "Live the action with high-speed remote control (RC) cars and challenge your friends to a desert-inspired race, where Liwa's rich heritage meets modern adrenaline and pure excitement.",
        image: "https://liwavillage.ae/wp-content/uploads/2025/11/rc-2-1.jpg",
      },
    ],
  },
};

const VIBES: Vibe[] = ["rush", "rhythm", "roots"];

/* ------------------------------------------------------------------ */
/* Variants for the entry animation                                   */
/* ------------------------------------------------------------------ */
const bgVideoVariants = {
  hidden: { scale: 1.2 },
  visible: {
    scale: 1,
    transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] as const },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const staggerCards = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] as const },
  },
};

/* ------------------------------------------------------------------ */
/* Props                                                              */
/* ------------------------------------------------------------------ */
interface ActivitiesReelProps {
  selection: Vibe;
  /** Called when the user clicks the close button to return to Scene 3 */
  onBack?: () => void;
}

/* ================================================================== */
/* ActivitiesReel — Scene 4                                           */
/* ================================================================== */
export default function ActivitiesReel({
  selection,
  onBack,
}: ActivitiesReelProps) {
  const category = CATALOG[selection];

  /* ── Drag constraints ──────────────────────────────────────────── */
  const filmstripRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const dragX = useMotionValue(0);

  const recalcConstraints = useCallback(() => {
    if (!filmstripRef.current) return;
    const parent = filmstripRef.current.parentElement;
    if (!parent) return;
    const scrollW = filmstripRef.current.scrollWidth;
    const containerW = parent.offsetWidth;
    const maxDrag = Math.max(0, scrollW - containerW + 80);
    setDragConstraints({ left: -maxDrag, right: 80 });
  }, []);

  useEffect(() => {
    const t = setTimeout(recalcConstraints, 100);
    window.addEventListener("resize", recalcConstraints);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", recalcConstraints);
    };
  }, [recalcConstraints, category]);

  return (
    <motion.div
      className="fixed inset-0 z-10 overflow-hidden pointer-events-auto"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: {} }}
    >
      {/* BACKGROUND VIDEO */}
      <motion.video
        key={`bg-${selection}`}
        className="absolute inset-0 h-full w-full object-cover"
        variants={bgVideoVariants}
        autoPlay
        loop
        playsInline
        muted
        src={category.backgroundVideo}
      />

      {/* DARK OVERLAY */}
      <motion.div
        className="absolute inset-0 bg-black/45"
        variants={fadeIn}
        aria-hidden="true"
      />

      {/* CLOSE BUTTON */}
      {/* CLOSE BUTTON */}
      {onBack && (
        <motion.button
          type="button"
          onClick={onBack}
          variants={fadeIn}
          className="
      absolute top-6 right-6 sm:top-24 sm:right-10 z-30
      flex items-center justify-center gap-3
      text-white/60 hover:text-white
      text-[10px] sm:text-xs uppercase tracking-[0.2em] font-sans font-medium
      transition-colors duration-300
      border border-white/20 hover:border-white/50
      rounded-full 
      
      /* Explicit width & height balancing */
      min-w-[100px] sm:min-w-[130px]
      h-10 sm:h-12
      px-5 sm:px-7
      
      backdrop-blur-md bg-black/20
      whitespace-nowrap
    "
          aria-label="Close activity reel and return to scene selection"
        >
          <span
            className="text-sm sm:text-base leading-none"
            aria-hidden="true"
          >
            ←
          </span>
          <span>Back</span>
        </motion.button>
      )}

      {/* CATEGORY TRACKER */}
      <motion.div
        className="absolute top-10 sm:top-12 left-1/2 -translate-x-1/2"
        variants={fadeIn}
      >
        <nav
          className="flex items-center gap-3 sm:gap-5 text-[11px] sm:text-sm uppercase tracking-[0.25em] font-sans font-medium"
          aria-label="Category navigation"
        >
          {VIBES.map((vibe, i) => (
            <span key={vibe} className="flex items-center gap-3 sm:gap-5">
              {i > 0 && (
                <span className="text-white/15 select-none" aria-hidden="true">
                  |
                </span>
              )}
              <span
                className={vibe === selection ? "text-white" : "text-white/30"}
              >
                {CATALOG[vibe].label}
              </span>
            </span>
          ))}
        </nav>
      </motion.div>

      {/* ═══════════════════════════════════════════════════
          HORIZONTAL FILMSTRIP — Centered Vertically
          ═══════════════════════════════════════════════════ */}
      <div
        className="absolute top-1/2 -translate-y-1/2 left-0 right-0 overflow-hidden py-10"
        onWheel={(e) => {
          const currentX = dragX.get();
          const newX = Math.max(
            dragConstraints.left,
            Math.min(dragConstraints.right, currentX - e.deltaY),
          );
          dragX.set(newX);
        }}
      >
        <motion.div
          ref={filmstripRef}
          drag="x"
          style={{ x: dragX }}
          dragConstraints={dragConstraints}
          dragElastic={0.04}
          dragTransition={{ power: 0.2, timeConstant: 200 }}
          className="flex gap-5 sm:gap-6 px-8 sm:px-10 w-max cursor-grab active:cursor-grabbing select-none"
          variants={staggerCards}
        >
          {category.activities.map((activity) => (
            <ActivityCard key={activity.title} activity={activity} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/* ActivityCard                                                      */
/* ================================================================== */
function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <motion.div
      variants={cardReveal}
      className="
        group relative shrink-0
        w-75 sm:w-87.5 md:w-105
        h-[55vh] sm:h-[60vh] md:h-[65vh]
        rounded-lg overflow-hidden
        transition-transform duration-500 ease-out
        hover:scale-[1.02]
      "
    >
      <img
        className="
          absolute inset-0 h-full w-full object-cover
          brightness-75
          transition-all duration-500 ease-out
          group-hover:brightness-100
        "
        src={activity.image}
        alt={activity.title}
        loading="lazy"
      />

      {/* Top vignette */}
      <div
        className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/50 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      {/* Bottom vignette */}
      <div
        className="
          absolute inset-x-0 bottom-0 h-48
          bg-linear-to-t from-black/85 via-black/45 to-transparent
          pointer-events-none
          transition-opacity duration-500
          group-hover:opacity-100
        "
        aria-hidden="true"
      />

      {/* Typography */}
      <div
        className="
          absolute bottom-0 left-0 right-0
          translate-y-3 opacity-0
          transition-all duration-400 ease-out
          group-hover:translate-y-0 group-hover:opacity-100
        "
        style={{ padding: "0 24px 32px 24px" }}
      >
        <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold tracking-[0.03em] font-sans uppercase mb-1">
          {activity.title}
        </h3>
        <p
          className="text-white/70 text-xs sm:text-sm font-serif italic tracking-[0.03em]"
          style={{ maxWidth: "280px", lineHeight: "1.5" }}
        >
          {activity.description}
        </p>
      </div>
    </motion.div>
  );
}
