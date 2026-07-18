import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  RefreshCw,
  Pickaxe,
  Users,
  Clock3,
  BadgeCheck,
} from 'lucide-react'
import {
  getTasks,
  getTaskCategories,
  type TaskDto,
  type TaskCategoryDto,
} from '../../api/tasks'
import { ApiError } from '../../api/http'
import { clearAuthSession, getStoredUser } from '../../lib/auth-storage'
import { formatNairaFromKobo } from '../../lib/money'
import { getPlatformIcon, getBannerUrl, formatDateShort } from '../../lib/task-visuals'
import { isAuthFailure } from '../../lib/api-errors'
import { spawnRipple } from '../../lib/ripple'
import DashboardHeader from '../Dashboard/components/DashboardHeader'
import BottomNav from '../Dashboard/components/BottomNav'
import TaskCardSkeleton from './components/TaskCardSkeleton'
import '../../App.css'
import '../../styles.css'
import './tasks.css'
import './tasks-skeleton.css'

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

export default function BrowseTasksPage() {
  const navigate = useNavigate()
  const user = getStoredUser()

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [tasks, setTasks] = useState<TaskDto[]>([])
  const [categories, setCategories] = useState<TaskCategoryDto[]>([])

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('ALL')
  const [subcategory, setSubcategory] = useState<string>('ALL')

  async function loadAll(isManual = false) {
    if (isManual) setRefreshing(true)
    else setLoading(true)

    setError(null)
    try {
      const [t, c] = await Promise.all([getTasks(), getTaskCategories()])
      setTasks(t.tasks ?? [])
      setCategories(c.categories ?? [])
    } catch (err) {
      if (isAuthFailure(err)) {
        clearAuthSession()
        navigate('/login', { replace: true })
        return
      }
      if (err instanceof ApiError) setError(err.message)
      else setError('Failed to load tasks. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadAll(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const categoryOptions = useMemo(() => {
    const names = uniq(categories.map((c) => c.category_name))
    names.sort()
    return ['ALL', ...names]
  }, [categories])

  const subcategoryOptions = useMemo(() => {
    if (category === 'ALL') return ['ALL']
    const subs = uniq(
      categories
        .filter((c) => c.category_name === category)
        .map((c) => c.subcategory_name),
    )
    subs.sort()
    return ['ALL', ...subs]
  }, [categories, category])

  useEffect(() => {
    if (!subcategoryOptions.includes(subcategory)) setSubcategory('ALL')
  }, [subcategoryOptions, subcategory])

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase()

    return tasks.filter((t) => {
      if (category !== 'ALL' && t.category_name !== category) return false
      if (subcategory !== 'ALL' && t.subcategory_name !== subcategory) return false

      if (!q) return true
      const hay = [
        t.job_description,
        t.category_name,
        t.subcategory_name,
        t.advertiser_username,
      ]
        .join(' ')
        .toLowerCase()

      return hay.includes(q)
    })
  }, [tasks, search, category, subcategory])

  function handleLogout() {
    clearAuthSession()
    navigate('/')
  }

  const liveCount = filteredTasks.length

  return (
    <div className="tasks-page">
      <div className="tasks-orb-1" />
      <div className="tasks-orb-2" />

      <DashboardHeader user={user} onLogout={handleLogout} />

      <div className="tasks-shell">
        <section className="tasks-hero glass-strong">
          <div className="tasks-hero-icon glass">
            <Pickaxe className="h-5 w-5" />
          </div>

          <h1 className="tasks-hero-title">
            Task Feed — <span className="text-gradient">earn daily</span>
          </h1>

          <p className="tasks-hero-subtitle">
            Pick a quick job, submit proof, get paid to your Taskora wallet.
            Keep it simple—no long applications.
          </p>

          <div className="tasks-hero-stats">
            <div className="tasks-mini-stat glass">
              <div className="tasks-mini-stat-top">{loading ? '—' : liveCount}</div>
              <div className="tasks-mini-stat-bottom">Live tasks</div>
            </div>
            <div className="tasks-mini-stat glass">
              <div className="tasks-mini-stat-top">₦50M+</div>
              <div className="tasks-mini-stat-bottom">Paid out</div>
            </div>
            <div className="tasks-mini-stat glass">
              <div className="tasks-mini-stat-top">19k+</div>
              <div className="tasks-mini-stat-bottom">Workers</div>
            </div>
          </div>

          <div className="tasks-hero-actions">
            <div className="tasks-search">
              <Search className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks…"
              />
              <button
                type="button"
                className="tasks-refresh"
                onClick={() => loadAll(true)}
                disabled={loading || refreshing}
                aria-label="Refresh tasks"
                title="Refresh"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'tasks-refresh-spin' : ''}`} />
              </button>
            </div>

            <details className="tasks-categories glass" open={false}>
              <summary className="tasks-categories-summary">
                <span className="tasks-categories-label">Categories</span>
                <span className="tasks-categories-value">
                  {category === 'ALL' ? 'All platforms' : category}
                  {subcategory !== 'ALL' ? ` · ${subcategory}` : ''}
                </span>
              </summary>

              <div className="tasks-categories-body">
                <div className="tasks-filter-row">
                  {categoryOptions.map((name) => (
                    <button
                      key={name}
                      type="button"
                      className={`tasks-chip ${category === name ? 'tasks-chip-active' : ''}`}
                      onClick={() => setCategory(name)}
                    >
                      {name === 'ALL' ? 'All' : name}
                    </button>
                  ))}
                </div>

                <div className="tasks-filter-row">
                  {subcategoryOptions.map((name) => (
                    <button
                      key={name}
                      type="button"
                      className={`tasks-chip ${subcategory === name ? 'tasks-chip-active' : ''}`}
                      onClick={() => setSubcategory(name)}
                      disabled={category === 'ALL' && name !== 'ALL'}
                      style={
                        category === 'ALL' && name !== 'ALL'
                          ? { opacity: 0.45, cursor: 'not-allowed' }
                          : undefined
                      }
                    >
                      {name === 'ALL' ? 'All' : name}
                    </button>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </section>

        {error && <div className="tasks-error">{error}</div>}

        <div className="tasks-list">
          {loading ? (
            <>
              <TaskCardSkeleton />
              <TaskCardSkeleton />
              <TaskCardSkeleton />
            </>
          ) : filteredTasks.length === 0 ? (
            <div className="tasks-empty">No tasks match your filters right now.</div>
          ) : (
            filteredTasks.map((t) => {
              const Icon = getPlatformIcon(t.category_name)
              const banner = getBannerUrl(t.category_name)

              return (
                <article key={t.id} className="task-card glass-strong">
                  <div className="task-banner">
                    <img src={banner} alt="" loading="lazy" />
                    <div className="task-banner-overlay" />
                    <div className="task-banner-chip glass">
                      <Icon className="h-4 w-4" />
                      <span>{t.category_name}</span>
                    </div>
                  </div>

                  <div className="task-card-inner">
                    <div className="task-body">
                      <div className="task-top">
                        <div className="task-badges">
                          <span className="task-badge task-badge-muted">
                            {t.subcategory_name}
                          </span>
                          {t.proof_required && (
                            <span className="task-badge task-badge-muted task-badge-proof">
                              <BadgeCheck className="task-mini-icon" />
                              Proof
                            </span>
                          )}
                        </div>

                        <div
                          className="task-earn text-gradient"
                          title="Earnings per completion"
                        >
                          {formatNairaFromKobo(t.worker_earn_kobo)}
                        </div>
                      </div>

                      <div className="task-desc">{t.job_description}</div>

                      <div className="task-meta">
                        <div className="task-meta-item">
                          <Users className="task-mini-icon" />
                          <span>
                            <strong>{t.spots_remaining}</strong> spots
                          </span>
                        </div>
                        <div className="task-meta-item">
                          <Clock3 className="task-mini-icon" />
                          <span>
                            Expires <strong>{formatDateShort(t.expires_at)}</strong>
                          </span>
                        </div>
                        <div className="task-meta-item">
                          <span>
                            By <strong>@{t.advertiser_username}</strong>
                          </span>
                        </div>
                        <div className="task-meta-item">
                          <span>
                            Done <strong>{t.completed_count}/{t.quantity}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="task-actions">
                        <button
                          type="button"
                          className="task-btn task-btn-primary task-btn-apply"
                          onClick={(e) => {
                            spawnRipple(e)
                            navigate(`/tasks/${t.id}`)
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </div>

      <BottomNav role={user?.role} />
    </div>
  )
}
