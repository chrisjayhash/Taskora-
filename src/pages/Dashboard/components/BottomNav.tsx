import { useState, useRef, useEffect } from 'react'
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

export default function BottomNav() {
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

  return (
    <nav className="dash-bottom-nav">
      <div className="dash-bottom-nav-inner glass-strong">
        {/* Left group */}
        <div className="dash-nav-group dash-nav-group-left">
          {leftTabs.map((t) => {
            const Icon = t.icon
            const isActive = active === t.id
            return (
              <button
                type="button"
                key={t.id}
                className={`dash-nav-item ${isActive ? 'dash-nav-item-active' : ''}`}
                onClick={() => setActive(t.id)}
              >
                <Icon className="h-5 w-5" />
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>

        {/* Center FAB */}
        <div className="dash-nav-fab-slot" ref={fabRef}>
          <AnimatePresence>
            {fabOpen && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="dash-fab-menu glass-strong"
              >
                <button type="button" className="dash-fab-menu-item">
                  <ClipboardList className="h-4 w-4" /> Post a task
                </button>
                <button type="button" className="dash-fab-menu-item">
                  <Send className="h-4 w-4" /> Browse tasks
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            className="dash-nav-fab"
            onClick={() => setFabOpen((v) => !v)}
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

        {/* Right group */}
        <div className="dash-nav-group dash-nav-group-right">
          {rightTabs.map((t) => {
            const Icon = t.icon
            const isActive = active === t.id
            return (
              <button
                type="button"
                key={t.id}
                className={`dash-nav-item ${isActive ? 'dash-nav-item-active' : ''}`}
                onClick={() => setActive(t.id)}
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
