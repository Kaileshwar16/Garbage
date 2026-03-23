import { BG2, BORDER, GOLD, MUTED } from "../theme";

export default function ExerciseItem({ exercise, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: BG2,
        borderRadius: 12,
        padding: "14px 16px",
        marginBottom: 8,
        cursor: "pointer",
        border: `1px solid ${BORDER}`,
      }}
    >
      {/* Checkbox */}
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: exercise.done ? GOLD : "rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          color: exercise.done ? "#1a1a2e" : "transparent",
          flexShrink: 0,
          transition: "all 0.2s",
        }}
      >
        ✓
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: exercise.done ? "rgba(255,255,255,0.4)" : "#fff",
            textDecoration: exercise.done ? "line-through" : "none",
          }}
        >
          {exercise.name}
        </div>
        <div style={{ color: MUTED, fontSize: 11, marginTop: 2 }}>{exercise.sets}</div>
      </div>

      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 16 }}>›</span>
    </div>
  );
}
