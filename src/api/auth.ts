import { apiFetch, ApiError } from './http'

// Re-export so existing imports keep working
export { ApiError }

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  role: string
}

// ── Sign up ──────────────────────────────────────────────────────────────────

export interface SignUpPayload {
  firstName: string
  lastName: string
  username: string
  email: string
  phoneNumber: string
  role: string
  password: string
}

export interface SignUpUser {
  id: string
  first_name: string
  last_name: string
  username: string
  email: string
  phone_number: string
  role: string
  referral_code: string
  created_at: string
}

export interface SignUpResponse {
  user: SignUpUser
}

// ── Login ────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

// ── Refresh ─────────────────────────────────────────────────────────────────

export interface RefreshPayload {
  refreshToken: string
}

export interface RefreshResponse {
  accessToken: string
}

// ── Endpoints ───────────────────────────────────────────────────────────────

export async function signUp(payload: SignUpPayload): Promise<SignUpResponse> {
  return apiFetch<SignUpResponse>('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function refreshAccessToken(refreshToken: string): Promise<RefreshResponse> {
  return apiFetch<RefreshResponse>('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken } satisfies RefreshPayload),
  })
}
