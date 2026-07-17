import { apiFetch, ApiError } from './http'
import { refreshAccessToken } from './auth'
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from '../lib/auth-storage'

export interface WalletDto {
  id: string
  balance: string
  currency: string
  updated_at: string
}

export interface WalletResponse {
  wallet: WalletDto
}

function isExpiredTokenError(err: unknown): boolean {
  if (!(err instanceof ApiError)) return false
  const msg = err.body?.error ?? ''
  return msg.toLowerCase().includes('invalid or expired access token') || err.status === 401
}

export async function getWallet(): Promise<WalletResponse> {
  const access = getAccessToken()
  if (!access) throw new ApiError(401, { error: 'Not authenticated' })

  try {
    return await apiFetch<WalletResponse>('/wallet', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
  } catch (err) {
    if (isExpiredTokenError(err)) {
      const refresh = getRefreshToken()
      if (!refresh) throw err

      const refreshed = await refreshAccessToken(refresh)
      setAccessToken(refreshed.accessToken)

      return await apiFetch<WalletResponse>('/wallet', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${refreshed.accessToken}`,
        },
      })
    }

    throw err
  }
}
