import { useMemo } from "react";

interface StarDef {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export function StarBackground() {
  const stars = useMemo<StarDef[]>(() => {
    return Array.from({ length: 90 }, (_, i) => {
      const rng = Math.sin(i * 9301 + 49297) * 0.5 + 0.5;
      const rng2 = Math.sin(i * 23453 + 83547) * 0.5 + 0.5;
      const rng3 = Math.sin(i * 37171 + 11239) * 0.5 + 0.5;
      const rng4 = Math.sin(i * 53267 + 71293) * 0.5 + 0.5;
      const rng5 = Math.sin(i * 67391 + 31337) * 0.5 + 0.5;

      const colors = ["#ffffff", "#00ffff", "#aaddff", "#ffddaa", "#00ff88"];
      const isBright = rng < 0.12;

      return {
        id: i,
        x: rng * 100,
        y: rng2 * 100,
        size: isBright ? 3 : rng3 < 0.3 ? 2 : 1,
        duration: 2 + rng4 * 4,
        delay: rng5 * 6,
        color: isBright
          ? colors[Math.floor(rng3 * colors.length)]
          : "#ffffff",
      };
    });
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={
            {
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: star.color,
              "--duration": `${star.duration}s`,
              "--delay": `${star.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
