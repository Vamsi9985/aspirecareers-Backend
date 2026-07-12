# Aspire Careers Backend

A lightweight Express backend for the Aspire Careers frontend app.

## Endpoints

- `GET /api/status` - health check
- `GET /api/jobs` - list all job openings
- `GET /api/jobs/:id` - get a single job by id
- `POST /api/jobs` - create a new job entry
- `POST /api/auth/register` - register a new user
- `POST /api/auth/login` - login with email and password

## Run locally

```bash
cd backend
npm install
npm start
```

## Notes

This backend uses in-memory storage for jobs and users. It is intended as a starter backend for development and should be extended with a real database and authentication for production.
