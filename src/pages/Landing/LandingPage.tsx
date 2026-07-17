import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Instagram,
  Facebook,
  Youtube,
  Music2,
  Globe,
  Send,
  MessageCircle,
  Linkedin,
  Smartphone,
  Wallet,
  ShieldCheck,
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
} from 'lucide-react'
import heroImage from '../../assets/hero-earner.jpg'
import '../../App.css'
import '../../styles.css'

const nav = [
  { label: 'How it works', href: '#how' },
  { label: 'Tasks', href: '#tasks' },
  { label: 'Earnings', href: '#earnings' },
  { label: 'FAQ', href: '#faq' },
]

const categories = [
  { name: 'Instagram', icon: Instagram, rate: '₦8 – ₦25' },
  { name: 'TikTok', icon: Music2, rate: '₦10 – ₦30' },
  { name: 'Facebook', icon: Facebook, rate: '₦8 – ₦20' },
  { name: 'YouTube', icon: Youtube, rate: '₦15 – ₦50' },
  { name: 'WhatsApp', icon: MessageCircle, rate: '₦5 – ₦15' },
  { name: 'Telegram', icon: Send, rate: '₦8 – ₦20' },
  { name: 'LinkedIn', icon: Linkedin, rate: '₦12 – ₦30' },
  { name: 'Website Visit', icon: Globe, rate: '₦5 – ₦12' },
  { name: 'App Download', icon: Smartphone, rate: '₦40 – ₦150' },
]

const steps = [
  {
    n: '01',
    title: 'Create your free account',
    body: 'Sign up as a worker to earn or an advertiser to grow. Your Taskora wallet is auto-created.',
  },
  {
    n: '02',
    title: 'Pick a task or post one',
    body: 'Workers browse tasks by category. Advertisers set budget, quantity and worker pay in Naira.',
  },
  {
    n: '03',
    title: 'Submit proof & get paid',
    body: 'Upload a screenshot or link. Once approved, Naira drops straight into your wallet.',
  },
]

const trustBadges = [
  { icon: ShieldCheck, label: 'Escrowed budgets' },
  { icon: Zap, label: 'Paystack payouts' },
  { icon: Users, label: 'Real Nigerian workers' },
  { icon: TrendingUp, label: 'Verified engagement' },
]

const faqs = [
  {
    q: 'How fast do I get paid?',
    a: 'Approved submissions credit your Taskora wallet instantly. Withdrawals via Paystack process in minutes on business days.',
  },
  {
    q: 'Is there a minimum to start earning?',
    a: 'None. Sign up free, complete your first task and start earning. Withdrawals start from ₦500.',
  },
  {
    q: 'How do advertisers know engagement is real?',
    a: 'Every task requires proof — screenshot, link or timed action. Reviewers verify before your budget is released.',
  },
  {
    q: 'What does it cost to post a task?',
    a: 'You only pay the worker rate plus a small platform fee. Set your own budget, pause any time.',
  },
]

function useScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return scrolled
}

function Header() {
  const scrolled = useScrolled()
  const [open, setOpen] = useState(false)
  return (
    <header className={`header ${scrolled ? 'header-scrolled' : 'header-normal'}`}>
      <div className="header-container">
        <div className={`header-nav glass ${scrolled ? 'with-shadow' : ''}`}>
          <a href="#" className="header-logo">
            <img src="/icon.png" alt="Taskora" className="header-logo-icon" />
            <span className="header-logo-text">Taskora</span>
          </a>
          <nav className="header-nav-menu">
            {nav.map((i) => (
              <a key={i.href} href={i.href} className="nav-link">
                {i.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a href="#signin" className="header-signin">
              Sign in
            </a>
            <Link to="/signup" className="header-getstarted btn-glow">
              Get started
            </Link>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="menu-toggle"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="glass mobile-menu">
            <div className="mobile-menu-nav">
              {nav.map((i) => (
                <a
                  key={i.href}
                  href={i.href}
                  onClick={() => setOpen(false)}
                  className="nav-link"
                >
                  {i.label}
                </a>
              ))}
            </div>
            <div className="mobile-menu-actions">
              <a href="#signin" className="mobile-signin">
                Sign in
              </a>
              <Link to="/signup" className="mobile-getstarted" onClick={() => setOpen(false)}>
                Get started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-orb-1" />
      <div className="hero-orb-2" />

      <div className="hero-content">
        <div className="hero-left">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hero-badge glass"
          >
            <span className="hero-badge-dot" />
            <span>Now paying out in Naira via Paystack</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="hero-title"
          >
            Follow. Like. Watch.
            <br />
            <span className="text-gradient">Cash out in Naira.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hero-description"
          >
            Taskora pays real Nigerians to complete simple social tasks —
            following pages, watching videos, downloading apps and more.
            Brands get real reach. Workers get real money.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="hero-buttons"
          >
            <Link to="/signup" className="hero-btn-primary btn-glow">
              Start earning free
              <ArrowRight className="h-4 w-4" style={{ transition: 'all 0.3s ease' }} />
            </Link>
            <a href="#post" className="hero-btn-secondary glass">
              Post a task
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="hero-stats"
          >
            {[
              { k: '₦42M+', v: 'Paid out' },
              { k: '128k', v: 'Active workers' },
              { k: '9', v: 'Task platforms' },
            ].map((s) => (
              <div key={s.v} className="hero-stat glass">
                <div className="hero-stat-number">{s.k}</div>
                <div className="hero-stat-label">{s.v}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="hero-right"
        >
          <div className="hero-image-container">
            <img
              src={heroImage}
              alt="Nigerian earner smiling at phone with cash"
              className="hero-image"
            />
            <div className="hero-image::after" />
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="floating-card glass-strong floating-card-left"
            style={{ background: 'rgba(23, 37, 84, 0.78)', backdropFilter: 'blur(24px)' }}
          >
            <div className="floating-card-icon" style={{ background: 'rgba(37, 99, 235, 0.25)' }}>
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-accent" style={{ height: '1rem', width: '1rem' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="floating-card-text-small">Just paid</div>
              <div className="floating-card-text-bold" style={{ fontFamily: 'var(--font-display)' }}>+ ₦2,450</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="floating-card glass-strong floating-card-right"
            style={{ background: 'rgba(23, 37, 84, 0.78)', backdropFilter: 'blur(24px)' }}
          >
            <div className="floating-card-icon" style={{ background: 'rgba(96, 165, 250, 0.25)' }}>
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-accent" style={{ height: '1rem', width: '1rem' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="floating-card-text-small">Task approved</div>
              <div className="floating-card-text-bold" style={{ fontFamily: 'var(--font-display)' }}>Instagram follow</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Marquee() {
  const items = [...trustBadges, ...trustBadges, ...trustBadges]
  return (
    <div className="marquee">
      <div className="marquee-track animate-marquee">
        {items.map((b, i) => {
          const Icon = b.icon
          return (
            <div key={i} className="marquee-item">
              <Icon className="marquee-icon" />
              <span>{b.label}</span>
              <span className="marquee-dot" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HowItWorks() {
  return (
    <section id="how" className="how-it-works">
      <div className="section-container">
        <div className="section-header">
          <span className="section-label">How it works</span>
          <h2 className="section-title">
            From sign up to <span className="text-gradient">payout</span> in minutes.
          </h2>
        </div>

        <div className="steps-grid">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="step-card glass"
            >
              <div className="step-number">{s.n}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-description">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TaskCategories() {
  return (
    <section id="tasks" className="task-categories">
      <div className="section-container">
        <div className="task-header">
          <div className="section-header">
            <span className="section-label">Task categories</span>
            <h2 className="section-title">
              Nine platforms.
              <br />
              One wallet.
            </h2>
          </div>
          <p className="task-description">
            Instagram, TikTok, YouTube, Facebook, WhatsApp, Telegram, LinkedIn,
            websites and app downloads — pick a task, deliver, get paid.
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((c, i) => {
            const Icon = c.icon
            return (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="category-card glass"
              >
                <div className="category-content">
                  <div className="category-icon">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="category-info">
                    <div className="category-name">{c.name}</div>
                    <div className="category-label">per task</div>
                  </div>
                </div>
                <div className="category-rate">{c.rate}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Earnings() {
  return (
    <section id="earnings" className="earnings">
      <div className="earnings-grid section-container">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="earnings-card glass-strong"
        >
          <div className="earnings-header">
            <div>
              <div className="earnings-amount-label">Your wallet</div>
              <div className="earnings-amount">
                ₦ <span className="text-gradient">28,450</span>
              </div>
              <div className="earnings-balance">Available balance • NGN</div>
            </div>
            <div className="earnings-badge glass">+₦4,200 this week</div>
          </div>

          <div className="earnings-transactions">
            {[
              { t: 'Instagram follow', a: '+₦25', d: 'Just now' },
              { t: 'TikTok view (60s)', a: '+₦18', d: '2m ago' },
              { t: 'App download — GTB', a: '+₦150', d: '12m ago' },
              { t: 'Website visit', a: '+₦8', d: '35m ago' },
            ].map((row) => (
              <div key={row.t} className="transaction-item glass">
                <div className="transaction-info">
                  <div className="transaction-title">{row.t}</div>
                  <div className="transaction-time">{row.d}</div>
                </div>
                <div className="transaction-amount">{row.a}</div>
              </div>
            ))}
          </div>

          <button className="earnings-withdraw btn-glow">Withdraw to bank</button>
        </motion.div>

        <div className="earnings-right">
          <span className="section-label">Real Naira, real fast</span>
          <h2 className="section-title">
            One wallet. <span className="text-gradient">Every task.</span>
          </h2>
          <p style={{ marginTop: '1rem', maxWidth: '28rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', lineHeight: '1.5' }}>
            Every approved task lands in your Taskora wallet immediately. Move it
            to any Nigerian bank via Paystack, or keep it to post your own tasks
            and boost your brand.
          </p>
          <ul className="earnings-features">
            {[
              'Withdraw to any Nigerian bank from ₦500',
              'Escrow protects both workers and advertisers',
              'Referral bonus on every friend you invite',
              'Live transaction ledger — every kobo tracked',
            ].map((f) => (
              <li key={f} className="feature-item">
                <CheckCircle2 className="feature-icon" />
                <span className="feature-text">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  return (
    <section id="faq" className="faq">
      <div className="faq-container">
        <div className="faq-header section-header">
          <span className="section-label">FAQ</span>
          <h2 className="section-title">Questions, answered.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <motion.details
              key={f.q}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="faq-item glass"
            >
              <summary className="faq-item summary">
                <span>{f.q}</span>
                <span className="faq-toggle">+</span>
              </summary>
              <p className="faq-answer">{f.a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section id="signup" className="cta">
      <div className="cta-container">
        <div className="cta-box glass-strong">
          <div className="cta-content">
            <h2 className="cta-title">Start earning tonight.</h2>
            <p className="cta-description">
              Join thousands of Nigerians already using Taskora to earn from their
              phone. Free forever to sign up.
            </p>
            <div className="cta-buttons">
              <Link to="/signup" className="cta-btn-primary btn-glow">
                Create free account <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#post" className="cta-btn-secondary glass">
                I'm an advertiser
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img src="/icon.png" alt="Taskora" className="footer-logo-icon" />
          <span className="footer-logo-text">Taskora</span>
          <span className="footer-tag">Made in Nigeria 🇳🇬</span>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} Taskora. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <HowItWorks />
        <TaskCategories />
        <Earnings />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
