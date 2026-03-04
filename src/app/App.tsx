import { useState, useEffect } from "react";
import "../styles/pixel.css";

import { StarBackground } from "./components/StarBackground";
import { TopBar } from "./components/TopBar";
import { QuestListView } from "./components/QuestListView";
import { QuestMode } from "./components/QuestMode";
import { CompletionScreen } from "./components/CompletionScreen";
import { BreakItDownModal } from "./components/BreakItDownModal";

export interface Quest {
  id: string;
  title: string;
  duration: 5 | 7 | 10;
  xp: number;
  completed: boolean;
}

type AppView = "list" | "quest" | "complete";

const SAMPLE_QUESTS: Quest[] = [
  { id: "1", title: "Reply to 3 emails", duration: 5, xp: 10, completed: false },
  { id: "2", title: "Organize desktop files", duration: 7, xp: 10, completed: false },
  { id: "3", title: "Write tomorrow's to-do list", duration: 5, xp: 10, completed: false },
  { id: "4", title: "Review meeting notes", duration: 10, xp: 10, completed: false },
];

const STORAGE_KEY = "5mq-save";

function loadState() {
  const today = new Date().toDateString();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.savedDate === today) {
        return {
          quests: (data.quests as Quest[]) ?? SAMPLE_QUESTS,
          dailyXP: (data.dailyXP as number) ?? 0,
          questsToday: (data.questsToday as number) ?? 0,
        };
      }
      // New day – reset XP & completions
      return {
        quests: ((data.quests as Quest[]) ?? SAMPLE_QUESTS).map((q) => ({
          ...q,
          completed: false,
        })),
        dailyXP: 0,
        questsToday: 0,
      };
    }
  } catch {
    // ignore
  }
  return { quests: SAMPLE_QUESTS, dailyXP: 0, questsToday: 0 };
}

export default function App() {
  const initial = loadState();

  const [quests, setQuests] = useState<Quest[]>(initial.quests);
  const [view, setView] = useState<AppView>("list");
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [dailyXP, setDailyXP] = useState(initial.dailyXP);
  const [questsToday, setQuestsToday] = useState(initial.questsToday);
  const [newQuestTitle, setNewQuestTitle] = useState("");
  const [newQuestDuration, setNewQuestDuration] = useState<5 | 7 | 10>(5);
  const [showBreakItDown, setShowBreakItDown] = useState(false);

  // Persist on change
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ quests, dailyXP, questsToday, savedDate: today })
    );
  }, [quests, dailyXP, questsToday]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const startQuest = (quest: Quest) => {
    setActiveQuest(quest);
    setView("quest");
  };

  const completeQuest = (quest: Quest) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === quest.id ? { ...q, completed: true } : q))
    );
    setDailyXP((prev) => Math.min(prev + quest.xp, 30));
    setQuestsToday((prev) => Math.min(prev + 1, 3));
    setView("complete");
  };

  const onCompletionDone = () => {
    setView("list");
    setActiveQuest(null);
  };

  const addQuest = () => {
    const title = newQuestTitle.trim();
    if (!title) return;
    const newQ: Quest = {
      id: Date.now().toString(),
      title: title.slice(0, 42),
      duration: newQuestDuration,
      xp: 10,
      completed: false,
    };
    setQuests((prev) => [...prev, newQ]);
    setNewQuestTitle("");
  };

  const deleteQuest = (id: string) => {
    setQuests((prev) => prev.filter((q) => q.id !== id));
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      className="size-full flex items-center justify-center overflow-hidden"
      style={{
        background: "#04070f",
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      <StarBackground />

      {/* ── App Window ─────────────────────────────────────────────────── */}
      <div
        className="app-border-scan"
        style={{
          width: "500px",
          height: "620px",
          background: "#0c1526",
          border: "3px solid #00d4ff",
          boxShadow: "0 0 40px rgba(0, 212, 255, 0.15), 6px 6px 0px #000000",
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Corner accents (pixel frame decoration) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "8px",
            height: "8px",
            background: "#00ffff",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "8px",
            height: "8px",
            background: "#00ffff",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "8px",
            height: "8px",
            background: "#00ffff",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "8px",
            height: "8px",
            background: "#00ffff",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />

        {/* Top bar — always visible */}
        <TopBar questsToday={questsToday} dailyXP={dailyXP} />

        {/* Main content area */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* LIST VIEW */}
          {view === "list" && (
            <QuestListView
              quests={quests}
              newQuestTitle={newQuestTitle}
              newQuestDuration={newQuestDuration}
              onTitleChange={setNewQuestTitle}
              onDurationChange={setNewQuestDuration}
              onAddQuest={addQuest}
              onStartQuest={startQuest}
              onDeleteQuest={deleteQuest}
              onBreakItDown={() => setShowBreakItDown(true)}
            />
          )}

          {/* QUEST MODE */}
          {view === "quest" && activeQuest && (
            <QuestMode
              quest={activeQuest}
              onComplete={completeQuest}
              onCancel={() => {
                setView("list");
                setActiveQuest(null);
              }}
            />
          )}

          {/* COMPLETION SCREEN */}
          {view === "complete" && activeQuest && (
            <CompletionScreen
              quest={activeQuest}
              xpGained={activeQuest.xp}
              onDone={onCompletionDone}
            />
          )}
        </div>
      </div>

      {/* ── Break It Down Modal ─────────────────────────────────────────── */}
      {showBreakItDown && (
        <BreakItDownModal
          taskText={newQuestTitle}
          onClose={() => setShowBreakItDown(false)}
          onAddTask={(title) => {
            setNewQuestTitle(title);
            setShowBreakItDown(false);
          }}
        />
      )}
    </div>
  );
}
