import { useState } from "react";
import { useUser } from "../context/UserContext";
import { GOLD } from "../theme";
import { calcBMR, calcCalories, calcProtein, calcWater, calcTargetWeight } from "../utils/fitness";
import { GOALS, GENDERS, GOAL_EMOJI } from "../utils/constants";

const STEP_META = [
  { label: "Personal Info",  icon: "👤" },
  { label: "Body Stats",     icon: "📏" },
  { label: "Your Goal",      icon: "🎯" },
  { label: "Activity Level", icon: "⚡" },
];

const ACTIVITY_OPTIONS = [
  { level: "Beginner",     desc: "Little to no regular exercise. Just starting out.",     icon: "🌱" },
  { level: "Intermediate", desc: "Exercise 3–4 days per week. Some fitness background.",  icon: "⚡" },
  { level: "Advanced",     desc: "Exercise 5+ days per week at high intensity.",           icon: "🏆" },
];

const lightInput = {
  width: "100%",
  padding: "14px 16px",
  background: "#fff",
  border: "1.5px solid #ddd",
  borderRadius: 12,
  color: "#1a1a2e",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

export default function Onboarding({ nav }) {
  const { user, setUser } = useUser();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ age: "", gender: "", weight: 70, height: 170, goal: "", activityLevel: "" });
  const [err,  setErr]  = useState("");

  const set = (key, val) => setData((d) => ({ ...d, [key]: val }));

  const validate = () => {
    if (step === 1 && (!data.age || !data.gender))    { setErr("Please answer all questions."); return false; }
    if (step === 3 && !data.goal)                      { setErr("Please select a goal."); return false; }
    if (step === 4 && !data.activityLevel)             { setErr("Please select your activity level."); return false; }
    setErr(""); return true;
  };

  const next = () => {
    if (!validate()) return;
    if (step < 4) { setStep((s) => s + 1); return; }
    finish();
  };

  const finish = () => {
    const age      = parseInt(data.age, 10);
    const bmr      = calcBMR(data.weight, data.height, age, data.gender);
    const calories = calcCalories(bmr, data.activityLevel);
    const protein  = calcProtein(data.weight, data.goal);
    const water    = calcWater(data.weight);
    const targetW  = calcTargetWeight(data.weight, data.goal);
    setUser((u) => ({
      ...u, ...data, age, bmr, calories, protein, water, targetWeight: targetW,
      streak: 0, weekDone: 0, weekTotal: 4,
      stepsToday: 0, waterToday: 0, caloriesBurned: 0,
      schedule: {}, workoutHistory: [],
    }));
    nav("plan");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f0", display: "flex", flexDirection: "column" }}>
      {/* Progress + title */}
      <div style={{ padding: "24px 28px 0" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {STEP_META.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < step ? "#1a1a2e" : "#ddd", transition: "background 0.3s" }} />
          ))}
        </div>
        <p style={{ color: "#999", fontSize: 12, margin: "0 0 4px" }}>Step {step} of 4</p>
        <h2 style={{ color: "#1a1a2e", fontSize: 22, fontWeight: 800, margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
          {STEP_META[step - 1].icon} {STEP_META[step - 1].label}
        </h2>
        {user.name && (
          <p style={{ color: "#888", fontSize: 13, margin: "4px 0 0" }}>
            Let's set up your profile, {user.name.split(" ")[0]}!
          </p>
        )}
      </div>

      {/* Step content */}
      <div style={{ flex: 1, padding: "28px 28px 100px", overflowY: "auto" }}>

        {/* ── STEP 1: Personal Info ── */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <label style={{ color: "#444", fontSize: 14, fontWeight: 700, display: "block", marginBottom: 12 }}>
                How old are you?
              </label>
              <input
                type="number" placeholder="Enter your age (e.g. 25)"
                value={data.age} onChange={(e) => set("age", e.target.value)}
                min={10} max={100} style={lightInput}
              />
            </div>
            <div>
              <label style={{ color: "#444", fontSize: 14, fontWeight: 700, display: "block", marginBottom: 12 }}>
                What is your gender?
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                {GENDERS.map((g) => (
                  <button
                    key={g} onClick={() => set("gender", g)}
                    style={{
                      flex: 1, padding: "14px", borderRadius: 12,
                      border: `2px solid ${data.gender === g ? "#1a1a2e" : "#e0e0e0"}`,
                      background: data.gender === g ? "#1a1a2e" : "#fff",
                      color: data.gender === g ? "#fff" : "#555",
                      cursor: "pointer", fontWeight: 600, fontSize: 14,
                      fontFamily: "inherit", transition: "all 0.2s",
                    }}
                  >
                    {g === "Male" ? "👨" : g === "Female" ? "👩" : "🧑"} {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Body Stats ── */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {[
              { label: "What is your weight?", key: "weight", unit: "kg", min: 30,  max: 200 },
              { label: "What is your height?", key: "height", unit: "cm", min: 100, max: 250 },
            ].map(({ label, key, unit, min, max }) => (
              <div key={key} style={{ textAlign: "center", background: "#fff", borderRadius: 20, padding: "28px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <p style={{ color: "#555", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>{label}</p>
                <div style={{ fontSize: 72, fontWeight: 900, color: "#1a1a2e", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>
                  {data[key]}
                </div>
                <div style={{ background: "#1a1a2e", borderRadius: 20, padding: "5px 18px", display: "inline-block", margin: "10px 0 24px", color: GOLD, fontWeight: 700, fontSize: 14 }}>
                  {unit}
                </div>
                <input
                  type="range" min={min} max={max} value={data[key]}
                  onChange={(e) => set(key, Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#1a1a2e", height: 6 }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", color: "#bbb", fontSize: 11, marginTop: 6 }}>
                  <span>{min}{unit}</span><span>{max}{unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 3: Goal ── */}
        {step === 3 && (
          <div>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
              What do you want to achieve? We'll personalise your workout program around your goal.
            </p>
            {GOALS.map((g) => (
              <div
                key={g} onClick={() => set("goal", g)}
                style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "18px 20px", borderRadius: 14, marginBottom: 12,
                  background: data.goal === g ? "#1a1a2e" : "#fff",
                  border: `2px solid ${data.goal === g ? "#1a1a2e" : "#e5e5e5"}`,
                  cursor: "pointer", transition: "all 0.2s",
                  boxShadow: data.goal === g ? "0 4px 16px rgba(0,0,0,0.15)" : "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <span style={{ fontSize: 26 }}>{GOAL_EMOJI[g]}</span>
                <span style={{ color: data.goal === g ? "#fff" : "#222", fontWeight: 600, fontSize: 15, flex: 1 }}>{g}</span>
                {data.goal === g && <span style={{ color: GOLD, fontSize: 20 }}>✓</span>}
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 4: Activity Level ── */}
        {step === 4 && (
          <div>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
              How active are you currently? This helps us calculate your daily calorie needs accurately.
            </p>
            {ACTIVITY_OPTIONS.map(({ level, desc, icon }) => (
              <div
                key={level} onClick={() => set("activityLevel", level)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 16,
                  padding: "20px", borderRadius: 14, marginBottom: 12,
                  background: data.activityLevel === level ? "#1a1a2e" : "#fff",
                  border: `2px solid ${data.activityLevel === level ? "#1a1a2e" : "#e5e5e5"}`,
                  cursor: "pointer", transition: "all 0.2s",
                  boxShadow: data.activityLevel === level ? "0 4px 16px rgba(0,0,0,0.15)" : "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <span style={{ fontSize: 28 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: data.activityLevel === level ? "#fff" : "#111", fontWeight: 700, fontSize: 15 }}>{level}</div>
                  <div style={{ color: data.activityLevel === level ? "rgba(255,255,255,0.55)" : "#888", fontSize: 13, marginTop: 3, lineHeight: 1.4 }}>{desc}</div>
                </div>
                {data.activityLevel === level && <span style={{ color: GOLD, fontSize: 20, flexShrink: 0 }}>✓</span>}
              </div>
            ))}
          </div>
        )}

        {err && (
          <p style={{ color: "#e53935", fontSize: 13, marginTop: 16, padding: "10px 14px", background: "rgba(229,57,53,0.08)", borderRadius: 8 }}>
            {err}
          </p>
        )}
      </div>

      {/* Navigation buttons */}
      <div style={{ position: "sticky", bottom: 0, background: "#f5f5f0", padding: "16px 28px 28px", display: "flex", gap: 12, borderTop: "1px solid #e8e8e8" }}>
        <button
          onClick={() => step > 1 ? setStep((s) => s - 1) : nav("register")}
          style={{ background: "rgba(0,0,0,0.07)", border: "none", borderRadius: 12, padding: "14px 24px", color: "#444", cursor: "pointer", fontSize: 14, fontFamily: "inherit", fontWeight: 600 }}
        >
          ← Back
        </button>
        <button
          onClick={next}
          style={{ flex: 1, background: "#1a1a2e", border: "none", borderRadius: 12, padding: "14px", color: "#fff", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: "inherit" }}
        >
          {step < 4 ? "Continue →" : "See My Plan 🎯"}
        </button>
      </div>
    </div>
  );
}
