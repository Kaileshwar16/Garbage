import { useState } from "react";
import { useUser } from "../context/UserContext";
import { BG, BG2, BORDER, GOLD, MUTED, inputStyle, btnGold, btnOutline } from "../theme";
import { WEEK_DAYS } from "../utils/constants";

export default function Schedule() {
  const { user, setUser } = useUser();

  // Default to today
  const todayIdx  = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const [activeDay, setActiveDay] = useState(WEEK_DAYS[todayIdx]);
  const [showAdd,   setShowAdd]   = useState(false);
  const [newS, setNewS] = useState({ name: "", time: "08:00", dur: "30" });

  const schedule = user.schedule || {};
  const sessions  = schedule[activeDay] || [];

  /* ── helpers ── */
  const updateSchedule = (updater) =>
    setUser((u) => {
      const s = { ...(u.schedule || {}) };
      s[activeDay] = updater(s[activeDay] || []);
      return { ...u, schedule: s };
    });

  const toggleDone    = (i) => updateSchedule((list) => list.map((item, j) => j === i ? { ...item, done: !item.done } : item));
  const deleteSession = (i) => updateSchedule((list) => list.filter((_, j) => j !== i));

  const addSession = () => {
    if (!newS.name.trim()) return;
    updateSchedule((list) => [
      ...list,
      { time: newS.time, name: newS.name.trim(), dur: `${newS.dur} min`, done: false },
    ]);
    setNewS({ name: "", time: "08:00", dur: "30" });
    setShowAdd(false);
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: 28, color: "#fff" }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 800, margin: "0 0 24px" }}>
        Schedule
      </h1>

      {/* Day tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, overflowX: "auto", paddingBottom: 4 }}>
        {WEEK_DAYS.map((d) => (
          <button
            key={d} onClick={() => setActiveDay(d)}
            style={{
              padding: "8px 14px", borderRadius: 20, border: "none", cursor: "pointer",
              background: activeDay === d ? GOLD : "rgba(255,255,255,0.08)",
              color: activeDay === d ? "#1a1a2e" : MUTED,
              fontWeight: activeDay === d ? 700 : 400,
              fontSize: 13, transition: "all 0.2s", whiteSpace: "nowrap", fontFamily: "inherit",
            }}
          >
            {d}{d === WEEK_DAYS[todayIdx] ? " ·" : ""}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {sessions.length === 0 && !showAdd && (
        <div style={{ textAlign: "center", padding: "50px 20px", color: "rgba(255,255,255,0.2)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
          <p style={{ fontSize: 15, marginBottom: 20 }}>No sessions scheduled for {activeDay}</p>
        </div>
      )}

      {/* Session cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sessions.map((s, i) => (
          <div key={i} style={{ background: BG2, borderRadius: 14, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${BORDER}` }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: MUTED, fontSize: 11, margin: "0 0 4px" }}>{s.time}</p>
              <h3 style={{ color: "#fff", margin: "0 0 4px", fontSize: 16, fontWeight: 700 }}>{s.name}</h3>
              <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>{s.dur}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                onClick={() => toggleDone(i)}
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: s.done ? GOLD : "rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: s.done ? "#1a1a2e" : MUTED, fontSize: 16, cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {s.done ? "✓" : "○"}
              </div>
              <button
                onClick={() => deleteSession(i)}
                style={{ background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, padding: "5px 8px", color: "#f87171", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <div style={{ background: BG2, borderRadius: 14, padding: 18, marginTop: 12, border: `1px solid ${BORDER}` }}>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: "0 0 14px" }}>
            Add Session for {activeDay}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              placeholder="Workout name (e.g. Morning Run)"
              value={newS.name}
              onChange={(e) => setNewS((s) => ({ ...s, name: e.target.value }))}
              style={inputStyle}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ color: MUTED, fontSize: 11, display: "block", marginBottom: 4 }}>Time</label>
                <input type="time" value={newS.time} onChange={(e) => setNewS((s) => ({ ...s, time: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: MUTED, fontSize: 11, display: "block", marginBottom: 4 }}>Duration (min)</label>
                <input type="number" placeholder="45" min={5} max={180} value={newS.dur} onChange={(e) => setNewS((s) => ({ ...s, dur: e.target.value }))} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={addSession}        style={{ ...btnGold,    padding: "11px" }}>Add Session</button>
              <button onClick={() => setShowAdd(false)} style={{ ...btnOutline, padding: "11px" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add button */}
      {!showAdd && (
        <button
          onClick={() => setShowAdd(true)}
          style={{ marginTop: 12, width: "100%", padding: "14px", background: "transparent", border: "1.5px dashed rgba(255,255,255,0.12)", borderRadius: 14, color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}
        >
          + Add Session
        </button>
      )}
    </div>
  );
}
