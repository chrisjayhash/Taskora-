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
  ArrowRight,
  Loader2,
  Chrome,
  Check,
} from 'lucide-react'
import '../../styles.css'
import { signUp, login, ApiError } from '../../api/auth'
import { setAuthSession } from '../../lib/auth-storage'

const roles = [
  { value: 'worker', label: 'Worker', description: 'Earn by completing tasks' },
  { value: 'advertiser', label: 'Advertiser', description: 'Post tasks and grow your brand' },
]

function RoleDropdownFlat({
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
    <div className="role-dropdown-flat" ref={ref}>
      <button
        type="button"
        className="role-trigger-flat"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="role-trigger-left-flat">
          <span className="role-icon-flat">
            {selected ? <User className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </span>
          <span className="role-label-flat">
            {selected ? selected.label : 'Select your role'}
          </span>
        </span>
        <span className="role-chevron-flat">⌄</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="role-menu-flat"
          >
            {roles.map((r) => (
              <button
                type="button"
                key={r.value}
                className="role-option-flat"
                data-selected={r.value === value}
                onClick={() => {
                  onChange(r.value)
                  setOpen(false)
                }}
              >
                <span className="role-icon-flat">
                  <User className="h-4 w-4" />
                </span>
                <span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{r.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                    {r.description}
                  </div>
                </span>
                {r.value === value && <Check className="role-check-flat h-4 w-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PasswordStrengthFlat({ password }: { password: string }) {
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
  const strengthClass = ['weak', 'fair', 'good', 'strong'][Math.max(strength - 1, 0)]
  const label = password ? labels[Math.max(strength - 1, 0)] : ''

  if (!password) return null

  return (
    <div className="password-strength-flat">
      <div className="password-strength-bars-flat">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`strength-bar-flat ${i < strength ? strengthClass : ''}`}
          />
        ))}
      </div>
      <span className="password-strength-label-flat">{label}</span>
    </div>
  )
}

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
      await signUp({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        phoneNumber: form.phone.replace(/\s/g, ''),
        role: form.role,
        password: form.password,
      })

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

  function handleGoogleSignUp() {
    console.log('Google Sign Up')
  }

  return (
    <div className="auth-page-flat">
      <div className="auth-bg-orbs">
        <div className="auth-orb-1" />
        <div className="auth-orb-2" />
      </div>

      <div className="auth-container-flat">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="auth-header-flat"
        >
          <Link to="/" className="auth-logo-flat">
            <img src="/icon.png" alt="Taskora" className="auth-logo-icon-flat" />
            <span className="auth-logo-text-flat">Taskora</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="auth-form-wrapper-flat"
        >
          <div className="auth-title-section-flat">
            <h1 className="auth-title-flat">
              Create your <span className="text-gradient">free account</span>
            </h1>
            <p className="auth-subtitle-flat">
              Join Taskora and start earning or growing your brand today
            </p>
          </div>

          <div className="auth-social-section-flat">
            <button
              type="button"
              className="auth-social-btn-flat"
              onClick={handleGoogleSignUp}
              aria-label="Sign up with Google"
            >
              <Chrome className="h-5 w-5" />
            </button>
            <span className="auth-social-divider-flat">or continue with email</span>
          </div>

          <AnimatePresence>
            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="auth-error-flat"
              >
                {apiError}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="auth-form-flat" onSubmit={handleSubmit} noValidate>
            <div className="auth-row-flat">
              <div className="auth-field-flat">
                <label className="auth-label-flat">First name</label>
                <div className={`auth-input-wrapper-flat ${errors.firstName ? 'error' : ''}`}>
                  <User className="auth-input-icon-flat" />
                  <input
                    type="text"
                    className="auth-input-flat"
                    placeholder="Ada"
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                  />
                </div>
                {errors.firstName && (
                  <span className="auth-error-text-flat">{errors.firstName}</span>
                )}
              </div>

              <div className="auth-field-flat">
                <label className="auth-label-flat">Last name</label>
                <div className={`auth-input-wrapper-flat ${errors.lastName ? 'error' : ''}`}>
                  <User className="auth-input-icon-flat" />
                  <input
                    type="text"
                    className="auth-input-flat"
                    placeholder="Okafor"
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                  />
                </div>
                {errors.lastName && (
                  <span className="auth-error-text-flat">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="auth-field-flat">
              <label className="auth-label-flat">Username</label>
              <div className={`auth-input-wrapper-flat ${errors.username ? 'error' : ''}`}>
                <AtSign className="auth-input-icon-flat" />
                <input
                  type="text"
                  className="auth-input-flat"
                  placeholder="ada_okafor"
                  value={form.username}
                  onChange={(e) => update('username', e.target.value)}
                />
              </div>
              {errors.username && (
                <span className="auth-error-text-flat">{errors.username}</span>
              )}
            </div>

            <div className="auth-field-flat">
              <label className="auth-label-flat">Email address</label>
              <div className={`auth-input-wrapper-flat ${errors.email ? 'error' : ''}`}>
                <Mail className="auth-input-icon-flat" />
                <input
                  type="email"
                  className="auth-input-flat"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <span className="auth-error-text-flat">{errors.email}</span>
              )}
            </div>

            <div className="auth-field-flat">
              <label className="auth-label-flat">Phone number</label>
              <div className={`auth-input-wrapper-flat ${errors.phone ? 'error' : ''}`}>
                <Phone className="auth-input-icon-flat" />
                <input
                  type="tel"
                  className="auth-input-flat"
                  placeholder="+234 801 234 5678"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                />
              </div>
              {errors.phone && (
                <span className="auth-error-text-flat">{errors.phone}</span>
              )}
            </div>

            <div className="auth-field-flat">
              <label className="auth-label-flat">I want to</label>
              <RoleDropdownFlat value={form.role} onChange={(v) => update('role', v)} />
              {errors.role && (
                <span className="auth-error-text-flat">{errors.role}</span>
              )}
            </div>

            <div className="auth-field-flat">
              <label className="auth-label-flat">Password</label>
              <div className={`auth-input-wrapper-flat ${errors.password ? 'error' : ''}`}>
                <Lock className="auth-input-icon-flat" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input-flat"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-input-toggle-flat"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <PasswordStrengthFlat password={form.password} />
              {errors.password && (
                <span className="auth-error-text-flat">{errors.password}</span>
              )}
            </div>

            <div className="auth-field-flat">
              <label className="auth-label-flat">Confirm password</label>
              <div className={`auth-input-wrapper-flat ${errors.confirmPassword ? 'error' : ''}`}>
                <Lock className="auth-input-icon-flat" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="auth-input-flat"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-input-toggle-flat"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="auth-error-text-flat">{errors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              className="auth-submit-btn-flat"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create free account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="auth-footer-flat">
            Already have an account?{' '}
            <Link to="/login" className="auth-footer-link-flat">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
