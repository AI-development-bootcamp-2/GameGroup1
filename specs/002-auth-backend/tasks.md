# Tasks: Auth Backend

**Spec**: specs/002-auth-backend/spec.md
**Stack**: Node.js + Express + TypeScript + MongoDB + Mongoose + bcryptjs + jsonwebtoken
**Path base**: `server/src/`

---

## Phase 1: Setup

**Purpose**: Ensure auth dependencies are present and environment is configured.

- [x] T001 Add `bcryptjs`, `jsonwebtoken`, `@types/bcryptjs`, `@types/jsonwebtoken` to `server/package.json`
- [x] T002 Add `JWT_SECRET` and `JWT_EXPIRES_IN=7d` entries to `server/.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared infrastructure both user stories depend on — must be complete before US-1 or US-2.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Create `User` Mongoose schema with all fields from spec §4 in `server/src/models/User.ts` (username, email, password, role, isBanned, bio, avatarUrl, timestamps)
- [x] T003a [P] Define TypeScript DTOs in `server/src/types/auth.types.ts`: `RegisterInput { username, email, password }`, `LoginInput { email, password }`, `AuthResponse { token, user: { id, username, email, role } }`
- [x] T004 [P] Create JWT utility with `signToken(payload)` and `verifyToken(token)` in `server/src/utils/jwt.ts` — payload shape: `{ userId, username, role }`; read secret from `process.env.JWT_SECRET`; throw on startup if secret is missing
- [x] T005 [P] Create auth router skeleton and mount it at `/api/auth` in `server/src/routes/auth.ts` and `server/src/app.ts`
- [x] T006 [P] Add global error handler middleware returning `{ message }` shape for 400/401/409/500 in `server/src/middleware/errorHandler.ts`

**Checkpoint**: User model, JWT util, router, and error handler are in place.

---

## Phase 3: User Story 1 — Register (P1) 🎯 MVP

**Goal**: A visitor can POST valid credentials and receive a JWT + user object. Duplicate username or email returns a descriptive 409.

**Independent Test**: `POST /api/auth/register` with a fresh username/email returns 201 + token. Submitting the same email a second time returns 409 "Email already registered".

- [x] T007 [US1] Implement `validateRegisterInput` — check username (3–30 chars, `^[a-zA-Z0-9_]+$`), email (valid format, lowercase), password (min 8 chars) in `server/src/middleware/validateRegister.ts`
- [x] T008 [US1] Implement `registerUser` service — normalise email to lowercase, check username uniqueness (409), check email uniqueness (409), hash password with bcryptjs (saltRounds 10), save User, sign JWT with payload `{ userId: user._id, username: user.username, role: user.role }`, return `AuthResponse` (no password field) in `server/src/services/auth.service.ts`
- [x] T009 [US1] Implement `register` controller — call `validateRegisterInput` middleware then `registerUser`; respond 201 on success in `server/src/controllers/auth.controller.ts`
- [x] T010 [US1] Wire `POST /api/auth/register` → `validateRegisterInput` → `register` in `server/src/routes/auth.ts`

**Checkpoint**: Registration flow is end-to-end functional and independently testable.

---

## Phase 4: User Story 2 — Login (P2)

**Goal**: A registered user can POST email + password and receive a JWT. Wrong credentials return a generic 401 without revealing which field failed.

**Independent Test**: `POST /api/auth/login` with correct credentials returns 200 + token. Wrong password and non-existent email both return 401 "Invalid email or password." with no other detail.

- [x] T011 [US2] Implement `validateLoginInput` — require non-empty email and password; return 400 if missing in `server/src/middleware/validateLogin.ts`
- [x] T012 [US2] Implement `loginUser` service — normalise email to lowercase, find user by email using `.select('+password')` to override `select: false` (generic 401 if not found), call `bcrypt.compare(input.password, user.password)` and return generic 401 if false, sign JWT with payload `{ userId: user._id, username: user.username, role: user.role }`, return `AuthResponse` (no password field) in `server/src/services/auth.service.ts`
- [x] T013 [US2] Implement `login` controller — call `validateLoginInput` then `loginUser`; respond 200 on success in `server/src/controllers/auth.controller.ts`
- [x] T014 [US2] Wire `POST /api/auth/login` → `validateLoginInput` → `login` in `server/src/routes/auth.ts`

**Checkpoint**: Login flow is end-to-end functional. Both stories are independently testable.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T015 Add Mongoose `pre('save')` hook on `User` to lowercase `email` before every save in `server/src/models/User.ts`
- [ ] T016 [P] Add startup guard in `server/src/config/env.ts` — throw and exit if `JWT_SECRET` is absent, so the server never starts without it
- [ ] T017 [P] Ensure `password` field has `select: false` on the User schema so it is never returned by default queries in `server/src/models/User.ts`

---

## Dependencies & Execution Order

- **Phase 1** → No dependencies, start immediately
- **Phase 2** → Depends on Phase 1; blocks Phases 3 and 4
- **Phase 3 (US-1)** → Depends on Phase 2; US-1 and US-2 can proceed in parallel once Phase 2 is done
- **Phase 4 (US-2)** → Depends on Phase 2; shares `auth.service.ts` with US-1 so coordinate on that file
- **Phase 5** → Can be applied any time after Phase 2; T015 and T017 touch `User.ts` alongside T003

### Within each story

- Validation middleware → service → controller → route wire-up

### Parallel opportunities

- T004, T005, T006 (Phase 2) — different files, no mutual dependency
- T015, T016, T017 (Phase 5) — different files

---

## Implementation Strategy

### MVP (US-1 only)

1. Phase 1 → Phase 2 → Phase 3
2. Validate: `POST /api/auth/register` works end to end
3. Stop and demo before adding login

### Full delivery

1. Phase 1 + 2 → foundation
2. Phase 3 → register working
3. Phase 4 → login working
4. Phase 5 → hardening
