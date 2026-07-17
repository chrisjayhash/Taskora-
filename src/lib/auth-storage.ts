const ACCESS_TOKEN_KEY = 'taskora_access_token'
const REFRESH_TOKEN_KEY = 'taskora_refresh_token'
const USER_KEY = 'taskora_user'

export interface StoredWallet {
  id: string
  balanceKobo: string
  currency: string
}

export interface StoredUser {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  role: string

  // Optional fields populated by /me
  phoneNumber?: string
  referralCode?: string
  isVerified?: boolean
  referralCount?: number
  wallet?: StoredWallet
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

export function setAccessToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

export function setRefreshToken(refreshToken: string) {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function setStoredUser(user: StoredUser) {
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

// NOTE: this checks for token presence (not expiry). Expiry is handled
// by API calls (refresh on 401/expired message).
export function isAuthenticated(): boolean {
  return !!getAccessToken()
}

export function getAuthHeader(): Record<string, string> {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
