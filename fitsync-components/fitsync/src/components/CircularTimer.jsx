import { GOLD } from "../theme";

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CircularTimer({ seconds, totalSeconds, running, onToggle }) {
  const progress = Math.min(seconds / Math.max(totalSeconds, 1), 1);
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* SVG ring */}
      <div style={{ position: "relative", width: 160, height: 160 }}>
        <svg
          width={160}
          height={160}
          style={{ transform: "rotate(-90deg)", position: "absolute", top: 0, left: 0 }}
        >
          {/* Track */}
          <circle
            cx={80} cy={80} r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={8}
          />
          {/* Progress */}
          <circle
            cx={80} cy={80} r={RADIUS}
            fill="none"
            stroke={GOLD}
            strokeWidth={8}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>

        {/* Time label */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 800,
            fontFamily: "'Space Grotesk', sans-serif",
            color: "#fff",
            letterSpacing: 1,
          }}
        >
          {min}:{sec}
        </div>
      </div>

      {/* Play / Pause */}
      <button
        onClick={onToggle}
        style={{
          marginTop: 16,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: GOLD,
          border: "none",
          cursor: "pointer",
          fontSize: 18,
          color: "#1a1a2e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {running ? "⏸" : "▶"}
      </button>
    </div>
  );
}
