import { useState } from "react";
import type { Quest } from "../App";

interface QuestCardProps {
  quest: Quest;
  onStart: (quest: Quest) => void;
  onDelete: (id: string) => void;
}

const DURATION_COLORS: Record<number, string> = {
  5: "#00ff88",
  7: "#00d4ff",
  10: "#ffaa22",
};

export function QuestCard({ quest, onStart, onDelete }: QuestCardProps) {
  const [hovered, setHovered] = useState(false);
  const dColor = DURATION_COLORS[quest.duration] ?? "#00d4ff";

  return (
    <div
      className={`quest-card${quest.completed ? " completed" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !quest.completed && onStart(quest)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "7px 8px",
        marginBottom: "4px",
        background: quest.completed
          ? "#090e1c"
          : hovered
          ? "#0d1e3c"
          : "#0c1830",
        border: `2px solid ${
          quest.completed ? "#112233" : hovered ? "#00d4ff" : "#1a2a4a"
        }`,
        cursor: quest.completed ? "default" : "pointer",
        opacity: quest.completed ? 0.55 : 1,
        transition: "background 0.08s",
        position: "relative",
      }}
    >
      {/* Pixel checkbox */}
      <div
        style={{
          width: "14px",
          height: "14px",
          border: `2px solid ${quest.completed ? "#00ff88" : "#2a4a6a"}`,
          background: quest.completed ? "#00ff88" : "transparent",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "8px",
          color: "#000",
          fontFamily: "monospace",
        }}
      >
        {quest.completed ? "✓" : ""}
      </div>

      {/* Arrow indicator on hover */}
      {hovered && !quest.completed && (
        <div
          style={{
            position: "absolute",
            left: "4px",
            color: "#00d4ff",
            fontSize: "6px",
          }}
        >
          ▶
        </div>
      )}

      {/* Quest title */}
      <div
        style={{
          flex: 1,
          fontSize: "6px",
          color: quest.completed ? "#2a4060" : "#d0d8f0",
          textDecoration: quest.completed ? "line-through" : "none",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          letterSpacing: "0.5px",
        }}
      >
        {quest.title}
      </div>

      {/* Duration badge */}
      <div
        style={{
          background: "#060b18",
          border: `2px solid ${dColor}`,
          color: dColor,
          fontSize: "5px",
          padding: "2px 5px",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        {quest.duration}MIN
      </div>

      {/* XP badge */}
      <div
        style={{
          background: "#100c00",
          border: "2px solid #554400",
          color: "#ffd700",
          fontSize: "5px",
          padding: "2px 5px",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        +{quest.xp}XP
      </div>

      {/* Delete button */}
      {hovered && !quest.completed && (
        <button
          className="pixel-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(quest.id);
          }}
          style={{
            background: "#1a0008",
            border: "2px solid #660022",
            color: "#ff3366",
            fontSize: "9px",
            width: "18px",
            height: "18px",
            cursor: "pointer",
            fontFamily: "'Press Start 2P', monospace",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
