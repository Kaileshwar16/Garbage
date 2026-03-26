import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

function CircleTimer({ elapsed, total, size = 200 }) {
  const r = (size / 2) - 14;
  const circ = 2 * Math.PI * r;
  const progress = total > 0 ? Math.min(elapsed / total, 1) : 0;
  const dash = circ * progress;
  const remaining = total - elapsed;
  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:'block', margin:'0 auto' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg4)" strokeWidth="8"/>
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke="var(--accent)" strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dasharray 0.5s linear' }}
      />
      <text x={size/2} y={size/2 + 8} textAnchor="middle" fill="var(--text)" fontSize="32" fontWeight="600" fontFamily="DM Sans, sans-serif">
        {mins}:{secs}
      </text>
    </svg>
  );
}

export default function WorkoutTimerPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [checkedExs, setCheckedExs] = useState({});
  const intervalRef = useRef(null);

  useEffect(() => {
    api.get(`/workouts/plan/${planId}`)
      .then(({ data }) => setPlan(data))
      .catch(() => navigate('/home'));
  }, [planId, navigate]);

  useEffect(() => {
    if (running && !done) {
      intervalRef.current = setInterval(() => {
        setElapsed(e => {
          const totalSecs = (plan?.duration ?? 45) * 60;
          if (e + 1 >= totalSecs) {
            setRunning(false);
            setDone(true);
            return totalSecs;
          }
          return e + 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, done, plan]);

  const handleComplete = useCallback(async () => {
    setCompleting(true);
    try {
      await api.post(`/workouts/complete/${planId}`);
      navigate('/home');
    } catch { navigate('/home'); }
  }, [planId, navigate]);

  const totalSecs = (plan?.duration ?? 45) * 60;
  const allChecked = plan && Object.keys(checkedExs).length === plan.exercises?.length;

  return (
    <div className="page fade-up" style={{ paddingTop: 0 }}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.back} onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
        <h2 style={styles.title}>{plan?.title || 'Workout'}</h2>
        <div style={{ width: 60 }} />
      </div>

      {/* Timer circle */}
      <div style={styles.timerWrap}>
        <CircleTimer elapsed={elapsed} total={totalSecs} size={200} />
      </div>

      {/* Control buttons */}
      <div style={styles.controls}>
        {!done ? (
          <>
            <button style={styles.pauseBtn} onClick={() => setRunning(r => !r)}>
              {running ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21"/></svg>
              )}
            </button>
            <button style={styles.finishBtn} onClick={handleComplete} disabled={completing}>
              {completing ? <span className="spinner" style={{ width:16, height:16 }}/> : 'Finish Early'}
            </button>
          </>
        ) : (
          <button className="btn btn-primary" style={{ maxWidth: 240, margin:'0 auto' }} onClick={handleComplete} disabled={completing}>
            {completing ? <span className="spinner"/> : '🎉 Complete Workout'}
          </button>
        )}
      </div>

      {/* Exercise list */}
      <div style={styles.exSection}>
        <p style={styles.exHeading}>Exercises</p>
        <div style={styles.exList}>
          {plan?.exercises?.map((ex, i) => (
            <div
              key={i}
              style={{ ...styles.exItem, ...(checkedExs[i] ? styles.exItemDone : {}) }}
              onClick={() => setCheckedExs(c => ({ ...c, [i]: !c[i] }))}
            >
              <div style={{ ...styles.exCheck, ...(checkedExs[i] ? styles.exCheckDone : {}) }}>
                {checkedExs[i] && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0e0e12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </div>
              <div style={styles.exInfo}>
                <p style={styles.exName}>{ex.name}</p>
                <p style={styles.exDetail}>
                  {ex.sets
                    ? `${ex.sets} sets × ${ex.reps ? `${ex.reps} reps` : `${ex.duration} min`}`
                    : `${ex.duration} min`}
                </p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid var(--border)' },
  back: { display:'flex', alignItems:'center', gap:6, color:'var(--text2)', fontSize:13, background:'none', cursor:'pointer' },
  title: { fontSize:17, fontWeight:700, textAlign:'center' },
  timerWrap: { padding:'32px 0 20px', display:'flex', justifyContent:'center' },
  controls: { display:'flex', justifyContent:'center', alignItems:'center', gap:16, paddingBottom:24, paddingInline:20 },
  pauseBtn: { width:52, height:52, borderRadius:'50%', background:'var(--accent)', color:'#0e0e12', display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer' },
  finishBtn: { padding:'11px 22px', borderRadius:100, background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text2)', fontSize:13, cursor:'pointer' },
  exSection: { paddingInline:20 },
  exHeading: { fontSize:12, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:12 },
  exList: { display:'flex', flexDirection:'column', gap:8, paddingBottom:100 },
  exItem: { display:'flex', alignItems:'center', gap:12, padding:'14px 16px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:14, cursor:'pointer', transition:'all 0.15s' },
  exItemDone: { opacity:0.55, borderColor:'var(--accent)' },
  exCheck: { width:26, height:26, borderRadius:'50%', border:'2px solid var(--border)', background:'var(--bg3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.15s' },
  exCheckDone: { background:'var(--accent)', border:'2px solid var(--accent)' },
  exInfo: { flex:1 },
  exName: { fontSize:14, fontWeight:600 },
  exDetail: { fontSize:12, color:'var(--text3)', marginTop:2 },
};
