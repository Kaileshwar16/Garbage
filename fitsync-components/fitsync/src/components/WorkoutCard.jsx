import { BG2, BORDER, GOLD, MUTED, btnOutline } from "../theme";

export default function WorkoutCard({ workout, onStart }) {
  if (!workout) return null;
  return (
    <div style={{ background: BG2, borderRadius: 14, padding: "16px 18px", border: `1px solid ${BORDER}` }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <p style={{ color: MUTED, fontSize: 10, margin: "0 0 3px" }}>Today's Workout</p>
          <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: 0 }}>{workout.name}</h3>
        </div>
        <span
          style={{
            background: "rgba(245,197,24,0.15)",
            color: GOLD,
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 20,
            fontWeight: 600,
            whiteSpace: "nowrap",
            alignSelf: "flex-start",
          }}
        >
          {workout.dur}
        </span>
      </div>

      {/* Exercise list */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 12 }}>
        {workout.exercises.map((e) => (
          <div key={e} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
            <span style={{ color: MUTED, fontSize: 10 }}>{e}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        style={{ ...btnOutline, padding: "9px", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
      >
        ▶ Start Workout Now
      </button>
    </div>
  );
}
