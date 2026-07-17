import { apiFetch, ApiError } from './http'
import { refreshAccessToken } from './auth'
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setStoredUser,
} from '../lib/auth-storage'

export interface MeWallet {
  id: string
  balanceKobo: string
  currency: string
}

export interface MeUser {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  phoneNumber: string
  role: string
  referralCode: string
  referredBy: string | null
  isVerified: boolean
  createdAt: string
  updatedAt: string
  wallet: MeWallet
  referralCount: number
}

export interface MeResponse {
  user: MeUser
}

function isExpiredTokenError(err: unknown): boolean {
  if (!(err instanceof ApiError)) return false
  const msg = err.body?.error ?? ''
  return msg.toLowerCase().includes('invalid or expired access token') || err.status === 401
}

export async function getMe(): Promise<MeResponse> {
  const access = getAccessToken()
  if (!access) throw new ApiError(401, { error: 'Not authenticated' })

  try {
    const res = await apiFetch<MeResponse>('/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })

    // Keep local storage user in sync with backend truth
    setStoredUser({
      id: res.user.id,
      firstName: res.user.firstName,
      lastName: res.user.lastName,
      username: res.user.username,
      email: res.user.email,
      role: res.user.role,
      phoneNumber: res.user.phoneNumber,
      referralCode: res.user.referralCode,
      isVerified: res.user.isVerified,
      referralCount: res.user.referralCount,
      wallet: res.user.wallet,
    })

    return res
  } catch (err) {
    // If access token expired, refresh and retry once
    if (isExpiredTokenError(err)) {
      const refresh = getRefreshToken()
      if (!refresh) throw err

      const refreshed = await refreshAccessToken(refresh)
      setAccessToken(refreshed.accessToken)

      const res = await apiFetch<MeResponse>('/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${refreshed.accessToken}`,
        },
      })

      setStoredUser({
        id: res.user.id,
        firstName: res.user.firstName,
        lastName: res.user.lastName,
        username: res.user.username,
        email: res.user.email,
        role: res.user.role,
        phoneNumber: res.user.phoneNumber,
        referralCode: res.user.referralCode,
        isVerified: res.user.isVerified,
        referralCount: res.user.referralCount,
        wallet: res.user.wallet,
      })

      return res
    }

    throw err
  }
}
