const express = require('express');
const router = express.Router();
const users = require('../data/users');
const admins = require('../data/admins');
const { validateEmail, validatePassword, validateContactNumber, validateRequiredFields } = require('../utils/validation');
const { generateOTP, storeOTP, verifyOTP } = require('../utils/otp');

router.post('/register', (req, res) => {
  const { fullName, email, contactNumber, password } = req.body;

  // Check required fields
  const requiredFields = ['fullName', 'email', 'contactNumber', 'password'];
  const missingFields = validateRequiredFields(req.body, requiredFields);
  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate contact number
  if (!validateContactNumber(contactNumber)) {
    return res.status(400).json({ error: 'Contact number must be a valid 10-digit number' });
  }

  // Validate password strength
  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 6 characters with uppercase, lowercase, and numbers' });
  }

  // Check if email already exists
  const existingUser = users.find((user) => user.email === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    fullName,
    email: email.toLowerCase(),
    contactNumber,
    password,
  };

  users.push(newUser);
  res.status(201).json({
    message: 'Registration successful',
    user: {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      contactNumber: newUser.contactNumber,
    },
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const user = users.find((item) => item.email === email.toLowerCase() && item.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      contactNumber: user.contactNumber,
    },
  });
});

// Admin login - Request OTP
router.post('/admin/login', (req, res) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Find admin user
  const admin = admins.find((item) => item.email === email.toLowerCase() && item.password === password);
  if (!admin) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  // Generate and store OTP
  const otp = generateOTP(6);
  storeOTP(email.toLowerCase(), otp, 5); // 5 minutes expiry

  // In production, you would send this OTP via email/SMS
  // For development, we'll return it (remove in production)
  res.status(200).json({
    message: 'OTP sent to registered email/phone',
    adminEmail: email,
    // Remove the next line in production
    otp: process.env.NODE_ENV === 'production' ? undefined : otp,
  });
});

// Verify Admin OTP
router.post('/admin/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  // Check required fields
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Verify OTP
  const otpResult = verifyOTP(email, otp);
  if (!otpResult.valid) {
    return res.status(401).json({ error: otpResult.message });
  }

  // Find admin and return success
  const admin = admins.find((item) => item.email === email.toLowerCase());
  if (!admin) {
    return res.status(401).json({ error: 'Admin not found' });
  }

  res.json({
    message: 'OTP verified successfully',
    admin: {
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
    },
  });
});

module.exports = router;
