import {
  Instagram,
  Music2,
  Facebook,
  Youtube,
  MessageCircle,
  Send,
  Linkedin,
  Globe,
  Smartphone,
  Wallet,
  CheckCircle2,
  ListChecks,
  Users,
  type LucideIcon,
} from 'lucide-react'

// ── Stats overview ───────────────────────────────────────────────────────────

export interface StatCard {
  id: string
  label: string
  value: string
  helper: string
  icon: LucideIcon
  accent: 'blue' | 'green' | 'purple' | 'pink'
}

export const statCards: StatCard[] = [
  {
    id: 'balance',
    label: 'Wallet balance',
    value: '₦28,450',
    helper: '+₦4,200 this week',
    icon: Wallet,
    accent: 'blue',
  },
  {
    id: 'completed',
    label: 'Tasks completed',
    value: '184',
    helper: '12 today',
    icon: CheckCircle2,
    accent: 'green',
  },
  {
    id: 'active',
    label: 'Active tasks',
    value: '6',
    helper: '2 awaiting review',
    icon: ListChecks,
    accent: 'purple',
  },
  {
    id: 'referrals',
    label: 'Referrals',
    value: '9',
    helper: '₦900 earned',
    icon: Users,
    accent: 'pink',
  },
]

// ── Task categories (quick browse) ──────────────────────────────────────────

export interface TaskCategoryQuick {
  name: string
  icon: LucideIcon
  rate: string
}

export const quickCategories: TaskCategoryQuick[] = [
  { name: 'Instagram', icon: Instagram, rate: '₦8 – ₦25' },
  { name: 'TikTok', icon: Music2, rate: '₦10 – ₦30' },
  { name: 'Facebook', icon: Facebook, rate: '₦8 – ₦20' },
  { name: 'YouTube', icon: Youtube, rate: '₦15 – ₦50' },
  { name: 'WhatsApp', icon: MessageCircle, rate: '₦5 – ₦15' },
  { name: 'Telegram', icon: Send, rate: '₦8 – ₦20' },
  { name: 'LinkedIn', icon: Linkedin, rate: '₦12 – ₦30' },
  { name: 'Website', icon: Globe, rate: '₦5 – ₦12' },
  { name: 'App Install', icon: Smartphone, rate: '₦40 – ₦150' },
]

// ── Recent activity ──────────────────────────────────────────────────────────

export interface ActivityItem {
  id: string
  title: string
  meta: string
  amount: string
  positive: boolean
}

export const recentActivity: ActivityItem[] = [
  {
    id: '1',
    title: 'Instagram follow — @brandhq',
    meta: 'Approved · 2m ago',
    amount: '+₦25',
    positive: true,
  },
  {
    id: '2',
    title: 'TikTok view (60s)',
    meta: 'Approved · 18m ago',
    amount: '+₦18',
    positive: true,
  },
  {
    id: '3',
    title: 'App download — GTBank',
    meta: 'Pending review · 1h ago',
    amount: '+₦150',
    positive: true,
  },
  {
    id: '4',
    title: 'Withdrawal to GTBank ****2291',
    meta: 'Completed · Yesterday',
    amount: '-₦5,000',
    positive: false,
  },
  {
    id: '5',
    title: 'Website visit — SME Naija',
    meta: 'Approved · Yesterday',
    amount: '+₦8',
    positive: true,
  },
]

// ── Announcement marquee ─────────────────────────────────────────────────────

export const announcements: string[] = [
  'Post real tasks, pay fair rates, get real results.',
  'Withdrawals now settle in minutes via Paystack.',
  'Refer a friend and earn ₦100 instantly.',
  'New: LinkedIn engagement tasks now live.',
]
