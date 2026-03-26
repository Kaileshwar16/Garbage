import React, { useEffect, useState } from 'react';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const DAYS_SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAYS_FULL  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export default function SchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selectedDay, setSelectedDay] = useState(() => {
    const d = new Date().getDay(); // 0=Sun
    return (d + 6) % 7; // 0=Mon
  });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/workouts/schedule')
      .then(({ data }) => setSchedule(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const todayIdx = (new Date().getDay() + 6) % 7;
  const dayName  = DAYS_FULL[selectedDay];
  const dayWorkouts = schedule.filter(s => s.day === dayName);

  return (
    <div className="page fade-up" style={{ paddingTop: 0 }}>
      <TopNav />
      <div style={{ padding:'20px 20px 0' }}>
        <h2 style={styles.title}>Schedule</h2>

        {/* Day selector pills */}
        <div style={styles.pillRow}>
          {DAYS_SHORT.map((d, i) => (
            <button
              key={d}
              style={{
                ...styles.pill,
                ...(i === selectedDay ? styles.pillActive : {}),
                ...(i === todayIdx && i !== selectedDay ? styles.pillToday : {}),
              }}
              onClick={() => setSelectedDay(i)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:'0 20px', paddingBottom: 'calc(var(--nav-h) + 24px)' }}>
        {loading ? (
          <div style={styles.loadWrap}><span className="spinner" /></div>
        ) : dayWorkouts.length === 0 ? (
          <div className="card" style={styles.restCard}>
            <span style={{ fontSize:28 }}>🛌</span>
            <p style={styles.restText}>Rest Day</p>
            <p style={styles.restSub}>Recovery is part of the plan. Take it easy today.</p>
          </div>
        ) : (
          dayWorkouts.map((w) => (
            <WorkoutCard key={w._id} workout={w} onStart={() => navigate(`/workout/${w._id}`)} />
          ))
        )}

        {/* Full week overview */}
        <p style={styles.weekLabel}>FULL WEEK</p>
        <div style={styles.weekList}>
          {DAYS_FULL.map((day, i) => {
            const w = schedule.find(s => s.day === day);
            const isToday = i === todayIdx;
            return (
              <div
                key={day}
                style={{ ...styles.weekRow, ...(isToday ? styles.weekRowToday : {}) }}
                onClick={() => setSelectedDay(i)}
              >
                <div style={{ ...styles.weekDot, background: w ? 'var(--accent)' : 'var(--bg4)' }} />
                <div style={{ flex:1 }}>
                  <span style={styles.weekDay}>{day}</span>
                  {isToday && <span className="badge badge-accent" style={{ marginLeft:8, fontSize:9 }}>Today</span>}
                </div>
                <div style={{ textAlign:'right' }}>
                  {w ? (
                    <>
                      <span style={styles.weekTitle}>{w.title}</span>
                      <span style={styles.weekDur}> · {w.duration}min</span>
                    </>
                  ) : (
                    <span style={styles.restLabel}>Rest</span>
                  )}
                </div>
                {w && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function WorkoutCard({ workout, onStart }) {
  const [open, setOpen] = useState(false);
  const time = workout.day === 'Monday' || workout.day === 'Wednesday' || workout.day === 'Friday' ? '08:00 AM' : '02:00 PM';
  return (
    <div className="card" style={styles.wCard}>
      <div style={styles.wCardTop} onClick={() => setOpen(o => !o)}>
        <div>
          <p style={styles.wTime}>{time}</p>
          <p style={styles.wTitle}>{workout.title}</p>
          <p style={styles.wDur}>{workout.duration} min</p>
        </div>
        <div style={styles.wRight}>
          {open ? null : <span className="badge badge-muted">{workout.exercises?.length} exercises</span>}
          <button style={styles.checkBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        </div>
      </div>
      {open && (
        <div style={styles.exList}>
          {workout.exercises?.map((ex, i) => (
            <div key={i} style={styles.exRow}>
              <span style={styles.exDot} />
              <span style={styles.exName}>{ex.name}</span>
              <span style={styles.exDetail}>
                {ex.sets ? `${ex.sets}×${ex.reps || ex.duration+'min'}` : `${ex.duration}min`}
              </span>
            </div>
          ))}
          <div style={styles.calRow}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            <span style={{ fontSize:12, color:'var(--text3)', marginLeft:4 }}>{workout.caloriesBurned} kcal</span>
          </div>
          <button className="btn btn-primary" style={{ marginTop:12 }} onClick={onStart}>▷ Start Workout</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  title: { fontSize:26, fontWeight:700, letterSpacing:'-0.3px', marginBottom:16 },
  pillRow: { display:'flex', gap:6, overflowX:'auto', paddingBottom:16, scrollbarWidth:'none' },
  pill: { flexShrink:0, width:42, height:42, borderRadius:'50%', background:'var(--bg2)', border:'1px solid var(--border)', color:'var(--text3)', fontSize:11, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' },
  pillActive: { background:'var(--accent)', color:'#0e0e12', border:'1px solid var(--accent)' },
  pillToday: { border:'1px solid var(--accent)', color:'var(--accent)' },
  loadWrap: { display:'flex', justifyContent:'center', padding:40 },
  restCard: { display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:36, marginBottom:20 },
  restText: { fontSize:20, fontWeight:700 },
  restSub: { fontSize:13, color:'var(--text3)', textAlign:'center' },
  wCard: { marginBottom:12, padding:16 },
  wCardTop: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', cursor:'pointer' },
  wTime: { fontSize:11, color:'var(--text3)', marginBottom:2 },
  wTitle: { fontSize:17, fontWeight:700, marginBottom:2 },
  wDur: { fontSize:12, color:'var(--text3)' },
  wRight: { display:'flex', alignItems:'center', gap:10 },
  checkBtn: { width:28, height:28, borderRadius:8, background:'rgba(200,241,53,0.12)', display:'flex', alignItems:'center', justifyContent:'center' },
  exList: { marginTop:14, paddingTop:14, borderTop:'1px solid var(--border)' },
  exRow: { display:'flex', alignItems:'center', gap:8, paddingBlock:6 },
  exDot: { width:6, height:6, borderRadius:'50%', background:'var(--accent)', flexShrink:0 },
  exName: { flex:1, fontSize:13 },
  exDetail: { fontSize:12, color:'var(--text3)' },
  calRow: { display:'flex', alignItems:'center', marginTop:8 },
  weekLabel: { fontSize:10, color:'var(--text3)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:10, marginTop:20 },
  weekList: { display:'flex', flexDirection:'column', gap:2 },
  weekRow: { display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:12, cursor:'pointer', transition:'background 0.15s' },
  weekRowToday: { background:'var(--bg2)', border:'1px solid var(--border)' },
  weekDot: { width:8, height:8, borderRadius:'50%', flexShrink:0 },
  weekDay: { fontSize:14, fontWeight:500 },
  weekTitle: { fontSize:13, fontWeight:500, color:'var(--text2)' },
  weekDur: { fontSize:12, color:'var(--text3)' },
  restLabel: { fontSize:12, color:'var(--text3)' },
};
