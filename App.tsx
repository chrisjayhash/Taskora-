import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Instagram,
  Facebook,
  Youtube,
  Music2,
  Globe,
  PlayCircle,
  MessageCircle,
  ClipboardList,
  Smartphone,
  Wallet,
  ShieldCheck,
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Menu,
  FlaskConical,
  MessageSquare,
  X,
} from 'lucide-react'
import heroImage from './assets/hero-earner.jpg'
import './App.css'
import './styles.css'

const nav = [
  { label: 'How it works', href: '#how' },
  { label: 'Tasks', href: '#tasks' },
  { label: 'Earnings', href: '#earnings' },
  { label: 'FAQ', href: '#faq' },
]

const categories = [
  { name: 'Social media growth', icon: TrendingUp, label: 'Increase your brands visibility through likes, follows, comments and shares' },
  { name: 'Music promotion', icon: Music2, label: 'Boost streams, downloads and engagement for your latest release.' },
  { name: 'App promotion', icon: Smartphone, label: 'Drive installs, ratings and reviews for your mobile application.' },
  { name: 'Website traffic', icon: Globe, label: 'Send real users to your website, landing page or online store.' },
  { name: 'Product review', icon: MessageSquare, label: 'Collect authentic reviews and valuable customer feedback.' },
  { name: 'Video promotion', icon: PlayCircle, label: 'Increase video views, watch time and audience engagement.' },
  { name: 'Survey and feedback', icon: ClipboardList, label: 'Gather opinions, test products and collect valuable customer insights.' },
  { name: 'Community growth', icon: Users, label: 'Grow your Telegram, WhatsApp or Discord community with genuine members.' },
  { name: 'App testing', icon: FlaskConical, label: 'Get real users to test your app, discover bugs and provide actionable feedback.' },
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
    q: 'How does Taskora works?',
    a: 'Businesses post campaigns, taskers complete simple online tasks, and payments are released after approved completions.',
  },
  {
    q: 'What types of campaigns can i run?',
    a: 'You can promote social media accounts, apps, websites, music, products, communities, and more.',
  },
  {
    q: 'How do you verify completed tasks?',
    a: 'Every submission is reviewed before approval. Businesses only pay for approved task completions.',
  },
  {
    q: 'How do taskers get paid?',
    a: 'Earnings are credited after approval and can be withdrawn securely to a Nigerian bank account through Paystack.',
  },
  {
    q: 'Is there a minimum campaign budget?',
    a: 'Yes. Campaigns have minimum budgets depending on the task type and number of completions required.',
  },
  {
    q: 'Who can join Taskora?',
    a: 'Anyone can create an account. Businesses can launch campaigns, while individuals can complete tasks and earn from approved work.',
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
          <div className="header-logo">
            <div className="header-logo-icon">T</div>
            <span className="header-logo-text">Taskora</span>
          </div>
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
            <a href="#signup" className="header-getstarted btn-glow">
              Get started
            </a>
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
              <a href="#signup" className="mobile-getstarted">
                Get started
              </a>
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
            <span>Trusted by businesses & professionals</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="hero-title"
          >
            The Marketplace Where Work 
            <br />
            <span className="text-gradient">Get's Done.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hero-description"
          >
          Businesses and individuals
           find skilled professionals, while taskers discover flexible
            earning opportunities.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="hero-buttons"
          >
            <a href="#signup" className="hero-btn-primary btn-glow">
              Post Tasks
              <ArrowRight className="h-4 w-4" style={{ transition: 'all 0.3s ease' }} />
            </a>
            <a href="#post" className="hero-btn-secondary glass">
              Start Earning 
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="hero-stats"
          >
            {[
              { k: '24/7', v: 'Task Availability' },
              { k: 'Fast', v: 'Tasks Approval' },
              { k: 'Secure', v: 'Payments' },
            ].map((s) => (
              <div key={s.v} className="hero-stat glass">
                <div className="hero-stat-number">{s.k}</div>
                <div className="hero-stat-label">{s.v}</div>
              </div>
            ))}
          </motion.div>
        </div>
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
            <span className="section-label">Campaign categories</span>
            <h2 className="section-title">
              Campaign built for.
              <br />
              Every Goal.
            </h2>
          </div>
          <p className="task-description">
            Whether you want more followers, app installs, website traffic, music streams,
             or product reviews, Taskora has a campaign to help you achieve it.
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
                  </div>
                </div>
                <div className="category-rate">{c.label}</div>
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
          <span className="section-label">Built On Trust</span>
          <h2 className="section-title">
            Trusted For. <span className="text-gradient">Every Campaign.</span>
          </h2>
          <p style={{ marginTop: '1rem', maxWidth: '28rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', lineHeight: '1.5' }}>
            Businesses launch campaigns and pay only for approved results, while taskers complete simple online tasks and earn securely. 
            Taskora makes every campaign transparent from start to finish.
          </p>
          <ul className="earnings-features">
            {[
              'Businesses pay only for approved task completions',
              'Taskers receive secure payouts through Paystack',
              'Escrow protects both businesses and taskers',
              'Every campaign includes transparent approval tracking',
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
            <h2 className="cta-title">Ready to get started?</h2>
            <p className="cta-description">
              Whether you're growing your brand or looking to earn from sim
              ple online tasks, Taskora helps you get started in minutes.
            </p>
            <div className="cta-buttons">
              <a href="#signup" className="cta-btn-primary btn-glow">
                Launch a campaign<ArrowRight className="h-4 w-4" />
              </a>
              <a href="#post" className="cta-btn-secondary glass">
              Start earning
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function Footnav(){
return(
<div className="footer-nav">
  <div className="header-logo">
    <div className="header-logo-icon">T</div>
    <div className="header-logo-text">Taskora</div>
  </div>

<div className="footer-column">
  <h2>Product</h2>
  <ul>
  <li><a href="#how-it-works">How it Works</a></li>
  <li><a href="#campaigns">Campaign Categories</a></li>
  <li><a href="#faq">FAQ</a></li>
  </ul>
</div>

<div className="footer-column">
    <h2>Businesses</h2>
    <ul>
    <li><a href="/signup">Launch a Campaign</a></li>
    <li><a href="/pricing">Pricing</a></li>
    </ul>
</div>

<div className="footer-column">
  <h2>Taskers</h2>
  <ul>
  <li><a href="/signup">Start Earning</a></li>
  <li><a href="/payouts">Payouts</a></li>
  </ul>
</div>

<div className="footer-column">
    <h2>Company</h2>
    <ul>
    <li><a href="/contact">Contact</a></li>
    <li><a href="/privacy">Privacy Policy</a></li>
    <li><a href="/terms">Terms of Service</a></li>
    </ul>
</div>

</div>
)
}
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo-icon">T</div>
          <span className="footer-logo-text">Taskora</span>
          <span className="footer-tag">Secure payments by Paystack • Transparent approvals • Built for Nigeria</span>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} Taskora. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default function App() {
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
        <Footnav />
      </main>
      <Footer />
    </div>
  )
}
