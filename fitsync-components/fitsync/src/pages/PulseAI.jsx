import { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { BG, BORDER, GOLD, MUTED, inputStyle } from "../theme";

let aiIdx = 0;

export default function PulseAI({ onClose }) {
  const { user } = useUser();
  const firstName = (user.name || "there").split(" ")[0];
  const now       = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  /* ── AI response logic ── */
  const getResponse = (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("calorie") || m.includes("diet") || m.includes("eat") || m.includes("food") || m.includes("nutrition"))
      return `For your ${user.goal || "fitness"} goal, target ${user.calories || "—"} kcal/day and ${user.protein || "—"}g of protein. Focus on lean proteins, complex carbs, and healthy fats. You've burned ${user.caloriesBurned || 0} kcal today!`;
    if (m.includes("workout") || m.includes("exercise") || m.includes("train"))
      return `Based on your ${user.activityLevel || "activity level"} and "${user.goal || "fitness"}" goal, stick with your personalised workout plan. You have ${(user.workoutHistory || []).length} sessions completed — keep the momentum!`;
    if (m.includes("water") || m.includes("hydrat"))
      return `Your daily water target is ${user.water || 3}L. You've had ${user.waterToday || 0}L today — that's ${Math.round(((user.waterToday || 0) / (user.water || 3)) * 100)}% of your goal. Keep sipping!`;
    if (m.includes("weight") || m.includes("progress"))
      return `You're at ${user.weight || "?"}kg working toward ${user.targetWeight || "?"}kg. With your ${user.activityLevel || ""} plan and ${user.streak || 0}-day streak, you're on the right track, ${firstName}!`;
    if (m.includes("streak") || m.includes("motivation"))
      return `${user.streak || 0}-day streak! ${user.streak >= 7 ? "Over a week — incredible! 🏆" : user.streak >= 3 ? "Momentum is building! 🔥" : user.streak > 0 ? "Every streak starts with day one! 💪" : "Start today and build your streak! ⚡"} Total sessions: ${(user.workoutHistory || []).length}.`;
    if (m.includes("recover") || m.includes("rest") || m.includes("sleep"))
      return `Recovery is as important as training! Aim for 7–9 hours of sleep, hit your ${user.water || 3}L water goal, and take 1–2 rest days per week based on your ${user.activityLevel || "activity"} level.`;
    if (m.includes("protein") || m.includes("muscle"))
      return `With your "${user.goal || "fitness"}" goal and ${user.weight || "?"}kg body weight, your daily protein target is ${user.protein || "—"}g. Great sources: chicken breast, eggs, Greek yogurt, lentils, and cottage cheese.`;

    const pool = [
      `Looking great, ${firstName}! Your ${user.goal || "fitness"} plan is built for your ${user.activityLevel || "activity"} level. Stay consistent — small daily habits drive big results!`,
      `Your BMR is ${user.bmr || "—"} kcal, meaning your body burns that just at rest. Your active target of ${user.calories || "—"} kcal accounts for your ${user.activityLevel || ""} lifestyle.`,
      `${firstName}, your target weight is ${user.targetWeight || "?"}kg. With your workout plan and nutrition targets, you'll get there steadily and sustainably!`,
    ];
    return pool[aiIdx++ % pool.length];
  };

  const [msgs,   setMsgs]   = useState([{ from: "ai", text: `Hi ${firstName}! I'm Pulse, your AI fitness companion. How can I help you today?`, time: now() }]);
  const [inp,    setInp]    = useState("");
  const [typing, setTyping] = useState(false);
  const bot = useRef(null);

  useEffect(() => { bot.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const send = (txt) => {
    const m = txt || inp.trim();
    if (!m) return;
    setInp("");
    setMsgs((ms) => [...ms, { from: "user", text: m, time: now() }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((ms) => [...ms, { from: "ai", text: getResponse(m), time: now() }]);
    }, 900 + Math.random() * 600);
  };

  const QUICK_REPLIES = ["Workout plan?", "Nutrition tips?", "My water goal?", "My progress?", "Recovery tips?"];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(6px)" }}>
      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>

      <div style={{ background: BG, borderRadius: 20, width: "100%", maxWidth: 580, height: "82vh", display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,0.12)", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", color: MUTED, fontSize: 20, cursor: "pointer" }}>‹</button>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Pulse AI</div>
            <div style={{ color: "#4ade80", fontSize: 11 }}>● Online & Ready</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "4px 12px", fontSize: 10, color: MUTED }}>
            ⚡ FitSync Intelligence
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
          {msgs.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
              {msg.from === "ai" && (
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>
              )}
              <div>
                <div
                  style={{
                    background: msg.from === "ai" ? "rgba(255,255,255,0.07)" : "rgba(245,197,24,0.12)",
                    borderRadius: msg.from === "ai" ? "14px 14px 14px 3px" : "14px 14px 3px 14px",
                    padding: "10px 14px", maxWidth: 340,
                    border: msg.from === "ai" ? `1px solid ${BORDER}` : "1px solid rgba(245,197,24,0.15)",
                  }}
                >
                  <p style={{ color: "#fff", margin: 0, fontSize: 13, lineHeight: 1.55 }}>{msg.text}</p>
                </div>
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, margin: "3px 0 0", textAlign: msg.from === "user" ? "right" : "left" }}>
                  {msg.time}
                </p>
              </div>
              {msg.from === "user" && (
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>👤</div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
              <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "14px 14px 14px 3px", padding: "12px 16px", border: `1px solid ${BORDER}` }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.4)", animation: "bounce 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bot} />
        </div>

        {/* Quick replies */}
        <div style={{ padding: "6px 18px", display: "flex", gap: 8, overflowX: "auto" }}>
          {QUICK_REPLIES.map((r) => (
            <button key={r} onClick={() => send(r)}
              style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, borderRadius: 20, padding: "5px 12px", color: MUTED, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>
              {r}
            </button>
          ))}
        </div>

        {/* Input row */}
        <div style={{ padding: "10px 18px 18px", display: "flex", gap: 10, alignItems: "center" }}>
          <input
            value={inp}
            onChange={(e) => setInp(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask Pulse AI..."
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            onClick={() => send()}
            style={{ width: 44, height: 44, borderRadius: "50%", background: GOLD, border: "none", cursor: "pointer", fontSize: 18, color: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
