import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDownToLine, Loader2, X } from 'lucide-react'
import { initializeDeposit } from '../../api/payments'
import { ApiError } from '../../api/http'
import '../../App.css'
import '../../styles.css'
import './deposit.css'

const FEE_NAIRA = 50
const MIN_AMOUNT_NAIRA = 50

function formatNaira(n: number) {
  const hasDecimals = Math.round(n * 100) % 100 !== 0
  const formatted = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(n)
  return `₦${formatted}`
}

export default function DepositPage() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState<string>('') // naira
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const amountNaira = useMemo(() => {
    const n = Number(amount)
    return Number.isFinite(n) ? n : 0
  }, [amount])

  const totalNaira = useMemo(() => {
    if (!amount) return 0
    const n = Number(amount)
    if (!Number.isFinite(n) || n <= 0) return 0
    return n + FEE_NAIRA
  }, [amount])

  function close() {
    navigate('/dashboard', { replace: true })
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function submit() {
    setError(null)

    const raw = Number(amount)
    if (!amount || !Number.isFinite(raw)) {
      setError('Please enter a valid amount.')
      return
    }
    if (raw < MIN_AMOUNT_NAIRA) {
      setError(`Minimum deposit amount is ₦${MIN_AMOUNT_NAIRA}.`)
      return
    }

    setSubmitting(true)
    try {
      // Send NAIRA units (backend converts to kobo for Paystack)
      const res = await initializeDeposit(totalNaira)

      // Open Paystack checkout in a new tab
      const w = window.open(res.authorizationUrl, '_blank', 'noopener,noreferrer')
      if (!w) {
        // Popup blockers on mobile sometimes prevent new tabs
        window.location.href = res.authorizationUrl
        return
      }

      close()
    } catch (err) {
      if (err instanceof ApiError) setError(err.message)
      else setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="deposit-page">
      <div className="deposit-orb-1" />
      <div className="deposit-orb-2" />

      <div
        className="deposit-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Deposit"
        onMouseDown={(e) => {
          if (e.currentTarget === e.target) close()
        }}
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="deposit-dialog glass-strong"
          >
            <div className="deposit-header">
              <div className="deposit-title-wrap">
                <div className="deposit-icon">
                  <ArrowDownToLine className="h-5 w-5" />
                </div>
                <div>
                  <div className="deposit-title">Deposit to wallet</div>
                  <div className="deposit-subtitle">
                    Enter an amount (min ₦{MIN_AMOUNT_NAIRA}). A ₦{FEE_NAIRA} fee applies.
                  </div>
                </div>
              </div>

              <button className="deposit-close" type="button" onClick={close} aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="deposit-form">
              <div className="deposit-field">
                <div className="deposit-label">Amount</div>
                <div className="deposit-input-wrap">
                  <span className="deposit-prefix">₦</span>
                  <input
                    className="deposit-input"
                    value={amount}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^\d]/g, '')
                      setAmount(v)
                      if (error) setError(null)
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="200"
                    aria-label="Deposit amount in naira"
                  />
                </div>
                <div className="deposit-hint">
                  You’ll be redirected to Paystack to complete payment.
                </div>
              </div>

              <div className="deposit-breakdown">
                <div className="deposit-row">
                  <span>Deposit</span>
                  <strong>{amount ? formatNaira(amountNaira) : '—'}</strong>
                </div>
                <div className="deposit-row">
                  <span>Fee</span>
                  <strong>{amount ? formatNaira(FEE_NAIRA) : '—'}</strong>
                </div>
                <div className="deposit-row">
                  <span>Total</span>
                  <strong>{amount ? formatNaira(totalNaira) : '—'}</strong>
                </div>
              </div>

              {error && <div className="deposit-error">{error}</div>}

              <button
                type="button"
                className="deposit-submit"
                onClick={submit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 deposit-spinner" /> Initializing…
                  </>
                ) : (
                  'Continue to Paystack'
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
