import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './MemberDetails.css';

const API = 'http://localhost:5000';

function DataRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="data-row">
      <span className="dr-label hud-label">{label}</span>
      <span className="dr-bar" />
      <span className="dr-value">{value}</span>
    </div>
  );
}

function AnimatedBar({ delay = 0 }) {
  return <div className="anim-bar" style={{ animationDelay: `${delay}s` }} />;
}

export default function MemberDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    axios.get(`${API}/members/${id}`)
      .then(r => { setMember(r.data); setLoading(false); })
      .catch(e => { setError(e.response?.data?.error || 'Not found'); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="det-page page-enter">
      <div className="det-loading">
        <div className="dl-bars">
          {[...Array(5)].map((_, i) => <AnimatedBar key={i} delay={i * 0.1} />)}
        </div>
        <span className="hud-label">// FETCHING_RECORD...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="det-page page-enter">
      <div className="det-error">
        <span className="de-code neon-text">404</span>
        <p className="hud-label">// RECORD_NOT_FOUND</p>
        <Link to="/view" className="btn btn-ghost">← BACK TO ROSTER</Link>
      </div>
    </div>
  );

  const imgSrc = member.image ? `${API}/uploads/${member.image}` : null;
  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const hobbies = member.hobbies ? member.hobbies.split(',').map(h => h.trim()).filter(Boolean) : [];

  return (
    <div className="det-page page-enter">
      {/* Back */}
      <div className="det-nav">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          BACK
        </button>
        <span className="hud-label">// MEMBER_PROFILE / {member._id?.slice(-8).toUpperCase()}</span>
      </div>

      <div className="det-layout">
        {/* ── LEFT COLUMN ── */}
        <div className="det-left">
          {/* Profile image */}
          <div className="det-img-card panel panel-corners">
            <div className={`det-img-wrap ${imgLoaded ? 'loaded' : ''}`}>
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={member.name}
                  className="det-img"
                  onLoad={() => setImgLoaded(true)}
                />
              ) : (
                <div className="det-initials">{initials}</div>
              )}
              {/* Holographic overlay */}
              <div className="det-img-holo" />
              {/* Corner brackets */}
              <div className="img-corner img-tl" />
              <div className="img-corner img-tr" />
              <div className="img-corner img-bl" />
              <div className="img-corner img-br" />
            </div>

            {/* Animated scan over image */}
            <div className="img-scan" />

            <div className="det-identity">
              <h1 className="det-name">{member.name}</h1>
              <div className="det-role-tag">{member.role}</div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="quick-stats panel">
            <div className="qs-row">
              <span className="hud-label">DEGREE</span>
              <span>{member.degree}</span>
            </div>
            <div className="qs-row">
              <span className="hud-label">YEAR</span>
              <span>{member.year}</span>
            </div>
            <div className="qs-row">
              <span className="hud-label">ROLL</span>
              <span className="qs-val-mono">{member.roll}</span>
            </div>
            <div className="qs-row">
              <span className="hud-label">EMAIL</span>
              <a href={`mailto:${member.email}`} className="qs-email">{member.email}</a>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="det-right">
          {/* Section: Experience */}
          {(member.project || member.certificate || member.internship) && (
            <div className="det-section panel">
              <div className="ds-header">
                <span className="ds-line" />
                <span className="hud-label">// EXPERIENCE</span>
              </div>
              <div className="data-rows">
                <DataRow label="PROJECT"     value={member.project} />
                <DataRow label="CERTIFICATE" value={member.certificate} />
                <DataRow label="INTERNSHIP"  value={member.internship} />
              </div>
            </div>
          )}

          {/* Section: About */}
          {member.aboutAim && (
            <div className="det-section panel">
              <div className="ds-header">
                <span className="ds-line" />
                <span className="hud-label">// ABOUT & AIM</span>
              </div>
              <p className="det-bio">{member.aboutAim}</p>
            </div>
          )}

          {/* Section: Hobbies */}
          {hobbies.length > 0 && (
            <div className="det-section panel">
              <div className="ds-header">
                <span className="ds-line" />
                <span className="hud-label">// INTERESTS</span>
              </div>
              <div className="hobbies-grid">
                {hobbies.map((h, i) => (
                  <div key={i} className="hobby-chip" style={{ animationDelay: `${i * 0.06}s` }}>
                    <span className="hc-dot" />
                    {h}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: System info */}
          <div className="det-section panel det-sys-info">
            <div className="ds-header">
              <span className="ds-line" />
              <span className="hud-label">// SYSTEM_INFO</span>
            </div>
            <div className="data-rows">
              <DataRow label="RECORD_ID" value={member._id} />
              <DataRow label="CREATED"   value={new Date(member.createdAt).toLocaleString()} />
            </div>
          </div>

          {/* Actions */}
          <div className="det-actions">
            <Link to="/view" className="btn btn-ghost">← ROSTER</Link>
            <Link to="/add"  className="btn btn-primary">⊕ ADD MEMBER</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
