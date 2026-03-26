import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ICONS = {
  weight: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
  ),
  target: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  ),
  cal: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  ),
  protein: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
  ),
  strength: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  ),
};

const goalStrengthGain = (goal) => {
  if (goal?.includes('Muscle')) return '+25%';
  if (goal?.includes('Fat')) return '-15%';
  return '+10%';
};

export default function TransformPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const rows = [
    { icon: ICONS.weight,   label: 'Current Weight',  value: `${user?.weight ?? '--'} kg` },
    { icon: ICONS.target,   label: 'Target Weight',   value: `${user?.targetWeight ?? '--'} kg` },
    { icon: ICONS.cal,      label: 'Daily Calories',  value: user?.dailyCalories ? user.dailyCalories.toLocaleString() : '--' },
    { icon: ICONS.protein,  label: 'Daily Protein',   value: user?.dailyProtein ? `${user.dailyProtein}g` : '--' },
    { icon: ICONS.strength, label: 'Strength Gain',   value: goalStrengthGain(user?.goal) },
  ];

  return (
    <div style={styles.wrap} className="fade-up">
      <h2 style={styles.h2}>Your Transformation</h2>
      <p style={styles.sub}>Personalized plan ready</p>

      <div style={styles.rows}>
        {rows.map((r, i) => (
          <div key={i} style={{ ...styles.row, animationDelay: `${i * 0.08}s` }} className="fade-up">
            <div style={styles.rowIcon}>{r.icon}</div>
            <span style={styles.rowLabel}>{r.label}</span>
            <span style={styles.rowVal}>{r.value}</span>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" style={styles.cta} onClick={() => navigate('/home')}>
        Start My Transformation
      </button>
    </div>
  );
}

const styles = {
  wrap: { minHeight:'100vh', padding:'48px 24px 40px', display:'flex', flexDirection:'column', gap:16 },
  h2: { fontSize:30, fontWeight:600, letterSpacing:'-0.5px' },
  sub: { fontSize:14, color:'var(--text2)', marginBottom:8 },
  rows: { display:'flex', flexDirection:'column', gap:10, flex:1 },
  row: { display:'flex', alignItems:'center', gap:14, padding:'16px 18px', background:'var(--bg2)', borderRadius:14, border:'1px solid var(--border)' },
  rowIcon: { width:38, height:38, borderRadius:10, background:'var(--accent-dim)', color:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  rowLabel: { flex:1, fontSize:14, color:'var(--text2)' },
  rowVal: { fontSize:16, fontWeight:600, color:'var(--text)' },
  cta: { marginTop:8 },
};
