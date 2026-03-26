import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import api from '../utils/api';

const Row = ({ icon, label, onClick, danger }) => (
  <button onClick={onClick} style={{ ...styles.row, ...(danger ? styles.dangerRow : {}) }}>
    <span style={styles.rowIcon}>{icon}</span>
    <span style={{ ...styles.rowLabel, ...(danger ? { color:'var(--red)' } : {}) }}>{label}</span>
    {!danger && (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color:'var(--text3)' }}>
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    )}
  </button>
);

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: user?.username || '', age: user?.age || '' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const initials = user?.username?.charAt(0).toUpperCase() || 'U';

  const handleSave = async () => {
    setSaving(true); setErr('');
    try {
      await api.put('/user/profile', { username: form.username, age: Number(form.age) });
      await refreshUser();
      setEditing(false);
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page fade-up">
      <h2 style={styles.title}>Profile</h2>

      {/* Avatar */}
      <div style={styles.avatarWrap}>
        <div style={styles.avatar}>{initials}</div>
        {editing ? (
          <div style={styles.editForm}>
            <input className="input-field" placeholder="Username" value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))} style={{ marginBottom:8 }} />
            <input className="input-field" type="number" placeholder="Age" value={form.age}
              onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
            {err && <div className="error-msg">{err}</div>}
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <button className="btn btn-ghost" style={{ flex:1 }} onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex:1 }} onClick={handleSave} disabled={saving}>
                {saving ? <span className="spinner" /> : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 style={styles.name}>{user?.username}</h3>
            <p style={styles.email}>{user?.email}</p>
          </>
        )}
      </div>

      {/* Stats strip */}
      {!editing && (
        <div style={styles.statsStrip}>
          <div style={styles.statCell}>
            <span style={styles.statNum}>{user?.weight ?? '--'}</span>
            <span style={styles.statUnit}>Weight (kg)</span>
          </div>
          <div style={styles.statDiv} />
          <div style={styles.statCell}>
            <span style={styles.statNum}>{user?.height ?? '--'}</span>
            <span style={styles.statUnit}>Height (cm)</span>
          </div>
          <div style={styles.statDiv} />
          <div style={styles.statCell}>
            <span style={styles.statNum}>{user?.age ?? '--'}</span>
            <span style={styles.statUnit}>Age</span>
          </div>
        </div>
      )}

      {/* Menu */}
      {!editing && (
        <div className="card" style={{ padding:0, overflow:'hidden', marginTop:16 }}>
          <Row icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          } label="Edit Profile" onClick={() => setEditing(true)} />
          <div style={styles.menuDiv} />
          <Row icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          } label="Settings" onClick={() => {}} />
          <div style={styles.menuDiv} />
          <Row icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          } label="Progress" onClick={() => navigate('/stats')} />
          <div style={styles.menuDiv} />
          <Row icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          } label="Logout" onClick={handleLogout} danger />
        </div>
      )}

      <BottomNav />
    </div>
  );
}

const styles = {
  title: { fontSize:26, fontWeight:600, letterSpacing:'-0.3px', marginBottom:24 },
  avatarWrap: { display:'flex', flexDirection:'column', alignItems:'center', gap:8, marginBottom:20 },
  avatar: { width:68, height:68, borderRadius:'50%', background:'var(--accent)', color:'#0e0e12', fontSize:28, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' },
  name: { fontSize:20, fontWeight:600 },
  email: { fontSize:13, color:'var(--text3)' },
  editForm: { width:'100%', marginTop:12 },
  statsStrip: { display:'flex', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:14, padding:'14px 0' },
  statCell: { flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2 },
  statNum: { fontSize:20, fontWeight:600 },
  statUnit: { fontSize:11, color:'var(--text3)' },
  statDiv: { width:1, background:'var(--border)' },
  row: { display:'flex', alignItems:'center', gap:14, padding:'16px 18px', background:'none', color:'var(--text)', width:'100%', textAlign:'left', cursor:'pointer', transition:'background 0.15s' },
  dangerRow: {},
  rowIcon: { width:32, height:32, borderRadius:8, background:'var(--bg3)', color:'var(--text2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  rowLabel: { flex:1, fontSize:14, fontWeight:500 },
  menuDiv: { height:1, background:'var(--border)', marginInline:18 },
};
