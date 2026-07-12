const express = require('express');
const router = express.Router();
const users = require('../data/users');

router.post('/register', (req, res) => {
  const { fullName, email, contactNumber, password } = req.body;

  if (!fullName || !email || !contactNumber || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

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

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
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

module.exports = router;
