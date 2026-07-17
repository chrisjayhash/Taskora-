const BASE = import.meta.env.VITE_API_BASE_URL as string

export interface ApiErrorBody {
  error: string
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ApiErrorBody,
  ) {
    super(body?.error ?? 'An unexpected error occurred')
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
      },
    })
  } catch (networkErr) {
    console.error(`[API] Network/fetch error on ${path}:`, networkErr)
    throw new ApiError(0, { error: `Cannot reach the server. Make sure the backend is running on ${BASE}` })
  }

  const text = await res.text()
  let json: unknown = {}
  try {
    json = text ? JSON.parse(text) : {}
  } catch {
    // non-json response
    throw new ApiError(res.status, { error: `Server returned an unexpected response (${res.status}).` })
  }

  if (!res.ok) {
    throw new ApiError(res.status, json as ApiErrorBody)
  }

  return json as T
}
