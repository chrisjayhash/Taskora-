import { apiFetch, ApiError } from './http'
import { refreshAccessToken } from './auth'
import { getAccessToken, getRefreshToken, setAccessToken } from '../lib/auth-storage'

export interface InitializePaymentResponse {
  authorizationUrl: string
  reference: string
}

function isExpiredTokenError(err: unknown): boolean {
  if (!(err instanceof ApiError)) return false
  const msg = err.body?.error ?? ''
  return msg.toLowerCase().includes('invalid or expired access token') || err.status === 401
}

/**
 * Initialize a deposit checkout.
 *
 * IMPORTANT:
 * Your current backend is behaving like it expects `amountNaira` in NAIRA units
 * (e.g. 250), and then converts to kobo internally for Paystack.
 *
 * If you send kobo (25000), the backend converts again and Paystack shows ₦25,000.
 */
export async function initializeDeposit(amountNaira: number): Promise<InitializePaymentResponse> {
  const access = getAccessToken()
  if (!access) throw new ApiError(401, { error: 'Not authenticated' })

  const payload = { amountNaira: Math.round(amountNaira) }

  try {
    return await apiFetch<InitializePaymentResponse>('/payments/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    if (isExpiredTokenError(err)) {
      const refresh = getRefreshToken()
      if (!refresh) throw err

      const refreshed = await refreshAccessToken(refresh)
      setAccessToken(refreshed.accessToken)

      return await apiFetch<InitializePaymentResponse>('/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshed.accessToken}`,
        },
        body: JSON.stringify(payload),
      })
    }

    throw err
  }
}
