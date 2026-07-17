import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  RefreshCw,
  ExternalLink,
  Pickaxe,
  Users,
  Clock3,
  BadgeCheck,
  Instagram,
  Facebook,
  Music2,
  Youtube,
  Send,
  MessageCircle,
  Linkedin,
  Globe,
  Smartphone,
  Layers,
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
import DashboardHeader from '../Dashboard/components/DashboardHeader'
import BottomNav from '../Dashboard/components/BottomNav'
import TaskCardSkeleton from './components/TaskCardSkeleton'
import '../../App.css'
import '../../styles.css'
import './tasks.css'
import './tasks-skeleton.css'

function formatDateShort(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-NG', { day: '2-digit', month: 'short' })
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

function isAuthFailure(err: unknown) {
  if (!(err instanceof ApiError)) return false
  const msg = (err.body?.error ?? err.message ?? '').toLowerCase()
  return (
    err.status === 401 ||
    err.status === 403 ||
    msg.includes('not authenticated') ||
    msg.includes('invalid or expired access token') ||
    msg.includes('invalid refresh') ||
    msg.includes('expired refresh')
  )
}

function getPlatformIcon(categoryName: string) {
  switch (categoryName) {
    case 'INSTAGRAM':
      return Instagram
    case 'FACEBOOK':
      return Facebook
    case 'TIKTOK':
      return Music2
    case 'YOUTUBE':
      return Youtube
    case 'TELEGRAM':
      return Send
    case 'WHATSAPP':
      return MessageCircle
    case 'LINKEDIN':
      return Linkedin
    case 'WEBSITE':
      return Globe
    case 'APP_DOWNLOAD':
      return Smartphone
    default:
      return Layers
  }
}

function getBannerUrl(categoryName: string) {
  const map: Record<string, string> = {
    INSTAGRAM:
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1200&q=70',
    FACEBOOK:
      'https://images.unsplash.com/photo-1557683304-673a23048d34?auto=format&fit=crop&w=1200&q=70',
    TIKTOK:
      'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=70',
    YOUTUBE:
      'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=1200&q=70',
    WHATSAPP:
      'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=1200&q=70',
    TELEGRAM:
      'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?auto=format&fit=crop&w=1200&q=70',
    LINKEDIN:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=70',
    WEBSITE:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=70',
    APP_DOWNLOAD:
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=70',
  }

  return (
    map[categoryName] ??
    'https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=1200&q=70'
  )
}

function spawnRipple(e: MouseEvent<HTMLButtonElement>) {
  const btn = e.currentTarget
  const rect = btn.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2

  const span = document.createElement('span')
  span.className = 'task-btn-ripple'
  span.style.width = `${size}px`
  span.style.height = `${size}px`
  span.style.left = `${x}px`
  span.style.top = `${y}px`

  btn.appendChild(span)
  span.addEventListener('animationend', () => span.remove())
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

  function openLink(url: string) {
    const w = window.open(url, '_blank', 'noopener,noreferrer')
    if (!w) window.location.href = url
  }

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
        {/* Hero / intro */}
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

        {/* List */}
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
                      {/* Badges row */}
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

                      {/* Description */}
                      <div className="task-desc">{t.job_description}</div>

                      {/* Meta block (extra spacing) */}
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

                      {/* Actions */}
                      <div className="task-actions">
                        <button
                          type="button"
                          className="task-btn task-btn-ghost"
                          onClick={() => openLink(t.job_link)}
                        >
                          <span className="task-btn-inline">
                            Open <ExternalLink className="h-4 w-4" />
                          </span>
                        </button>

                        <button
                          type="button"
                          className="task-btn task-btn-primary task-btn-apply"
                          onClick={(e) => {
                            spawnRipple(e)
                            openLink(t.job_link)
                            setTimeout(
                              () => alert('Submit proof flow — coming soon'),
                              250,
                            )
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
