const ACCESS_TOKEN_KEY = 'taskora_access_token'
const REFRESH_TOKEN_KEY = 'taskora_refresh_token'
const USER_KEY = 'taskora_user'

export interface StoredUser {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  role: string
}

// ── Write ────────────────────────────────────────────────────────────────────

export function setAuthSession(
  accessToken: string,
  refreshToken: string,
  user: StoredUser,
) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// ── Read ─────────────────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredUser
  } catch {
    return null
  }
}

// NOTE: this only checks for a token's *presence*, not its expiry.
// The access token is short-lived (~15 min). Once a refresh-token flow
// endpoint exists (e.g. POST /auth/refresh), wire it up here so expired
// access tokens are silently renewed using the refresh token.
export function isAuthenticated(): boolean {
  return !!getAccessToken()
}

// Convenience helper for attaching the bearer token to future
// authenticated API requests (dashboard data, wallet, tasks, etc.)
export function getAuthHeader(): Record<string, string> {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
