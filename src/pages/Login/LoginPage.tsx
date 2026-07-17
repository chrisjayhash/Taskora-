import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import '../../App.css'
import '../../styles.css'
import { login, ApiError } from '../../api/auth'
import { setAuthSession } from '../../lib/auth-storage'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
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
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email address'
    if (!form.password) next.password = 'Password is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError(null)
    if (!validate()) return

    setSubmitting(true)
    try {
      const res = await login({
        email: form.email,
        password: form.password,
      })
      setAuthSession(res.accessToken, res.refreshToken, res.user)
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
              Welcome <span className="text-gradient">back</span>
            </h1>
            <p className="auth-subtitle">
              Sign in to your Taskora account to continue earning.
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
              <div className="auth-label-row">
                <label className="auth-label">Password</label>
                <a
                  href="#forgot"
                  className="auth-footer-link"
                  style={{ fontSize: '0.75rem' }}
                >
                  Forgot password?
                </a>
              </div>
              <div
                className={`auth-input-wrap glass ${
                  errors.password ? 'auth-input-error' : ''
                }`}
              >
                <Lock className="h-4 w-4 auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Enter your password"
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
              {errors.password && (
                <span className="auth-error">{errors.password}</span>
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
                  Sign in <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-footer-link">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
