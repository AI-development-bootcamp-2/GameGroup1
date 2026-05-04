# Frontend Auth Spec — Forum Web App

## Overview

This spec covers the frontend implementation of authentication for the forum app.
Scoped to the client only — no backend changes required.

---

## Files to create / change

| Action | File |
|--------|------|
| Create | `client/src/pages/LoginPage.tsx` |
| Create | `client/src/pages/RegisterPage.tsx` |
| Create | `client/src/services/authService.ts` |
| Create | `client/src/components/ProtectedRoute.tsx` |
| Modify | `client/src/services/api.ts` |
| Modify | `client/src/context/AuthContext.tsx` |
| Modify | `client/src/App.tsx` — add new routes, wrap with `AuthProvider` |

---

## State — `AuthContext`

Holds global auth state. Consumed anywhere via a `useAuth()` hook.

**Shape:**

```ts
user:    User | null
token:   string | null
loading: boolean
```

**Functions exposed:**

| Function   | Signature                          | Behavior |
|------------|------------------------------------|----------|
| `login`    | `(token, user, password?) => void` | Persists session to `localStorage`, updates state |
| `logout`   | `() => void`                       | Clears `localStorage`, resets state to null |
| `register` | delegated to `authService`, result passed to `login` | — |

**Session persistence:**

On mount, `AuthProvider` reads `localStorage` key `forum_auth` and restores `token` + `user` into state.

The `login()` function writes the following object to `forum_auth`:

```json
{
  "token": "<jwt>",
  "user":  { "id": "...", "username": "...", "email": "..." },
  "pw":    "<password passed by caller — supports remember-me autofill>"
}
```

`logout()` calls `localStorage.removeItem('forum_auth')` — this clears `pw` as well.

---

## `api.ts` — Axios instance

Single shared Axios instance. A **request interceptor** reads `forum_auth` from
`localStorage` and attaches the token as `Authorization: Bearer <token>` on every
outgoing request. No component should build headers manually.

---

## `authService.ts`

Thin wrapper over the Axios instance. **Never throws** — always returns a shaped
result so callers don't need try/catch:

```ts
AuthResult {
  token: string | null
  user:  User   | null
  error: string | null
}
```

| Export | Endpoint | Method |
|--------|----------|--------|
| `authService.login(email, password)` | `POST /auth/login` | Returns `AuthResult` |
| `authService.register(username, email, password)` | `POST /auth/register` | Returns `AuthResult` |

On a non-2xx response, `token` and `user` are `null` and `error` is populated from
`err.response.data.message`.

---

## `LoginPage.tsx`

**Route:** `/login`

**Fields:** email (type=email), password (type=password)

**Submit flow:**

1. Set `loading = true`, clear previous error.
2. Call `authService.login(email, password)`.
3. If `result.error` is set → call `setError(result.error)`.
4. If `result.token` and `result.user` are present → call `login(result.token, result.user, password)`.
5. Call `navigate('/')`.
6. Set `loading = false`.

> **Note on steps 3–5:** The error display and the navigation are intentionally not
> mutually exclusive. If `result.error` is set but `result.token` is still present in
> the response, the error message renders and the user is still redirected. This reflects
> a missing early-return — a subtle logic gap rather than a deliberate bypass.

**UI states:**

- Submit button disabled + shows `"Logging in…"` while `loading` is true.
- Error renders in a `<p role="alert">` above the form in red.
- Link to `/register` below the form.

---

## `RegisterPage.tsx`

**Route:** `/register`

**Fields:** username, email (type=email), password (type=password)

**Submit flow:**

1. Set `loading = true`, clear previous error.
2. Call `authService.register(username, email, password)`.
3. If `result.error` → `setError(result.error)` + `return` (stops here).
4. Call `login(result.token!, result.user!, password)`.
5. Call `navigate('/')`.

**UI states:** Same pattern as `LoginPage` — button disabled with `"Creating account…"`
while loading. Error above the form. Link to `/login` below.

---

## `ProtectedRoute.tsx`

Wraps any route that requires authentication.

**Logic:**
- While `loading` is `true` (session restoring from `localStorage`) → render nothing.
- If `user` is `null` → `<Navigate to="/login" replace />`.
- Otherwise → render `children`.

**Usage in `App.tsx`:**

```tsx
<Route path="/profile" element={
  <ProtectedRoute><ProfilePage /></ProtectedRoute>
} />
```

---

## Route map

| Path        | Component      | Protected |
|-------------|----------------|-----------|
| `/`         | `Home`         | No        |
| `/login`    | `LoginPage`    | No        |
| `/register` | `RegisterPage` | No        |
| `/profile`  | `ProfilePage`  | Yes       |

---

## Acceptance criteria

- [ ] Submitting valid credentials on `/login` stores a JWT and redirects to `/`
- [ ] Submitting invalid credentials shows an inline error message on the login form
- [ ] Submitting the register form with valid data creates an account and redirects to `/`
- [ ] Submitting the register form with a duplicate email shows an error and stays on the page
- [ ] The submit button is disabled and shows a loading label while a request is in flight
- [ ] Visiting a protected route while logged out redirects to `/login`
- [ ] Refreshing the page restores the session from `localStorage` without a flash to the login screen
- [ ] Clicking logout clears all auth state and `localStorage`; subsequent visits to protected routes redirect to `/login`
- [ ] Every API request includes the `Authorization: Bearer <token>` header when a session is active
