import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Home,
  Store,
  Plus,
  Briefcase,
  Menu as MenuIcon,
  Send,
  ClipboardList,
} from 'lucide-react'

const leftTabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'marketplace', label: 'Marketplace', icon: Store },
]

const rightTabs = [
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'more', label: 'More', icon: MenuIcon },
]

export default function BottomNav({ role }: { role?: string | null }) {
  const navigate = useNavigate()
  const [active, setActive] = useState('home')
  const [fabOpen, setFabOpen] = useState(false)
  const fabRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setFabOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const isWorker = role === 'worker'
  const isAdvertiser = role === 'advertiser'

  // - worker: hide "Post a task"
  // - advertiser: hide "Browse tasks"
  const showPostTask = !isWorker
  const showBrowseTasks = !isAdvertiser
  const hasFabActions = showPostTask || showBrowseTasks

  function navTo(tabId: string) {
    setActive(tabId)
    if (tabId === 'home') navigate('/dashboard')
    if (tabId === 'jobs') navigate('/tasks')
    // marketplace/more: placeholder for now
  }

  return (
    <nav className="dash-bottom-nav">
      <div className="dash-bottom-nav-inner glass-strong">
        <div className="dash-nav-group dash-nav-group-left">
          {leftTabs.map((t) => {
            const Icon = t.icon
            const isActive = active === t.id
            return (
              <button
                type="button"
                key={t.id}
                className={`dash-nav-item ${isActive ? 'dash-nav-item-active' : ''}`}
                onClick={() => navTo(t.id)}
              >
                <Icon className="h-5 w-5" />
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>

        <div className="dash-nav-fab-slot" ref={fabRef}>
          <AnimatePresence>
            {fabOpen && hasFabActions && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="dash-fab-menu glass-strong"
              >
                {showPostTask && (
                  <button
                    type="button"
                    className="dash-fab-menu-item"
                    onClick={() => {
                      setFabOpen(false)
                      alert('Post a task — coming soon')
                    }}
                  >
                    <ClipboardList className="h-4 w-4" /> Post a task
                  </button>
                )}

                {showBrowseTasks && (
                  <button
                    type="button"
                    className="dash-fab-menu-item"
                    onClick={() => {
                      setFabOpen(false)
                      navigate('/tasks')
                    }}
                  >
                    <Send className="h-4 w-4" /> Browse tasks
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            className="dash-nav-fab"
            onClick={() => {
              if (!hasFabActions) return
              setFabOpen((v) => !v)
            }}
            aria-label="Quick actions"
          >
            <Plus
              className="h-6 w-6"
              style={{
                transform: fabOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>
        </div>

        <div className="dash-nav-group dash-nav-group-right">
          {rightTabs.map((t) => {
            const Icon = t.icon
            const isActive = active === t.id
            return (
              <button
                type="button"
                key={t.id}
                className={`dash-nav-item ${isActive ? 'dash-nav-item-active' : ''}`}
                onClick={() => navTo(t.id)}
              >
                <Icon className="h-5 w-5" />
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
