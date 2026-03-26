import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const STEP = 2;

export default function OnboardHeight() {
  const navigate = useNavigate();
  const [unit, setUnit] = useState('cm');
  const [value, setValue] = useState(170);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const min = unit === 'cm' ? 130 : 51;
  const max = unit === 'cm' ? 220 : 87;

  const handleUnit = (u) => {
    setUnit(u);
    setValue(u === 'cm' ? 170 : 67);
  };

  const handleNext = async () => {
    setLoading(true); setError('');
    try {
      await api.put('/user/onboarding/height', { height: value, heightUnit: unit });
      navigate('/onboard/goal');
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

      <h2 style={styles.h2}>What is your height?</h2>

      <div style={styles.toggleWrap}>
        {['inches','cm'].map(u => (
          <button key={u} style={{ ...styles.toggle, ...(unit === u ? styles.toggleActive : {}) }}
            onClick={() => handleUnit(u)}>{u}</button>
        ))}
      </div>

      <div style={styles.picker}>
        <div style={styles.bigVal}>{value}</div>
        <div style={styles.unitLabel}>{unit}</div>
        <div style={styles.sliderWrap}>
          <input type="range" min={min} max={max} value={value}
            onChange={e => setValue(Number(e.target.value))} style={styles.slider} />
          <div style={styles.sliderTicks}>
            {[min, Math.round((min+max)/2 - (max-min)/4), Math.round((min+max)/2), Math.round((min+max)/2 + (max-min)/4), max].map(v => (
              <span key={v} style={styles.tick}>{v}</span>
            ))}
          </div>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div style={styles.navRow}>
        <button style={styles.backBtn} onClick={() => navigate('/onboard/weight')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <button className="btn btn-primary" style={{ flex:1 }} onClick={handleNext} disabled={loading}>
          {loading ? <span className="spinner" /> : <>Next <span style={{fontSize:18}}>›</span></>}
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight:'100vh', padding:'40px 28px 40px', display:'flex', flexDirection:'column', background:'var(--bg)', gap:24 },
  h2: { fontSize:26, fontWeight:600, textAlign:'center', letterSpacing:'-0.3px' },
  toggleWrap: { display:'flex', background:'var(--bg3)', borderRadius:100, padding:4, gap:4, width:'fit-content', margin:'0 auto' },
  toggle: { padding:'8px 24px', borderRadius:100, fontSize:14, fontWeight:500, background:'transparent', color:'var(--text3)', transition:'all 0.2s' },
  toggleActive: { background:'#1e1e28', color:'var(--text)', boxShadow:'0 2px 8px rgba(0,0,0,0.3)' },
  picker: { flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'var(--bg3)', borderRadius:20, padding:'32px 24px', gap:4 },
  bigVal: { fontSize:80, fontWeight:300, lineHeight:1, letterSpacing:'-4px', color:'var(--text)' },
  unitLabel: { fontSize:16, color:'var(--text3)', marginBottom:20 },
  sliderWrap: { width:'100%' },
  slider: { width:'100%', accentColor:'var(--accent)', cursor:'pointer' },
  sliderTicks: { display:'flex', justifyContent:'space-between', marginTop:8 },
  tick: { fontSize:11, color:'var(--text3)' },
  navRow: { display:'flex', gap:12, alignItems:'center' },
  backBtn: { width:48, height:48, borderRadius:12, background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
};
