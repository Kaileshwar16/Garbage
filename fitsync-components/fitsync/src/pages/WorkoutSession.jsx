import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { BG, GOLD, MUTED, btnGold } from "../theme";
import CircularTimer from "../components/CircularTimer";
import ExerciseItem  from "../components/ExerciseItem";
import { WORKOUT_DETAIL_MAP } from "../utils/constants";
import { calsPerMin } from "../utils/fitness";

export default function WorkoutSession({ nav }) {
  const { user, setUser } = useUser();
  const wk = WORKOUT_DETAIL_MAP[user.goal] || WORKOUT_DETAIL_MAP["General Fitness"];

  const [secs,    setSecs]   = useState(0);
  const [running, setRunning] = useState(true);
  const [exList,  setExList]  = useState(wk.exercises.map((e) => ({ ...e, done: false })));

  // Timer tick
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const doneCount  = exList.filter((e) => e.done).length;
  const cpMin      = calsPerMin(user.activityLevel);
  const estimateCal= Math.round((secs / 60) * cpMin);
  const TOTAL_SECS = 40 * 60; // ring fills at 40 min

  const toggleExercise = (i) =>
    setExList((list) => list.map((e, j) => (j === i ? { ...e, done: !e.done } : e)));

  const finishWorkout = () => {
    setRunning(false);
    const calBurned = Math.round((secs / 60) * cpMin);
    setUser((u) => ({
      ...u,
      caloriesBurned: (u.caloriesBurned || 0) + calBurned,
      streak:         (u.streak         || 0) + 1,
      weekDone:       Math.min((u.weekDone || 0) + 1, u.weekTotal || 4),
      workoutHistory: [
        ...(u.workoutHistory || []),
        { name: wk.name, date: new Date().toLocaleDateString(), duration: Math.round(secs / 60), calBurned },
      ],
    }));
    nav("dashboard");
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: 28, color: "#fff" }}>
      {/* Back */}
      <button onClick={() => nav("dashboard")} style={{ background: "none", border: "none", color: MUTED, fontSize: 14, cursor: "pointer", marginBottom: 20 }}>
        ← Back
      </button>

      {/* Title */}
      <h2 style={{ textAlign: "center", fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
        {wk.name}
      </h2>
      <p style={{ textAlign: "center", color: MUTED, fontSize: 13, marginBottom: 28 }}>
        {doneCount}/{exList.length} exercises · ~{estimateCal} kcal burned
      </p>

      {/* Timer */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
        <CircularTimer
          seconds={secs}
          totalSeconds={TOTAL_SECS}
          running={running}
          onToggle={() => setRunning((r) => !r)}
        />
      </div>

      {/* Exercise list */}
      <h3 style={{ color: MUTED, fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
        Exercises
      </h3>
      {exList.map((ex, i) => (
        <ExerciseItem key={i} exercise={ex} onToggle={() => toggleExercise(i)} />
      ))}

      {/* Finish */}
      <button onClick={finishWorkout} style={{ ...btnGold, marginTop: 20 }}>
        ✓ Finish Workout & Save
      </button>
    </div>
  );
}
