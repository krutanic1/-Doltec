const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  console.log('Register request:', req.body);
  try {
    const { name, email, phone, password, role, posterType } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, phone, password, role, posterType });
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) {
        console.error('JWT Sign Error:', err);
        throw err;
      }
      console.log('Registration successful for:', user.email);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
    });
  } catch (err) {
    console.error('Auth Error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Phone number or email already in use.' });
    }
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  console.log('Login request:', req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    if (password !== user.password) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) {
        console.error('JWT Sign Error:', err);
        throw err;
      }
      console.log('Login successful for:', user.email);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
    });
  } catch (err) {
    console.error('Auth Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
