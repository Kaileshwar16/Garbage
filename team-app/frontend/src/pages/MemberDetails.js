import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './MemberDetails.css';

const API = 'http://localhost:5000';

function InfoChip({ label, value }) {
  if (!value) return null;
  return (
    <div className="info-chip">
      <span className="chip-label">{label}</span>
      <span className="chip-value">{value}</span>
    </div>
  );
}

export default function MemberDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API}/members/${id}`)
      .then(res => { setMember(res.data); setLoading(false); })
      .catch(err => { setError(err.response?.data?.error || 'Member not found'); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="detail-page page-enter">
        <div className="detail-skeleton">
          <div className="shimmer ds-img" />
          <div className="ds-content">
            <div className="shimmer ds-line w60" />
            <div className="shimmer ds-line w40" />
            <div className="shimmer ds-line w80" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-page page-enter">
        <div className="detail-error">
          <span>404</span>
          <h2>{error}</h2>
          <Link to="/view" className="btn btn-ghost">← Back to Team</Link>
        </div>
      </div>
    );
  }

  const imgSrc = member.image ? `${API}/uploads/${member.image}` : null;
  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const hobbies = member.hobbies ? member.hobbies.split(',').map(h => h.trim()).filter(Boolean) : [];

  return (
    <div className="detail-page page-enter">
      {/* Back */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back
      </button>

      <div className="detail-layout">
        {/* Left: Image + Identity */}
        <div className="detail-left">
          <div className="detail-img-wrap">
            {imgSrc ? (
              <img src={imgSrc} alt={member.name} className="detail-img" />
            ) : (
              <div className="detail-initials">{initials}</div>
            )}
            <div className="detail-img-glow" />
          </div>

          <div className="detail-identity">
            <h1 className="detail-name">{member.name}</h1>
            <div className="detail-role-badge">{member.role}</div>
            <p className="detail-meta">{member.degree} · {member.year}</p>
          </div>

          <div className="detail-contact">
            <a href={`mailto:${member.email}`} className="contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              {member.email}
            </a>
            <div className="contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="2"/>
                <path d="M9 9h6M9 12h6M9 15h4"/>
              </svg>
              Roll #{member.roll}
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="detail-right">
          <div className="detail-section">
            <h2 className="section-title">
              <span className="section-line" />
              Academic Info
            </h2>
            <div className="info-grid">
              <InfoChip label="Degree"   value={member.degree} />
              <InfoChip label="Year"     value={member.year} />
              <InfoChip label="Roll No." value={member.roll} />
            </div>
          </div>

          {(member.project || member.certificate || member.internship) && (
            <div className="detail-section">
              <h2 className="section-title">
                <span className="section-line" />
                Experience
              </h2>
              <div className="info-grid">
                <InfoChip label="Project"     value={member.project} />
                <InfoChip label="Certificate" value={member.certificate} />
                <InfoChip label="Internship"  value={member.internship} />
              </div>
            </div>
          )}

          {member.aboutAim && (
            <div className="detail-section">
              <h2 className="section-title">
                <span className="section-line" />
                About & Aim
              </h2>
              <p className="detail-paragraph">{member.aboutAim}</p>
            </div>
          )}

          {hobbies.length > 0 && (
            <div className="detail-section">
              <h2 className="section-title">
                <span className="section-line" />
                Hobbies
              </h2>
              <div className="hobbies-wrap">
                {hobbies.map((h, i) => (
                  <span key={i} className="hobby-tag">{h}</span>
                ))}
              </div>
            </div>
          )}

          <div className="detail-actions">
            <Link to="/view" className="btn btn-ghost">← All Members</Link>
            <Link to="/add" className="btn btn-primary">+ Add Member</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
