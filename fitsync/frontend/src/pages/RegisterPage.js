import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);
const EyeIcon = ({ off }) => off ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [showCo, setShowCo] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.username.trim()) return 'Username is required';
    if (form.username.length < 3) return 'Username must be at least 3 characters';
    if (!form.email) return 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Enter a valid email';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirm) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate('/onboard/weight');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap} className="fade-up">
      <button style={styles.back} onClick={() => navigate('/start')}><BackIcon /></button>
      <div style={styles.iconWrap}>
        <svg width="44" height="44" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="27" stroke="#c8f135" strokeWidth="1.5"/>
          <path d="M18 34l6-10 5 7 4-5 5 8" stroke="#c8f135" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2 style={styles.h2}>Hello! Register to<br />get started</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div className="input-wrap">
          <input className="input-field" type="text" placeholder="Username"
            value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
        </div>
        <div className="input-wrap">
          <input className="input-field" type="email" placeholder="Email"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="input-wrap">
          <input className="input-field" type={showPw ? 'text' : 'password'} placeholder="Password"
            value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            style={{ paddingRight: 44 }} />
          <button type="button" className="input-eye" onClick={() => setShowPw(s => !s)}><EyeIcon off={showPw} /></button>
        </div>
        <div className="input-wrap">
          <input className="input-field" type={showCo ? 'text' : 'password'} placeholder="Confirm password"
            value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
            style={{ paddingRight: 44 }} />
          <button type="button" className="input-eye" onClick={() => setShowCo(s => !s)}><EyeIcon off={showCo} /></button>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <div style={{ marginTop: 8 }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Register'}
          </button>
        </div>
      </form>

      <p style={styles.bottom}>
        Already have an account?{' '}
        <span style={styles.link} onClick={() => navigate('/login')}>Login</span>
      </p>
    </div>
  );
}

const styles = {
  wrap: { minHeight: '100vh', padding: '28px 28px 40px', display: 'flex', flexDirection: 'column', gap: 20 },
  back: { width: 38, height: 38, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  iconWrap: {},
  h2: { fontSize: 28, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.3px' },
  form: { display: 'flex', flexDirection: 'column', flex: 1 },
  bottom: { textAlign: 'center', fontSize: 14, color: 'var(--text2)' },
  link: { color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 },
};
