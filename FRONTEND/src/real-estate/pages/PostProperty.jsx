import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyForm from '../components/PropertyForm';
import usePropertyForm from '../hooks/usePropertyForm';
import { createProperty } from '../services/propertiesApi';

const STEPS = [
  { n: '01', t: 'Basic Info' },
  { n: '02', t: 'Location' },
  { n: '03', t: 'Amenities' },
  { n: '04', t: 'Photos' },
  { n: '05', t: 'Select Plan' },
];

const PERKS = [
  { icon: '🎁', t: 'Free Listing', d: 'No hidden charges. Post for free and get unlimited leads directly on your phone.' },
  { icon: '🛡️', t: 'Verified Badge', d: 'Properties with accurate details get a "Verified" badge, increasing trust by 3×.' },
  { icon: '📞', t: 'Direct Calls', d: 'Interested parties can call you directly or send WhatsApp messages instantly.' },
];

export default function PostProperty() {
  const navigate = useNavigate();
  const form = usePropertyForm();
  const [creditError, setCreditError] = React.useState(null);
  const [currentStep, setCurrentStep] = React.useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.loading) return; 
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }
    
    try {
      form.setLoading(true);
      form.setError('');
      const res = await createProperty(form.toFormData());
      navigate(`/real-estate/properties/${res.slug || res._id}`);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.data?.msg === 'No token, authorization denied') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/real-estate/login');
        return;
      }
      
      if (err.response?.status === 402) {
        setCreditError({
          msg: err.response.data?.msg || err.response.data?.message || 'You do not have enough credits to activate this package.',
          selectedTier: form.values.tier
        });
        return;
      }
      
      form.setError(err.response?.data?.message || err.message || 'Failed to save property');
    } finally {
      form.setLoading(false);
    }
  };

  return (
    <div className="re-fade-in" style={{ paddingBottom: 80, background: '#f8f9fc', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0b0f1a 0%, #1a2550 50%, #2537a0 100%)',
        padding: '100px 24px 100px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(59,91,219,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '10%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(234,137,12,0.1)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 100,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            color: '#bac8ff', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em',
            marginBottom: 20,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b5bdb', display: 'inline-block' }} />
            Post Your Property
          </span>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, color: '#fff',
            margin: '0 0 16px', letterSpacing: '-0.04em', lineHeight: 1.15,
          }}>
            Sell or Rent your property{' '}
            <span style={{ color: '#faa219' }}>faster than ever.</span>
          </h1>
          <p style={{ color: 'rgba(186,200,255,0.8)', fontSize: 16, fontWeight: 500, margin: 0, lineHeight: 1.65 }}>
            Reach 50,000+ active buyers and tenants daily. Our AI-powered moderation ensures your property gets the visibility it deserves.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div style={{ maxWidth: 860, margin: '-60px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div className="re-card" style={{ boxShadow: '0 24px 64px rgba(15,22,50,0.12)' }}>
          {/* Step indicator */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', borderBottom: '1px solid rgba(226,230,240,0.8)' }} className="re-step-indicator">
            {STEPS.map((s, i) => {
              const active = i === currentStep;
              const completed = i < currentStep;
              return (
                <div key={s.n} 
                  onClick={() => setCurrentStep(i)}
                  style={{
                    padding: '20px 16px', textAlign: 'center',
                    borderRight: i < 4 ? '1px solid rgba(226,230,240,0.8)' : 'none',
                    background: active ? 'rgba(59,91,219,0.03)' : 'transparent',
                    position: 'relative', cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseOver={e => { if (!active) e.currentTarget.style.background = '#f8f9fc'; }}
                  onMouseOut={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: active || completed ? '#3b5bdb' : '#9fa6b8', display: 'block', marginBottom: 4 }}>
                    {completed ? '✓ ' : ''}{s.n}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: active || completed ? '#0f1629' : '#9fa6b8' }}>{s.t}</span>
                  {active && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #3b5bdb, #748ffc)' }} />}
                </div>
              );
            })}
          </div>

          {/* Form body */}
          <div style={{ padding: '40px 48px' }} className="re-form-body">
            {form.error && (
              <div style={{
                background: 'rgba(240,62,94,0.06)', border: '1px solid rgba(240,62,94,0.2)', borderRadius: 14,
                padding: '16px 20px', marginBottom: 28, color: '#f03e5e', fontSize: 13.5, fontWeight: 700,
              }}>
                ⚠️ {form.error}
              </div>
            )}
            <PropertyForm 
              form={form} 
              onSubmit={handleSubmit} 
              currentStep={currentStep} 
              setCurrentStep={setCurrentStep} 
              totalSteps={STEPS.length} 
            />
          </div>
        </div>

        {/* Perks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginTop: 40 }} className="re-perks-grid">
          {PERKS.map(p => (
            <div key={p.t} className="re-panel" style={{ padding: '28px 24px', transition: 'all 0.2s ease', border: '1px solid rgba(226,230,240,0.8)' }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(15,22,50,0.08)'; e.currentTarget.style.borderColor = 'rgba(59,91,219,0.3)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--re-shadow-sm)'; e.currentTarget.style.borderColor = 'rgba(226,230,240,0.8)'; }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>{p.icon}</div>
              <h4 style={{ fontSize: 16, fontWeight: 900, color: '#0f1629', margin: '0 0 8px', letterSpacing: '-0.02em' }}>{p.t}</h4>
              <p style={{ fontSize: 13.5, color: '#6b7494', lineHeight: 1.6, margin: 0 }}>{p.d}</p>
            </div>
          ))}
        </div>
      </div>

      {creditError && (
        <div className="re-overlay" onClick={() => setCreditError(null)}>
          <div className="re-modal" onClick={e => e.stopPropagation()}>
            <div style={{
              width: 64, height: 64, borderRadius: 32,
              background: 'rgba(234,137,12,0.1)', border: '1px solid rgba(234,137,12,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, marginBottom: 24
            }}>🪙</div>

            <h3 style={{ fontSize: 24, fontWeight: 900, color: '#0f1629', margin: '0 0 12px', letterSpacing: '-0.03em' }}>Insufficient Credits</h3>
            <p style={{ fontSize: 14, color: '#6b7494', lineHeight: 1.6, margin: '0 0 28px', fontWeight: 500 }}>{creditError.msg}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                type="button"
                onClick={() => { form.setField('tier', 'PLAIN'); setCreditError(null); }}
                className="re-btn re-btn-primary re-btn-full re-btn-xl"
              >Select Free Basic Plan & Post</button>

              <button
                type="button"
                onClick={() => navigate('/real-estate/workspace/listings')}
                className="re-btn re-btn-outline re-btn-full re-btn-xl"
              >Upgrade Packages & Credits</button>

              <button
                type="button"
                onClick={() => setCreditError(null)}
                className="re-btn re-btn-ghost re-btn-full"
                style={{ marginTop: 8 }}
              >Close & Modify Plan</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:800px){
          .re-step-indicator { grid-template-columns: repeat(2,1fr) !important; }
          .re-step-indicator > div { border-bottom: 1px solid rgba(226,230,240,0.8); }
          .re-step-indicator > div:nth-child(even) { border-right: none !important; }
          .re-form-body { padding: 28px 24px !important; }
        }
        @media(max-width:640px){.re-perks-grid{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}
