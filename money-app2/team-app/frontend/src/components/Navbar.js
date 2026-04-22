import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Clock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="nav-clock">{time}</span>;
}

export default function Navbar() {
  const loc = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => setMenuOpen(false), [loc]);

  const links = [
    { path: '/',    label: 'HOME',        code: '//01' },
    { path: '/add', label: 'ADD MEMBER',  code: '//02' },
    { path: '/view',label: 'ROSTER',      code: '//03' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Left: brand */}
      <Link to="/" className="nav-brand">
        <div className="brand-icon">
          <span className="bi-inner" />
        </div>
        <div className="brand-text-wrap">
          <span className="brand-main">TEAM<span className="brand-blue">BLUE</span></span>
          <span className="brand-sub">SRM // 21CSS301T</span>
        </div>
      </Link>

      {/* Center: links */}
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {links.map(l => (
          <li key={l.path}>
            <Link to={l.path} className={`nav-link ${loc.pathname === l.path ? 'active' : ''}`}>
              <span className="nl-code">{l.code}</span>
              <span className="nl-label">{l.label}</span>
              <span className="nl-bar" />
            </Link>
          </li>
        ))}
      </ul>

      {/* Right: HUD info */}
      <div className="nav-hud">
        <Clock />
        <div className="hud-status">
          <span className="status-dot" />
          <span>ONLINE</span>
        </div>
      </div>

      <button className={`burger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(p => !p)}>
        <span /><span /><span />
      </button>
    </nav>
  );
}
