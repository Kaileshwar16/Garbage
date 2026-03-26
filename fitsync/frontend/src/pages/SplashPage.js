import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate('/start'), 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div style={styles.wrap}>
      <div style={styles.iconWrap}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="23" stroke="#c8f135" strokeWidth="1.5"/>
          <path d="M16 28l4-8 4 6 3-4 5 6" stroke="#c8f135" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h1 style={styles.title}>FitSync</h1>
      <p style={styles.sub}>Fitness Made Simple.</p>
    </div>
  );
}

const styles = {
  wrap: {
    height: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 12,
    background: 'linear-gradient(160deg, #13131a 0%, #0e0e12 100%)',
    animation: 'fadeUp 0.6s ease',
  },
  iconWrap: { marginBottom: 8 },
  title: { fontSize: 32, fontWeight: 600, letterSpacing: '-0.5px', color: '#f0f0f5' },
  sub: { fontSize: 15, color: '#9090a8', fontWeight: 400 },
};
