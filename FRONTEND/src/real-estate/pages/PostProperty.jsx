import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyForm from '../components/PropertyForm';
import usePropertyForm from '../hooks/usePropertyForm';
import { createProperty } from '../services/propertiesApi';

const S = { font: 'Inter,sans-serif' };

const STEPS = [
  { n: '01', t: 'Basic Info' },
  { n: '02', t: 'Location & Details' },
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
    if (form.loading) return; // Prevent double submission
    
    // Safety guard: only allow final submission on the last step (Select Plan)
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
      
      // Capture 402 Insufficient Credits payment required
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
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: S.font, paddingBottom: 80 }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(145deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)',
        paddingTop: 100, paddingBottom: 80, textAlign: 'center', padding: '100px 24px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(59,130,246,.08)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px', borderRadius: 30,
            background: 'rgba(59,130,246,.12)', border: '1px solid rgba(96,165,250,.2)',
            color: '#93c5fd', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em',
            marginBottom: 20,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa', display: 'inline-block' }} />
            100% Free
          </span>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff',
            margin: '0 0 16px', letterSpacing: '-.04em', lineHeight: 1.15,
          }}>
            Sell or Rent your property{' '}
            <span style={{ color: '#60a5fa' }}>faster than ever.</span>
          </h1>
          <p style={{ color: '#93c5fd', fontSize: 16, fontWeight: 500, margin: 0, lineHeight: 1.65 }}>
            Reach 50,000+ active buyers and tenants daily. Our AI-powered moderation ensures your property gets the visibility it deserves.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div style={{ maxWidth: 860, margin: '-48px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div style={{
          background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0',
          boxShadow: '0 24px 64px rgba(0,0,0,.08)', overflow: 'hidden',
        }}>
          {/* Step indicator */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', borderBottom: '1px solid #f1f5f9' }} className="re-step-indicator">
            {STEPS.map((s, i) => {
              const active = i === currentStep;
              const completed = i < currentStep;
              return (
                <div key={s.n} 
                  onClick={() => setCurrentStep(i)}
                  style={{
                    padding: '18px 16px', textAlign: 'center',
                    borderRight: i < 4 ? '1px solid #f1f5f9' : 'none',
                    background: active ? '#eff6ff' : 'transparent',
                    position: 'relative', cursor: 'pointer',
                    transition: 'background .2s',
                  }}
                  onMouseOver={e => { if (!active) e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseOut={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: active || completed ? '#2563eb' : '#94a3b8', display: 'block', marginBottom: 4 }}>
                    {completed ? '✓ ' : ''}{s.n}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: active || completed ? '#0f172a' : '#94a3b8' }}>{s.t}</span>
                  {active && <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 40, height: 3, background: '#2563eb', borderRadius: '3px 3px 0 0' }} />}
                </div>
              );
            })}
          </div>

          {/* Form body */}
          <div style={{ padding: '36px 40px' }} className="re-form-body">
            {form.error && (
              <div style={{
                background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 12,
                padding: '14px 18px', marginBottom: 24, color: '#991b1b', fontSize: 13, fontWeight: 600,
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 32 }} className="re-perks-grid">
          {PERKS.map(p => (
            <div key={p.t} style={{
              background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0',
              padding: '24px 20px',
              transition: 'box-shadow .2s, transform .2s',
            }}
              onMouseOver={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(37,99,235,.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ fontSize: 28, marginBottom: 14 }}>{p.icon}</div>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>{p.t}</h4>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{p.d}</p>
            </div>
          ))}
        </div>
      </div>

      {creditError && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: 24,
          fontFamily: S.font
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 24,
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)',
            width: '100%',
            maxWidth: 480,
            padding: 32,
            position: 'relative',
            animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Warning Icon Badge */}
            <div style={{
              width: 56, height: 56, borderRadius: 28,
              background: '#fef3c7', border: '1px solid #fde68a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, marginBottom: 20
            }}>
              🪙
            </div>

            <h3 style={{
              fontSize: 20, fontWeight: 800, color: '#0f172a',
              margin: '0 0 10px', letterSpacing: '-0.02em'
            }}>
              Insufficient Credits
            </h3>
            
            <p style={{
              fontSize: 14, color: '#475569', lineHeight: 1.6,
              margin: '0 0 24px'
            }}>
              {creditError.msg}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                type="button"
                onClick={() => {
                  form.setField('tier', 'PLAIN');
                  setCreditError(null);
                }}
                style={{
                  background: '#2563eb', color: '#fff',
                  border: 'none', borderRadius: 12, padding: '14px 20px',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  transition: 'all 0.2s', textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                }}
                onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
                onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
              >
                Select Free Basic Plan & Post
              </button>

              <button
                type="button"
                onClick={() => navigate('/real-estate/workspace/listings')}
                style={{
                  background: '#fff', color: '#0f172a',
                  border: '1px solid #cbd5e1', borderRadius: 12, padding: '14px 20px',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  transition: 'all 0.2s', textAlign: 'center'
                }}
                onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseOut={e => e.currentTarget.style.background = '#fff'}
              >
                Upgrade Packages & Purchase Credits
              </button>

              <button
                type="button"
                onClick={() => setCreditError(null)}
                style={{
                  background: 'transparent', color: '#64748b',
                  border: 'none', borderRadius: 12, padding: '10px 20px',
                  fontWeight: 600, fontSize: 12, cursor: 'pointer',
                  marginTop: 4, textAlign: 'center'
                }}
                onMouseOver={e => e.currentTarget.style.color = '#0f172a'}
                onMouseOut={e => e.currentTarget.style.color = '#64748b'}
              >
                Close & Modify Plan
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes modalSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media(max-width:800px){
          .re-step-indicator { grid-template-columns: repeat(2,1fr) !important; }
          .re-step-indicator > div { border-bottom: 1px solid #f1f5f9; }
          .re-step-indicator > div:nth-child(even) { border-right: none !important; }
          .re-form-body { padding: 24px 20px !important; }
        }
        @media(max-width:640px){.re-perks-grid{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}
