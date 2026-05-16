import React from 'react';
import {
  INTENT_OPTIONS,
  SEGMENT_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  BHK_OPTIONS,
  POSSESSION_OPTIONS,
  AGE_OPTIONS,
  FURNISHING_OPTIONS,
  FACING_OPTIONS,
  PARKING_OPTIONS,
  AMENITIES_OPTIONS,
} from '../constants/filterOptions';

const FONT = 'Inter, -apple-system, sans-serif';

/* ── Shared style helpers ────────────────────────────────── */
const labelStyle = {
  display: 'block',
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.1em',
  color: '#94a3b8',
  marginBottom: 7,
  fontFamily: FONT,
};

const inputStyle = {
  width: '100%',
  background: '#f8fafc',
  border: '1.5px solid #e2e8f0',
  borderRadius: 10,
  padding: '12px 14px',
  fontFamily: FONT,
  fontSize: 14,
  fontWeight: 500,
  color: '#0f172a',
  outline: 'none',
  transition: 'border-color .15s, box-shadow .15s, background .15s',
  boxSizing: 'border-box',
};

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2394a3b8' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: 38,
  appearance: 'none',
  WebkitAppearance: 'none',
};

const sectionStyle = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  padding: '28px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
};

const sectionTitleStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  fontSize: 17,
  fontWeight: 800,
  color: '#0f172a',
  margin: 0,
  letterSpacing: '-.02em',
};

const sectionNumStyle = {
  width: 30,
  height: 30,
  borderRadius: 8,
  background: '#eff6ff',
  border: '1.5px solid #dbeafe',
  color: '#2563eb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 13,
  fontWeight: 900,
  flexShrink: 0,
};

const grid2 = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
};

const onFocus = (e) => {
  e.target.style.borderColor = '#2563eb';
  e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,.1)';
  e.target.style.background = '#fff';
};
const onBlur = (e) => {
  e.target.style.borderColor = '#e2e8f0';
  e.target.style.boxShadow = 'none';
  e.target.style.background = '#f8fafc';
};

function Field({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function PropertyForm({ form, onSubmit, currentStep, setCurrentStep, totalSteps }) {
  const { values, setField, toggleAmenity, onFiles, loading, error, preview } = form;

  const handleSegmentChange = (e) => {
    const seg = e.target.value;
    setField('category', seg);
    setField('filters.segment', seg);
    const types = PROPERTY_TYPE_OPTIONS[seg] || [];
    if (types.length > 0) {
      setField('propertyType', types[0].value);
      setField('filters.propertyType', types[0].value);
    }
  };

  const showBhk = values.category === 'RESIDENTIAL';

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data"
      style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 100, fontFamily: FONT }}>

      {/* ── STEP 0: Basic Information ──────────────────────── */}
      {currentStep === 0 && (
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            <span style={sectionNumStyle}>1</span>
            Basic Information
          </h2>

          <Field label="Property Title">
            <input
              style={inputStyle}
              placeholder="e.g. Modern 3BHK Apartment with Sea View"
              value={values.title}
              onChange={e => setField('title', e.target.value)}
              onFocus={onFocus} onBlur={onBlur}
              required
            />
          </Field>

          <div style={grid2} className="re-form-grid">
            <Field label="Listing Intent">
              <select style={selectStyle} value={values.filters.intent} onChange={e => setField('filters.intent', e.target.value)} onFocus={onFocus} onBlur={onBlur}>
                {INTENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Segment">
              <select style={selectStyle} value={values.category} onChange={handleSegmentChange} onFocus={onFocus} onBlur={onBlur}>
                {SEGMENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Property Type">
              <select style={selectStyle} value={values.propertyType}
                onChange={e => { setField('propertyType', e.target.value); setField('filters.propertyType', e.target.value); }}
                onFocus={onFocus} onBlur={onBlur}>
                {(PROPERTY_TYPE_OPTIONS[values.category] || []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Price (₹)">
              <input style={inputStyle} type="number" placeholder="Enter amount"
                value={values.price.amount} onChange={e => setField('price.amount', e.target.value)}
                onFocus={onFocus} onBlur={onBlur} required />
            </Field>
            <Field label="Super Built-up Area (sqft)">
              <input style={inputStyle} type="number" placeholder="e.g. 1200"
                value={values.areaSqFt || ''} onChange={e => setField('areaSqFt', e.target.value)}
                onFocus={onFocus} onBlur={onBlur} />
            </Field>
            <Field label="Posted By">
              <select style={selectStyle} value={values.filters?.postedBy || 'OWNER'} onChange={e => setField('filters.postedBy', e.target.value)} onFocus={onFocus} onBlur={onBlur}>
                <option value="OWNER">Owner</option>
                <option value="BUILDER">Builder</option>
                <option value="AGENT">Agent</option>
              </select>
            </Field>
          </div>
        </div>
      )}

      {/* ── STEP 1: Property Details & Location ───────────────── */}
      {currentStep === 1 && (
        <>
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              <span style={sectionNumStyle}>2</span>
              Property Details
            </h2>
            <div style={grid2} className="re-form-grid">
              {showBhk && (
                <Field label="BHK Type">
                  <select style={selectStyle} value={values.filters.bhk} onChange={e => setField('filters.bhk', e.target.value)} onFocus={onFocus} onBlur={onBlur}>
                    {BHK_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </Field>
              )}
              <Field label="Possession Status">
                <select style={selectStyle} value={values.filters.possession} onChange={e => setField('filters.possession', e.target.value)} onFocus={onFocus} onBlur={onBlur}>
                  {POSSESSION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
              <Field label="Age of Property">
                <select style={selectStyle} value={values.filters.age || ''} onChange={e => setField('filters.age', e.target.value)} onFocus={onFocus} onBlur={onBlur}>
                  {AGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
              <Field label="Furnishing">
                <select style={selectStyle} value={values.filters.furnishing} onChange={e => setField('filters.furnishing', e.target.value)} onFocus={onFocus} onBlur={onBlur}>
                  {FURNISHING_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
              <Field label="Facing">
                <select style={selectStyle} value={values.filters.facing || ''} onChange={e => setField('filters.facing', e.target.value)} onFocus={onFocus} onBlur={onBlur}>
                  {FACING_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
              <Field label="Parking">
                <select style={selectStyle} value={values.filters.parking || ''} onChange={e => setField('filters.parking', e.target.value)} onFocus={onFocus} onBlur={onBlur}>
                  {PARKING_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
            </div>
          </div>

          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              <span style={sectionNumStyle}>3</span>
              Location
            </h2>
            <div style={grid2} className="re-form-grid">
              <Field label="Locality / Area">
                <input style={inputStyle} placeholder="e.g. Bandra West"
                  value={values.locality} onChange={e => setField('locality', e.target.value)}
                  onFocus={onFocus} onBlur={onBlur} required />
              </Field>
              <Field label="City">
                <input style={inputStyle} placeholder="e.g. Mumbai"
                  value={values.city} onChange={e => setField('city', e.target.value)}
                  onFocus={onFocus} onBlur={onBlur} required />
              </Field>
            </div>
            <Field label="Society / Builder Name (optional)">
              <input style={inputStyle} placeholder="e.g. Lodha Palava"
                value={values.builder || ''} onChange={e => setField('builder', e.target.value)}
                onFocus={onFocus} onBlur={onBlur} />
            </Field>
            <Field label="Description">
              <textarea
                style={{ ...inputStyle, minHeight: 100, resize: 'vertical', lineHeight: 1.6 }}
                placeholder="Describe the property — highlights, connectivity, nearby landmarks…"
                value={values.description || ''} onChange={e => setField('description', e.target.value)}
                onFocus={onFocus} onBlur={onBlur}
              />
            </Field>
          </div>
        </>
      )}

      {/* ── STEP 2: Photos ─────────────────────────────────── */}
      {currentStep === 2 && (
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            <span style={sectionNumStyle}>4</span>
            Photos
          </h2>
          <div style={{
            border: '2px dashed #e2e8f0', borderRadius: 14,
            padding: '40px 20px', textAlign: 'center',
            background: '#f8fafc', cursor: 'pointer', transition: 'all .15s',
          }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.background = '#eff6ff'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
          >
            <input type="file" multiple accept="image/*" onChange={e => onFiles(e.target.files)} style={{ display: 'none' }} id="re-file-upload" />
            <label htmlFor="re-file-upload" style={{ cursor: 'pointer', display: 'block' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📸</div>
              <p style={{ fontWeight: 700, color: '#334155', fontSize: 14, margin: '0 0 4px' }}>Click to upload property images</p>
              <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>PNG, JPG, WEBP — up to 10MB each</p>
            </label>
          </div>
          {preview?.imageCount > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: 10, padding: '10px 14px',
            }}>
              <span style={{ color: '#16a34a', fontSize: 16 }}>✓</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#15803d' }}>{preview.imageCount} image{preview.imageCount > 1 ? 's' : ''} selected and ready</span>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 3: Amenities ─────────────────────────────── */}
      {currentStep === 3 && (
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            <span style={sectionNumStyle}>5</span>
            Amenities
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {AMENITIES_OPTIONS.map(o => {
              const active = values.filters.amenities?.includes(o.value);
              return (
                <button key={o.value} type="button" onClick={() => toggleAmenity(o.value)}
                  style={{
                    padding: '8px 16px', borderRadius: 30, border: `1.5px solid ${active ? '#2563eb' : '#e2e8f0'}`,
                    background: active ? '#eff6ff' : '#fff',
                    color: active ? '#2563eb' : '#475569',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    fontFamily: FONT, transition: 'all .15s',
                    boxShadow: active ? '0 2px 8px rgba(37,99,235,.12)' : 'none',
                  }}
                  onMouseOver={e => { if (!active) { e.currentTarget.style.borderColor = '#bfdbfe'; e.currentTarget.style.color = '#2563eb'; } }}
                  onMouseOut={e => { if (!active) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; } }}
                >{o.label}</button>
              );
            })}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 12,
          padding: '14px 18px', color: '#991b1b', fontSize: 13, fontWeight: 600,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Sticky Submit Bar ─────────────────────────── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: '#fff', borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -4px 24px rgba(0,0,0,.08)',
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <div style={{ width: '100%', maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <button type="button" onClick={prevStep} disabled={currentStep === 0} style={{
            background: '#fff', color: currentStep === 0 ? '#cbd5e1' : '#64748b', 
            border: `1.5px solid ${currentStep === 0 ? '#e2e8f0' : '#cbd5e1'}`,
            padding: '11px 24px', borderRadius: 12, fontFamily: FONT, fontWeight: 700, fontSize: 14,
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer', transition: 'all .15s',
            visibility: currentStep === 0 ? 'hidden' : 'visible'
          }}
            onMouseOver={e => { if (currentStep > 0) { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.color = '#334155'; } }}
            onMouseOut={e => { if (currentStep > 0) { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#64748b'; } }}
          >
            ← Back
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>
              Step {currentStep + 1} of {totalSteps}
            </span>

            {currentStep < totalSteps - 1 ? (
              <button type="button" onClick={nextStep} style={{
                background: '#2563eb', color: '#fff', border: 'none', 
                padding: '12px 32px', borderRadius: 12, fontFamily: FONT, fontWeight: 700, fontSize: 14,
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,.2)', transition: 'all .15s',
              }}
                onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
                onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
              >
                Next →
              </button>
            ) : (
              <button type="submit" disabled={loading} style={{
                background: loading ? '#94a3b8' : '#10b981',
                color: '#fff', border: 'none', padding: '12px 32px',
                borderRadius: 12, fontFamily: FONT, fontWeight: 700, fontSize: 14,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(16,185,129,.3)',
                transition: 'all .15s', minWidth: 200,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
                onMouseOver={e => { if (!loading) e.currentTarget.style.background = '#059669'; }}
                onMouseOut={e => { if (!loading) e.currentTarget.style.background = '#10b981'; }}
              >
                {loading
                  ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 're-spin .7s linear infinite' }} /> Publishing…</>
                  : '🚀 Post Property'
                }
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes re-spin{to{transform:rotate(360deg)}}
        @media(max-width:640px){.re-form-grid{grid-template-columns:1fr !important}}
      `}</style>
    </form>
  );
}
