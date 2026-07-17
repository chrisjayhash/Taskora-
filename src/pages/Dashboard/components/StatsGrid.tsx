import { motion } from 'framer-motion'
import { statCards } from '../../../lib/dashboard-mock'

export default function StatsGrid({ balance }: { balance?: string }) {
  const cards = statCards.map((c) =>
    c.id === 'balance' && balance ? { ...c, value: balance } : c,
  )

  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <h3 className="dash-section-title">Your overview</h3>
      </div>
      <div className="dash-stats-grid">
        {cards.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`dash-stat-card glass dash-stat-${s.accent}`}
            >
              <div className="dash-stat-icon">
                <Icon className="h-4 w-4" />
              </div>
              <div className="dash-stat-value">{s.value}</div>
              <div className="dash-stat-label">{s.label}</div>
              <div className="dash-stat-helper">{s.helper}</div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
