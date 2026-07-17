import { Bell, RefreshCw } from 'lucide-react'
import type { StoredUser } from '../../../lib/auth-storage'

function shortenBalanceText(balance: string) {
  // CSS also ellipsizes, but this ensures the "…" appears even if layout changes.
  const max = 14
  if (!balance) return '₦0'
  if (balance.length <= max) return balance
  return `${balance.slice(0, max - 1)}…`
}

export default function ProfileBar({
  user,
  balance,
  notificationCount,
  onRefreshBalance,
  refreshingBalance,
}: {
  user: StoredUser | null
  balance: string
  notificationCount: number
  onRefreshBalance?: () => void
  refreshingBalance?: boolean
}) {
  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : 'TK'

  return (
    <div
      className="dash-profile-bar glass-strong"
      // Slimmer card
      style={{ padding: '0.8rem 0.95rem' }}
    >
      <div className="dash-profile-left">
        <div
          className="dash-profile-avatar"
          style={{ height: '2.5rem', width: '2.5rem' }}
        >
          {initials}
        </div>

        <div style={{ minWidth: 0 }}>
          <div className="dash-profile-username">@{user?.username ?? 'guest'}</div>

          {/* Balance line: Balance ... (tiny refresh) NGN */}
          <div className="dash-balance-row">
            <span
              className="text-gradient dash-balance-text"
              title={balance}
              aria-label={`Wallet balance ${balance}`}
            >
              {shortenBalanceText(balance)}
            </span>

            {/* refresh icon should sit just before NGN */}
            <button
              type="button"
              className="dash-balance-refresh"
              onClick={onRefreshBalance}
              disabled={!onRefreshBalance || !!refreshingBalance}
              aria-label="Refresh wallet balance"
              title="Refresh balance"
            >
              <RefreshCw
                className={`dash-balance-refresh-icon ${
                  refreshingBalance ? 'dash-balance-refresh-spin' : ''
                }`}
              />
            </button>

            <span className="dash-profile-currency">NGN</span>
          </div>
        </div>
      </div>

      {/* Only keep notifications */}
      <div className="dash-profile-actions">
        <button type="button" className="dash-icon-btn" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <span className="dash-icon-badge">{notificationCount}</span>
          )}
        </button>
      </div>
    </div>
  )
}
