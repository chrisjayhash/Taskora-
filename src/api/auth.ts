const BASE = import.meta.env.VITE_API_BASE_URL as string

// ── Shared shapes ────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  role: string
}

export interface ApiErrorBody {
  error: string
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ApiErrorBody,
  ) {
    super(body.error ?? 'An unexpected error occurred')
    this.name = 'ApiError'
  }
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

// ── Internal fetch helper ────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    })
  } catch (networkErr) {
    console.error(`[API] Network/fetch error on ${path}:`, networkErr)
    throw new ApiError(0, {
      error: `Cannot reach the server. Make sure the backend is running on ${BASE}`,
    })
  }

  if (import.meta.env.DEV) {
    console.log(`[API] ${res.status} ${res.url}`)
  }

  const text = await res.text()

  let json: unknown
  try {
    json = text ? JSON.parse(text) : {}
  } catch {
    throw new ApiError(res.status, {
      error: `Server returned an unexpected response (${res.status}).`,
    })
  }

  if (!res.ok) {
    throw new ApiError(res.status, json as ApiErrorBody)
  }

  return json as T
}

// ── Endpoints ────────────────────────────────────────────────────────────────

export async function signUp(payload: SignUpPayload): Promise<SignUpResponse> {
  return apiFetch<SignUpResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
