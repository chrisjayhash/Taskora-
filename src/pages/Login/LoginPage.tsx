import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Chrome } from 'lucide-react'
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

  function handleGoogleSignIn() {
    console.log('Google Sign In')
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
              Welcome <span className="text-gradient">back</span>
            </h1>
            <p className="auth-subtitle-flat">
              Sign in to your Taskora account to continue earning
            </p>
          </div>

          <div className="auth-social-section-flat">
            <button
              type="button"
              className="auth-social-btn-flat"
              onClick={handleGoogleSignIn}
              aria-label="Sign in with Google"
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
            <div className="auth-field-flat">
              <label className="auth-label-flat">Email address</label>
              <div
                className={`auth-input-wrapper-flat ${
                  errors.email ? 'error' : ''
                }`}
              >
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
              <div className="auth-label-row-flat">
                <label className="auth-label-flat">Password</label>
                <a href="#forgot" className="auth-forgot-link-flat">
                  Forgot password?
                </a>
              </div>
              <div
                className={`auth-input-wrapper-flat ${
                  errors.password ? 'error' : ''
                }`}
              >
                <Lock className="auth-input-icon-flat" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input-flat"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-input-toggle-flat"
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
                <span className="auth-error-text-flat">{errors.password}</span>
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="auth-footer-flat">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-footer-link-flat">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
