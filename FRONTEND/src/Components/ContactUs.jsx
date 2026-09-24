import React, { useState } from 'react';
import axios from 'axios';
import API from '../API';
import '../Style/Contactus.css';


const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API}/contactus`, formData);
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
      });
      setDialogOpen(true);
    } catch (error) {
      alert('Error submitting data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lp-wrapper contact-wrapper-new">

      {/* CONTACT HERO SPLIT */}
      <div className="contact-split-container">
        {/* Left Side: Form */}
        <div className="contact-form-side">
          <div className="contact-form-header">
            <h1>Let's build something great together.</h1>
            <p>Whether you need to hire elite talent, build a digital product, or find the perfect property, Doltec is here to help.</p>
          </div>

          <div className="contact-info-cards">
            <div className="c-info-card">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <span>support@doltec.in</span>
            </div>
            <div className="c-info-card">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <span>+91-9324504318</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form-modern">
            <div className="form-row">
              <div className="form-group-modern">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
              </div>
              <div className="form-group-modern">
                <label>Contact Number</label>
                <input type="number" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 00000 00000" required />
              </div>
            </div>
            
            <div className="form-group-modern">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@company.com" required />
            </div>

            <div className="form-group-modern">
              <label>How can we help?</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="Tell us about your project, hiring needs, or property requirements..." required></textarea>
            </div>

            <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Right Side: Image */}
        <div className="contact-image-side">
          {/* Cinematic overlay */}
          <div className="contact-image-overlay"></div>
          <div className="contact-image-content">
            <h2>Your strategic partner for growth.</h2>
            <p>Join hundreds of forward-thinking companies.</p>
          </div>
        </div>
      </div>

      {/* DIALOG POPUP */}
      {isDialogOpen && (
        <div className="dialog-overlay-modern">
          <div className="dialog-box-modern">
            <div className="dialog-icon-success">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3>Message Sent!</h3>
            <p>Thank you for reaching out. A Doltec representative will get back to you shortly.</p>
            <button onClick={() => setDialogOpen(false)}>Return to Site</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;

