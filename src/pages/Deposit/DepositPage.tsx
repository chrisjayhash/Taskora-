import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowDownToLine,
  ChevronRight,
  Wallet,
  RefreshCw,
  ShieldCheck,
  Lock,
  Info,
  Loader2,
} from 'lucide-react'
import { initializeDeposit } from '../../api/payments'
import { getWallet } from '../../api/wallet'
import { ApiError } from '../../api/http'
import { getStoredUser, clearAuthSession } from '../../lib/auth-storage'
import { formatNaira } from '../../lib/money'
import { setWalletCache } from '../../lib/dashboard-cache'
import DashboardHeader from '../Dashboard/components/DashboardHeader'
import BottomNav from '../Dashboard/components/BottomNav'
import '../../styles.css'
import './deposit.css'

const FEE_NAIRA = 50
const MIN_AMOUNT_NAIRA = 50
const MAX_AMOUNT_NAIRA = 1000000

export default function DepositPage() {
  const navigate = useNavigate()
  const user = getStoredUser()

  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>('₦0')
  const [loadingBalance, setLoadingBalance] = useState(true)

  // Load real wallet balance
  useEffect(() => {
    let alive = true
    async function loadWallet() {
      setLoadingBalance(true)
      try {
        const res = await getWallet()
        if (!alive) return
        const formatted = formatNaira(res.wallet.balance)
        setBalance(formatted)
        setWalletCache({
          balanceText: formatted,
          currency: res.wallet.currency,
          updatedAt: res.wallet.updated_at,
        })
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearAuthSession()
          navigate('/login', { replace: true })
        }
      } finally {
        if (alive) setLoadingBalance(false)
      }
    }
    loadWallet()
    return () => { alive = false }
  }, [navigate])

  const amountNum = useMemo(() => {
    const n = Number(amount)
    return Number.isFinite(n) ? n : 0
  }, [amount])

  const feeNum = useMemo(() => {
    if (!amount || amountNum <= 0) return 0
    return FEE_NAIRA
  }, [amount, amountNum])

  const totalNum = useMemo(() => {
    if (!amount || amountNum <= 0) return 0
    return amountNum + feeNum
  }, [amount, amountNum, feeNum])

  function formatDisplay(n: number) {
    if (n === 0) return '₦0.00'
    const hasDecimals = Math.round(n * 100) % 100 !== 0
    return '₦' + new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: hasDecimals ? 2 : 2,
      maximumFractionDigits: 2,
    }).format(n)
  }

  const canSubmit = amountNum >= MIN_AMOUNT_NAIRA && amountNum <= MAX_AMOUNT_NAIRA && !submitting

  function handleLogout() {
    clearAuthSession()
    navigate('/')
  }

  async function handleSubmit() {
    setError(null)

    if (!amount || amountNum <= 0) {
      setError('Please enter a valid amount.')
      return
    }
    if (amountNum < MIN_AMOUNT_NAIRA) {
      setError(`Minimum deposit amount is ₦${MIN_AMOUNT_NAIRA}.`)
      return
    }
    if (amountNum > MAX_AMOUNT_NAIRA) {
      setError(`Maximum deposit amount is ₦${MAX_AMOUNT_NAIRA.toLocaleString()}.`)
      return
    }

    setSubmitting(true)
    try {
      const res = await initializeDeposit(totalNum)
      const w = window.open(res.authorizationUrl, '_blank', 'noopener,noreferrer')
      if (!w) window.location.href = res.authorizationUrl
      navigate('/dashboard', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) setError(err.message)
      else setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'TK'

  return (
    <div className="dep-page">
      <DashboardHeader user={user} onLogout={handleLogout} />

      {/* ── Page Hero ── */}
      <div className="dep-hero">
        <div className="dep-hero-orb-1" />
        <div className="dep-hero-orb-2" />
        <div className="dep-hero-orb-3" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="dep-hero-content"
        >
          <div className="dep-hero-icon">
            <ArrowDownToLine className="h-5 w-5" />
          </div>
          <h1 className="dep-hero-title">Deposit</h1>
          <div className="dep-breadcrumb">
            <button type="button" onClick={() => navigate('/dashboard')}>
              Home
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="dep-breadcrumb-active">Deposit</span>
          </div>
        </motion.div>
      </div>

      {/* ── Shell ── */}
      <div className="dep-shell">

        {/* ── Profile + Balance Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="dep-profile-row"
        >
          <div className="dep-avatar">{initials}</div>
          <div className="dep-profile-info">
            <div className="dep-profile-username">@{user?.username ?? 'user'}</div>
            <div className="dep-profile-balance">
              {loadingBalance ? (
                <RefreshCw className="dep-balance-spin h-3 w-3" />
              ) : (
                balance
              )}{' '}
              <span className="dep-profile-currency">NGN</span>
            </div>
          </div>
        </motion.div>

        {/* ── Wallet Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="dep-wallet-card"
        >
          <div className="dep-wallet-card-top">
            <Wallet className="h-5 w-5" />
            <span className="dep-wallet-card-title">Fund Your Wallet</span>
          </div>
          <p className="dep-wallet-card-subtitle">
            Top up your Taskora balance instantly via Paystack
          </p>
          <div className="dep-wallet-balance-label">AVAILABLE BALANCE</div>
          <div className="dep-wallet-balance-amount">
            {loadingBalance ? (
              <span className="dep-balance-loading">Loading...</span>
            ) : (
              `${balance} NGN`
            )}
          </div>
        </motion.div>

        {/* ── Enter Amount Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="dep-card"
        >
          <div className="dep-card-section-title">
            <span className="dep-card-accent-bar" />
            ENTER AMOUNT
          </div>

          <div className="dep-amount-input-wrap">
            <span className="dep-amount-prefix">₦</span>
            <input
              className="dep-amount-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                const v = e.target.value.replace(/[^\d]/g, '')
                setAmount(v)
                if (error) setError(null)
              }}
            />
          </div>

          <div className="dep-limit-note">
            <Info className="h-3.5 w-3.5" />
            Deposit limit: ₦{MIN_AMOUNT_NAIRA.toLocaleString()}.00 – ₦{MAX_AMOUNT_NAIRA.toLocaleString()}.00
          </div>
        </motion.div>

        {/* ── Order Summary Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="dep-card"
        >
          <div className="dep-card-section-title">
            <span className="dep-card-accent-bar" />
            ORDER SUMMARY
          </div>

          <div className="dep-summary-box">
            <div className="dep-summary-row">
              <span className="dep-summary-label">Method</span>
              <span className="dep-summary-value">Paystack</span>
            </div>
            <div className="dep-summary-divider" />

            <div className="dep-summary-row">
              <span className="dep-summary-label">Amount</span>
              <span className="dep-summary-value">{formatDisplay(amountNum)}</span>
            </div>
            <div className="dep-summary-divider" />

            <div className="dep-summary-row">
              <span className="dep-summary-label">
                Fee <Info className="dep-info-icon" />
              </span>
              <span className="dep-summary-value">{formatDisplay(feeNum)}</span>
            </div>
            <div className="dep-summary-divider" />

            <div className="dep-summary-row dep-summary-total-row">
              <span className="dep-summary-total-label">You Pay</span>
              <span className="dep-summary-total-value">{formatDisplay(totalNum)}</span>
            </div>
          </div>

          {error && (
            <div className="dep-error-box">{error}</div>
          )}

          <button
            type="button"
            className={`dep-submit-btn ${canSubmit ? 'active' : ''}`}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 dep-submit-spinner" />
                Initializing...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Proceed to Paystack
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="dep-secure-note">
            <ShieldCheck className="h-3.5 w-3.5" />
            256-bit SSL encrypted &amp; secure
          </div>
        </motion.div>

      </div>

      <BottomNav role={user?.role} />
    </div>
  )
}
