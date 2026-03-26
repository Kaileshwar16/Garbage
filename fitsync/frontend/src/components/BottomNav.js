import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/>
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);
const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 20V10M12 20V4M6 20v-6"/>
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const TABS = [
  { label: 'Home',     path: '/home',     Icon: HomeIcon },
  { label: 'Schedule', path: '/schedule', Icon: CalendarIcon },
  { label: 'Stats',    path: '/stats',    Icon: ChartIcon },
  { label: 'Profile',  path: '/profile',  Icon: UserIcon },
];

export default function BottomNav() {
  const navigate  = useNavigate();
  const { pathname } = useLocation();
  return (
    <nav className="bottom-nav">
      {TABS.map(({ label, path, Icon }) => (
        <button
          key={path}
          className={`nav-item ${pathname === path ? 'active' : ''}`}
          onClick={() => navigate(path)}
        >
          <Icon />
          {label}
        </button>
      ))}
    </nav>
  );
}
