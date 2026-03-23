import { useState } from "react";
import { useUser } from "../context/UserContext";
import { BG, BG2, BORDER, GOLD, MUTED } from "../theme";
import { WEEK_DAYS } from "../utils/constants";

const STAT_BOXES = [
  { icon: "💧", label: "Water Today",      key: (u) => `${u.waterToday || 0} L`,                              color: "#60a5fa" },
  { icon: "👟", label: "Steps Today",      key: (u) => (u.stepsToday  || 0).toLocaleString(),                 color: "#4ade80" },
  { icon: "🔥", label: "Cal Burned Today", key: (u) => `${u.caloriesBurned || 0} kcal`,                       color: "#f97316" },
  { icon: "🏆", label: "All-Time Burned",  key: (u) => `${(u.workoutHistory || []).reduce((a, h) => a + (h.calBurned || 0), 0).toLocaleString()} kcal`, color: GOLD },
  { icon: "⚡", label: "Streak",           key: (u) => `${u.streak || 0} day${u.streak !== 1 ? "s" : ""}`,    color: "#a78bfa" },
  { icon: "🥩", label: "Protein Target",   key: (u) => u.protein ? `${u.protein} g/day` : "—",                color: MUTED    },
];

export default function Stats() {
  const { user } = useUser();
  const [period, setPeriod] = useState("Week");

  const history   = user.workoutHistory || [];
  const last7     = history.slice(-7);
  const durations = WEEK_DAYS.map((_, i) => (last7[i] ? last7[i].duration : 0));
  const maxD      = Math.max(...durations, 1);
  const weeklyAvg = last7.length > 0
    ? (last7.reduce((a, h) => a + h.duration, 0) / last7.length).toFixed(1)
    : 0;
  const C2 = 400 / 6;

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: 28, color: "#fff" }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 800, margin: "0 0 24px" }}>
        Statistics
      </h1>

      {/* Period tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["Day", "Week", "Month"].map((p) => (
          <button
            key={p} onClick={() => setPeriod(p)}
            style={{
              padding: "8px 18px", borderRadius: 20, border: "none", cursor: "pointer",
              background: period === p ? GOLD : "rgba(255,255,255,0.08)",
              color: period === p ? "#1a1a2e" : MUTED,
              fontWeight: period === p ? 700 : 400,
              fontSize: 13, transition: "all 0.2s", fontFamily: "inherit",
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chart card */}
      <div style={{ background: BG2, borderRadius: 16, padding: 20, marginBottom: 16, border: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 700 }}>Workout Duration</h3>
            <p style={{ color: MUTED, fontSize: 10, margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>
              WEEKLY PERFORMANCE (MIN)
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(74,222,128,0.12)", padding: "4px 12px", borderRadius: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
            <span style={{ color: "#4ade80", fontSize: 11, fontWeight: 600 }}>ACTIVE</span>
          </div>
        </div>

        {history.length === 0 ? (
          <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: MUTED, gap: 8 }}>
            <span style={{ fontSize: 32 }}>📊</span>
            <span style={{ fontSize: 13 }}>Complete workouts to see your stats</span>
          </div>
        ) : (
          <>
            <div style={{ position: "relative", height: 120 }}>
              <svg width="100%" height="120" viewBox="0 0 400 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={GOLD} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={GOLD} stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                {/* Area fill */}
                <path
                  d={`M ${durations.map((v, i) => `${i * C2},${110 - (v / maxD) * 90}`).join(" L ")} L ${6 * C2},110 L 0,110 Z`}
                  fill="url(#cg)"
                />
                {/* Line */}
                <polyline
                  points={durations.map((v, i) => `${i * C2},${110 - (v / maxD) * 90}`).join(" ")}
                  fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                />
                {/* Dots */}
                {durations.map((v, i) => (
                  <circle key={i} cx={i * C2} cy={110 - (v / maxD) * 90} r="4" fill={v > 0 ? GOLD : "rgba(255,255,255,0.15)"} />
                ))}
              </svg>
            </div>

            {/* X axis labels */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              {WEEK_DAYS.map((d) => (
                <span key={d} style={{ color: "rgba(255,255,255,0.2)", fontSize: 10 }}>{d}</span>
              ))}
            </div>
          </>
        )}

        {/* Summary row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
          <div>
            <p style={{ color: MUTED, fontSize: 10, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: 1 }}>WEEKLY AVG</p>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}>
              {weeklyAvg} <span style={{ fontSize: 12, color: MUTED, fontWeight: 400 }}>MIN/SESSION</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: GOLD, fontSize: 15, fontWeight: 700 }}>{history.length} sessions</div>
            <div style={{ color: MUTED, fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>COMPLETED</div>
          </div>
        </div>
      </div>

      {/* Stat boxes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {STAT_BOXES.map(({ icon, label, key, color }) => (
          <div key={label} style={{ background: BG2, borderRadius: 14, padding: "14px 16px", border: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
            <p style={{ color: MUTED, fontSize: 10, margin: "0 0 4px" }}>{label}</p>
            <div style={{ fontSize: 16, fontWeight: 800, color }}>{key(user)}</div>
          </div>
        ))}
      </div>

      {/* Recent workouts */}
      {history.length > 0 && (
        <>
          <h3 style={{ color: MUTED, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, margin: "4px 0 12px" }}>
            Recent Workouts
          </h3>
          {history.slice().reverse().slice(0, 5).map((h, i) => (
            <div key={i} style={{ background: BG2, borderRadius: 12, padding: "12px 16px", marginBottom: 8, border: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{h.name}</div>
                <div style={{ color: MUTED, fontSize: 11, marginTop: 2 }}>{h.date}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: GOLD, fontWeight: 700, fontSize: 13 }}>{h.duration} min</div>
                <div style={{ color: MUTED, fontSize: 11 }}>{h.calBurned} kcal</div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
