import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ViewMembers.css';

const API = 'http://localhost:5000';

function MemberCard({ member, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Remove ${member.name} from the team?`)) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/members/${member._id}`);
      onDelete(member._id);
    } catch { setDeleting(false); }
  };

  const imgSrc = member.image
    ? `${API}/uploads/${member.image}`
    : null;

  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      className={`member-card ${hovered ? 'hovered' : ''} ${deleting ? 'deleting' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="card-img-wrap">
        {imgSrc ? (
          <img src={imgSrc} alt={member.name} className="card-img" />
        ) : (
          <div className="card-initials">{initials}</div>
        )}
        <div className="card-overlay">
          <Link to={`/member/${member._id}`} className="overlay-btn">View Profile</Link>
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-name">{member.name}</h3>
        <span className="card-role">{member.role}</span>
        <span className="card-roll">Roll #{member.roll}</span>

        <div className="card-footer">
          <Link to={`/member/${member._id}`} className="card-link">
            View Details →
          </Link>
          <button className="card-delete" onClick={handleDelete} title="Remove member">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ViewMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    axios.get(`${API}/members`)
      .then(res => { setMembers(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const roles = ['All', ...new Set(members.map(m => m.role).filter(Boolean))];

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || m.role === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = id => setMembers(prev => prev.filter(m => m._id !== id));

  return (
    <div className="view-page page-enter">
      {/* Header */}
      <div className="view-header">
        <div>
          <span className="page-tag">/ TEAM ROSTER</span>
          <h1 className="page-title">
            Meet The<br /><span className="gold">Team</span>
          </h1>
        </div>
        <div className="member-count">
          <span className="count-num">{members.length}</span>
          <span className="count-label">Members</span>
        </div>
      </div>

      {/* Controls */}
      <div className="view-controls">
        <div className="search-wrap">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search members..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {roles.map(r => (
            <button
              key={r}
              className={`filter-tab ${filter === r ? 'active' : ''}`}
              onClick={() => setFilter(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="members-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="member-card skeleton">
              <div className="shimmer skeleton-img" />
              <div className="skeleton-body">
                <div className="shimmer skeleton-line w70" />
                <div className="shimmer skeleton-line w40" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No members found</h3>
          <p>{members.length === 0 ? 'Add your first team member to get started.' : 'Try adjusting your search or filter.'}</p>
          {members.length === 0 && <Link to="/add" className="btn btn-primary">Add First Member</Link>}
        </div>
      ) : (
        <div className="members-grid">
          {filtered.map((m, i) => (
            <div key={m._id} style={{ animationDelay: `${i * 0.07}s` }} className="card-wrapper">
              <MemberCard member={m} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
