import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ViewMembers.css';

const API = 'http://localhost:5000';

/* 3D magnetic tilt card */
function TiltCard({ member, onDelete }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, o: 0 });
  const [deleting, setDeleting] = useState(false);

  const handleMouseMove = e => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -12, y: dx * 12 });
    setGlare({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100, o: 0.15 });
  };
  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare(g => ({ ...g, o: 0 }));
  };

  const handleDelete = async e => {
    e.preventDefault(); e.stopPropagation();
    if (!window.confirm(`Purge ${member.name} from system?`)) return;
    setDeleting(true);
    try { await axios.delete(`${API}/members/${member._id}`); onDelete(member._id); }
    catch { setDeleting(false); }
  };

  const imgSrc = member.image ? `${API}/uploads/${member.image}` : null;
  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${deleting ? 'purging' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
    >
      {/* Glare */}
      <div className="card-glare" style={{
        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(0,200,255,${glare.o}), transparent 60%)`,
      }} />

      {/* Holographic border */}
      <div className="card-holo-border" />

      {/* Image */}
      <div className="tc-img-wrap">
        {imgSrc
          ? <img src={imgSrc} alt={member.name} className="tc-img" />
          : <div className="tc-initials">{initials}</div>
        }
        <div className="tc-img-overlay" />
        {/* Scan line on hover */}
        <div className="tc-scan" />
      </div>

      {/* Info */}
      <div className="tc-body">
        <div className="tc-id hud-label">ID: {member._id?.slice(-6).toUpperCase()}</div>
        <h3 className="tc-name">{member.name}</h3>
        <div className="tc-role">{member.role}</div>
        <div className="tc-roll">ROLL {member.roll}</div>

        <div className="tc-footer">
          <Link to={`/member/${member._id}`} className="tc-view-btn">
            PROFILE <span>→</span>
          </Link>
          <button className="tc-del" onClick={handleDelete} title="Delete member">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Corner decoration */}
      <div className="tc-corner tc-tl" />
      <div className="tc-corner tc-br" />
    </div>
  );
}

export default function ViewMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [view, setView] = useState('grid'); // grid | list

  useEffect(() => {
    axios.get(`${API}/members`)
      .then(r => { setMembers(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const roles = ['ALL', ...new Set(members.map(m => m.role).filter(Boolean))];
  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    return (m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)) &&
      (filter === 'ALL' || m.role === filter);
  });

  const onDelete = id => setMembers(p => p.filter(m => m._id !== id));

  return (
    <div className="view-page page-enter">
      {/* Header */}
      <div className="view-header">
        <div className="vh-left">
          <span className="page-tag">// ROSTER.DB</span>
          <h1 className="view-title">TEAM <span className="neon-text">ROSTER</span></h1>
        </div>
        <div className="vh-right">
          <div className="big-count">
            <span className="bc-num">{String(members.length).padStart(2, '0')}</span>
            <span className="bc-label">MEMBERS</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="view-controls">
        <div className="search-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sb-icon">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="sb-input"
            type="text"
            placeholder="SEARCH_MEMBER..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="sb-clear" onClick={() => setSearch('')}>✕</button>}
        </div>

        <div className="role-filters">
          {roles.map(r => (
            <button key={r} className={`rf-btn ${filter === r ? 'active' : ''}`} onClick={() => setFilter(r)}>{r}</button>
          ))}
        </div>

        <div className="view-toggles">
          <button className={`vt-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </button>
          <button className={`vt-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Count bar */}
      <div className="results-bar hud-label">
        SHOWING {filtered.length} OF {members.length} RECORDS
        <div className="rb-line"><div className="rb-fill" style={{ width: `${members.length > 0 ? (filtered.length / members.length * 100) : 0}%` }} /></div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className={`members-${view}`}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="tilt-card skeleton">
              <div className="shimmer" style={{ height: 200 }} />
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="shimmer" style={{ height: 12, width: '60%', borderRadius: 4 }} />
                <div className="shimmer" style={{ height: 10, width: '40%', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="es-code hud-label">// 404_NOT_FOUND</div>
          <h3 className="es-title">NO RECORDS</h3>
          <p className="es-desc">{members.length === 0 ? 'Database is empty. Initialize the first member.' : 'Query returned 0 results.'}</p>
          {members.length === 0 && <Link to="/add" className="btn btn-primary">⊕ INIT FIRST MEMBER</Link>}
        </div>
      ) : view === 'grid' ? (
        <div className="members-grid">
          {filtered.map((m, i) => (
            <div key={m._id} className="card-anim-wrap" style={{ animationDelay: `${i * 0.06}s` }}>
              <TiltCard member={m} onDelete={onDelete} />
            </div>
          ))}
        </div>
      ) : (
        <div className="members-list">
          {filtered.map((m, i) => {
            const imgSrc = m.image ? `${API}/uploads/${m.image}` : null;
            const initials = m.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div key={m._id} className="list-row" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="lr-img">
                  {imgSrc ? <img src={imgSrc} alt={m.name} /> : <span>{initials}</span>}
                </div>
                <span className="lr-id hud-label">{m._id?.slice(-6).toUpperCase()}</span>
                <span className="lr-name">{m.name}</span>
                <span className="lr-role">{m.role}</span>
                <span className="lr-roll hud-label">{m.roll}</span>
                <div className="lr-actions">
                  <Link to={`/member/${m._id}`} className="btn btn-ghost btn-sm">VIEW</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => {
                    if (window.confirm(`Purge ${m.name}?`))
                      axios.delete(`${API}/members/${m._id}`).then(() => onDelete(m._id));
                  }}>DEL</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
