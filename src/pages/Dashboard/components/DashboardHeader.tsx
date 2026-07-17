import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  User as UserIcon,
  Settings,
  LifeBuoy,
  LogOut,
} from 'lucide-react'
import type { StoredUser } from '../../../lib/auth-storage'

export default function DashboardHeader({
  user,
  onLogout,
}: {
  user: StoredUser | null
  onLogout: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <header className="dash-header">
      <div className="dash-header-inner glass">
        <Link to="/dashboard" className="dash-logo">
          <img src="/icon.png" alt="Taskora" className="dash-logo-icon" />
          <span className="dash-logo-text">Taskora</span>
        </Link>

        <div className="dash-header-menu" ref={ref}>
          <button
            type="button"
            className="dash-menu-trigger"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="dash-menu-dropdown glass-strong"
              >
                <div className="dash-menu-user">
                  <div className="dash-menu-avatar">
                    {user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'TK'}
                  </div>
                  <div>
                    <div className="dash-menu-name">
                      {user ? `${user.firstName} ${user.lastName}` : 'Taskora User'}
                    </div>
                    <div className="dash-menu-username">@{user?.username ?? 'guest'}</div>
                  </div>
                </div>

                <div className="dash-menu-sep" />

                <button type="button" className="dash-menu-item">
                  <UserIcon className="h-4 w-4" /> Profile
                </button>
                <button type="button" className="dash-menu-item">
                  <Settings className="h-4 w-4" /> Settings
                </button>
                <button type="button" className="dash-menu-item">
                  <LifeBuoy className="h-4 w-4" /> Support
                </button>

                <div className="dash-menu-sep" />

                <button
                  type="button"
                  className="dash-menu-item dash-menu-item-danger"
                  onClick={onLogout}
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
