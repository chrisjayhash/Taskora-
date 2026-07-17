import { ArrowRight, Megaphone, Briefcase } from 'lucide-react'
import type { StoredUser } from '../../../lib/auth-storage'

export default function RoleCTA({ user }: { user: StoredUser | null }) {
  const isAdvertiser = user?.role === 'advertiser'

  return (
    <div className="dash-role-cta glass-strong">
      <div className="dash-role-cta-icon">
        {isAdvertiser ? (
          <Megaphone className="h-5 w-5" />
        ) : (
          <Briefcase className="h-5 w-5" />
        )}
      </div>
      <div className="dash-role-cta-text">
        <div className="dash-role-cta-title">
          {isAdvertiser ? 'Ready to grow your brand?' : 'Ready to start earning?'}
        </div>
        <div className="dash-role-cta-subtitle">
          {isAdvertiser
            ? 'Post a task and reach thousands of active workers today.'
            : 'Browse available tasks and get your first payout today.'}
        </div>
      </div>
      <button type="button" className="dash-role-cta-btn btn-glow">
        {isAdvertiser ? 'Post a task' : 'Find tasks'} <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}
