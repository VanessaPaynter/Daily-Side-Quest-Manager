import type { KeyboardEvent } from "react";
import type { Quest } from "../App";
import { QuestCard } from "./QuestCard";

interface QuestListViewProps {
  quests: Quest[];
  newQuestTitle: string;
  newQuestDuration: 5 | 7 | 10;
  onTitleChange: (title: string) => void;
  onDurationChange: (dur: 5 | 7 | 10) => void;
  onAddQuest: () => void;
  onStartQuest: (quest: Quest) => void;
  onDeleteQuest: (id: string) => void;
  onBreakItDown: () => void;
}

const DURATION_BTNS: (5 | 7 | 10)[] = [5, 7, 10];

export function QuestListView({
  quests,
  newQuestTitle,
  newQuestDuration,
  onTitleChange,
  onDurationChange,
  onAddQuest,
  onStartQuest,
  onDeleteQuest,
  onBreakItDown,
}: QuestListViewProps) {
  const active = quests.filter((q) => !q.completed);
  const done = quests.filter((q) => q.completed);

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onAddQuest();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Quest Log Header */}
      <div
        style={{
          padding: "6px 14px",
          background: "#080f1e",
          borderBottom: "2px solid #0f1e38",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span style={{ color: "#00d4ff", fontSize: "6px" }}>
          ▶ QUEST LOG
        </span>
        <span style={{ color: "#334466", fontSize: "5px" }}>
          {active.length} ACTIVE · {done.length} DONE
        </span>
      </div>

      {/* Scrollable list */}
      <div
        className="quest-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px",
        }}
      >
        {quests.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#1a2a4a",
              fontSize: "6px",
              padding: "48px 20px",
              lineHeight: 2.5,
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "12px" }}>📜</div>
            <div>NO QUESTS IN LOG</div>
            <div style={{ marginTop: "8px", color: "#112233" }}>
              ADD YOUR FIRST QUEST BELOW
            </div>
          </div>
        )}

        {/* Active quests */}
        {active.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onStart={onStartQuest}
            onDelete={onDeleteQuest}
          />
        ))}

        {/* Completed separator */}
        {done.length > 0 && (
          <div
            style={{
              fontSize: "5px",
              color: "#1a3050",
              padding: "8px 4px 4px",
              borderTop: "1px solid #0f1e38",
              marginTop: "4px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ color: "#00ff88" }}>✓</span>
            COMPLETED TODAY
          </div>
        )}

        {done.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onStart={onStartQuest}
            onDelete={onDeleteQuest}
          />
        ))}
      </div>

      {/* Bottom input section */}
      <div
        style={{
          borderTop: "3px solid #00d4ff",
          background: "#080f1e",
          padding: "10px 12px",
          flexShrink: 0,
        }}
      >
        {/* Duration selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "8px",
          }}
        >
          <span style={{ color: "#334466", fontSize: "5px", whiteSpace: "nowrap" }}>
            TIMER:
          </span>
          {DURATION_BTNS.map((dur) => {
            const selected = newQuestDuration === dur;
            return (
              <button
                key={dur}
                className="pixel-btn"
                onClick={() => onDurationChange(dur)}
                style={{
                  padding: "4px 8px",
                  fontSize: "5px",
                  background: selected ? "#00d4ff" : "#0a1525",
                  color: selected ? "#000" : "#00d4ff",
                  border: `2px solid ${selected ? "#00d4ff" : "#1a3a5a"}`,
                  cursor: "pointer",
                  fontFamily: "'Press Start 2P', monospace",
                  boxShadow: selected ? "2px 2px 0px #005588" : "none",
                }}
              >
                {dur}M
              </button>
            );
          })}
          <div style={{ flex: 1 }} />
          <span
            style={{
              fontSize: "5px",
              color: "#334466",
              border: "1px solid #1a2a4a",
              padding: "2px 4px",
            }}
          >
            +10 XP
          </span>
        </div>

        {/* Input row */}
        <div
          style={{ display: "flex", gap: "6px", marginBottom: "6px" }}
        >
          <input
            value={newQuestTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            onKeyDown={handleKey}
            placeholder="ADD NEW QUEST..."
            maxLength={40}
            style={{
              flex: 1,
              background: "#0a1525",
              border: "2px solid #1a3a6a",
              color: "#c0d0e8",
              fontSize: "6px",
              padding: "8px",
              fontFamily: "'Press Start 2P', monospace",
              outline: "none",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "#00d4ff")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "#1a3a6a")
            }
          />
          <button
            className="pixel-btn"
            onClick={onAddQuest}
            disabled={!newQuestTitle.trim()}
            style={{
              background: newQuestTitle.trim() ? "#00d4ff" : "#0a1525",
              border: `3px solid ${newQuestTitle.trim() ? "#0088cc" : "#1a3a5a"}`,
              color: newQuestTitle.trim() ? "#000" : "#334466",
              fontSize: "10px",
              padding: "0 12px",
              cursor: newQuestTitle.trim() ? "pointer" : "default",
              fontFamily: "'Press Start 2P', monospace",
              boxShadow: newQuestTitle.trim() ? "2px 2px 0px #005588" : "none",
            }}
          >
            +
          </button>
        </div>

        {/* Break It Down button */}
        <button
          className="pixel-btn"
          onClick={onBreakItDown}
          style={{
            width: "100%",
            background: "#100820",
            border: "2px solid #6622cc",
            color: "#aa55ff",
            fontSize: "5px",
            padding: "6px",
            cursor: "pointer",
            fontFamily: "'Press Start 2P', monospace",
            textAlign: "center",
            letterSpacing: "1px",
          }}
        >
          🔮 BREAK IT DOWN HELPER
        </button>
      </div>
    </div>
  );
}