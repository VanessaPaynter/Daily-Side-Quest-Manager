import { useEffect, useState, useMemo } from "react";
import type { Quest } from "../App";
import { PixelRocket } from "./PixelRocket";

interface CompletionScreenProps {
  quest: Quest;
  xpGained: number;
  onDone: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  tx: number;
  ty: number;
  delay: number;
  duration: number;
}

const COLORS = [
  "#00ffff", "#ffd700", "#ff5500", "#00ff88",
  "#ff66aa", "#9944ff", "#ffaa22", "#44aaff",
];

export function CompletionScreen({ quest, xpGained, onDone }: CompletionScreenProps) {
  const [phase, setPhase] = useState<"reveal" | "launch" | "done">("reveal");
  const [rocketY, setRocketY] = useState(0);
  const [rocketSize, setRocketSize] = useState(1);
  const [sparkActive, setSparkActive] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  // Particles for rocket explosion
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 28 }, (_, i) => {
      const angle = (i / 28) * Math.PI * 2;
      const dist = 60 + (Math.sin(i * 37) * 0.5 + 0.5) * 100;
      return {
        id: i,
        x: 50,
        y: 35,
        size: 4 + Math.floor((Math.sin(i * 19) * 0.5 + 0.5) * 6),
        color: COLORS[i % COLORS.length],
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        delay: (Math.sin(i * 53) * 0.5 + 0.5) * 0.4,
        duration: 0.6 + (Math.sin(i * 71) * 0.5 + 0.5) * 0.6,
      };
    });
  }, []);

  // Confetti
  const confetti = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: 5 + (i / 17) * 90,
      color: COLORS[i % COLORS.length],
      delay: (Math.sin(i * 31) * 0.5 + 0.5) * 0.8,
      duration: 1.2 + (Math.sin(i * 43) * 0.5 + 0.5) * 0.8,
      size: 4 + Math.floor((Math.sin(i * 67) * 0.5 + 0.5) * 4),
    }));
  }, []);

  const launchRocket = () => {
    setPhase("launch");
    setRocketY(-420);
    setRocketSize(0.5);
    setSparkActive(true);
    setConfettiActive(true);
  };

  useEffect(() => {
    if (phase === "launch") {
      const t = setTimeout(() => {
        setPhase("done");
        onDone();
      }, 3200); // match rocket animation duration
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  return (
    <div
      className="fade-in"
      style={{
        position: "absolute",
        inset: 0,
        background: "#060b18",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        overflow: "hidden",
      }}
    >
      {/* Spark/Explosion Particles */}
      {sparkActive &&
        particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color,
              animation: `sparkBurst ${p.duration}s ease-out ${p.delay}s forwards`,
              opacity: 0,
              ["--tx" as string]: `${p.tx}px`,
              ["--ty" as string]: `${p.ty}px`,
            }}
          />
        ))}

      {/* Confetti */}
      {confettiActive &&
        confetti.map((c) => (
          <div
            key={c.id}
            style={{
              position: "absolute",
              left: `${c.x}%`,
              top: "-10px",
              width: `${c.size}px`,
              height: `${c.size}px`,
              background: c.color,
              animation: `confettiFall ${c.duration}s ease-in ${c.delay + 0.5}s forwards`,
              opacity: 0,
            }}
          />
        ))}

      {/* QUEST COMPLETE text */}
      <div
        className="quest-complete-anim"
        style={{
          textAlign: "center",
          marginBottom: "20px",
          zIndex: 2,
          lineHeight: 1.8,
        }}
      >
        <div
          style={{
            fontSize: "20px",
            color: "#00ffff",
            textShadow: "0 0 20px #00ffff, 0 0 40px #00ffff60",
            letterSpacing: "2px",
          }}
        >
          QUEST
        </div>
        <div
          style={{
            fontSize: "20px",
            color: "#00ff88",
            textShadow: "0 0 20px #00ff88, 0 0 40px #00ff8860",
            letterSpacing: "2px",
          }}
        >
          COMPLETE!
        </div>
      </div>

      {/* Rocket */}
      <div
        style={{
          transform: `translateY(${rocketY}px) scale(${rocketSize})`,
          transition:
            phase === "launch"
              ? "transform 2s cubic-bezier(0.2, 0.0, 0.8, 1.0)"
              : "none",
          zIndex: 2,
        }}
      >
        <PixelRocket buildStage={5} isThrustersActive={true} launching={true} />
      </div>

      {/* XP gained */}
      <div
        className="slide-up"
        style={{
          position: "absolute",
          bottom: "90px",
          textAlign: "center",
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: "16px",
            color: "#ffd700",
            textShadow: "0 0 16px #ffd700",
            letterSpacing: "2px",
          }}
        >
          +{xpGained} XP
        </div>
        <div style={{ color: "#886600", fontSize: "5px", marginTop: "4px" }}>
          GAINED!
        </div>
      </div>

      {/* Quest name */}
      <div
        style={{
          position: "absolute",
          bottom: "60px",
          fontSize: "5px",
          color: "#1a3050",
          textAlign: "center",
          padding: "0 20px",
          zIndex: 2,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "90%",
        }}
      >
        ✓ {quest.title}
      </div>

      {/* YEET button */}
      {phase === "reveal" && (
        <button
          onClick={launchRocket}
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            background: "#00ff88",
            border: "none",
            color: "#1a3050",
            fontSize: "10px",
            padding: "6px 12px",
            cursor: "pointer",
            fontFamily: "'Press Start 2P', monospace",
            zIndex: 10,
          }}
        >
          YEET 🚀
        </button>
      )}

      {/* Skip button */}
      <button
        onClick={onDone}
        style={{
          position: "absolute",
          bottom: "42px",
          right: "12px",
          background: "transparent",
          border: "2px solid #1a2a4a",
          color: "#1a3050",
          fontSize: "5px",
          padding: "4px 8px",
          cursor: "pointer",
          fontFamily: "'Press Start 2P', monospace",
          zIndex: 10,
        }}
      >
        SKIP ▶
      </button>
    </div>
  );
}