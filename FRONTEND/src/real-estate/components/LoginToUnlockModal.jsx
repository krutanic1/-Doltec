import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useAuthStore from '../stores/authStore';

export default function LoginToUnlockModal({ isOpen, onClose, propertyId, onSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  // Reset state on open/close
  useEffect(() => {
    if (!isOpen) {
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const { loginAndUnlockContact } = await import('../services/leadApi');
      const res = await loginAndUnlockContact({
        email: loginForm.email,
        password: loginForm.password,
        propertyId
      });

      if (res.success) {
        // Log user in
        const { token, user, unlockedData } = res;
        useAuthStore.getState().setAccessToken(token);
        useAuthStore.getState().setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        onSuccess(unlockedData.owner);
        onClose();
      } else {
        setError(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data?.msg || err.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password } = registerForm;
    if (!name || !email || !password) {
      setError('Name, email, and password are required fields.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const { registerAndUnlockContact } = await import('../services/leadApi');
      const res = await registerAndUnlockContact({
        name,
        email,
        phone,
        password,
        propertyId
      });

      if (res.success) {
        // Log user in
        const { token, user, unlockedData } = res;
        useAuthStore.getState().setAccessToken(token);
        useAuthStore.getState().setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        onSuccess(unlockedData.owner);
        onClose();
      } else {
        setError(res.message || 'Registration failed. Try again.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data?.msg || err.message || 'Phone number or email already in use.');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div 
      onClick={e => { e.preventDefault(); e.stopPropagation(); onClose(); }}
      onMouseOver={e => e.stopPropagation()}
      onMouseOut={e => e.stopPropagation()}
      onMouseEnter={e => e.stopPropagation()}
      onMouseLeave={e => e.stopPropagation()}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 10000, padding: 16, fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Modal Card */}
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', width: '100%', maxWidth: 450, borderRadius: 24,
          overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0', animation: 're-modal-fade .3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header Branding */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          padding: '28px 28px 24px', position: 'relative', color: '#fff'
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)',
            border: 'none', width: 32, height: 32, borderRadius: '50%', color: '#fff',
            fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background .15s'
          }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >✕</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              background: '#2563eb', padding: 8, borderRadius: 10, display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: '#60a5fa' }}>Unlock Verification</span>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 6px', letterSpacing: '-.02em' }}>Unlock Owner Details</h3>
          <p style={{ color: '#93c5fd', fontSize: 13, margin: 0, fontWeight: 500 }}>Create a free account or sign in to verify identity and reveal details.</p>
        </div>

        {/* Tab Selectors */}
        <div style={{ display: 'flex', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <button 
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); }}
            style={{
              flex: 1, padding: '16px', background: 'none', border: 'none',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              color: activeTab === 'login' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'login' ? '3px solid #2563eb' : '3px solid transparent',
              transition: 'all .15s'
            }}
          >Sign In</button>
          <button 
            type="button"
            onClick={() => { setActiveTab('register'); setError(''); }}
            style={{
              flex: 1, padding: '16px', background: 'none', border: 'none',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              color: activeTab === 'register' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'register' ? '3px solid #2563eb' : '3px solid transparent',
              transition: 'all .15s'
            }}
          >Create Account</button>
        </div>

        {/* Content Body */}
        <div style={{ padding: 28 }}>
          {error && (
            <div style={{
              background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 12,
              padding: '12px 16px', marginBottom: 20, color: '#991b1b', fontSize: 13,
              fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8
            }}>
              <span>⚠️</span>
              <span style={{ flex: 1 }}>{error}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#64748b', marginBottom: 6 }}>Email Address</label>
                <input 
                  type="email" required placeholder="name@example.com"
                  value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                  style={inputStyle}
                  onFocus={focusInput} onBlur={blurInput}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#64748b', marginBottom: 6 }}>Password</label>
                <input 
                  type="password" required placeholder="••••••••"
                  value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  style={inputStyle}
                  onFocus={focusInput} onBlur={blurInput}
                />
              </div>
              <button 
                type="submit" disabled={loading}
                style={{
                  ...submitBtnStyle,
                  background: loading ? '#93c5fd' : '#2563eb',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
                onMouseOver={e => { if (!loading) e.currentTarget.style.background = '#1d4ed8'; }}
                onMouseOut={e => { if (!loading) e.currentTarget.style.background = '#2563eb'; }}
              >
                {loading ? 'Authenticating...' : 'Unlock Contact Details →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#64748b', marginBottom: 6 }}>Full Name</label>
                <input 
                  type="text" required placeholder="John Doe"
                  value={registerForm.name} onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                  style={inputStyle}
                  onFocus={focusInput} onBlur={blurInput}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#64748b', marginBottom: 6 }}>Mobile Number</label>
                <input 
                  type="tel" placeholder="+91 99999 99999"
                  value={registerForm.phone} onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  style={inputStyle}
                  onFocus={focusInput} onBlur={blurInput}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#64748b', marginBottom: 6 }}>Email Address</label>
                <input 
                  type="email" required placeholder="john@example.com"
                  value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                  style={inputStyle}
                  onFocus={focusInput} onBlur={blurInput}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#64748b', marginBottom: 6 }}>Password</label>
                <input 
                  type="password" required placeholder="Choose a strong password"
                  value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                  style={inputStyle}
                  onFocus={focusInput} onBlur={blurInput}
                />
              </div>
              <button 
                type="submit" disabled={loading}
                style={{
                  ...submitBtnStyle,
                  background: loading ? '#93c5fd' : '#2563eb',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: 6
                }}
                onMouseOver={e => { if (!loading) e.currentTarget.style.background = '#1d4ed8'; }}
                onMouseOut={e => { if (!loading) e.currentTarget.style.background = '#2563eb'; }}
              >
                {loading ? 'Creating Account...' : 'Register & Unlock Contact →'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes re-modal-fade {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}

// Styling Constants
const inputStyle = {
  width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
  borderRadius: 12, padding: '12px 14px', fontFamily: 'Inter, sans-serif',
  fontSize: 13.5, fontWeight: 500, color: '#0f172a', outline: 'none',
  transition: 'border-color .15s, box-shadow .15s', boxSizing: 'border-box'
};

const submitBtnStyle = {
  width: '100%', padding: '14px', borderRadius: 12, border: 'none',
  color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 14,
  fontWeight: 700, boxShadow: '0 4px 14px rgba(37,99,235,0.2)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background .15s'
};

const focusInput = (e) => {
  e.target.style.borderColor = '#2563eb';
  e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,.1)';
};

const blurInput = (e) => {
  e.target.style.borderColor = '#e2e8f0';
  e.target.style.boxShadow = 'none';
};
