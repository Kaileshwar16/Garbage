import { useUser } from "../context/UserContext";
import { BG, BG2, BORDER, GOLD, MUTED, btnGold } from "../theme";

const PLAN_ROWS = [
  { icon: "⚖️", label: "Current Weight",   key: (u) => `${u.weight} kg`,          color: GOLD        },
  { icon: "🎯", label: "Target Weight",    key: (u) => `${u.targetWeight} kg`,     color: (u) => u.targetWeight > u.weight ? "#4ade80" : "#f87171" },
  { icon: "🔥", label: "Daily Calories",   key: (u) => `${u.calories} kcal`,       color: "#f97316"   },
  { icon: "🥩", label: "Daily Protein",    key: (u) => `${u.protein} g`,           color: "#a78bfa"   },
  { icon: "💧", label: "Daily Water",      key: (u) => `${u.water} L`,             color: "#60a5fa"   },
  { icon: "⚡", label: "Activity Level",   key: (u) => u.activityLevel,            color: "#34d399"   },
  { icon: "📊", label: "BMR (base burn)",  key: (u) => `${u.bmr} kcal/day`,        color: MUTED       },
];

export default function PlanReveal({ nav }) {
  const { user } = useUser();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 28,
        color: "#fff",
      }}
    >
      <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 800, margin: "0 0 4px", textAlign: "center" }}>
        Your Transformation Plan
      </h2>
      <p style={{ color: MUTED, fontSize: 13, margin: "0 0 32px", textAlign: "center" }}>
        Personalised for {user.name} · {user.goal}
      </p>

      <div
        style={{
          background: BG2, borderRadius: 20, padding: 28,
          width: "100%", maxWidth: 440,
          display: "flex", flexDirection: "column", gap: 18,
          border: `1px solid ${BORDER}`,
        }}
      >
        {PLAN_ROWS.map(({ icon, label, key, color }) => {
          const val   = key(user);
          const clr   = typeof color === "function" ? color(user) : color;
          return (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: "rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0,
                }}
              >
                {icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: MUTED, fontSize: 11 }}>{label}</div>
                <div style={{ color: clr, fontWeight: 700, fontSize: 16 }}>{val}</div>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={() => nav("dashboard")} style={{ ...btnGold, marginTop: 28, maxWidth: 440 }}>
        Start My Journey 🚀
      </button>
    </div>
  );
}
