# Trackwise — Full-Stack Project & Bug Tracker

Trackwise is a MERN application for managing projects and tracking issues. It includes a React + Vite frontend and a Node.js/Express + MongoDB API.

## Included features

- Register and log in with password hashing and JWT authentication
- Dashboard, project listing and project details
- Create and manage projects
- Create, filter, view, update and delete tickets
- Kanban workflow with Todo, In Progress and Done statuses
- Ticket priorities and comments (API support)
- Protected API routes

## Tech stack

- **Frontend:** React 18, Vite, React Router, Axios, Lucide React
- **Backend:** Node.js, Express, Mongoose, MongoDB
- **Authentication:** JSON Web Tokens and bcryptjs

## Project structure

```text
trackwise-fullstack/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── ProjectContext.jsx
│       ├── hooks/
│       │   └── useAuth.js
│       ├── components/
│       │   ├── common/
│       │   ├── dashboard/
│       │   ├── kanban/
│       │   ├── projects/
│       │   └── tickets/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       └── utils/
├── server/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── middleware/
│       ├── models/
│       └── routes/
├── package.json
├── .gitignore
└── README.md
```

The `client/src/components/` and `client/src/pages/` directories contain the individual JSX component and page files (not just empty folders).

## Requirements

- Node.js 20 or newer and npm
- MongoDB running locally or a MongoDB Atlas connection string

## Setup

1. Extract the ZIP and open the `trackwise-fullstack` folder in VS Code.
2. Install dependencies from the project root:

   ```bash
   npm install
   ```

3. Create the server environment file:

   **Windows PowerShell**
   ```powershell
   Copy-Item server/.env.example server/.env
   ```

   **macOS / Linux**
   ```bash
   cp server/.env.example server/.env
   ```

4. Edit `server/.env` and set your MongoDB URI and a strong JWT secret. Example:

   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/trackwise
   JWT_SECRET=replace_with_a_long_random_secret
   CLIENT_URL=http://localhost:5173
   ```

5. Optional: copy `client/.env.example` to `client/.env` if you need to change the API URL. The default is `http://localhost:5000/api`.
6. Start both frontend and backend from the root:

   ```bash
   npm run dev
   ```

7. Open **http://localhost:5173**. The API runs at **http://localhost:5000**.

## Useful commands

Run these from the project root:

| Command | Description |
|---|---|
| `npm install` | Install workspace dependencies |
| `npm run dev` | Start client and server together |
| `npm run build` | Build the frontend |
| `npm start` | Start the API server |
| `npm run dev -w client` | Start only the frontend |
| `npm run dev -w server` | Start only the backend |

## API endpoints

- `GET /api/health` — health check
- `POST /api/auth/register` — register
- `POST /api/auth/login` — login
- `GET /api/auth/me` — current authenticated user
- `GET/POST /api/projects` — list/create projects
- `GET/PATCH/DELETE /api/projects/:id` — project operations
- `POST /api/projects/:id/members` — add an existing user to a project
- `GET/POST /api/tickets` — list/create tickets (`GET` expects `?project=<projectId>`)
- `PATCH/DELETE /api/tickets/:id` — update/delete tickets
- `POST /api/tickets/:id/comments` — add a comment

## First run

1. Start MongoDB and the app.
2. Register an account using the Register page.
3. Log in and create a project.
4. Add tickets and move them through the Kanban statuses.

This is a learning/starter project. Review authorization, validation, rate limiting, and deployment secrets before using it in production.
