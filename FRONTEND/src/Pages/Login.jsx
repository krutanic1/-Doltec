import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Style/Login.css';

const loginVisual = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const nextErrors = {};
    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password should be at least 6 characters';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!validate()) {
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/real-estate/dashboard';
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="re-login-page">
      <div className="re-login-shell">
        <section className="re-login-hero" style={{ backgroundImage: `url(${loginVisual})` }}>
          <div className="re-login-hero-overlay" />
          <div className="re-login-hero-content">
            <p className="re-login-kicker">Real Estate CRM</p>
            <h1>Welcome back to your deal desk</h1>
            <p>
              Track listings, follow up leads, and move buyers from first message to closed deal in one place.
            </p>
            <div className="re-login-stats">
              <div>
                <strong>10k+</strong>
                <span>Active buyers</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Lead notifications</span>
              </div>
              <div>
                <strong>Fast</strong>
                <span>Listing workflow</span>
              </div>
            </div>
          </div>
        </section>

        <section className="re-login-panel">
          <div className="re-login-panel-head">
            <h2>Sign in</h2>
            <p>Enter your details to continue managing properties and leads.</p>
          </div>

          {error && <div className="re-login-alert">{error}</div>}

          <form onSubmit={onSubmit} className="re-login-form" noValidate>
            <div className="re-login-field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                placeholder="you@example.com"
                className={fieldErrors.email ? 'input-error' : ''}
                autoComplete="email"
              />
              {fieldErrors.email ? <span className="re-login-field-error">{fieldErrors.email}</span> : null}
            </div>

            <div className="re-login-field">
              <div className="re-login-label-row">
                <label htmlFor="login-password">Password</label>
              </div>
              <div className="re-login-password-wrap">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  placeholder="Enter your password"
                  className={fieldErrors.password ? 'input-error' : ''}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="re-login-password-toggle"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {fieldErrors.password ? <span className="re-login-field-error">{fieldErrors.password}</span> : null}
            </div>

            <button type="submit" className="re-login-submit">Continue to dashboard</button>

            <p className="re-login-foot">
              New here? <Link to="/real-estate/register">Create account</Link>
            </p>
          </form>

          <div className="re-login-secure-note">Secure login protected by token-based authentication.</div>
        </section>
      </div>
    </div>
  );
}
