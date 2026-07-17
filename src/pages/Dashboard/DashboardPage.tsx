import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  clearAuthSession,
  getStoredUser,
  type StoredUser,
} from '../../lib/auth-storage'
import { announcements } from '../../lib/dashboard-mock'
import { getMe } from '../../api/me'
import { getWallet } from '../../api/wallet'
import { formatNaira } from '../../lib/money'
import { getWalletCache, setWalletCache } from '../../lib/dashboard-cache'

import DashboardHeader from './components/DashboardHeader'
import DashboardHero from './components/DashboardHero'
import ProfileBar from './components/ProfileBar'
import AnnouncementBanner from './components/AnnouncementBanner'
import WelcomeSection from './components/WelcomeSection'
import RoleCTA from './components/RoleCTA'
import QuickActions from './components/QuickActions'
import ActionGrid from './components/ActionGrid'
import StatsGrid from './components/StatsGrid'
import TaskCategoriesStrip from './components/TaskCategoriesStrip'
import RecentActivity from './components/RecentActivity'
import BottomNav from './components/BottomNav'

import '../../App.css'
import '../../styles.css'
import './dashboard-actions.css'
import './profilebar-overrides.css'

export default function DashboardPage() {
  const navigate = useNavigate()

  const [user, setUser] = useState<StoredUser | null>(() => getStoredUser())
  const [loading, setLoading] = useState(false)
  const [refreshingBalance, setRefreshingBalance] = useState(false)

  const cachedWallet = useMemo(() => getWalletCache(), [])
  const [balanceText, setBalanceText] = useState<string>(() => cachedWallet?.balanceText ?? '₦0')

  const notificationCount = 2

  // Hard caching:
  // - On mount: only fetch /me if we don't already have a stored user.
  // - On mount: only fetch /wallet if we have no cached wallet.
  useEffect(() => {
    let alive = true

    async function initialLoad() {
      const hasUser = !!getStoredUser()
      const hasWallet = !!getWalletCache()

      if (hasUser && hasWallet) return

      setLoading(true)
      try {
        if (!hasUser) {
          const meRes = await getMe()
          if (!alive) return

          const u = meRes.user
          const stored: StoredUser = {
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            username: u.username,
            email: u.email,
            role: u.role,
            phoneNumber: u.phoneNumber,
            referralCode: u.referralCode,
            isVerified: u.isVerified,
            referralCount: u.referralCount,
            wallet: u.wallet,
          }
          setUser(stored)
        } else {
          // keep state in sync with localStorage
          setUser(getStoredUser())
        }

        if (!hasWallet) {
          const walletRes = await getWallet()
          if (!alive) return

          const formatted = formatNaira(walletRes.wallet.balance)
          setBalanceText(formatted)
          setWalletCache({
            balanceText: formatted,
            currency: walletRes.wallet.currency,
            updatedAt: walletRes.wallet.updated_at,
          })
        }
      } catch {
        clearAuthSession()
        navigate('/login', { replace: true })
      } finally {
        if (alive) setLoading(false)
      }
    }

    initialLoad()
    return () => {
      alive = false
    }
  }, [navigate])

  async function refreshWalletBalance() {
    setRefreshingBalance(true)
    try {
      const walletRes = await getWallet()
      const formatted = formatNaira(walletRes.wallet.balance)
      setBalanceText(formatted)
      setWalletCache({
        balanceText: formatted,
        currency: walletRes.wallet.currency,
        updatedAt: walletRes.wallet.updated_at,
      })
    } catch {
      clearAuthSession()
      navigate('/login', { replace: true })
    } finally {
      setRefreshingBalance(false)
    }
  }

  const displayBalance = useMemo(() => balanceText, [balanceText])

  function handleLogout() {
    clearAuthSession()
    navigate('/')
  }

  return (
    <div className="dash-page">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <main className="dash-main">
        <DashboardHero />

        <div className="dash-content">
          <ProfileBar
            user={user}
            balance={displayBalance}
            notificationCount={notificationCount}
            onRefreshBalance={refreshWalletBalance}
            refreshingBalance={refreshingBalance}
          />

          <AnnouncementBanner items={announcements} />
          <WelcomeSection user={user} />
          <RoleCTA user={user} />

          <QuickActions user={user} />
          <ActionGrid />
          <StatsGrid balance={displayBalance} />

          <TaskCategoriesStrip />
          <RecentActivity />
        </div>
      </main>

      {/* Role-aware FAB menu */}
      <BottomNav role={user?.role} />

      {loading && (
        <div
          style={{
            position: 'fixed',
            top: '4.25rem',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '0.35rem 0.7rem',
            borderRadius: '999px',
            fontSize: '0.7rem',
            color: 'var(--muted-foreground)',
            background: 'rgba(15, 27, 46, 0.65)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(14px)',
            zIndex: 60,
          }}
        >
          Loading…
        </div>
      )}
    </div>
  )
}
