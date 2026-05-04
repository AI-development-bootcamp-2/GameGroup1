# Forum Project

A full-stack forum application — React frontend, Express + MongoDB backend, JWT auth.

## Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18 + Vite + TypeScript        |
| Backend    | Node.js + Express + TypeScript      |
| Database   | MongoDB + Mongoose                  |
| Auth       | JWT (jsonwebtoken + bcryptjs)       |

## Project Structure

```
forum-project/
├── .github/workflows/     # GitHub Actions CI
├── client/                # React frontend (Vite)
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── context/       # React context providers
│       ├── hooks/         # Custom React hooks
│       ├── pages/         # Route-level page components
│       ├── services/      # Axios API layer
│       └── types/         # Shared TypeScript types
└── server/                # Express backend
    ├── src/
    │   ├── config/        # DB connection
    │   ├── controllers/   # Request/response handlers
    │   ├── middleware/     # Express middleware (auth guard)
    │   ├── models/        # Mongoose schemas
    │   ├── routes/        # Express route definitions
    │   ├── services/      # Business logic
    │   └── utils/         # Shared helpers (JWT)
    └── tests/             # Jest integration tests
```

## Getting Started

### Prerequisites
- Node.js >= 20
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

### Backend

```bash
cd server
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev               # starts on http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev               # starts on http://localhost:5173
```

## API Endpoints

| Method | Path                  | Auth | Description          |
|--------|-----------------------|------|----------------------|
| POST   | /api/auth/register    | —    | Register a new user  |
| POST   | /api/auth/login       | —    | Login, receive JWT   |
| GET    | /api/posts            | —    | List all posts       |
| POST   | /api/posts            | ✓    | Create a post        |
| DELETE | /api/posts/:id        | ✓    | Delete own post      |

## Scripts

```bash
# server
npm run dev      # tsx watch (hot reload)
npm run build    # compile TypeScript
npm test         # Jest
npm run lint     # ESLint

# client
npm run dev      # Vite dev server
npm run build    # tsc + vite build
npm run lint     # ESLint
```
