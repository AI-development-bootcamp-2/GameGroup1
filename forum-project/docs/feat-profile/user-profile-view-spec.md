# Feature Spec: User Profile View

**Feature**: User Profile View  
**Story Reference**: User Story 6 — User Profiles  
**Priority**: P3  
**Status**: Draft  

---

## User Story

As any visitor (authenticated or not), I want to view a public user profile so that I can see who authored posts I found interesting, learn about them, and browse their post history.

---

## Functional Requirements

| ID     | Requirement |
|--------|-------------|
| FR-015 | System MUST provide a public profile page for each user showing their username, bio, avatar, and post history |
| FR-016 | System MUST allow authenticated users to update their own bio and avatar URL |

Scoped to **view only** for this feature. Edit functionality (FR-016) is tracked separately.

---

## API Endpoint

GET /api/users/:id

Returns the public profile data for a given user.

### Path Parameters

- id — the unique identifier of the user

### Response (200 OK)

```json
{
  "_id": "6637a2f1e4b0c2a1d8f9e123",
  "username": "alice",
  "bio": "Forum member and tech enthusiast.",
  "avatarUrl": "https://example.com/avatars/alice.png",
  "createdAt": "2025-01-10T08:00:00Z",
  "posts": [
    {
      "_id": "6637b3c2e4b0c2a1d8f9e456",
      "title": "Best gaming setups of 2025",
      "category": "Gaming",
      "likeCount": 14,
      "commentCount": 3,
      "createdAt": "2025-03-20T12:00:00Z"
    }
  ]
}

Error Responses
404 Not Found — user with the given ID does not exist
400 Bad Request — ID is not a valid MongoDB ObjectId

Notes
Sensitive fields (email, role, banned status, password hash) are never returned
Posts are returned in reverse chronological order (newest first)
Endpoint is public — no authentication required

Fields to Display
| Field        | Source         | Notes                                            |
| ------------ | -------------- | ------------------------------------------------ |
| Username     | user.username  | Always shown                                     |
| Avatar       | user.avatarUrl | Show placeholder if null/empty                   |
| Bio          | user.bio       | Show "No bio yet." if null/empty                 |
| Member since | user.createdAt | Human-readable date                              |
| Post list    | user.posts[]   | Title, category, like count, comment count, date |

Frontend Behavior
Route: /users/:id or /profile/:id
Profile page accessible without login
Avatar shows fallback if missing/broken
Bio displayed as plain text
Post list shows links to posts
Show "Edit Profile" only for own profile
Loading state while fetching
Error state on failure

Edge Cases
No posts → show "No posts yet."
Broken avatar → show placeholder
Empty bio → show "No bio yet."
Invalid ID → show 400
User not found → show 404
Own profile → show edit button
Other profile → no edit button

Out of Scope
Editing profile
Showing email/role
Messaging/following
Pagination
Real-time updates

