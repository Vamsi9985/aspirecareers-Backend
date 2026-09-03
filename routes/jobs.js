const express = require('express');
const router = express.Router();
const jobs = require('../data/jobs');
const admins = require('../data/admins');
const { validateJobData } = require('../utils/validation');

// Middleware to protect admin routes. Expects headers `x-admin-email` and `x-admin-password`.
function requireAdmin(req, res, next) {
  const email = (req.headers['x-admin-email'] || '').toLowerCase();
  const password = req.headers['x-admin-password'] || '';

  if (!email || !password) {
    return res.status(401).json({ error: 'Admin credentials required in headers' });
  }

  const admin = admins.find((a) => a.email === email && a.password === password && a.role === 'admin');
  if (!admin) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  // attach admin to request for downstream handlers
  req.admin = { id: admin.id, email: admin.email, fullName: admin.fullName };
  next();
}

// GET /api/jobs[?sector=name] - list jobs or filter by sector
router.get('/', (req, res) => {
  const { sector } = req.query;
  if (sector) {
    const filtered = jobs.filter((j) => (j.sector || '').toLowerCase() === String(sector).toLowerCase());
    return res.json(filtered);
  }

  res.json(jobs);
});

// GET /api/jobs/sectors - list available sectors
router.get('/sectors', (req, res) => {
  const sectors = Array.from(new Set(jobs.map((j) => j.sector).filter(Boolean)));
  res.json(sectors);
});

// GET /api/jobs/:id - single job
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const job = jobs.find((item) => item.id === id);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.json(job);
});

// POST /api/jobs - create new job (admin only)
router.post('/', requireAdmin, (req, res) => {
  // Validate job data
  const validationErrors = validateJobData(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ error: validationErrors });
  }

  const { title, location, qualification, experience, skills, salary, images, description, sector } = req.body;
  const nextId = jobs.length ? Math.max(...jobs.map((item) => item.id)) + 1 : 1;

  const job = {
    id: nextId,
    title,
    location,
    qualification,
    experience,
    skills,
    salary,
    images,
    description,
    sector,
  };

  jobs.push(job);
  res.status(201).json(job);
});

// PUT /api/jobs/:id - update job (admin only)
router.put('/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const jobIndex = jobs.findIndex((item) => item.id === id);
  if (jobIndex === -1) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // Allow partial updates; validate if provided
  const validationErrors = validateJobData(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ error: validationErrors });
  }

  const existing = jobs[jobIndex];
  const updated = Object.assign({}, existing, req.body, { id: existing.id });
  jobs[jobIndex] = updated;

  res.json(updated);
});

// DELETE /api/jobs/:id - delete job (admin only)
router.delete('/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const jobIndex = jobs.findIndex((item) => item.id === id);
  if (jobIndex === -1) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const [removed] = jobs.splice(jobIndex, 1);
  res.json({ message: 'Job deleted', job: removed });
});

module.exports = router;
