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
  Sun,
  Moon,
} from 'lucide-react'
import { toggleTheme } from '../../../lib/theme'
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
          <span className="dash-logo-text">Taskora</span>
        </Link>

        <div className="dash-header-menu" ref={ref}>
          <button
            type="button"
            className="dash-menu-trigger"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="dash-menu-dropdown glass"
              >
                <button className="dash-menu-item">
                  <UserIcon className="h-4 w-4" /> Profile
                </button>

                <button
                  className="dash-menu-item"
                  onClick={toggleTheme}
                >
                  <Sun className="h-4 w-4" /> Toggle Theme
                </button>

                <button className="dash-menu-item">
                  <Settings className="h-4 w-4" /> Settings
                </button>

                <button className="dash-menu-item">
                  <LifeBuoy className="h-4 w-4" /> Support
                </button>

                <div className="dash-menu-sep" />

                <button
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
