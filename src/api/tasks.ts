import { apiFetch, ApiError } from './http'
import { refreshAccessToken } from './auth'
import { getAccessToken, getRefreshToken, setAccessToken } from '../lib/auth-storage'

export interface TaskDto {
  id: string
  job_link: string
  job_description: string
  proof_required: boolean
  proof_type: string
  quantity: number
  worker_earn_kobo: string
  completed_count: number
  expires_at: string
  created_at: string
  spots_remaining: number
  category_name: string
  subcategory_name: string
  advertiser_username: string
  status?: string
}

export interface TasksResponse {
  tasks: TaskDto[]
}

export interface TaskCategoriesResponse {
  categories: any[]
}

export interface TaskDetailResponse {
  task: TaskDto
}

export interface SubmitTaskProofResponse {
  submission: any
}

export interface SubmissionHistoryItem {
  id: string
  task_id: string
  status: 'pending' | 'approved' | 'rejected'
  proof_value: string
  rejection_reason: string | null
  submitted_at: string
  reviewed_at: string | null
  job_description: string
  worker_earn_kobo: string
  category_name: string
  subcategory_name: string
}

export interface SubmissionsResponse {
  submissions: SubmissionHistoryItem[]
}

function isExpiredTokenError(err: unknown): boolean {
  if (!(err instanceof ApiError)) return false
  const msg = err.body?.error ?? ''
  return msg.toLowerCase().includes('invalid or expired access token') || err.status === 401
}

async function authedGet<T>(path: string): Promise<T> {
  const access = getAccessToken()
  if (!access) throw new ApiError(401, { error: 'Not authenticated' })

  try {
    return await apiFetch<T>(path, {
      method: 'GET',
      headers: { Authorization: `Bearer ${access}` },
    })
  } catch (err) {
    if (!isExpiredTokenError(err)) throw err

    const refresh = getRefreshToken()
    if (!refresh) throw err

    const refreshed = await refreshAccessToken(refresh)
    setAccessToken(refreshed.accessToken)

    return await apiFetch<T>(path, {
      method: 'GET',
      headers: { Authorization: `Bearer ${refreshed.accessToken}` },
    })
  }
}

async function authedPost<T>(path: string, body: unknown): Promise<T> {
  const access = getAccessToken()
  if (!access) throw new ApiError(401, { error: 'Not authenticated' })

  try {
    return await apiFetch<T>(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify(body ?? {}),
    })
  } catch (err) {
    if (!isExpiredTokenError(err)) throw err

    const refresh = getRefreshToken()
    if (!refresh) throw err

    const refreshed = await refreshAccessToken(refresh)
    setAccessToken(refreshed.accessToken)

    return await apiFetch<T>(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshed.accessToken}`,
      },
      body: JSON.stringify(body ?? {}),
    })
  }
}

/* ✅ KEEP ALL ORIGINAL EXPORTS */

export function getTasks(): Promise<TasksResponse> {
  return authedGet<TasksResponse>('/tasks')
}

export function getTaskCategories(): Promise<TaskCategoriesResponse> {
  return authedGet<TaskCategoriesResponse>('/tasks/categories')
}

export function getTaskById(id: string): Promise<TaskDetailResponse> {
  return authedGet<TaskDetailResponse>(`/tasks/${id}`)
}

export function submitTaskProof(id: string, proofValue?: string): Promise<SubmitTaskProofResponse> {
  const body = proofValue !== undefined ? { proofValue } : {}
  return authedPost<SubmitTaskProofResponse>(`/tasks/${id}/submit`, body)
}

export function getMySubmissions(): Promise<SubmissionsResponse> {
  return authedGet<SubmissionsResponse>('/submissions/mine')
}
