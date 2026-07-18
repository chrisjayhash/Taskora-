import {
  Instagram,
  Facebook,
  Music2,
  Youtube,
  Send,
  MessageCircle,
  Linkedin,
  Globe,
  Smartphone,
  Layers,
  type LucideIcon,
} from 'lucide-react'

export function getPlatformIcon(categoryName: string): LucideIcon {
  switch (categoryName) {
    case 'INSTAGRAM':
      return Instagram
    case 'FACEBOOK':
      return Facebook
    case 'TIKTOK':
      return Music2
    case 'YOUTUBE':
      return Youtube
    case 'TELEGRAM':
      return Send
    case 'WHATSAPP':
      return MessageCircle
    case 'LINKEDIN':
      return Linkedin
    case 'WEBSITE':
      return Globe
    case 'APP_DOWNLOAD':
      return Smartphone
    default:
      return Layers
  }
}

export function getBannerUrl(categoryName: string): string {
  const map: Record<string, string> = {
    INSTAGRAM:
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1200&q=70',
    FACEBOOK:
      'https://images.unsplash.com/photo-1557683304-673a23048d34?auto=format&fit=crop&w=1200&q=70',
    TIKTOK:
      'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=70',
    YOUTUBE:
      'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=1200&q=70',
    WHATSAPP:
      'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=1200&q=70',
    TELEGRAM:
      'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?auto=format&fit=crop&w=1200&q=70',
    LINKEDIN:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=70',
    WEBSITE:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=70',
    APP_DOWNLOAD:
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=70',
  }

  return (
    map[categoryName] ??
    'https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=1200&q=70'
  )
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-NG', { day: '2-digit', month: 'short' })
}

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  if (!Number.isFinite(diffMs)) return '—'
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
