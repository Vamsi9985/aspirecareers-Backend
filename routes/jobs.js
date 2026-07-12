const express = require('express');
const router = express.Router();
const jobs = require('../data/jobs');

router.get('/', (req, res) => {
  res.json(jobs);
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const job = jobs.find((item) => item.id === id);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.json(job);
});

router.post('/', (req, res) => {
  const { title, location, qualification, experience, skills, salary, images } = req.body;
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
  };

  jobs.push(job);
  res.status(201).json(job);
});

module.exports = router;
