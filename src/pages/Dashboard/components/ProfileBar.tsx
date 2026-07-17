import { Headphones, Bell, SlidersHorizontal } from 'lucide-react'
import type { StoredUser } from '../../../lib/auth-storage'

export default function ProfileBar({
  user,
  balance,
  notificationCount,
}: {
  user: StoredUser | null
  balance: string
  notificationCount: number
}) {
  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : 'TK'

  return (
    <div className="dash-profile-bar glass-strong">
      <div className="dash-profile-left">
        <div className="dash-profile-avatar">{initials}</div>
        <div>
          <div className="dash-profile-username">@{user?.username ?? 'guest'}</div>
          <div className="dash-profile-balance">
            <span className="text-gradient">{balance}</span>{' '}
            <span className="dash-profile-currency">NGN</span>
          </div>
        </div>
      </div>

      <div className="dash-profile-actions">
        <button type="button" className="dash-icon-btn" aria-label="Support">
          <Headphones className="h-4 w-4" />
        </button>
        <button type="button" className="dash-icon-btn" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <span className="dash-icon-badge">{notificationCount}</span>
          )}
        </button>
        <button type="button" className="dash-icon-btn" aria-label="Preferences">
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
