import { useState } from "react";

interface BreakItDownModalProps {
  taskText: string;
  onClose: () => void;
  onAddTask: (title: string) => void;
}

interface Breakdown {
  steps: string[];
  tip: string;
}

function getBreakdown(text: string): Breakdown {
  const lower = text.toLowerCase().trim();

  if (!lower) {
    return {
      steps: [
        "Open what you need to begin",
        "Do the very first tiny action",
        "Write down what comes next",
      ],
      tip: "Start with something that takes under 2 minutes!",
    };
  }

  if (lower.includes("essay") || lower.includes("write") || lower.includes("report") || lower.includes("blog")) {
    return {
      steps: [
        "Open the document / editor",
        "Write just the first paragraph",
        "Outline 3 key points only",
      ],
      tip: "Writing becomes easier once you start. Open it first!",
    };
  }

  if (lower.includes("email") || lower.includes("reply") || lower.includes("message") || lower.includes("inbox")) {
    return {
      steps: [
        "Open your inbox now",
        "Reply to the most urgent 1",
        "Archive or snooze the rest",
      ],
      tip: "Batch replies! 3 quick replies beat 1 long one.",
    };
  }

  if (lower.includes("clean") || lower.includes("organize") || lower.includes("tidy") || lower.includes("sort")) {
    return {
      steps: [
        "Clear just the desktop surface",
        "Pick up and put away 5 items",
        "Wipe one area clean",
      ],
      tip: "Set a 5-min timer and only do 1 zone!",
    };
  }

  if (lower.includes("study") || lower.includes("read") || lower.includes("learn") || lower.includes("review")) {
    return {
      steps: [
        "Open the material / page",
        "Read for exactly 5 minutes",
        "Write 1 key takeaway",
      ],
      tip: "Reading 5 mins a day > 0 mins all week.",
    };
  }

  if (lower.includes("code") || lower.includes("program") || lower.includes("fix") || lower.includes("bug") || lower.includes("feature")) {
    return {
      steps: [
        "Open the file with the issue",
        "Add a console.log / comment",
        "Fix or document 1 small thing",
      ],
      tip: "Just open the file. Everything else follows.",
    };
  }

  if (lower.includes("call") || lower.includes("meeting") || lower.includes("schedule") || lower.includes("book")) {
    return {
      steps: [
        "Find the contact / calendar",
        "Send 1 message or invite",
        "Set a reminder for follow-up",
      ],
      tip: "One action unlocks everything. Send the first message!",
    };
  }

  // Generic breakdown using task name
  const shortName = text.length > 25 ? text.slice(0, 25) + "..." : text;
  return {
    steps: [
      `Open what you need for: "${shortName}"`,
      "Do the smallest possible step",
      "Note the very next action",
    ],
    tip: "What is the ONE thing that unblocks everything else?",
  };
}

export function BreakItDownModal({ taskText, onClose, onAddTask }: BreakItDownModalProps) {
  const [addedIndex, setAddedIndex] = useState<number | null>(null);
  const { steps, tip } = getBreakdown(taskText);

  const handleAddStep = (step: string, idx: number) => {
    setAddedIndex(idx);
    setTimeout(() => {
      onAddTask(step);
    }, 400);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 500,
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      <div
        className="slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "420px",
          background: "#0c0f20",
          border: "4px solid #8822ff",
          boxShadow: "0 0 40px rgba(136, 34, 255, 0.4), 6px 6px 0px #000",
        }}
      >
        {/* Modal title bar */}
        <div
          style={{
            background: "#160828",
            borderBottom: "3px solid #8822ff",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px" }}>🔮</span>
            <span style={{ color: "#aa55ff", fontSize: "6px" }}>
              WIZARD ADVISOR
            </span>
          </div>
          <button
            className="pixel-btn"
            onClick={onClose}
            style={{
              background: "#220844",
              border: "2px solid #8822ff",
              color: "#aa55ff",
              width: "20px",
              height: "20px",
              fontSize: "10px",
              cursor: "pointer",
              fontFamily: "'Press Start 2P', monospace",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "14px" }}>
          {/* Title */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "14px",
            }}
          >
            <div style={{ fontSize: "10px", color: "#ffaa22", lineHeight: 1.8 }}>
              TOO BIG FOR A
            </div>
            <div style={{ fontSize: "10px", color: "#ffaa22", lineHeight: 1.8 }}>
              10-MINUTE QUEST?
            </div>
            {taskText.trim() && (
              <div
                style={{
                  fontSize: "5px",
                  color: "#334466",
                  marginTop: "6px",
                  padding: "4px 8px",
                  background: "#0a1220",
                  border: "1px solid #1a2a4a",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                ▸ "{taskText.length > 38 ? taskText.slice(0, 38) + "…" : taskText}"
              </div>
            )}
          </div>

          {/* Guiding questions */}
          <div
            style={{
              background: "#080e1c",
              border: "2px solid #1a2a4a",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                fontSize: "5px",
                color: "#334466",
                marginBottom: "8px",
                letterSpacing: "1px",
              }}
            >
              ▶ ASK YOURSELF:
            </div>
            {[
              '"Can I make this smaller?"',
              '"What is the FIRST tiny step?"',
              '"Can I do just ONE part now?"',
            ].map((q, i) => (
              <div
                key={i}
                style={{
                  fontSize: "5px",
                  color: "#9955ee",
                  marginBottom: "5px",
                  paddingLeft: "8px",
                  lineHeight: 1.8,
                }}
              >
                ★ {q}
              </div>
            ))}
          </div>

          {/* Suggested breakdown */}
          <div
            style={{
              background: "#080e1c",
              border: "2px solid #1a2a4a",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                fontSize: "5px",
                color: "#334466",
                marginBottom: "8px",
                letterSpacing: "1px",
              }}
            >
              ▶ SUGGESTED BREAKDOWN — CLICK TO ADD:
            </div>
            {steps.map((step, i) => (
              <button
                key={i}
                className="pixel-btn"
                onClick={() => handleAddStep(step, i)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  width: "100%",
                  background:
                    addedIndex === i ? "#002200" : "transparent",
                  border: `1px solid ${addedIndex === i ? "#00ff88" : "#1a3050"}`,
                  padding: "6px 4px",
                  marginBottom: "4px",
                  cursor: "pointer",
                  fontFamily: "'Press Start 2P', monospace",
                  textAlign: "left",
                  transition: "background 0.2s, border-color 0.2s",
                }}
              >
                <span
                  style={{
                    color: addedIndex === i ? "#00ff88" : "#00d4ff",
                    fontSize: "6px",
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                >
                  {addedIndex === i ? "✓" : `${i + 1}.`}
                </span>
                <span
                  style={{
                    color: addedIndex === i ? "#00ff88" : "#00d4ff",
                    fontSize: "5px",
                    lineHeight: 1.8,
                  }}
                >
                  {step}
                </span>
              </button>
            ))}
          </div>

          {/* Wizard tip */}
          <div
            style={{
              background: "#0c0818",
              border: "2px solid #441088",
              padding: "8px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                fontSize: "5px",
                color: "#334466",
                marginBottom: "4px",
              }}
            >
              💡 WIZARD TIP:
            </div>
            <div style={{ fontSize: "5px", color: "#7744bb", lineHeight: 1.8 }}>
              {tip}
            </div>
          </div>

          {/* Close button */}
          <button
            className="pixel-btn"
            onClick={onClose}
            style={{
              width: "100%",
              background: "#160828",
              border: "2px solid #8822ff",
              color: "#aa55ff",
              fontSize: "6px",
              padding: "8px",
              cursor: "pointer",
              fontFamily: "'Press Start 2P', monospace",
              letterSpacing: "1px",
            }}
          >
            CLOSE DIALOG ✕
          </button>
        </div>
      </div>
    </div>
  );
}
