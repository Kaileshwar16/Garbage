import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

/* ── Animated hex grid background ── */
function HexGrid() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let t = 0;
    let raf;

    const hexes = [];
    const SIZE = 32, COLS = Math.ceil(W / (SIZE * 1.73)) + 2, ROWS = Math.ceil(H / (SIZE * 1.5)) + 2;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = c * SIZE * 1.73 + (r % 2 === 0 ? 0 : SIZE * 0.865);
        const y = r * SIZE * 1.5;
        hexes.push({ x, y, phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.5 });
      }
    }

    function drawHex(x, y, s, alpha) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = Math.PI / 3 * i - Math.PI / 6;
        const px = x + s * Math.cos(a), py = y + s * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(0,200,255,${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      t += 0.005;
      hexes.forEach(h => {
        const wave = (Math.sin(t * h.speed + h.phase) + 1) / 2;
        const alpha = wave * 0.12 + 0.02;
        drawHex(h.x, h.y, SIZE - 2, alpha);
        if (wave > 0.9) {
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = Math.PI / 3 * i - Math.PI / 6;
            ctx.lineTo(h.x + (SIZE - 4) * Math.cos(a), h.y + (SIZE - 4) * Math.sin(a));
          }
          ctx.closePath();
          ctx.fillStyle = `rgba(0,200,255,${(wave - 0.9) * 0.3})`;
          ctx.fill();
        }
      });
      raf = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} className="hex-canvas" />;
}

/* ── Typewriter ── */
function Typewriter({ texts, speed = 80 }) {
  const [display, setDisplay] = useState('');
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[idx];
    let timeout;
    if (!deleting && charIdx <= current.length) {
      timeout = setTimeout(() => { setDisplay(current.slice(0, charIdx)); setCharIdx(c => c + 1); }, speed);
    } else if (!deleting && charIdx > current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => { setDisplay(current.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }, speed / 2);
    } else {
      setDeleting(false);
      setIdx(i => (i + 1) % texts.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, texts, speed]);

  return (
    <span className="typewriter">
      {display}<span className="tw-cursor">_</span>
    </span>
  );
}

/* ── Floating data cards ── */
function FloatingStats() {
  const stats = [
    { label: 'STACK',      value: 'FULL' },
    { label: 'FRAMEWORK',  value: 'REACT' },
    { label: 'DATABASE',   value: 'MONGO' },
    { label: 'RUNTIME',    value: 'NODE' },
  ];
  return (
    <div className="floating-stats">
      {stats.map((s, i) => (
        <div key={i} className="fstat" style={{ animationDelay: `${i * 0.15 + 0.8}s` }}>
          <span className="fstat-val">{s.value}</span>
          <span className="fstat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="home">
      <HexGrid />

      {/* Glowing orbs */}
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />

      {/* Main content */}
      <div className="home-content">
        <div className="home-eyebrow">
          <span className="eyebrow-line" />
          <span className="hud-label">SRM INSTITUTE // FULL STACK DEVELOPMENT // 21CSS301T</span>
          <span className="eyebrow-line" />
        </div>

        <h1 className="home-title">
          <span className="ht-sub glitch">TEAM</span>
          <span className="ht-main neon-text">BLUE</span>
        </h1>

        <p className="home-tagline">
          <Typewriter texts={[
            'Building the future, one commit at a time.',
            'React + Node.js + MongoDB.',
            'Full stack. Full power.',
            'Team Management System v2.0.',
          ]} />
        </p>

        <div className="home-actions stagger">
          <Link to="/add" className="btn btn-primary home-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            ADD MEMBER
          </Link>
          <Link to="/view" className="btn btn-ghost home-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            VIEW ROSTER
          </Link>
        </div>

        <FloatingStats />
      </div>

      {/* Corner HUD decorations */}
      <div className="hud-corner hud-tl">
        <div className="hud-bracket" />
        <span className="hud-label">SYS:ACTIVE</span>
      </div>
      <div className="hud-corner hud-br">
        <span className="hud-label">VER 2.0.0</span>
        <div className="hud-bracket flip" />
      </div>

      {/* Scrolling data strip */}
      <div className="data-strip">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className="ds-inner">
            TEAM_BLUE &nbsp;·&nbsp; MEMBER_MANAGEMENT &nbsp;·&nbsp; SRM_INSTITUTE &nbsp;·&nbsp; 21CSS301T &nbsp;·&nbsp; REACT &nbsp;·&nbsp; NODE &nbsp;·&nbsp; MONGODB &nbsp;·&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
}
