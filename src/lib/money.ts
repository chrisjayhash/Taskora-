export function formatNairaFromKobo(balanceKobo: string | number): string {
  const koboNum =
    typeof balanceKobo === 'string' ? Number(balanceKobo) : balanceKobo

  if (!Number.isFinite(koboNum)) return '₦0'

  const naira = koboNum / 100
  const hasDecimals = Math.round(naira * 100) % 100 !== 0

  const formatted = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(naira)

  return `₦${formatted}`
}

/**
 * Formats a NAIRA amount already in naira units (as returned by /wallet.balance).
 * Examples:
 *  "0" -> ₦0
 *  "2500" -> ₦2,500
 *  "2500.5" -> ₦2,500.50
 */
export function formatNaira(amountNaira: string | number): string {
  const num = typeof amountNaira === 'string' ? Number(amountNaira) : amountNaira
  if (!Number.isFinite(num)) return '₦0'

  const hasDecimals = Math.round(num * 100) % 100 !== 0
  const formatted = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(num)

  return `₦${formatted}`
}
