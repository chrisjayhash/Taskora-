import { motion } from 'framer-motion'
import { LayoutDashboard, ChevronRight } from 'lucide-react'

export default function DashboardHero() {
  return (
    <section className="dash-hero">
      <div className="dash-hero-orb-1" />
      <div className="dash-hero-orb-2" />
      <div className="dash-hero-orb-3" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="dash-hero-content"
      >
        <div className="dash-hero-icon glass">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <h1 className="dash-hero-title">Dashboard</h1>
        <div className="dash-hero-breadcrumb">
          <span>Home</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="dash-hero-breadcrumb-active">Dashboard</span>
        </div>
      </motion.div>
    </section>
  )
}
