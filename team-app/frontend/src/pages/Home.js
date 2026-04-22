import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const canvasRef = useRef(null);

  /* Particle field background */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let animId;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.5 + 0.1
    }));

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 200, 66, ${p.o})`;
        ctx.fill();
      });
      // Draw lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(245, 200, 66, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <div className="home">
      <canvas ref={canvasRef} className="home-canvas" />

      <div className="home-content page-enter">
        <div className="home-badge">SRM INSTITUTE · 21CSS301T</div>
        <h1 className="home-title">
          <span className="title-line">TEAM</span>
          <span className="title-line accent">BLUE</span>
        </h1>
        <p className="home-subtitle">
          Welcome to the BLUE Team Management System.<br />
          Add members, view profiles, and manage your squad.
        </p>

        <div className="home-cta">
          <Link to="/add" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Member
          </Link>
          <Link to="/view" className="btn btn-ghost">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            View Members
          </Link>
        </div>

        <div className="home-stats">
          <div className="stat-item">
            <span className="stat-num">Full</span>
            <span className="stat-label">Stack</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">React</span>
            <span className="stat-label">Frontend</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">Node</span>
            <span className="stat-label">Backend</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">Mongo</span>
            <span className="stat-label">Database</span>
          </div>
        </div>
      </div>

      <div className="scroll-hint">
        <span>Scroll</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </div>
  );
}
