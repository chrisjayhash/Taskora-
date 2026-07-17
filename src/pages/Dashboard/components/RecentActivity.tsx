import { ArrowRight } from 'lucide-react'
import { recentActivity } from '../../../lib/dashboard-mock'

export default function RecentActivity() {
  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <h3 className="dash-section-title">Recent activity</h3>
        <button type="button" className="dash-section-link">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="dash-activity-list">
        {recentActivity.map((a) => (
          <div key={a.id} className="dash-activity-item glass">
            <div className="dash-activity-info">
              <div className="dash-activity-title">{a.title}</div>
              <div className="dash-activity-meta">{a.meta}</div>
            </div>
            <div className={`dash-activity-amount ${a.positive ? 'positive' : 'negative'}`}>
              {a.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
