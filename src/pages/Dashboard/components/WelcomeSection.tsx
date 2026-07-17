import type { StoredUser } from '../../../lib/auth-storage'

export default function WelcomeSection({ user }: { user: StoredUser | null }) {
  return (
    <div className="dash-welcome">
      <h2 className="dash-welcome-title">
        Welcome back, {user ? `${user.firstName} ${user.lastName}` : 'friend'}!{' '}
        <span className="dash-welcome-wave">👋</span>
      </h2>
      <p className="dash-welcome-subtitle">
        Here's what's happening with your account today.
      </p>
    </div>
  )
}
