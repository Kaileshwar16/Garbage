import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home',     path: '/home' },
  { label: 'Schedule', path: '/schedule' },
  { label: 'Stats',    path: '/stats' },
  { label: 'Profile',  path: '/profile' },
];

export default function TopNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const initials = user?.username?.charAt(0).toUpperCase() || 'U';

  return (
    <nav style={styles.nav}>
      <span style={styles.logo} onClick={() => navigate('/home')}>FitSync</span>
      <div style={styles.links}>
        {NAV_LINKS.map(({ label, path }) => (
          <button
            key={path}
            style={{ ...styles.link, ...(pathname === path ? styles.activeLink : {}) }}
            onClick={() => navigate(path)}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={styles.userArea} onClick={() => navigate('/profile')}>
        <div style={styles.userInfo}>
          <span style={styles.userName}>{user?.username}</span>
          <span style={styles.userRole}>Pro Member</span>
        </div>
        <div style={styles.avatar}>{initials}</div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 20px', height: 52, background: 'var(--bg2)',
    borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 90,
  },
  logo: { color: 'var(--accent)', fontWeight: 800, fontSize: 17, cursor: 'pointer', letterSpacing: '-0.3px' },
  links: { display: 'flex', gap: 4 },
  link: { background: 'none', color: 'var(--text3)', fontSize: 13, fontWeight: 500, padding: '6px 10px', borderRadius: 8, cursor: 'pointer', transition: 'color 0.15s' },
  activeLink: { color: 'var(--accent)', fontWeight: 600 },
  userArea: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' },
  userInfo: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  userName: { fontSize: 12, fontWeight: 600 },
  userRole: { fontSize: 10, color: 'var(--text3)' },
  avatar: { width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', color: '#0e0e12', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' },
};
