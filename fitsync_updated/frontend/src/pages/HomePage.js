import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import TopNav from '../components/TopNav';
import api from '../utils/api';

const ChatFab = ({ onClick }) => (
  <button onClick={onClick} style={styles.fab} title="Chat with Pulse AI">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 9h8M8 13h5"/>
    </svg>
    <span style={styles.fabLabel}>Pulse AI</span>
  </button>
);

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [done, setDone] = useState(false);
  const [waterLoading, setWaterLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [wRes, tRes] = await Promise.all([
        api.get('/workouts/today'),
        api.get('/tracking/today'),
      ]);
      setTodayWorkout(wRes.data);
      setTracking(tRes.data);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleComplete = async () => {
    if (!todayWorkout?._id || done) return;
    setCompleting(true);
    try {
      await api.post(`/workouts/complete/${todayWorkout._id}`);
      setDone(true);
    } catch {}
    finally { setCompleting(false); }
  };

  const handleWater = async (delta) => {
    setWaterLoading(true);
    try {
      const { data } = await api.put('/tracking/water', { amount: delta });
      setTracking(data);
    } catch {}
    finally { setWaterLoading(false); }
  };

  const caloriesGoal = user?.dailyCalories || 2200;
  const caloriesDone = tracking?.caloriesBurned || 0;
  const calPct = Math.min(100, Math.round((caloriesDone / caloriesGoal) * 100));
  const water = tracking?.waterIntake ?? 0;
  const waterGoal = tracking?.waterGoal ?? 4.0;
  const steps = tracking?.steps ?? 0;
  const stepsGoal = tracking?.stepsGoal ?? 10000;
  const stepsPct = Math.min(100, Math.round((steps / stepsGoal) * 100));

  const totalWorkouts = user?.totalWorkouts || 42;
  const dailyActivityPct = Math.round((caloriesDone / caloriesGoal) * 100);

  return (
    <div className="page fade-up" style={{ paddingTop: 0 }}>
      <TopNav />
      <div style={{ paddingTop: 16 }}>
        {/* Greeting + stats header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.greet}>Hi, {user?.username} 👋</h2>
            <p style={styles.sub}>Ready to crush your goals?</p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.headerStat}>
              <p style={styles.headerStatLabel}>Daily Activity</p>
              <p style={styles.headerStatVal}>{dailyActivityPct}% Complete</p>
            </div>
            <div style={styles.headerStat}>
              <p style={styles.headerStatLabel}>Total Workouts</p>
              <p style={styles.headerStatVal}>{totalWorkouts} Sessions</p>
            </div>
          </div>
        </div>

        {/* Calories card */}
        <div style={styles.calCard} className="card">
          <div style={styles.calRow}>
            <div>
              <p style={styles.calLabel}>Calories Burned Today</p>
              <p style={styles.calVal}>{caloriesDone.toLocaleString()}</p>
            </div>
            <div style={styles.goalPill}>Goal: {caloriesGoal.toLocaleString()} kcal</div>
          </div>
          <p style={styles.progressLabel}>PROGRESS <span style={{ float:'right', color:'var(--accent)' }}>{calPct}%</span></p>
          <div style={styles.calBarBg}>
            <div style={{ ...styles.calBarFill, width: `${calPct}%` }} />
          </div>
        </div>

        {/* Streak + This Week */}
        <div style={styles.streakRow}>
          <div className="card" style={styles.streakCard}>
            <p style={styles.streakMeta}>Current Streak</p>
            <p style={styles.streakVal}>{user?.currentStreak ?? 12} days 🔥</p>
          </div>
          <div className="card" style={styles.streakCard}>
            <p style={styles.streakMeta}>This Week</p>
            <p style={styles.streakVal}>{user?.weeklyWorkoutsDone ?? 3}/4 done</p>
          </div>
        </div>

        {/* Today's Workout */}
        {loading ? (
          <div style={styles.loadWrap}><span className="spinner" /></div>
        ) : todayWorkout?.restDay ? (
          <div className="card" style={{ textAlign:'center', padding:28 }}>
            <p style={{ fontSize:28 }}>🛌</p>
            <p style={{ marginTop:8, color:'var(--text2)', fontSize:14 }}>Rest Day — Recovery is part of the plan!</p>
          </div>
        ) : todayWorkout ? (
          <div className="card" style={styles.workoutCard}>
            <p style={styles.workoutMeta}>Today's Featured Workout</p>
            <div style={styles.workoutHead}>
              <h3 style={styles.workoutTitle}>{todayWorkout.title}</h3>
              <span className="badge badge-muted">{todayWorkout.duration} min</span>
            </div>
            <div style={styles.exGrid}>
              {todayWorkout.exercises?.slice(0,4).map((ex, i) => (
                <div key={i} style={styles.exItem}>
                  <span style={styles.dot} />
                  <span style={{ fontSize:13 }}>{ex.name}</span>
                </div>
              ))}
            </div>
            <div style={styles.workoutBtns}>
              <button
                className={`btn ${done ? 'btn-ghost' : 'btn-primary'}`}
                style={{ flex:1 }}
                onClick={() => navigate(`/workout/${todayWorkout._id}`)}
              >
                ▷ Start Workout Now
              </button>
              {!done && (
                <button className="btn btn-ghost" style={{ width:50, padding:0 }} onClick={handleComplete} disabled={completing}>
                  {completing ? <span className="spinner" style={{ width:16,height:16 }}/> : done ? '✓' : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </button>
              )}
            </div>
            {done && <p style={{ textAlign:'center', color:'var(--accent)', fontSize:13, marginTop:8 }}>✓ Completed today!</p>}
          </div>
        ) : (
          <div className="card" style={{ textAlign:'center', padding:24 }}>
            <p style={{ color:'var(--text2)' }}>No workout planned yet.</p>
          </div>
        )}

        {/* Quick stat tiles row */}
        <div style={styles.tilesRow}>
          {/* Water Intake */}
          <div className="card" style={styles.tile}>
            <div style={styles.tileIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <p style={styles.tileLabel}>Water Intake</p>
            <p style={styles.tileVal}>{water.toFixed(1)} / {waterGoal.toFixed(1)} L</p>
            <div style={styles.waterBtns}>
              <button style={styles.waterBtn} onClick={() => handleWater(-0.25)} disabled={waterLoading}>−</button>
              <button style={styles.waterBtn} onClick={() => handleWater(0.25)} disabled={waterLoading}>+</button>
            </div>
          </div>

          {/* Steps Count */}
          <div className="card" style={styles.tile}>
            <div style={styles.tileIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <p style={styles.tileLabel}>Steps Count</p>
            <p style={styles.tileVal}>{steps.toLocaleString()}</p>
            <div style={styles.stepBarBg}>
              <div style={{ ...styles.stepBarFill, width:`${stepsPct}%` }} />
            </div>
            <p style={{ fontSize:10, color:'var(--text3)', marginTop:4 }}>Goal: {stepsGoal.toLocaleString()}</p>
          </div>
        </div>

        {/* Next Session + Goal */}
        <div style={styles.tilesRow}>
          <div className="card" style={styles.tile}>
            <div style={styles.tileIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            </div>
            <p style={styles.tileLabel}>Next Session</p>
            <p style={styles.tileVal} style={{ fontSize:14 }}>Tomorrow, 8 AM</p>
          </div>
          <div className="card" style={styles.tile}>
            <div style={styles.tileIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            </div>
            <p style={styles.tileLabel}>Goal Setting</p>
            <p style={{ fontSize:12, color:'var(--text)', fontWeight:500, marginTop:4 }}>{user?.goal?.split(' ').slice(0,2).join(' ') || 'Maintain Weight'}</p>
          </div>
        </div>
      </div>

      <ChatFab onClick={() => navigate('/chat')} />
      <BottomNav />
    </div>
  );
}

const styles = {
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 },
  greet: { fontSize:22, fontWeight:700, letterSpacing:'-0.3px' },
  sub: { fontSize:13, color:'var(--text3)', marginTop:2 },
  headerRight: { display:'flex', gap:8, flexDirection:'column', alignItems:'flex-end' },
  headerStat: { textAlign:'right' },
  headerStatLabel: { fontSize:10, color:'var(--text3)', lineHeight:1.2 },
  headerStatVal: { fontSize:12, fontWeight:600, color:'var(--text2)' },
  calCard: { marginBottom:12 },
  calRow: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 },
  calLabel: { fontSize:12, color:'var(--text3)', marginBottom:4 },
  calVal: { fontSize:36, fontWeight:700, color:'var(--accent)', letterSpacing:'-2px' },
  goalPill: { background:'var(--accent-dim)', color:'var(--accent)', fontSize:11, fontWeight:600, padding:'5px 10px', borderRadius:100 },
  progressLabel: { fontSize:10, color:'var(--text3)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:6 },
  calBarBg: { height:5, background:'var(--bg4)', borderRadius:4 },
  calBarFill: { height:'100%', background:'var(--accent)', borderRadius:4, transition:'width 0.5s ease' },
  streakRow: { display:'flex', gap:10, marginBottom:12 },
  streakCard: { flex:1, padding:14 },
  streakMeta: { fontSize:10, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 },
  streakVal: { fontSize:18, fontWeight:700 },
  loadWrap: { display:'flex', justifyContent:'center', padding:32 },
  workoutCard: { marginBottom:12 },
  workoutMeta: { fontSize:10, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:6 },
  workoutHead: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
  workoutTitle: { fontSize:20, fontWeight:700 },
  exGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:14 },
  exItem: { display:'flex', alignItems:'center', gap:6, color:'var(--text2)' },
  dot: { width:6, height:6, borderRadius:'50%', background:'var(--accent)', flexShrink:0 },
  workoutBtns: { display:'flex', gap:8 },
  tilesRow: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 },
  tile: { padding:14, display:'flex', flexDirection:'column', gap:4 },
  tileIcon: { width:34, height:34, borderRadius:9, background:'var(--accent-dim)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:4 },
  tileLabel: { fontSize:10, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.5px' },
  tileVal: { fontSize:18, fontWeight:700 },
  waterBtns: { display:'flex', gap:6, marginTop:4 },
  waterBtn: { flex:1, height:26, borderRadius:6, background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text)', fontSize:16, fontWeight:600, cursor:'pointer' },
  stepBarBg: { height:4, background:'var(--bg4)', borderRadius:4, marginTop:6 },
  stepBarFill: { height:'100%', background:'var(--accent)', borderRadius:4, transition:'width 0.4s' },
  fab: { position:'fixed', bottom:'calc(var(--nav-h) + 16px)', right:20, display:'flex', alignItems:'center', gap:8, padding:'12px 16px', borderRadius:100, background:'var(--accent)', color:'#0e0e12', fontWeight:600, fontSize:13, boxShadow:'0 4px 20px rgba(200,241,53,0.35)', zIndex:50 },
  fabLabel: { fontWeight:700, fontSize:13 },
};
