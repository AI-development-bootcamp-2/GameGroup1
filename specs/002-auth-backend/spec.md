# Feature Specification: Auth Backend

**Feature Branch**: `feature-auth-backend`
**Created**: 2026-05-04
**Status**: Draft
**Scope**: Backend only — Node.js + Express + TypeScript + MongoDB + Mongoose

> **Out of scope (flagged)**: Forgot password / password reset was explicitly excluded in the parent spec (`specs/001-full-forum-app/spec.md`, Assumptions). It is not implemented here.

---

## 1. Feature Overview

Provide secure user registration and login for the forum backend. On success, both endpoints return a signed JWT that the client stores and attaches to protected requests. No email verification step is required.

**Stack decisions (inherited from parent spec)**:
- Passwords hashed with `bcryptjs`
- Auth token: single JWT, 7-day expiry, `HS256`
- Token payload: `{ userId, username, role }`
- No refresh tokens

---

## 2. User Stories

### US-1 — Register
A visitor submits a username, email, and password. If the inputs are valid and both username and email are unused, an account is created and a JWT is returned so the user is immediately authenticated.

### US-2 — Login
A registered user submits their email and password. If the credentials are correct, a JWT is returned. The error message never reveals which field is wrong.

---

## 3. API Endpoints

### POST `/api/auth/register`

**Auth required**: No

**Request body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Success — 201 Created**:
```json
{
  "token": "<jwt>",
  "user": {
    "id": "<objectId>",
    "username": "string",
    "email": "string",
    "role": "user"
  }
}
```

**Error responses**:

| Status | Condition |
|--------|-----------|
| 400    | Missing or invalid field (see validations) |
| 409    | Username already taken |
| 409    | Email already registered |

---

### POST `/api/auth/login`

**Auth required**: No

**Request body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Success — 200 OK**:
```json
{
  "token": "<jwt>",
  "user": {
    "id": "<objectId>",
    "username": "string",
    "email": "string",
    "role": "user"
  }
}
```

**Error responses**:

| Status | Condition |
|--------|-----------|
| 400    | Missing email or password |
| 401    | Invalid credentials (generic — do not reveal which field is wrong) |

---

## 4. Data Model — User

**Mongoose schema** (`server/src/models/User.ts`):

| Field       | Type      | Constraints                          | Default |
|-------------|-----------|--------------------------------------|---------|
| `_id`       | ObjectId  | Auto-generated                       | —       |
| `username`  | String    | Required, unique, 3–30 chars         | —       |
| `email`     | String    | Required, unique, lowercase, valid format | —  |
| `password`  | String    | Required, bcrypt hash (never returned) | —    |
| `role`      | String    | Enum: `user`, `admin`                | `user`  |
| `isBanned`  | Boolean   | —                                    | `false` |
| `bio`       | String    | Optional                             | `""`    |
| `avatarUrl` | String    | Optional                             | `""`    |
| `createdAt` | Date      | Auto (timestamps: true)              | —       |
| `updatedAt` | Date      | Auto (timestamps: true)              | —       |

`bio` and `avatarUrl` are included now so the schema is complete for later profile features; they play no role in auth logic.

---

## 5. Validations & Error Handling

### Register — field rules

| Field      | Rule |
|------------|------|
| `username` | Required; 3–30 characters; only letters, numbers, underscores |
| `email`    | Required; valid email format; stored lowercase |
| `password` | Required; minimum 8 characters |

- Return **400** with a message identifying the invalid field(s).
- Return **409** with a message identifying whether username or email is already taken (revealing which one is fine per acceptance scenario 2 of the parent spec).

### Login — field rules

| Field    | Rule |
|----------|------|
| `email`  | Required |
| `password` | Required |

- If either credential is wrong, return **401** `"Invalid email or password."` — never disclose which field failed.

### Shared rules

- `password` is **never** included in any response body or JWT payload.
- All error responses use a consistent shape: `{ "message": "..." }`.
- Unexpected server errors return **500** `{ "message": "Internal server error" }`.

---

## 6. Edge Cases

| Scenario | Expected behaviour |
|----------|--------------------|
| Email submitted in mixed case (e.g. `User@Example.com`) | Normalise to lowercase before lookup and storage |
| Username with only whitespace | Fails required/pattern validation → 400 |
| Password shorter than 8 chars | Fails length validation → 400 |
| Duplicate username, unique email | 409 — "Username already taken" |
| Unique username, duplicate email | 409 — "Email already registered" |
| Banned user logs in | Login succeeds and JWT is issued; ban is enforced at content-creation endpoints, not at login |
| SQL/NoSQL injection in email field | Mongoose query uses exact string match; no `$where` or regex; safe by default |
| JWT secret missing from environment | Server must fail to start (validate `JWT_SECRET` in config, not at request time) |
