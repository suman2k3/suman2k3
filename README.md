# TaskFlow - Project & Task Management (RBAC)

## Overview
TaskFlow is a production-ready full-stack project and task management web app with role-based access control (Admin/Member), JWT authentication, and a modern responsive UI.

## Features
- JWT signup/login with hashed passwords (bcrypt)
- Protected routes and persistent auth via localStorage token
- Role-based access:
  - **Admin**: create projects, add members, create/assign/update tasks
  - **Member**: view assigned projects and update only their own tasks
- Project lifecycle: create/list/details
- Task lifecycle: create/list/update/filter by status
- Dashboard metrics:
  - Total tasks
  - Completed tasks
  - Pending tasks
  - Overdue tasks
- Responsive sidebar layout + card-based UI + chart visualization

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Axios, React Router, Recharts
- **Backend:** Node.js, Express.js, REST APIs
- **DB:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **Deploy:** Railway (backend + DB), Railway/Vercel/Netlify (frontend)

## Monorepo Structure
```
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── utils
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   ├── layouts
│   │   ├── pages
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## API Endpoints
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Projects
- `POST /api/projects` (admin)
- `GET /api/projects`
- `GET /api/projects/:id`

### Tasks
- `POST /api/tasks` (admin)
- `GET /api/tasks/project/:projectId`
- `PUT /api/tasks/:id`

## Local Setup
### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Set `.env` values:
- `PORT=5000`
- `MONGO_URI=<your mongo uri>`
- `JWT_SECRET=<strong secret>`

### 2) Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Set `.env`:
- `VITE_API_URL=http://localhost:5000/api`

## Railway Deployment (Step-by-step)
1. Push this repository to GitHub.
2. Create a Railway project.
3. Add a **MongoDB** service in Railway (or use MongoDB Atlas).
4. Add a **backend service** from this repo, set root directory to `backend`.
5. Configure backend environment variables in Railway:
   - `PORT` (Railway injects one; keep fallback in app)
   - `MONGO_URI`
   - `JWT_SECRET`
6. Set backend start command: `npm start`.
7. Deploy backend and note the public backend URL, e.g. `https://taskflow-api.up.railway.app`.
8. Add a **frontend service** from this repo, root directory `frontend`.
9. Set frontend env var:
   - `VITE_API_URL=https://taskflow-api.up.railway.app/api`
10. Set frontend build/start (Railway auto-detects Vite):
   - Build: `npm run build`
   - Start: `npm run preview -- --host 0.0.0.0 --port $PORT`
11. Redeploy frontend and verify auth + projects + tasks flow.

## Production Notes
- Restrict CORS origins to your frontend domain.
- Rotate JWT secret and use Railway secret variables.
- Add request rate limiting and centralized error middleware.
- Add input sanitization, logging pipeline, and test suite in CI.
