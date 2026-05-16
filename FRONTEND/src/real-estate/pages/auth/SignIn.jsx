import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const S = { font: 'Inter,sans-serif' };

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="9" fill="#2563EB"/>
    <path d="M18 8L28 15.5V28H8V15.5L18 8Z" fill="white"/>
    <rect x="15" y="21" width="6" height="7" rx="1" fill="#2563EB"/>
    <path d="M18 8L28 15.5L18 12L8 15.5L18 8Z" fill="#93c5fd"/>
  </svg>
);

export default function SignIn() {
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    try {
      const { default: api } = await import('../../services/api/axios');
      const { default: useAuthStore } = await import('../../stores/authStore');
      const res = await api.post('/auth/login', { email: form.email, password: form.password });
      
      const { token, user } = res.data;
      useAuthStore.getState().setAccessToken(token);
      useAuthStore.getState().setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      navigate('/real-estate/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.msg || err.response?.data?.message || err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', fontFamily: S.font,
      background: 'linear-gradient(145deg, #f8fafc 0%, #eff6ff 100%)',
    }}>
      {/* Left panel — branding */}
      <div style={{
        flex: 1, background: 'linear-gradient(145deg, #0f172a 0%, #1e3a8a 100%)',
        padding: '60px 48px', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', position: 'relative', overflow: 'hidden',
      }} className="re-auth-panel">
        <div style={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(59,130,246,.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(147,197,253,.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <Logo />
            <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-.02em' }}>
              Doltec<span style={{ color: '#60a5fa' }}>Properties</span>
            </span>
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', margin: '0 0 16px', letterSpacing: '-.04em', lineHeight: 1.2 }}>
            Your property<br />journey starts here.
          </h2>
          <p style={{ color: '#93c5fd', fontSize: 16, lineHeight: 1.7, margin: '0 0 48px', fontWeight: 500 }}>
            Access your dashboard, manage listings, and connect with thousands of buyers — all from one place.
          </p>
          {/* Trust stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '✓', text: '25,000+ verified listings' },
              { icon: '✓', text: 'Direct owner connections' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, background: 'rgba(59,130,246,.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#60a5fa', fontSize: 14, fontWeight: 800, flexShrink: 0,
                }}>{item.icon}</div>
                <span style={{ color: '#cbd5e1', fontSize: 14, fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-.03em' }}>Welcome back</h1>
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 500, margin: '0 0 36px' }}>Sign in to your Doltec Properties account.</p>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 24, color: '#991b1b', fontSize: 13, fontWeight: 600 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#64748b', marginBottom: 8 }}>Email Address</label>
              <input type="email" required placeholder="name@company.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                style={{
                  width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
                  borderRadius: 12, padding: '13px 16px', fontFamily: S.font,
                  fontSize: 14, fontWeight: 500, color: '#0f172a', outline: 'none',
                  transition: 'border-color .15s, box-shadow .15s', boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#64748b' }}>Password</label>
                <a href="#" style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}>Forgot?</a>
              </div>
              <input type="password" required placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                style={{
                  width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
                  borderRadius: 12, padding: '13px 16px', fontFamily: S.font,
                  fontSize: 14, fontWeight: 500, color: '#0f172a', outline: 'none',
                  transition: 'border-color .15s, box-shadow .15s', boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: 12, border: 'none',
              background: loading ? '#93c5fd' : '#2563eb', color: '#fff',
              fontFamily: S.font, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 14px rgba(37,99,235,.25)', transition: 'background .15s',
            }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.background = '#1d4ed8'; }}
              onMouseOut={e => { if (!loading) e.currentTarget.style.background = '#2563eb'; }}
            >
              {loading ? (
                <div style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 're-spin .7s linear infinite' }} />
              ) : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: '#64748b', fontWeight: 500 }}>
            Don't have an account?{' '}
            <Link to="/real-estate/register" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Create Account</Link>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes re-spin{to{transform:rotate(360deg)}}
        @media(max-width:768px){.re-auth-panel{display:none!important}}
      `}</style>
    </div>
  );
}
