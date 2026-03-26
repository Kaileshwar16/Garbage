import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import api from '../utils/api';

const ChatFab = ({ onClick }) => (
  <button onClick={onClick} style={styles.fab} title="Chat with Pulse AI">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  </button>
);

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [done, setDone] = useState(false);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { day:'2-digit', month:'long', year:'numeric' });

  const loadToday = useCallback(async () => {
    try {
      const { data } = await api.get('/workouts/today');
      setTodayWorkout(data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadToday(); }, [loadToday]);

  const handleComplete = async () => {
    if (!todayWorkout?._id || done) return;
    setCompleting(true);
    try {
      await api.post(`/workouts/complete/${todayWorkout._id}`);
      setDone(true);
    } catch { /* silent */ }
    finally { setCompleting(false); }
  };

  const caloriesGoal = user?.dailyCalories || 2000;
  const caloriesDone = 0; // would come from a today-log; simplified here

  return (
    <div className="page fade-up">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.dateLabel}>TODAY IS</p>
          <h2 style={styles.dateVal}>{dateStr}</h2>
          <p style={styles.greet}>Hi, {user?.username} 👋</p>
          <p style={styles.sub}>Ready to crush your goals?</p>
        </div>
      </div>

      {/* Calories card */}
      <div style={styles.calCard} className="card">
        <div style={styles.calRow}>
          <div>
            <p style={styles.calLabel}>Calories Burned</p>
            <p style={styles.calVal}>{caloriesDone.toLocaleString()}</p>
          </div>
          <div style={{ textAlign:'right' }}>
            <p style={styles.calLabel}>Goal</p>
            <p style={styles.calGoal}>{caloriesGoal.toLocaleString()}</p>
          </div>
        </div>
        <div style={styles.calBarBg}>
          <div style={{ ...styles.calBarFill, width:`${Math.min(100,(caloriesDone/caloriesGoal)*100)}%` }} />
        </div>
      </div>

      {/* Today's Workout */}
      <div style={{ marginTop: 16 }}>
        <p style={styles.sectionLabel}>Today's Workout</p>
        {loading ? (
          <div style={styles.loadWrap}><span className="spinner" /></div>
        ) : todayWorkout?.restDay ? (
          <div className="card" style={{ textAlign:'center', padding:28 }}>
            <p style={{ fontSize:28 }}>🛌</p>
            <p style={{ marginTop:8, color:'var(--text2)', fontSize:14 }}>Rest Day — Recovery is part of the plan!</p>
          </div>
        ) : todayWorkout ? (
          <div className="card" style={styles.workoutCard}>
            <div style={styles.workoutHead}>
              <div>
                <h3 style={styles.workoutTitle}>{todayWorkout.title}</h3>
                <span className="badge badge-muted">{todayWorkout.duration} min</span>
              </div>
            </div>
            <ul style={styles.exList}>
              {todayWorkout.exercises?.slice(0,3).map((ex, i) => (
                <li key={i} style={styles.exItem}>
                  <span style={styles.dot} />
                  {ex.name}
                </li>
              ))}
            </ul>
            <button
              className={`btn ${done ? 'btn-ghost' : 'btn-primary'}`}
              style={{ marginTop:16 }}
              onClick={handleComplete}
              disabled={completing || done}
            >
              {completing ? <span className="spinner" /> : done ? '✓ Completed!' : '▷  Start Workout'}
            </button>
          </div>
        ) : (
          <div className="card" style={{ textAlign:'center', padding:24 }}>
            <p style={{ color:'var(--text2)' }}>No workout planned yet.</p>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div style={styles.statsRow}>
        <div className="card" style={styles.statCard}>
          <span style={styles.statEmoji}>🔥</span>
          <p style={styles.statVal}>{user?.currentStreak ?? 0} days</p>
          <p style={styles.statLabel}>Streak</p>
        </div>
        <div className="card" style={styles.statCard}>
          <span style={styles.statEmoji}>📅</span>
          <p style={styles.statVal}>{user?.weeklyWorkoutsDone ?? 0}/3 done</p>
          <p style={styles.statLabel}>This Week</p>
        </div>
      </div>

      <ChatFab onClick={() => navigate('/chat')} />
      <BottomNav />
    </div>
  );
}

const styles = {
  header: { marginBottom:20 },
  dateLabel: { fontSize:11, color:'var(--text3)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:2 },
  dateVal: { fontSize:24, fontWeight:600, letterSpacing:'-0.3px', marginBottom:6 },
  greet: { fontSize:18, fontWeight:500 },
  sub: { fontSize:13, color:'var(--text3)', marginTop:2 },
  calCard: { marginTop:0 },
  calRow: { display:'flex', justifyContent:'space-between', marginBottom:12 },
  calLabel: { fontSize:12, color:'var(--text3)' },
  calVal: { fontSize:28, fontWeight:600, color:'var(--accent)', letterSpacing:'-1px' },
  calGoal: { fontSize:16, fontWeight:500, color:'var(--text2)' },
  calBarBg: { height:5, background:'var(--bg4)', borderRadius:4 },
  calBarFill: { height:'100%', background:'var(--accent)', borderRadius:4, transition:'width 0.5s ease' },
  sectionLabel: { fontSize:12, color:'var(--text3)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:10 },
  loadWrap: { display:'flex', justifyContent:'center', padding:32 },
  workoutCard: {},
  workoutHead: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 },
  workoutTitle: { fontSize:20, fontWeight:600, marginBottom:6 },
  exList: { listStyle:'none', display:'flex', flexDirection:'column', gap:6 },
  exItem: { display:'flex', alignItems:'center', gap:8, fontSize:14, color:'var(--text2)' },
  dot: { width:6, height:6, borderRadius:'50%', background:'var(--accent)', flexShrink:0 },
  statsRow: { display:'flex', gap:12, marginTop:16 },
  statCard: { flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:16 },
  statEmoji: { fontSize:22 },
  statVal: { fontSize:16, fontWeight:600 },
  statLabel: { fontSize:11, color:'var(--text3)' },
  fab: { position:'fixed', bottom:'calc(var(--nav-h) + 16px)', right:20, width:52, height:52, borderRadius:'50%', background:'var(--accent)', color:'#0e0e12', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 20px rgba(200,241,53,0.3)', transition:'transform 0.2s', zIndex:50 },
};
