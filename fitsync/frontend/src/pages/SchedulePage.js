import React, { useEffect, useState } from 'react';
import BottomNav from '../components/BottomNav';
import api from '../utils/api';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export default function SchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const todayName = DAYS[((new Date().getDay() + 6) % 7)];

  useEffect(() => {
    api.get('/workouts/schedule')
      .then(({ data }) => setSchedule(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const workoutDays = new Set(schedule.map(s => s.day));

  return (
    <div className="page fade-up">
      <h2 style={styles.title}>Schedule</h2>
      <p style={styles.sub}>Your weekly training plan</p>

      {loading ? (
        <div style={styles.loadWrap}><span className="spinner" /></div>
      ) : (
        <div style={styles.list}>
          {DAYS.map(day => {
            const workout = schedule.find(s => s.day === day);
            const isToday = day === todayName;
            const isOpen = expanded === day;
            return (
              <div key={day} style={{ ...styles.dayCard, ...(isToday ? styles.todayCard : {}) }}>
                <div style={styles.dayHead} onClick={() => workout && setExpanded(isOpen ? null : day)}>
                  <div style={styles.dayLeft}>
                    <span style={{ ...styles.dayDot, background: workoutDays.has(day) ? 'var(--accent)' : 'var(--bg4)' }} />
                    <div>
                      <span style={styles.dayName}>{day}</span>
                      {isToday && <span className="badge badge-accent" style={{ marginLeft:8, fontSize:10 }}>Today</span>}
                    </div>
                  </div>
                  <div style={styles.dayRight}>
                    {workout ? (
                      <>
                        <span style={styles.workoutLabel}>{workout.title}</span>
                        <span style={styles.duration}>{workout.duration}min</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition:'0.2s', color:'var(--text3)' }}>
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </>
                    ) : (
                      <span style={styles.restLabel}>Rest Day</span>
                    )}
                  </div>
                </div>
                {isOpen && workout && (
                  <div style={styles.exercises}>
                    <div style={styles.exGrid}>
                      {workout.exercises.map((ex, i) => (
                        <div key={i} style={styles.exItem}>
                          <span style={styles.exName}>{ex.name}</span>
                          <span style={styles.exDetail}>
                            {ex.sets ? `${ex.sets} sets × ${ex.reps ? `${ex.reps} reps` : `${ex.duration}min`}` : `${ex.duration} min`}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div style={styles.calBurn}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                      {workout.caloriesBurned} kcal estimated
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <BottomNav />
    </div>
  );
}

const styles = {
  title: { fontSize:26, fontWeight:600, letterSpacing:'-0.3px' },
  sub: { fontSize:13, color:'var(--text3)', marginTop:4, marginBottom:20 },
  loadWrap: { display:'flex', justifyContent:'center', padding:48 },
  list: { display:'flex', flexDirection:'column', gap:8 },
  dayCard: { background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden' },
  todayCard: { border:'1px solid rgba(200,241,53,0.25)' },
  dayHead: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', cursor:'pointer' },
  dayLeft: { display:'flex', alignItems:'center', gap:12 },
  dayDot: { width:8, height:8, borderRadius:'50%', flexShrink:0 },
  dayName: { fontSize:14, fontWeight:500 },
  dayRight: { display:'flex', alignItems:'center', gap:8 },
  workoutLabel: { fontSize:13, color:'var(--text2)' },
  duration: { fontSize:12, color:'var(--text3)', background:'var(--bg3)', padding:'2px 8px', borderRadius:100 },
  restLabel: { fontSize:13, color:'var(--text3)' },
  exercises: { borderTop:'1px solid var(--border)', padding:'14px 16px' },
  exGrid: { display:'flex', flexDirection:'column', gap:8 },
  exItem: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  exName: { fontSize:13, color:'var(--text)' },
  exDetail: { fontSize:12, color:'var(--text3)', fontFamily:'var(--mono)' },
  calBurn: { marginTop:12, display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--accent)', opacity:0.8 },
};
