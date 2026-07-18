import { useNavigate } from 'react-router-dom'
import {
  ArrowDownToLine,
  ArrowUpToLine,
  Smartphone,
  ListChecks,
  type LucideIcon,
} from 'lucide-react'

type Accent = 'blue' | 'green' | 'purple' | 'pink'

type ActionItem = {
  id: 'deposit' | 'withdraw' | 'airtime' | 'submissions'
  title: string
  subtitle: string
  icon: LucideIcon
  accent: Accent
  href?: string
}

const actions: ActionItem[] = [
  {
    id: 'deposit',
    title: 'Deposit',
    subtitle: 'Top up your wallet',
    icon: ArrowDownToLine,
    accent: 'blue',
    href: '/deposit',
  },
  {
    id: 'withdraw',
    title: 'Withdraw',
    subtitle: 'Cash out to bank',
    icon: ArrowUpToLine,
    accent: 'green',
  },
  {
    id: 'airtime',
    title: 'Buy airtime',
    subtitle: 'Airtime & data',
    icon: Smartphone,
    accent: 'purple',
  },
  {
    id: 'submissions',
    title: 'Submissions',
    subtitle: 'View your history',
    icon: ListChecks,
    accent: 'pink',
    href: '/submissions',
  },
]

export default function ActionGrid() {
  const navigate = useNavigate()

  function handleClick(a: ActionItem) {
    if (a.href) {
      navigate(a.href)
      return
    }
    alert(`${a.title} — coming soon`)
  }

  return (
    <section className="dash-section">
      <div className="dash-section-header">
        <h3 className="dash-section-title">Quick actions</h3>
      </div>

      <div className="dash-action-grid">
        {actions.map((a) => {
          const Icon = a.icon
          return (
            <button
              key={a.id}
              type="button"
              className={`dash-action-card glass dash-action-${a.accent}`}
              onClick={() => handleClick(a)}
            >
              <div className="dash-action-card-top">
                <div className="dash-action-icon">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="dash-action-title">{a.title}</div>
              <div className="dash-action-subtitle">{a.subtitle}</div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
