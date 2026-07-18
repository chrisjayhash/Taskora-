import { ApiError } from '../api/http'

/**
 * Broad check used for page-level data loading (GET requests).
 * Treats 401 and 403 as "you shouldn't be here" -> force logout.
 */
export function isAuthFailure(err: unknown): boolean {
  if (!(err instanceof ApiError)) return false
  const msg = (err.body?.error ?? err.message ?? '').toLowerCase()
  return (
    err.status === 401 ||
    err.status === 403 ||
    msg.includes('not authenticated') ||
    msg.includes('invalid or expired access token') ||
    msg.includes('invalid refresh') ||
    msg.includes('expired refresh')
  )
}

/**
 * Narrow check used for actions where a 403 can mean a legitimate
 * business rule violation (e.g. "you can't submit to your own task")
 * rather than an expired/invalid session. Only forces logout on a
 * real token problem.
 */
export function isSessionExpired(err: unknown): boolean {
  if (!(err instanceof ApiError)) return false
  if (err.status === 401) return true
  const msg = (err.body?.error ?? err.message ?? '').toLowerCase()
  return (
    msg.includes('not authenticated') ||
    msg.includes('invalid or expired access token') ||
    msg.includes('invalid refresh') ||
    msg.includes('expired refresh')
  )
}
