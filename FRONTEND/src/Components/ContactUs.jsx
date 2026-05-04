import React, {useState } from 'react';
import axios from 'axios';
import API from "../API";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/contactus`, formData);
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
      }),
      setDialogOpen(true);
    } catch (error) {
      alert('Error submitting data');
    }
  };

  return (
    <div className="contact-container">
      <div className="form-section">

        <div className="form_title">
          <h2>Get in Touch with Us</h2>
          <p>Have questions or need AI solutions? Let us know by filling out the form, and we'll be in touch!</p>
        </div>
          
        <div className="infoDetails">
          <div className="gmail">
             <div>
              <i class="fa fa-envelope" aria-hidden="true"></i> E-mail
             </div>
            <a href="mailto:support@doltec.in">support@doltec.in</a>
          </div>
          <div className="number">
             <div>
                <i class="fa fa-phone" aria-hidden="true"></i> Phone
             </div>
            <a href="tel:+918310626647">+91-8310626647</a>
          </div>
        </div>

        <form  onSubmit={handleSubmit} className="contact-form">

          <div className="form-group two-columns">
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="phone"
              value={formData.phone}
              placeholder="Contact Number"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email Id"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <textarea
              name="message"
              value={formData.message}
              placeholder="Write your message here..."
              rows="5"
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-button" >Send Message</button>
          {/* <div className='mail'><i className="fa fa-envelope" aria-hidden="true"></i><a href="mailto:doltec@gmail.com">support@doltec.in</a></div> */}

        </form>

        {isDialogOpen && (
          <div className="dialog-overlay">
            <div className="dialog-box">
              <h3>Thank You!</h3>
              <p>Your message has been submitted successfully.</p>
              <p>We will get back to you shortly.</p>
              <button onClick={() => setDialogOpen(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
