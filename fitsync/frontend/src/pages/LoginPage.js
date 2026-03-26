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

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.onboardingComplete ? '/home' : '/onboard/weight');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap} className="fade-up">
      <button style={styles.back} onClick={() => navigate('/start')}>
        <BackIcon />
      </button>
      <div style={styles.iconWrap}>
        <svg width="44" height="44" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="27" stroke="#c8f135" strokeWidth="1.5"/>
          <path d="M18 34l6-10 5 7 4-5 5 8" stroke="#c8f135" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2 style={styles.h2}>Welcome back!<br />Glad to see you, Again!</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div className="input-wrap">
          <input className="input-field" type="email" placeholder="Enter your email"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="input-wrap">
          <input className="input-field" type={showPw ? 'text' : 'password'} placeholder="Enter your password"
            value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            style={{ paddingRight: 44 }} />
          <button type="button" className="input-eye" onClick={() => setShowPw(s => !s)}>
            <EyeIcon off={showPw} />
          </button>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <div style={styles.forgot}>
          <span style={styles.forgotText}>Forgot Password?</span>
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : 'Login'}
        </button>
      </form>

      <p style={styles.bottom}>
        Don't have an account?{' '}
        <span style={styles.link} onClick={() => navigate('/register')}>Register</span>
      </p>
    </div>
  );
}

const styles = {
  wrap: { minHeight: '100vh', padding: '28px 28px 40px', display: 'flex', flexDirection: 'column', gap: 24 },
  back: { width: 38, height: 38, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  iconWrap: { marginTop: 8 },
  h2: { fontSize: 28, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.3px' },
  form: { display: 'flex', flexDirection: 'column', flex: 1 },
  forgot: { textAlign: 'right', marginBottom: 20, marginTop: 4 },
  forgotText: { fontSize: 13, color: 'var(--text3)', cursor: 'pointer' },
  bottom: { textAlign: 'center', fontSize: 14, color: 'var(--text2)' },
  link: { color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 },
};
