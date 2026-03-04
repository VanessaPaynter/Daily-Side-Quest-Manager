import { useState, useEffect } from "react";

interface TopBarProps {
  questsToday: number;
  dailyXP: number;
}

export function TopBar({ questsToday, dailyXP }: TopBarProps) {
  const [now, setNow] = useState(new Date());
  const [prevXP, setPrevXP] = useState(dailyXP);
  const [xpAnimating, setXpAnimating] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (dailyXP !== prevXP) {
      setXpAnimating(true);
      setPrevXP(dailyXP);
      setTimeout(() => setXpAnimating(false), 2000);
    }
  }, [dailyXP]);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const dateStr = `${DAYS[now.getDay()]} ${MONTHS[now.getMonth()]} ${pad(now.getDate())}`;

  const xpPercent = Math.min((dailyXP / 30) * 100, 100);
  const streakFull = questsToday >= 3;

  return (
    <div
      style={{
        background: "#080f1e",
        borderBottom: "3px solid #00d4ff",
        padding: "10px 14px 8px",
        flexShrink: 0,
      }}
    >
      {/* Row 1: Title + Date/Time */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        {/* App title */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px" }}>⚔️</span>
          <div>
            <div style={{ color: "#00ffff", fontSize: "7px", letterSpacing: "1px" }}>
              5-MINUTE QUESTS
            </div>
            <div style={{ color: "#334466", fontSize: "5px", marginTop: "2px" }}>
              RPG TASK MANAGER v1.0
            </div>
          </div>
        </div>

        {/* Date / time + controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#ffaa22", fontSize: "5px" }}>{dateStr}</div>
            <div
              style={{
                color: "#00ffff",
                fontSize: "7px",
                marginTop: "2px",
                letterSpacing: "1px",
              }}
            >
              {timeStr}
            </div>
          </div>

          {/* Pixel window buttons */}
          <div style={{ display: "flex", gap: "4px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                background: "#ffaa22",
                border: "2px solid #cc7700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "5px",
                color: "#000",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              _
            </div>
            <div
              style={{
                width: "12px",
                height: "12px",
                background: "#ff3366",
                border: "2px solid #cc0033",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "8px",
                color: "#fff",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              ×
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Streak + XP bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Streak indicator */}
        <div
          className={streakFull ? "streak-glow" : ""}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            background: "#0f1e38",
            border: `2px solid ${streakFull ? "#ff8800" : "#ffaa22"}`,
            padding: "4px 8px",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "11px" }}>
            {questsToday === 0 ? "🕯️" : questsToday < 3 ? "🔥" : "🔥"}
          </span>
          <div>
            <div style={{ color: "#ffaa22", fontSize: "5px", whiteSpace: "nowrap" }}>
              {questsToday}/3 TODAY
            </div>
            {streakFull && (
              <div style={{ color: "#ff8800", fontSize: "4px", marginTop: "1px" }}>
                ★ STREAK!
              </div>
            )}
          </div>
        </div>

        {/* XP Bar */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "3px",
            }}
          >
            <span style={{ color: "#ffd700", fontSize: "5px" }}>▸ DAILY XP</span>
            <span
              style={{
                color: dailyXP >= 30 ? "#00ff88" : "#ffd700",
                fontSize: "5px",
              }}
            >
              {dailyXP}/30 XP
              {dailyXP >= 30 && " ★"}
            </span>
          </div>

          {/* Pixel XP bar */}
          <div
            style={{
              height: "12px",
              background: "#060b18",
              border: "2px solid #443300",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Fill */}
            <div
              className={xpAnimating ? "xp-pulse" : ""}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: `${xpPercent}%`,
                background:
                  dailyXP >= 30
                    ? "linear-gradient(90deg, #ffd700, #00ff88)"
                    : "#ffd700",
                transition: "width 0.6s ease-out",
                backgroundImage:
                  "repeating-linear-gradient(90deg, transparent, transparent 7px, rgba(0,0,0,0.25) 7px, rgba(0,0,0,0.25) 9px)",
              }}
            />
            {/* Segment dividers */}
            {[10, 20].map((mark) => (
              <div
                key={mark}
                style={{
                  position: "absolute",
                  top: 0,
                  left: `${(mark / 30) * 100}%`,
                  width: "2px",
                  height: "100%",
                  background: "rgba(0,0,0,0.6)",
                  zIndex: 2,
                }}
              />
            ))}
            {/* Shimmer on completion */}
            {dailyXP >= 30 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                  animation: "shimmer 1.5s ease-in-out infinite",
                }}
              />
            )}
          </div>

          {dailyXP >= 30 && (
            <div
              className="slide-up"
              style={{
                fontSize: "4px",
                color: "#00ff88",
                textAlign: "center",
                marginTop: "2px",
              }}
            >
              ★ DAILY MOMENTUM ACHIEVED ★
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
