import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddMember.css';

const API = 'http://localhost:5000';

export default function AddMember() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: '', roll: '', year: '', degree: '', email: '', role: '',
    project: '', hobbies: '', certificate: '', internship: '', aboutAim: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const required = ['name', 'roll', 'year', 'degree', 'email', 'role'];
    const errs = {};
    required.forEach(k => { if (!form[k].trim()) errs[k] = 'Required'; });
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      await axios.post(`${API}/members`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('Member added successfully! 🎉');
      setTimeout(() => navigate('/view'), 1500);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to add member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Full Name',    name: 'name',        type: 'text',  placeholder: 'e.g. Dharani S', required: true },
    { label: 'Roll Number',  name: 'roll',        type: 'text',  placeholder: 'e.g. RA2011003010001', required: true },
    { label: 'Year',         name: 'year',        type: 'text',  placeholder: 'e.g. 2024', required: true },
    { label: 'Degree',       name: 'degree',      type: 'text',  placeholder: 'e.g. B.Tech', required: true },
    { label: 'Email',        name: 'email',       type: 'email', placeholder: 'you@example.com', required: true },
    { label: 'Role',         name: 'role',        type: 'text',  placeholder: 'e.g. Frontend Dev', required: true },
    { label: 'Project',      name: 'project',     type: 'text',  placeholder: 'e.g. e-com website' },
    { label: 'Certificate',  name: 'certificate', type: 'text',  placeholder: 'e.g. Fullstack' },
    { label: 'Internship',   name: 'internship',  type: 'text',  placeholder: 'e.g. Cloud Computing' },
  ];

  return (
    <div className="add-page page-enter">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}

      <div className="add-header">
        <span className="page-tag">/ ADD MEMBER</span>
        <h1 className="page-title">New Team<br /><span className="gold">Member</span></h1>
        <p className="page-desc">Fill in the details below to add a new member to your team roster.</p>
      </div>

      <div className="add-layout">
        {/* Image Upload Panel */}
        <div className="upload-panel">
          <div
            className={`upload-zone ${preview ? 'has-preview' : ''}`}
            onClick={() => fileRef.current.click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="upload-preview" />
            ) : (
              <div className="upload-placeholder">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>Upload Photo</span>
                <span className="upload-hint">Click to browse</span>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImage}
            />
          </div>
          {preview && (
            <button
              type="button"
              className="remove-img"
              onClick={() => { setPreview(null); setImage(null); fileRef.current.value = ''; }}
            >
              ✕ Remove photo
            </button>
          )}
          <div className="upload-tips">
            <p>Accepted: JPG, PNG, WEBP</p>
            <p>Recommended: Square, min 300×300px</p>
          </div>
        </div>

        {/* Form */}
        <form className="add-form" onSubmit={handleSubmit} noValidate>
          <div className="fields-grid">
            {fields.map(f => (
              <div key={f.name} className={`field-group ${errors[f.name] ? 'has-error' : ''}`}>
                <label className="field-label">
                  {f.label} {f.required && <span className="req">*</span>}
                </label>
                <input
                  type={f.type}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  className="field-input"
                />
                {errors[f.name] && <span className="field-error">{errors[f.name]}</span>}
              </div>
            ))}

            <div className="field-group full-span">
              <label className="field-label">Hobbies <span className="muted-label">(comma separated)</span></label>
              <input type="text" name="hobbies" value={form.hobbies} onChange={handleChange}
                placeholder="e.g. Reading, Gaming, Cooking" className="field-input" />
            </div>

            <div className="field-group full-span">
              <label className="field-label">About Your Aim</label>
              <textarea name="aboutAim" value={form.aboutAim} onChange={handleChange}
                placeholder="Describe your goals and aspirations..."
                className="field-input field-textarea" rows={3} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <><span className="spinner" /> Saving...</>
              ) : (
                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Add Member</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
