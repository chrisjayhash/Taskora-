import { useState } from 'react'
import { Send, MessageCircle, Gift, Copy, Check } from 'lucide-react'
import type { StoredUser } from '../../../lib/auth-storage'

export default function QuickActions({ user }: { user: StoredUser | null }) {
  const [copied, setCopied] = useState(false)
  const referralCode = user?.referralCode || user?.username?.toUpperCase() || 'TASKORA'

  function copyCode() {
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <h3 className="dash-section-title">Join the community</h3>
      </div>

      <div className="dash-quick-actions">
        <a href="#telegram" className="dash-action-btn dash-action-telegram">
          <Send className="h-4 w-4" /> Join Telegram
        </a>
        <a href="#whatsapp" className="dash-action-btn dash-action-whatsapp">
          <MessageCircle className="h-4 w-4" /> Join WhatsApp
        </a>
      </div>

      <div className="dash-referral-card glass">
        <div className="dash-referral-icon">
          <Gift className="h-5 w-5" />
        </div>
        <div className="dash-referral-info">
          <div className="dash-referral-title">Invite friends, earn ₦100 each</div>
          <div className="dash-referral-code">
            Your code: <strong>{referralCode}</strong>
          </div>
        </div>
        <button
          type="button"
          className="dash-referral-copy"
          onClick={copyCode}
          aria-label="Copy referral code"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
