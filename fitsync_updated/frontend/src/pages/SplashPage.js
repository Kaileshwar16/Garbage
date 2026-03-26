import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  { title: null, sub: null },
  { title: 'FitSync', sub: 'Fitness Made Simple.' },
  { title: 'Start your\nFitness Journey', sub: null, cta: true },
];

export default function SplashPage() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (slide < 2) {
      const t = setTimeout(() => setSlide(s => s + 1), 1000);
      return () => clearTimeout(t);
    }
  }, [slide]);

  return (
    <div style={styles.wrap}>
      <div style={styles.icon}>
        <svg width="52" height="52" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="27" stroke="#c8f135" strokeWidth="1.5"/>
          <path d="M18 34l6-10 5 7 4-5 5 8" stroke="#c8f135" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {slide >= 1 && (
        <div style={{ textAlign:'center', animation:'fadeUp 0.4s ease' }}>
          <h1 style={styles.title}>FitSync</h1>
          <p style={styles.sub}>Fitness Made Simple.</p>
        </div>
      )}

      {slide >= 2 && (
        <div style={{ ...styles.ctaWrap, animation:'fadeUp 0.4s ease' }}>
          <h2 style={styles.ctaTitle}>Start your{'\n'}<span style={{ color:'var(--accent)' }}>Fitness</span> Journey</h2>
          <div style={styles.btns}>
            <button className="btn btn-ghost" onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>Register</button>
            <button style={styles.guestBtn} onClick={() => navigate('/start')}>Continue as guest</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    height:'100vh', display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center', gap:20,
    background:'linear-gradient(160deg, #13131a 0%, #0e0e12 100%)',
    padding:'0 32px',
  },
  icon: { marginBottom:8 },
  title: { fontSize:34, fontWeight:700, letterSpacing:'-0.5px', color:'#f0f0f5', marginBottom:6 },
  sub: { fontSize:15, color:'#9090a8' },
  ctaWrap: { width:'100%', display:'flex', flexDirection:'column', gap:16, marginTop:20 },
  ctaTitle: { fontSize:30, fontWeight:700, textAlign:'center', lineHeight:1.3, whiteSpace:'pre-line' },
  btns: { display:'flex', flexDirection:'column', gap:10, width:'100%' },
  guestBtn: { background:'none', border:'none', color:'var(--text3)', fontSize:14, cursor:'pointer', paddingBlock:8 },
};
