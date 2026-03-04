import { useState, useEffect, useMemo } from "react";
import type { Quest } from "../App";
import { PixelRocket } from "./PixelRocket";

interface QuestModeProps {
  quest: Quest;
  onComplete: (quest: Quest) => void;
  onCancel: () => void;
}

// Stage labels for each build phase
const STAGE_LABELS = [
  "PREPARING LAUNCHPAD...",
  "INSTALLING ENGINE...",
  "ASSEMBLING BODY + FINS...",
  "ATTACHING UPPER SECTION...",
  "MOUNTING NOSE CONE...",
  "🚀 LAUNCH READY!",
];

// Generate random star positions for quest mode background
function useQuestStars(count: number) {
  return useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (Math.sin(i * 13721 + 54321) * 0.5 + 0.5) * 100,
      y: (Math.sin(i * 87161 + 12347) * 0.5 + 0.5) * 100,
      size: Math.sin(i * 23453) * 0.5 + 0.5 < 0.2 ? 3 : 2,
      duration: 2 + (Math.sin(i * 45671) * 0.5 + 0.5) * 3,
      delay: (Math.sin(i * 67891) * 0.5 + 0.5) * 5,
    }));
  }, [count]);
}

export function QuestMode({ quest, onComplete, onCancel }: QuestModeProps) {
  const totalSeconds = quest.duration * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(true);
  const [completed, setCompleted] = useState(false);

  const stars = useQuestStars(50);

  const progress = 1 - secondsLeft / totalSeconds; // 0→1
  const buildStage = Math.min(Math.floor(progress * 6), 5);
  const isFinalMin = secondsLeft <= 60 && secondsLeft > 0;
  const isThrusters = secondsLeft <= 30 && secondsLeft > 0;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (secondsLeft === 0 && !completed) {
      setCompleted(true);
      setRunning(false);
      // Small delay so user sees the fully built rocket
      setTimeout(() => onComplete(quest), 600);
    }
  }, [secondsLeft, completed]);

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  // Progress bar segments
  const progressPercent = Math.round(progress * 100);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#060b18",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Starry background */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={
            {
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: "#ffffff",
              pointerEvents: "none",
              zIndex: 0,
              "--duration": `${s.duration}s`,
              "--delay": `${s.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Quest title header */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "8px 14px",
          borderBottom: "2px solid #0f1e38",
          background: "#080f1e",
          flexShrink: 0,
        }}
      >
        <div
          style={{ color: "#334466", fontSize: "5px", marginBottom: "3px" }}
        >
          ▶ ACTIVE QUEST
        </div>
        <div
          style={{
            color: "#c0d0e8",
            fontSize: "7px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {quest.title}
        </div>
      </div>

      {/* Timer display */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "14px 16px 6px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {/* Paused banner */}
        {!running && secondsLeft > 0 && (
          <div
            className="pixel-pop"
            style={{
              fontSize: "6px",
              color: "#ffaa22",
              marginBottom: "4px",
              letterSpacing: "2px",
            }}
          >
            ⏸ PAUSED
          </div>
        )}

        {/* The digits */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0",
          }}
        >
          <span
            style={{
              fontSize: "42px",
              color: isFinalMin ? "#ff3366" : "#00ffff",
              letterSpacing: "2px",
              textShadow: `0 0 24px ${isFinalMin ? "#ff336680" : "#00ffff60"}`,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {pad(minutes)}
          </span>
          <span
            className={running ? "blink-colon" : ""}
            style={{
              fontSize: "36px",
              color: isFinalMin ? "#ff3366" : "#00ffff",
              margin: "0 2px",
              lineHeight: 1,
            }}
          >
            :
          </span>
          <span
            style={{
              fontSize: "42px",
              color: isFinalMin ? "#ff3366" : "#00ffff",
              letterSpacing: "2px",
              textShadow: `0 0 24px ${isFinalMin ? "#ff336680" : "#00ffff60"}`,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {pad(secs)}
          </span>
        </div>

        {/* Stage label */}
        <div
          style={{
            color: buildStage === 5 ? "#00ff88" : "#334466",
            fontSize: "5px",
            marginTop: "6px",
            letterSpacing: "1px",
            minHeight: "10px",
          }}
        >
          {STAGE_LABELS[buildStage]}
        </div>

        {/* Progress bar */}
        <div
          style={{
            marginTop: "6px",
            height: "6px",
            background: "#0a1220",
            border: "2px solid #1a2a4a",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              background: buildStage === 5 ? "#00ff88" : "#00d4ff",
              transition: "width 1s linear",
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(0,0,0,0.2) 6px, rgba(0,0,0,0.2) 8px)",
            }}
          />
        </div>
      </div>

      {/* Rocket animation area */}
      <div
        className={isThrusters ? "thruster-shake" : ""}
        style={{
          flex: 1,
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: "0",
          overflow: "hidden",
        }}
      >
        <PixelRocket
          buildStage={buildStage}
          isThrustersActive={isThrusters}
        />
      </div>

      {/* Build stage indicators */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "6px",
          display: "flex",
          gap: "4px",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {[0, 1, 2, 3, 4].map((s) => (
          <div
            key={s}
            style={{
              width: "18px",
              height: "8px",
              background: buildStage > s ? "#00d4ff" : "#0a1220",
              border: `2px solid ${buildStage > s ? "#00d4ff" : "#1a3a5a"}`,
              transition: "background 0.4s, border-color 0.4s",
              boxShadow: buildStage > s ? "0 0 6px #00d4ff60" : "none",
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "8px 12px 10px",
          borderTop: "2px solid #0f1e38",
          background: "#080f1e",
          display: "flex",
          gap: "8px",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <button
          className="pixel-btn"
          onClick={() => setRunning((r) => !r)}
          style={{
            background: running ? "#0e0820" : "#061808",
            border: `2px solid ${running ? "#6622cc" : "#00aa44"}`,
            color: running ? "#9944ff" : "#00ff88",
            fontSize: "6px",
            padding: "8px 16px",
            cursor: "pointer",
            fontFamily: "'Press Start 2P', monospace",
            letterSpacing: "1px",
          }}
        >
          {running ? "⏸ PAUSE" : "▶ RESUME"}
        </button>

        <button
          className="pixel-btn"
          onClick={onCancel}
          style={{
            background: "#120005",
            border: "2px solid #880022",
            color: "#ff3366",
            fontSize: "6px",
            padding: "8px 14px",
            cursor: "pointer",
            fontFamily: "'Press Start 2P', monospace",
            letterSpacing: "1px",
          }}
        >
          ✗ ABANDON
        </button>
      </div>
    </div>
  );
}
