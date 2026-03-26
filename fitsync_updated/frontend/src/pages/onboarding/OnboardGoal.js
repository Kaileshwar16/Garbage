import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const STEP = 3;
const GOALS = [
  'Strength Training for Muscle Gain',
  'High-Intensity Interval Training for Fat Loss',
  'Cardiovascular Exercise for Fat Loss',
  'Functional Training for Overall Fitness',
];

export default function OnboardGoal() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [selected, setSelected] = useState(GOALS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    setLoading(true); setError('');
    try {
      await api.put('/user/onboarding/goal', { goal: selected });
      await refreshUser();
      navigate('/transform');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.wrap} className="fade-up">
      <div className="ob-dots">
        {[1,2,3].map(i => (
          <span key={i} className={`ob-dot ${i === STEP ? 'active' : i < STEP ? 'done' : ''}`} />
        ))}
      </div>

      <h2 style={styles.h2}>What do you want to achieve?</h2>
      <p style={styles.sub}>What you are going to select will affect your workout program</p>

      <div style={styles.goals}>
        {GOALS.map(g => (
          <button key={g} style={{ ...styles.goalBtn, ...(selected === g ? styles.goalActive : {}) }}
            onClick={() => setSelected(g)}>
            <span>{g}</span>
            {selected === g && (
              <span style={styles.check}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
            )}
          </button>
        ))}
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div style={styles.navRow}>
        <button style={styles.backBtn} onClick={() => navigate('/onboard/height')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <button className="btn btn-primary" style={{ flex:1 }} onClick={handleStart} disabled={loading}>
          {loading ? <span className="spinner" /> : 'Start Now'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight:'100vh', padding:'40px 28px 40px', display:'flex', flexDirection:'column', background:'var(--bg)', gap:20 },
  h2: { fontSize:26, fontWeight:600, letterSpacing:'-0.3px' },
  sub: { fontSize:14, color:'var(--text3)', lineHeight:1.5 },
  goals: { display:'flex', flexDirection:'column', gap:10, flex:1 },
  goalBtn: { padding:'18px 20px', borderRadius:14, background:'var(--bg2)', border:'1.5px solid var(--border)', color:'var(--text)', fontSize:14, fontWeight:500, textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between', transition:'all 0.2s', cursor:'pointer' },
  goalActive: { border:'1.5px solid var(--accent)', background:'var(--accent-dim)', color:'var(--text)' },
  check: { width:24, height:24, borderRadius:'50%', background:'var(--accent)', color:'#0e0e12', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  navRow: { display:'flex', gap:12, alignItems:'center' },
  backBtn: { width:48, height:48, borderRadius:12, background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
};
