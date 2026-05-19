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
  POSTED_BY_OPTIONS,
} from '../constants/filterOptions';
import CustomSelect from './CustomSelect';
import { listCities } from '../services/propertiesApi';
import { getUserRole } from '../utils/access';

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
  const [locationLookupState, setLocationLookupState] = React.useState({ loading: false, message: '' });
  const [cityOptions, setCityOptions] = React.useState([]);
  const [showCityDropdown, setShowCityDropdown] = React.useState(false);

  React.useEffect(() => {
    listCities().then(setCityOptions).catch(console.error);
    
    // Auto-select Posted By based on user role and skip manual input field
    try {
      const userRole = getUserRole();
      let mappedPostedBy = 'OWNER';
      if (userRole === 'AGENT') mappedPostedBy = 'AGENT';
      else if (userRole === 'BUILDER') mappedPostedBy = 'BUILDER';
      setField('filters.postedBy', mappedPostedBy);
    } catch (e) {
      console.error('Error auto-selecting user role:', e);
    }
  }, []);

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

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationLookupState({ loading: false, message: 'Location access is not supported in this browser.' });
      return;
    }

    setLocationLookupState({ loading: true, message: '' });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        setField('locationUrl', mapsUrl);
        setField('locationCoordinates', { lat: latitude, lng: longitude });
        setLocationLookupState({ loading: false, message: 'Current location added to the map link field.' });
      },
      () => {
        setLocationLookupState({ loading: false, message: 'Unable to read your location. Check browser permissions and try again.' });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
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
              <CustomSelect value={values.filters.intent} onChange={e => setField('filters.intent', e.target.value)} options={INTENT_OPTIONS} />
            </Field>
            <Field label="Segment">
              <CustomSelect value={values.category} onChange={handleSegmentChange} options={SEGMENT_OPTIONS} />
            </Field>
            <Field label="Property Type">
              <CustomSelect value={values.propertyType}
                onChange={e => { setField('propertyType', e.target.value); setField('filters.propertyType', e.target.value); }}
                options={PROPERTY_TYPE_OPTIONS[values.category] || []}
              />
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
                  <CustomSelect value={values.filters.bhk} onChange={e => setField('filters.bhk', e.target.value)} options={BHK_OPTIONS} />
                </Field>
              )}
              <Field label="Possession Status">
                <CustomSelect value={values.filters.possession} onChange={e => setField('filters.possession', e.target.value)} options={POSSESSION_OPTIONS} />
              </Field>
              <Field label="Age of Property">
                <CustomSelect value={values.filters.age || ''} onChange={e => setField('filters.age', e.target.value)} options={AGE_OPTIONS} />
              </Field>
              <Field label="Furnishing">
                <CustomSelect value={values.filters.furnishing} onChange={e => setField('filters.furnishing', e.target.value)} options={FURNISHING_OPTIONS} />
              </Field>
              <Field label="Facing">
                <CustomSelect value={values.filters.facing || ''} onChange={e => setField('filters.facing', e.target.value)} options={FACING_OPTIONS} />
              </Field>
              <Field label="Parking">
                <CustomSelect value={values.filters.parking || ''} onChange={e => setField('filters.parking', e.target.value)} options={PARKING_OPTIONS} />
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
                <div style={{ position: 'relative' }}>
                  <input style={inputStyle} placeholder="e.g. Mumbai"
                    value={values.city} 
                    onChange={e => { setField('city', e.target.value); setShowCityDropdown(true); }}
                    onFocus={() => setShowCityDropdown(true)} 
                    required />
                  
                  {showCityDropdown && (
                    <div style={{
                      position: 'absolute', top: '105%', left: 0, right: 0, 
                      background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0',
                      boxShadow: '0 10px 25px rgba(0,0,0,.1)', zIndex: 1000,
                      maxHeight: 200, overflowY: 'auto', padding: '6px 0'
                    }}>
                      <div style={{ padding: '6px 12px', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Available Cities</div>
                      {cityOptions.filter(c => c.toLowerCase().includes(values.city?.toLowerCase() || '')).map(c => (
                        <div key={c} 
                          onClick={() => { setField('city', c); setShowCityDropdown(false); }}
                          style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer' }}
                          onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                        >{c}</div>
                      ))}
                      {cityOptions.length === 0 && <div style={{ padding: '10px 12px', fontSize: 12, color: '#94a3b8' }}>Type to add a new city...</div>}
                    </div>
                  )}
                  {showCityDropdown && <div onClick={() => setShowCityDropdown(false)} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />}
                </div>
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
            <Field label="Location URL / Map Link">
              <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }} className="re-location-row">
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="Paste a Google Maps link or use the current location button"
                  value={values.locationUrl || ''}
                  onChange={e => setField('locationUrl', e.target.value)}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={locationLookupState.loading}
                  aria-label="Use current location"
                  title="Use current location"
                  style={{
                    ...inputStyle,
                    width: 52,
                    minWidth: 52,
                    padding: 0,
                    border: '1.5px solid #bfdbfe',
                    background: locationLookupState.loading ? '#eff6ff' : '#eff6ff',
                    color: '#1d4ed8',
                    fontWeight: 800,
                    cursor: locationLookupState.loading ? 'wait' : 'pointer',
                    boxShadow: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                  }}
                  onMouseOver={e => { if (!locationLookupState.loading) { e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.background = '#dbeafe'; } }}
                  onMouseOut={e => { if (!locationLookupState.loading) { e.currentTarget.style.borderColor = '#bfdbfe'; e.currentTarget.style.background = '#eff6ff'; } }}
                >
                  {locationLookupState.loading ? (
                    '⌛'
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      aria-hidden="true"
                      focusable="false"
                      style={{ display: 'block' }}
                    >
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                        fill="#e11d48"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                Paste a shareable map URL, or let the browser fill one from your current GPS location.
              </p>
              {locationLookupState.message && (
                <p style={{ margin: '8px 0 0', fontSize: 12, fontWeight: 600, color: '#1d4ed8' }}>
                  {locationLookupState.message}
                </p>
              )}
            </Field>
          </div>
        </>
      )}

      {/* ── STEP 2: Amenities ─────────────────────────────── */}
      {currentStep === 2 && (
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            <span style={sectionNumStyle}>4</span>
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

      {/* ── STEP 3: Photos ─────────────────────────────────── */}
      {currentStep === 3 && (
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            <span style={sectionNumStyle}>5</span>
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

      {/* ── STEP 4: Choose Listing Plan ─────────────────────── */}
      {currentStep === 4 && (
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            <span style={sectionNumStyle}>6</span>
            Choose Listing Promotion Plan
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
            Promoted listings get up to 10× higher conversions and direct buyer inquiries. Choose the listing tier that matches your goals.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="re-form-grid">
            {[
              {
                id: 'PLAIN',
                name: 'Basic (Standard)',
                cost: 'Free',
                desc: 'Standard organic reach. Keep your listing active indefinitely without fees.',
                badge: { bg: '#f1f5f9', text: '#475569', label: 'Basic' },
              },
              {
                id: 'BASIC',
                name: 'Silver Booster',
                cost: '1 Credit',
                desc: '30-day moderate reach boost. Highlighted styling in property searches.',
                badge: { bg: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)', text: '#475569', label: 'Silver' },
              },
              {
                id: 'PLATINUM',
                name: 'Gold Project Spotlight',
                cost: '3 Credits',
                desc: '30-day top-priority boost. Guaranteed highlighted visibility in keyword queries.',
                badge: { bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', text: '#d97706', label: 'Gold ⭐' },
              },
              {
                id: 'PREMIUM',
                name: 'Platinum Elite Spotlight',
                cost: '5 Credits',
                desc: '30-day homepage spotlights and absolute top search ranking.',
                badge: { bg: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)', text: '#0f172a', label: 'Platinum 💎' },
              },
            ].map((plan) => {
              const active = (values.tier || 'PLAIN') === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setField('tier', plan.id)}
                  style={{
                    border: `2px solid ${active ? '#2563eb' : '#e2e8f0'}`,
                    borderRadius: 16,
                    padding: 20,
                    cursor: 'pointer',
                    background: active ? '#eff6ff' : '#fff',
                    transition: 'all .15s ease',
                    position: 'relative',
                    boxShadow: active ? '0 8px 24px rgba(37,99,235,.1)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 150,
                  }}
                  onMouseOver={(e) => {
                    if (!active) e.currentTarget.style.borderColor = '#bfdbfe';
                  }}
                  onMouseOut={(e) => {
                    if (!active) e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 15 }}>{plan.name}</span>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontSize: 10,
                          fontWeight: 700,
                          background: plan.badge.bg,
                          color: plan.badge.text,
                          border: '1px solid #cbd5e1',
                        }}
                      >
                        {plan.badge.label}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                      {plan.desc}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #cbd5e1' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: active ? '#2563eb' : '#475569' }}>
                      Cost: {plan.cost}
                    </span>
                    {active && (
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}>
                        ✓ Selected
                      </span>
                    )}
                  </div>
                </div>
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
        @media(max-width:720px){.re-location-row{flex-direction:column}}
      `}</style>
    </form>
  );
}
