import { useState } from 'react';
import axios from 'axios';
import '../Style/Register.css';

const signupIllustration = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';
const propertyGallery = [
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80',
];

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'USER' });
  const [error, setError] = useState('');

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/real-estate/dashboard';
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const err = {};
    if (!formData.name.trim()) err.name = 'Name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) err.email = 'Enter a valid email';
    if (!formData.phone.trim()) err.phone = 'Phone is required';
    if (formData.password.length < 6) err.password = 'Password must be at least 6 characters';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const onSubmitEnhanced = async e => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/real-estate/dashboard';
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="re-register-page">
      <div className="re-card">
        <div className="re-left" style={{ backgroundImage: `url(${signupIllustration})` }}>
          <div className="re-left-content">
            <h2>Find or list properties faster</h2>
            <p>Join thousands of buyers, renters and property owners. Manage listings, get leads and close deals quickly.</p>
            <ul className="re-benefits">
              <li>Verified Listings</li>
              <li>Simple onboarding for owners & agents</li>
              <li>Instant lead notifications</li>
            </ul>
            <div className="re-gallery" aria-label="Real estate photos">
              {propertyGallery.map((photo, idx) => (
                <img key={photo} src={photo} alt={`Property preview ${idx + 1}`} loading="lazy" />
              ))}
            </div>
          </div>
        </div>

        <div className="re-form-wrap">
          <div className="re-form">
            <h1>Create your account</h1>
            
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-3 text-sm font-semibold">{error}</div>}

            {/* social sign-up removed */}

            <form onSubmit={onSubmitEnhanced} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">Type</label>
                <select name="role" value={formData.role} onChange={onChange} className="re-input re-select">
                  <option value="USER">Buyer / Tenant</option>
                  <option value="OWNER">Property Owner</option>
                  <option value="AGENT">Agent</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">Full name</label>
                <input type="text" name="name" value={formData.name} onChange={onChange} className="re-input" placeholder="Your full name" />
                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">Email address</label>
                <input type="email" name="email" value={formData.email} onChange={onChange} className="re-input" placeholder="you@example.com" />
                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">Phone number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={onChange} className="re-input" placeholder="+91 98765 XXXXX" />
                {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={onChange} className="re-input" placeholder="Choose a strong password" />
                  <button type="button" onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', right: 10, top: 10 }} className="text-slate-500 text-sm">{showPassword ? 'Hide' : 'Show'}</button>
                </div>
                {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="text-sm text-slate-600">
                  <input type="checkbox" required /> <span>I agree to the <a href="/termsandconditions" className="text-slate-900 font-semibold">Terms & Conditions</a></span>
                </label>
              </div>

              <button type="submit" className="re-cta">Create account</button>

              <div className="re-foot">Already have an account? <a href="/real-estate/login" className="text-slate-900 font-semibold">Sign in</a></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
