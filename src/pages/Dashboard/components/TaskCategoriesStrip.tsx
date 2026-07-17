import { ArrowRight } from 'lucide-react'
import { quickCategories } from '../../../lib/dashboard-mock'

export default function TaskCategoriesStrip() {
  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <h3 className="dash-section-title">Browse tasks by platform</h3>
        <button type="button" className="dash-section-link">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="dash-categories-scroll dash-no-scrollbar">
        {quickCategories.map((c) => {
          const Icon = c.icon
          return (
            <button type="button" key={c.name} className="dash-category-chip glass">
              <span className="dash-category-chip-icon">
                <Icon className="h-4 w-4" />
              </span>
              <span className="dash-category-chip-name">{c.name}</span>
              <span className="dash-category-chip-rate">{c.rate}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
