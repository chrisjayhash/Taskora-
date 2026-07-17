import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  AtSign,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  Briefcase,
  Megaphone,
  Check,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import '../../App.css'
import '../../styles.css'
import { signUp, login, ApiError } from '../../api/auth'
import { setAuthSession } from '../../lib/auth-storage'

// ── Role data ────────────────────────────────────────────────────────────────

const roles = [
  {
    value: 'worker',
    label: 'Worker',
    description: 'Complete tasks and earn Naira',
    icon: Briefcase,
  },
  {
    value: 'advertiser',
    label: 'Advertiser',
    description: 'Post tasks and grow your brand',
    icon: Megaphone,
  },
]

// ── Sub-components ───────────────────────────────────────────────────────────

function RoleDropdown({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = roles.find((r) => r.value === value)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="role-dropdown" ref={ref}>
      <button
        type="button"
        className={`role-trigger glass ${open ? 'role-trigger-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="role-trigger-left">
          <span className="role-icon-wrap">
            {selected ? (
              <selected.icon className="h-4 w-4" />
            ) : (
              <Briefcase className="h-4 w-4" />
            )}
          </span>
          <span className="role-trigger-text">
            <span className="role-trigger-label">
              {selected ? selected.label : 'Select your role'}
            </span>
            {selected && (
              <span className="role-trigger-desc">{selected.description}</span>
            )}
          </span>
        </span>
        <ChevronDown
          className="h-4 w-4 role-chevron"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="role-menu glass-strong"
          >
            {roles.map((r) => {
              const isSelected = r.value === value
              return (
                <button
                  type="button"
                  key={r.value}
                  className={`role-option ${isSelected ? 'role-option-selected' : ''}`}
                  onClick={() => {
                    onChange(r.value)
                    setOpen(false)
                  }}
                >
                  <span className="role-icon-wrap">
                    <r.icon className="h-4 w-4" />
                  </span>
                  <span className="role-trigger-text">
                    <span className="role-trigger-label">{r.label}</span>
                    <span className="role-trigger-desc">{r.description}</span>
                  </span>
                  {isSelected && <Check className="h-4 w-4 role-check" />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }
  const strength = getStrength()
  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  const label = password ? labels[Math.max(strength - 1, 0)] : ''

  if (!password) return null

  return (
    <div className="password-strength">
      <div className="password-strength-bars">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`strength-bar ${i < strength ? `strength-bar-${strength}` : ''}`}
          />
        ))}
      </div>
      <span className="password-strength-label">{label}</span>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SignUpPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function update(field: string, val: string) {
    setForm((f) => ({ ...f, [field]: val }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }))
    if (apiError) setApiError(null)
  }

  function validate() {
    const next: Record<string, string> = {}
    if (!form.firstName.trim()) next.firstName = 'First name is required'
    if (!form.lastName.trim()) next.lastName = 'Last name is required'
    if (!form.username.trim()) next.username = 'Username is required'
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username))
      next.username = '3-20 characters, letters/numbers/underscore only'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email address'
    if (!form.phone.trim()) next.phone = 'Phone number is required'
    else if (!/^[0-9+\s-]{10,15}$/.test(form.phone))
      next.phone = 'Enter a valid phone number'
    if (!form.role) next.role = 'Please select a role'
    if (!form.password) next.password = 'Password is required'
    else if (form.password.length < 8)
      next.password = 'Password must be at least 8 characters'
    if (form.confirmPassword !== form.password)
      next.confirmPassword = 'Passwords do not match'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError(null)
    if (!validate()) return

    setSubmitting(true)
    try {
      // 1. Register the account
      await signUp({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        phoneNumber: form.phone.replace(/\s/g, ''),
        role: form.role,
        password: form.password,
      })

      // 2. /auth/register doesn't return tokens, so immediately log the
      //    new user in to get an access/refresh token pair and land them
      //    straight in the dashboard.
      const loginRes = await login({
        email: form.email,
        password: form.password,
      })
      setAuthSession(loginRes.accessToken, loginRes.refreshToken, loginRes.user)
      navigate('/dashboard')
    } catch (err) {
      if (err instanceof ApiError) {
        setApiError(err.message)
      } else {
        setApiError('Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-orb-1" />
      <div className="auth-orb-2" />

      <div className="auth-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="auth-card glass-strong"
        >
          <Link to="/" className="auth-logo">
            <img src="/icon.png" alt="Taskora" className="auth-logo-icon" />
            <span className="auth-logo-text">Taskora</span>
          </Link>

          <div className="auth-header">
            <h1 className="auth-title">
              Create your <span className="text-gradient">free account</span>
            </h1>
            <p className="auth-subtitle">
              Join Taskora and start earning or growing your brand today.
            </p>
          </div>

          <AnimatePresence>
            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="auth-api-error glass"
              >
                <span>{apiError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-row">
              <div className="auth-field">
                <label className="auth-label">First name</label>
                <div
                  className={`auth-input-wrap glass ${
                    errors.firstName ? 'auth-input-error' : ''
                  }`}
                >
                  <User className="h-4 w-4 auth-input-icon" />
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Ada"
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                  />
                </div>
                {errors.firstName && (
                  <span className="auth-error">{errors.firstName}</span>
                )}
              </div>

              <div className="auth-field">
                <label className="auth-label">Last name</label>
                <div
                  className={`auth-input-wrap glass ${
                    errors.lastName ? 'auth-input-error' : ''
                  }`}
                >
                  <User className="h-4 w-4 auth-input-icon" />
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Okafor"
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                  />
                </div>
                {errors.lastName && (
                  <span className="auth-error">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Username</label>
              <div
                className={`auth-input-wrap glass ${
                  errors.username ? 'auth-input-error' : ''
                }`}
              >
                <AtSign className="h-4 w-4 auth-input-icon" />
                <input
                  type="text"
                  className="auth-input"
                  placeholder="ada_okafor"
                  value={form.username}
                  onChange={(e) => update('username', e.target.value)}
                />
              </div>
              {errors.username && (
                <span className="auth-error">{errors.username}</span>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <div
                className={`auth-input-wrap glass ${
                  errors.email ? 'auth-input-error' : ''
                }`}
              >
                <Mail className="h-4 w-4 auth-input-icon" />
                <input
                  type="email"
                  className="auth-input"
                  placeholder="ada@example.com"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                />
              </div>
              {errors.email && (
                <span className="auth-error">{errors.email}</span>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label">Phone number</label>
              <div
                className={`auth-input-wrap glass ${
                  errors.phone ? 'auth-input-error' : ''
                }`}
              >
                <Phone className="h-4 w-4 auth-input-icon" />
                <input
                  type="tel"
                  className="auth-input"
                  placeholder="+234 801 234 5678"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                />
              </div>
              {errors.phone && (
                <span className="auth-error">{errors.phone}</span>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label">I want to</label>
              <RoleDropdown
                value={form.role}
                onChange={(v) => update('role', v)}
              />
              {errors.role && (
                <span className="auth-error">{errors.role}</span>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div
                className={`auth-input-wrap glass ${
                  errors.password ? 'auth-input-error' : ''
                }`}
              >
                <Lock className="h-4 w-4 auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                />
                <button
                  type="button"
                  className="auth-input-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <PasswordStrength password={form.password} />
              {errors.password && (
                <span className="auth-error">{errors.password}</span>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label">Confirm password</label>
              <div
                className={`auth-input-wrap glass ${
                  errors.confirmPassword ? 'auth-input-error' : ''
                }`}
              >
                <Lock className="h-4 w-4 auth-input-icon" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                />
                <button
                  type="button"
                  className="auth-input-toggle"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="auth-error">{errors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              className="auth-submit btn-glow"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 auth-spinner" />
              ) : (
                <>
                  Create free account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-footer-link">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
