import { useUser } from "../context/UserContext";
import { BG, BG2, BORDER, GOLD, MUTED, btnOutline } from "../theme";
import WorkoutCard from "../components/WorkoutCard";
import ProgressBar from "../components/ProgressBar";
import { WORKOUT_MAP } from "../utils/constants";

export default function Dashboard({ nav, onAI }) {
  const { user, setUser } = useUser();

  const calorieGoal = user.calories || 2000;
  const calBurned   = user.caloriesBurned || 0;
  const calPct      = Math.min(100, Math.round((calBurned / calorieGoal) * 100));
  const stepsToday  = user.stepsToday  || 0;
  const waterToday  = user.waterToday  || 0;
  const waterGoal   = user.water       || 3.0;
  const streak      = user.streak      || 0;
  const weekDone    = user.weekDone    || 0;
  const weekTotal   = user.weekTotal   || 4;
  const firstName   = (user.name || "Demo").split(" ")[0];
  const todayWk     = WORKOUT_MAP[user.goal] || WORKOUT_MAP["General Fitness"];

  const addCalories = (n) => setUser((u) => ({ ...u, caloriesBurned: (u.caloriesBurned || 0) + n }));
  const addWater    = ()  => setUser((u) => ({ ...u, waterToday: parseFloat(((u.waterToday || 0) + 0.25).toFixed(2)) }));
  const addSteps    = (n) => setUser((u) => ({ ...u, stepsToday: Math.min((u.stepsToday || 0) + n, 25000) }));

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 24px 80px", color: "#fff" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}>
            Hi, {firstName} 👋
          </h1>
          <p style={{ color: MUTED, margin: "4px 0 0", fontSize: 13 }}>Ready to crush your goals?</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            ["Daily Activity",  `${calPct}% Complete`],
            ["Total Workouts",  `${(user.workoutHistory || []).length} Sessions`],
          ].map(([label, value]) => (
            <div key={label} style={{ background: BG2, borderRadius: 10, padding: "8px 14px", border: `1px solid ${BORDER}` }}>
              <div style={{ color: MUTED, fontSize: 10, marginBottom: 2 }}>{label}</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Calories card ── */}
      <div style={{ background: GOLD, borderRadius: 16, padding: "20px 24px", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
          <div>
            <p style={{ color: "rgba(0,0,0,0.55)", fontSize: 11, fontWeight: 600, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1 }}>
              Calories Burned Today
            </p>
            <div style={{ fontSize: 52, fontWeight: 900, color: "#1a1a2e", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>
              {calBurned}
            </div>
          </div>
          <div>
            <div style={{ background: "rgba(0,0,0,0.12)", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>
              Goal: {calorieGoal.toLocaleString()} kcal
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
              {[50, 100, 200].map((n) => (
                <button key={n} onClick={() => addCalories(n)}
                  style={{ background: "rgba(0,0,0,0.14)", border: "none", borderRadius: 8, padding: "5px 10px", color: "#1a1a2e", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>
                  +{n}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(0,0,0,0.5)", marginBottom: 5 }}>
            <span>PROGRESS</span><span>{calPct}%</span>
          </div>
          <ProgressBar value={calBurned} max={calorieGoal} color="#1a1a2e" bgColor="rgba(0,0,0,0.15)" height={7} />
        </div>
      </div>

      {/* ── Streak & Week ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div style={{ background: BG2, borderRadius: 14, padding: "14px 16px", border: `1px solid ${BORDER}` }}>
          <p style={{ color: MUTED, fontSize: 11, margin: "0 0 6px" }}>Current Streak</p>
          <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}>
            {streak} day{streak !== 1 ? "s" : ""} {streak >= 3 ? "🔥" : streak > 0 ? "✨" : ""}
          </div>
        </div>
        <div style={{ background: BG2, borderRadius: 14, padding: "14px 16px", border: `1px solid ${BORDER}` }}>
          <p style={{ color: MUTED, fontSize: 11, margin: "0 0 6px" }}>This Week</p>
          <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}>
            {weekDone}/{weekTotal} done
          </div>
        </div>
      </div>

      {/* ── Main grid: Workout + Water + Steps ── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
        <WorkoutCard workout={todayWk} onStart={() => nav("workout")} />

        {/* Water */}
        <div style={{ background: BG2, borderRadius: 14, padding: 14, border: `1px solid ${BORDER}`, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, marginBottom: 6 }}>💧</div>
          <p style={{ color: MUTED, fontSize: 10, margin: "0 0 4px" }}>Water Intake</p>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{waterToday.toFixed(2)} / {waterGoal} L</div>
          <ProgressBar value={waterToday} max={waterGoal} color="#60a5fa" height={4} />
          <button onClick={addWater}
            style={{ marginTop: 10, background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: 8, padding: "6px", color: "#60a5fa", fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>
            +250 ml
          </button>
        </div>

        {/* Steps */}
        <div style={{ background: BG2, borderRadius: 14, padding: 14, border: `1px solid ${BORDER}`, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, marginBottom: 6 }}>👟</div>
          <p style={{ color: MUTED, fontSize: 10, margin: "0 0 4px" }}>Steps Today</p>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{stepsToday.toLocaleString()}</div>
          <ProgressBar value={stepsToday} max={10000} color="#4ade80" height={4} />
          <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
            {[500, 1000].map((n) => (
              <button key={n} onClick={() => addSteps(n)}
                style={{ flex: 1, background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 7, padding: "5px 2px", color: "#4ade80", fontSize: 10, cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>
                +{n >= 1000 ? `${n / 1000}k` : n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom info cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: BG2, borderRadius: 14, padding: "14px 16px", border: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 20, marginBottom: 6 }}>🎯</div>
          <p style={{ color: MUTED, fontSize: 10, margin: "0 0 4px" }}>Current Goal</p>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{user.goal || "Complete onboarding"}</div>
        </div>
        <div style={{ background: BG2, borderRadius: 14, padding: "14px 16px", border: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 20, marginBottom: 6 }}>🥩</div>
          <p style={{ color: MUTED, fontSize: 10, margin: "0 0 4px" }}>Protein Target</p>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{user.protein ? `${user.protein} g/day` : "—"}</div>
        </div>
      </div>

      {/* ── AI FAB ── */}
      <button
        onClick={onAI}
        style={{
          position: "fixed", bottom: 28, right: 28,
          width: 54, height: 54, borderRadius: "50%",
          background: GOLD, border: "none", cursor: "pointer",
          fontSize: 22, boxShadow: "0 4px 20px rgba(245,197,24,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        🤖
      </button>
    </div>
  );
}
