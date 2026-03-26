import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div style={styles.wrap} className="fade-up">
      <div style={styles.top}>
        <div style={styles.iconWrap}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="27" stroke="#c8f135" strokeWidth="1.5"/>
            <path d="M18 34l6-10 5 7 4-5 5 8" stroke="#c8f135" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 style={styles.h1}>Start your<br /><span style={styles.accent}>Fitness</span> Journey</h1>
      </div>
      <div style={styles.btns}>
        <button className="btn btn-ghost" onClick={() => navigate('/login')}>Login</button>
        <button className="btn btn-primary" onClick={() => navigate('/register')}>Register</button>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    height: '100vh', display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between', padding: '80px 28px 52px',
    background: 'linear-gradient(160deg, #13131a 0%, #0e0e12 100%)',
  },
  top: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 28 },
  iconWrap: {},
  h1: { fontSize: 36, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.5px', color: '#f0f0f5' },
  accent: { color: '#c8f135' },
  btns: { display: 'flex', flexDirection: 'column', gap: 12 },
};
