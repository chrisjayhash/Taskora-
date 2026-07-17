import { useNavigate } from 'react-router-dom'
import { getStoredUser, clearAuthSession } from '../../lib/auth-storage'
import { announcements } from '../../lib/dashboard-mock'
import DashboardHeader from './components/DashboardHeader'
import DashboardHero from './components/DashboardHero'
import ProfileBar from './components/ProfileBar'
import AnnouncementBanner from './components/AnnouncementBanner'
import WelcomeSection from './components/WelcomeSection'
import RoleCTA from './components/RoleCTA'
import QuickActions from './components/QuickActions'
import StatsGrid from './components/StatsGrid'
import TaskCategoriesStrip from './components/TaskCategoriesStrip'
import RecentActivity from './components/RecentActivity'
import BottomNav from './components/BottomNav'
import '../../App.css'
import '../../styles.css'

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = getStoredUser()

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
          <ProfileBar user={user} balance="₦28,450" notificationCount={2} />
          <AnnouncementBanner items={announcements} />
          <WelcomeSection user={user} />
          <RoleCTA user={user} />
          <QuickActions user={user} />
          <StatsGrid />
          <TaskCategoriesStrip />
          <RecentActivity />
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
