import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const S = { font: 'Inter,sans-serif' };

const inputStyle = {
  width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
  borderRadius: 12, padding: '13px 16px', fontFamily: S.font,
  fontSize: 14, fontWeight: 500, color: '#0f172a', outline: 'none',
  transition: 'border-color .15s, box-shadow .15s', boxSizing: 'border-box',
};

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', phone: '', password: '', posterType: 'OWNER' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Please fill in all required fields.'); return; }
    setLoading(true); setError('');
    try {
      const { default: api } = await import('../../services/api/axios');
      const { default: useAuthStore } = await import('../../stores/authStore');
      
      const payload = { ...form, role: form.posterType }; // Send the selected role
      const res = await api.post('/auth/register', payload);
      
      const { token, user } = res.data;
      useAuthStore.getState().setAccessToken(token);
      useAuthStore.getState().setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      navigate('/real-estate/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.msg || err.response?.data?.message || err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const onFocus = e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,.1)'; e.target.style.background = '#fff'; };
  const onBlur  = e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: S.font, background: 'linear-gradient(145deg,#f8fafc 0%,#eff6ff 100%)',
      padding: '80px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 480, background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 24px 64px rgba(37,99,235,.08)', padding: '40px 40px 36px' }}>

        {/* Logo + heading */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 18px', boxShadow: '0 8px 24px rgba(37,99,235,.25)',
          }}>
            <svg width="26" height="26" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-.03em' }}>Create Account</h1>
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 500, margin: 0 }}>Join India's most trusted property portal.</p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 22, color: '#991b1b', fontSize: 13, fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          
          {/* Profile Type Selection */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#64748b', marginBottom: 8 }}>I am a / an</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['OWNER', 'AGENT', 'BUILDER'].map(type => (
                <button
                  key={type} type="button"
                  onClick={() => setForm({ ...form, posterType: type })}
                  style={{
                    flex: 1, padding: '12px 0', borderRadius: 12, cursor: 'pointer',
                    fontFamily: S.font, fontSize: 13, fontWeight: 700,
                    border: form.posterType === type ? '1.5px solid #2563eb' : '1.5px solid #e2e8f0',
                    background: form.posterType === type ? '#eff6ff' : '#f8fafc',
                    color: form.posterType === type ? '#1d4ed8' : '#64748b',
                    transition: 'all .15s'
                  }}
                >
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
            { label: 'Email Address', key: 'email', type: 'email', placeholder: 'name@company.com' },
            { label: 'Phone (optional)', key: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
            { label: 'Password', key: 'password', type: 'password', placeholder: '•••••••• (min 8 chars)' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#64748b', marginBottom: 8 }}>{f.label}</label>
              <input
                type={f.type} placeholder={f.placeholder}
                required={f.key !== 'phone'}
                value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                style={inputStyle} onFocus={onFocus} onBlur={onBlur}
              />
            </div>
          ))}

          <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6, margin: '4px 0 0' }}>
            By creating an account, you agree to our{' '}
            <a href="#" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</a>{' '}and{' '}
            <a href="#" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</a>.
          </p>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 'none', marginTop: 4,
            background: loading ? '#93c5fd' : '#2563eb', color: '#fff',
            fontFamily: S.font, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 14px rgba(37,99,235,.25)', transition: 'background .15s',
          }}
            onMouseOver={e => { if (!loading) e.currentTarget.style.background = '#1d4ed8'; }}
            onMouseOut={e => { if (!loading) e.currentTarget.style.background = '#2563eb'; }}
          >
            {loading
              ? <div style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 're-spin .7s linear infinite' }} />
              : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#64748b', fontWeight: 500 }}>
          Already have an account?{' '}
          <Link to="/real-estate/login" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes re-spin{to{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
}
