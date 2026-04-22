import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddMember.css';

const API = 'http://localhost:5000';

/* Animated progress steps */
function FormProgress({ step, total }) {
  return (
    <div className="form-progress">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div className={`fp-step ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}>
            <div className="fp-circle">
              {i < step ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span className="fp-label">{['IDENTITY','ACADEMIC','EXTRAS'][i]}</span>
          </div>
          {i < total - 1 && <div className={`fp-line ${i < step ? 'filled' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function AddMember() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [step, setStep] = useState(0);
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
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const validateStep = (s) => {
    const errs = {};
    if (s === 0) {
      if (!form.name.trim()) errs.name = 'Required';
      if (!form.email.trim()) errs.email = 'Required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
      if (!form.role.trim()) errs.role = 'Required';
    }
    if (s === 1) {
      if (!form.roll.trim()) errs.roll = 'Required';
      if (!form.year.trim()) errs.year = 'Required';
      if (!form.degree.trim()) errs.degree = 'Required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => { if (validateStep(step)) setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      await axios.post(`${API}/members`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('// MEMBER_ADDED > SUCCESS');
      setTimeout(() => navigate('/view'), 1600);
    } catch (err) {
      showToast('// ERROR > ' + (err.response?.data?.error || 'FAILED'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-page page-enter">
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <div className="add-header">
        <span className="page-tag">// ADD_MEMBER.EXE</span>
        <h1 className="add-title">
          <span>NEW</span>
          <span className="neon-text">RECRUIT</span>
        </h1>
        <p className="add-desc">Initialize a new team member profile into the system database.</p>
      </div>

      <FormProgress step={step} total={3} />

      <div className="add-body">
        {/* Image panel */}
        <div className="img-upload-panel">
          <div className="img-upload-label hud-label">// PROFILE_IMAGE</div>
          <div className={`upload-zone panel panel-corners ${preview ? 'has-img' : ''}`}
            onClick={() => fileRef.current.click()}>
            {preview
              ? <img src={preview} alt="preview" className="up-preview" />
              : (
                <div className="up-placeholder">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>UPLOAD PHOTO</span>
                  <span className="up-sub">Click to browse</span>
                </div>
              )
            }
            <div className="up-scan-line" />
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImage} />
          </div>
          {preview && (
            <button className="btn btn-danger btn-sm" onClick={() => { setPreview(null); setImage(null); fileRef.current.value = ''; }}>
              ✕ CLEAR
            </button>
          )}
          {/* System info */}
          <div className="sys-info">
            <div className="si-row"><span>FORMAT</span><span>JPG / PNG / WEBP</span></div>
            <div className="si-row"><span>SIZE</span><span>MAX 5MB</span></div>
            <div className="si-row"><span>RATIO</span><span>1:1 PREFERRED</span></div>
          </div>
        </div>

        {/* Form steps */}
        <div className="form-steps">
          {/* Step 0 — Identity */}
          {step === 0 && (
            <div className="step-panel panel panel-corners" key="s0">
              <div className="step-header hud-label">// 01_IDENTITY</div>
              <div className="fields-grid">
                <Field label="FULL NAME" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Dharani S" error={errors.name} required />
                <Field label="ROLE / POSITION" name="role" value={form.role} onChange={handleChange} placeholder="e.g. Frontend Dev" error={errors.role} required />
                <Field label="EMAIL ADDRESS" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@srmist.edu.in" error={errors.email} required full />
              </div>
            </div>
          )}

          {/* Step 1 — Academic */}
          {step === 1 && (
            <div className="step-panel panel panel-corners" key="s1">
              <div className="step-header hud-label">// 02_ACADEMIC</div>
              <div className="fields-grid">
                <Field label="ROLL NUMBER" name="roll" value={form.roll} onChange={handleChange} placeholder="RA2011003010001" error={errors.roll} required />
                <Field label="YEAR" name="year" value={form.year} onChange={handleChange} placeholder="2024" error={errors.year} required />
                <Field label="DEGREE" name="degree" value={form.degree} onChange={handleChange} placeholder="B.Tech" error={errors.degree} required full />
              </div>
            </div>
          )}

          {/* Step 2 — Extras */}
          {step === 2 && (
            <div className="step-panel panel panel-corners" key="s2">
              <div className="step-header hud-label">// 03_EXTRAS</div>
              <div className="fields-grid">
                <Field label="PROJECT" name="project" value={form.project} onChange={handleChange} placeholder="e.g. E-com Website" />
                <Field label="CERTIFICATE" name="certificate" value={form.certificate} onChange={handleChange} placeholder="e.g. Fullstack" />
                <Field label="INTERNSHIP" name="internship" value={form.internship} onChange={handleChange} placeholder="e.g. Cloud Computing" />
                <Field label="HOBBIES" name="hobbies" value={form.hobbies} onChange={handleChange} placeholder="Reading, Gaming, ..." />
                <Field label="ABOUT / AIM" name="aboutAim" value={form.aboutAim} onChange={handleChange} placeholder="Your goals and ambitions..." textarea full />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="step-nav">
            {step > 0
              ? <button className="btn btn-ghost" onClick={prevStep}>← BACK</button>
              : <button className="btn btn-ghost" onClick={() => navigate('/')}>✕ CANCEL</button>
            }
            {step < 2
              ? <button className="btn btn-primary" onClick={nextStep}>NEXT →</button>
              : (
                <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                  {loading ? <><span className="spinner" /> UPLOADING...</> : '⊕ SUBMIT MEMBER'}
                </button>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, type = 'text', error, required, full, textarea }) {
  return (
    <div className={`field-group ${full ? 'full' : ''} ${error ? 'has-error' : ''}`}>
      <label className="field-label hud-label">
        {label}{required && <span className="req-dot" />}
      </label>
      {textarea
        ? <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} className="field-input" rows={3} />
        : <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className="field-input" />
      }
      {error && <span className="field-err">// ERR: {error}</span>}
    </div>
  );
}
