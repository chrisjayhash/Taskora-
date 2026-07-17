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
}

export interface TasksResponse {
  tasks: TaskDto[]
}

export interface TaskCategoryDto {
  category_id: string
  category_name: string
  subcategory_id: string
  subcategory_name: string
  base_rate_kobo: string
}

export interface TaskCategoriesResponse {
  categories: TaskCategoryDto[]
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

export function getTasks(): Promise<TasksResponse> {
  return authedGet<TasksResponse>('/tasks')
}

export function getTaskCategories(): Promise<TaskCategoriesResponse> {
  return authedGet<TaskCategoriesResponse>('/tasks/categories')
}
