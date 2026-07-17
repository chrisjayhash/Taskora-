const WALLET_CACHE_KEY = 'taskora_wallet_cache_v1'

export interface WalletCache {
  balanceText: string
  currency: string
  updatedAt: string
  cachedAt: string
}

export function getWalletCache(): WalletCache | null {
  const raw = localStorage.getItem(WALLET_CACHE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as WalletCache
  } catch {
    return null
  }
}

export function setWalletCache(next: Omit<WalletCache, 'cachedAt'>) {
  const payload: WalletCache = {
    ...next,
    cachedAt: new Date().toISOString(),
  }
  localStorage.setItem(WALLET_CACHE_KEY, JSON.stringify(payload))
}

export function clearWalletCache() {
  localStorage.removeItem(WALLET_CACHE_KEY)
}
