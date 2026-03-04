import { useState, useEffect } from "react";

interface PixelRocketProps {
  buildStage: number; // 0-5
  isThrustersActive: boolean;
  launching?: boolean;
}

const C = 8; // cell size in px
const COLS = 11;
const ROWS = 22;

type R = {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
};

function cell(col: number, row: number, w: number, h: number, fill: string): R {
  return { x: col * C, y: row * C, w: w * C, h: h * C, fill };
}

// ===== PLATFORM (always visible) =====
const PLATFORM: R[] = [
  cell(0, 18, 11, 1, "#2d4a6a"),
  cell(1, 19, 9, 1, "#223855"),
  cell(2, 20, 7, 1, "#172a40"),
  // platform details
  cell(0, 18, 2, 1, "#3d5a7a"),
  cell(9, 18, 2, 1, "#3d5a7a"),
  cell(3, 19, 1, 1, "#1a2d44"),
  cell(7, 19, 1, 1, "#1a2d44"),
];

// ===== ENGINE / NOZZLE (stage 1) =====
const ENGINE: R[] = [
  cell(4, 13, 3, 3, "#889ab0"),
  cell(4, 13, 3, 1, "#99aabb"), // top highlight
  cell(5, 16, 1, 1, "#6677aa"), // nozzle exit
  cell(4, 16, 3, 1, "#778899"), // nozzle base row
];

// ===== LOWER BODY + FINS (stage 2) =====
const LOWER_BODY: R[] = [
  // main body lower section
  cell(3, 8, 5, 5, "#2255cc"),
  cell(3, 8, 5, 1, "#3366dd"), // top highlight row
  cell(7, 9, 1, 4, "#1a44bb"), // right edge shadow
  // left fin
  cell(1, 10, 2, 4, "#1144aa"),
  cell(0, 12, 1, 2, "#0d3a99"),
  cell(1, 14, 2, 1, "#0d3a99"), // fin connection
  // right fin
  cell(8, 10, 2, 4, "#1144aa"),
  cell(10, 12, 1, 2, "#0d3a99"),
  cell(8, 14, 2, 1, "#0d3a99"), // fin connection
  // fin highlights
  cell(1, 10, 1, 1, "#2255cc"),
  cell(9, 10, 1, 1, "#2255cc"),
];

// ===== UPPER BODY + WINDOW (stage 3) =====
const UPPER_BODY: R[] = [
  // main body upper section
  cell(3, 3, 5, 5, "#3366dd"),
  cell(3, 3, 5, 1, "#4477ee"), // top highlight
  cell(7, 4, 1, 4, "#2255cc"), // right edge shadow
  // window frame (dark)
  cell(4, 5, 3, 3, "#112299"),
  // window glass (cyan)
  cell(5, 6, 1, 1, "#00ddff"),
  cell(4, 5, 1, 1, "#44aaee"), // window highlight corner
  cell(6, 7, 1, 1, "#0066aa"), // window shadow corner
  // accent stripe
  cell(3, 7, 5, 1, "#2255cc"),
];

// ===== NOSE CONE (stage 4) =====
const NOSE: R[] = [
  cell(5, 0, 1, 1, "#88ccff"), // tip
  cell(4, 1, 3, 1, "#66aaff"), // upper
  cell(3, 2, 5, 1, "#4488ff"), // mid
  cell(3, 3, 5, 1, "#3366dd"), // base (connects to upper body)
  // nose detail
  cell(5, 1, 1, 1, "#aaddff"), // highlight
];

// ===== FLAME FRAMES (stage 5) =====
const FLAME_A: R[] = [
  cell(4, 17, 3, 1, "#ff5500"),
  cell(4, 18, 3, 1, "#ff7700"),
  cell(5, 19, 1, 1, "#ffaa00"),
  cell(5, 20, 1, 1, "#ffdd00"),
  // inner
  cell(5, 17, 1, 1, "#ffaa00"),
];

const FLAME_B: R[] = [
  cell(4, 17, 3, 1, "#ff8800"),
  cell(4, 18, 3, 1, "#ff5500"),
  cell(5, 19, 1, 1, "#ffcc00"),
  cell(4, 19, 1, 1, "#ff7700"),
  cell(6, 19, 1, 1, "#ff7700"),
  cell(5, 20, 1, 1, "#ff9900"),
];

const FLAME_C: R[] = [
  cell(4, 17, 3, 1, "#ffaa00"),
  cell(5, 18, 1, 1, "#ff6600"),
  cell(4, 18, 1, 1, "#ff9900"),
  cell(6, 18, 1, 1, "#ff9900"),
  cell(4, 19, 3, 1, "#ff4400"),
  cell(5, 20, 1, 1, "#ffbb00"),
];

// Small idle thruster glow (stages 1-4)
const THRUSTER_IDLE: R[] = [
  cell(5, 17, 1, 1, "#223355"),
  cell(4, 17, 3, 1, "#0a1525"),
];

function Rects({ rects }: { rects: R[] }) {
  return (
    <>
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} />
      ))}
    </>
  );
}

export function PixelRocket({
  buildStage,
  isThrustersActive,
  launching = false,
}: PixelRocketProps) {
  const [flameFrame, setFlameFrame] = useState(0);

  useEffect(() => {
    if (isThrustersActive || launching) {
      const interval = setInterval(() => {
        setFlameFrame((prev) => (prev + 1) % 3);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isThrustersActive, launching]);

  const svgW = COLS * C;
  const svgH = ROWS * C;

  const flames = [FLAME_A, FLAME_B, FLAME_C];

  return (
    <svg
      width={svgW * 2}
      height={svgH * 2}
      viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ imageRendering: "pixelated", display: "block" }}
    >
      {/* Platform — always visible */}
      <Rects rects={PLATFORM} />

      {/* Engine — stage 1+ */}
      <g style={{ opacity: buildStage >= 1 ? 1 : 0, transition: "opacity 0.4s" }}>
        <Rects rects={ENGINE} />
      </g>

      {/* Lower body + fins — stage 2+ */}
      <g style={{ opacity: buildStage >= 2 ? 1 : 0, transition: "opacity 0.4s" }}>
        <Rects rects={LOWER_BODY} />
      </g>

      {/* Upper body + window — stage 3+ */}
      <g style={{ opacity: buildStage >= 3 ? 1 : 0, transition: "opacity 0.4s" }}>
        <Rects rects={UPPER_BODY} />
      </g>

      {/* Nose cone — stage 4+ */}
      <g style={{ opacity: buildStage >= 4 ? 1 : 0, transition: "opacity 0.4s" }}>
        <Rects rects={NOSE} />
      </g>

      {/* Idle thruster placeholder */}
      {buildStage >= 1 && !isThrustersActive && !launching && (
        <Rects rects={THRUSTER_IDLE} />
      )}

      {/* Active thruster flame */}
      {(isThrustersActive || launching) && (
        <Rects rects={flames[flameFrame]} />
      )}
    </svg>
  );
}
