import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/add', label: 'Add Member' },
    { path: '/view', label: 'View Team' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-brand">
        <span className="brand-dot" />
        <span className="brand-text">TEAM<span className="brand-accent">BLUE</span></span>
      </Link>

      <button className={`burger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <span /><span /><span />
      </button>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {navItems.map(item => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
              {location.pathname === item.path && <span className="nav-indicator" />}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
