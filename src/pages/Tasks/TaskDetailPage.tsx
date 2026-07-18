import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Calendar,
  MapPin,
  User,
  ExternalLink,
  Info,
  AlertTriangle,
  Upload,
  CheckCircle,
  ChevronRight,
  X,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { getTaskById, submitTaskProof, type TaskDto } from '../../api/tasks'
import { ApiError } from '../../api/http'
import { clearAuthSession, getStoredUser } from '../../lib/auth-storage'
import { timeAgo, formatDateShort } from '../../lib/task-visuals'
import { formatNairaFromKobo } from '../../lib/money'
import { isAuthFailure, isSessionExpired } from '../../lib/api-errors'
import { openExternalLink } from '../../lib/links'
import { spawnRipple } from '../../lib/ripple'
import { uploadProofScreenshot } from '../../lib/upload-proof'
import DashboardHeader from '../Dashboard/components/DashboardHeader'
import BottomNav from '../Dashboard/components/BottomNav'
import '../../App.css'
import '../../styles.css'
import './task-detail-modern.css'

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = getStoredUser()

  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState<TaskDto | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [proofText, setProofText] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let alive = true

    async function load() {
      if (!id) return
      setLoading(true)
      setLoadError(null)
      try {
        const res = await getTaskById(id)
        if (!alive) return
        setTask(res.task)
      } catch (err) {
        if (!alive) return
        if (isAuthFailure(err)) {
          clearAuthSession()
          navigate('/login', { replace: true })
          return
        }
        console.error('[TaskDetail] load failed:', err)
        if (err instanceof ApiError) setLoadError(err.message)
        else if (err instanceof Error) setLoadError(err.message)
        else setLoadError('Failed to load this task. Please try again.')
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [id, navigate])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setSubmitError('Please select an image file.')
      return
    }
    setSubmitError(null)
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
  }

  function clearFile() {
    setSelectedFile(null)
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handlePerformJob() {
    if (task) openExternalLink(task.job_link)
  }

  function handleLogout() {
    clearAuthSession()
    navigate('/')
  }

  const needsProof = !!task?.proof_required
  const isScreenshotProof = task?.proof_type === 'SCREENSHOT'
  const isTextProof = needsProof && !isScreenshotProof

  const isExpired = task ? new Date(task.expires_at).getTime() < Date.now() : false
  const taskUnavailable = task
    ? (task.status ? task.status !== 'active' : false) || task.spots_remaining <= 0 || isExpired
    : false

  const canSubmit =
    !!task &&
    !taskUnavailable &&
    !submitting &&
    !submitted &&
    (!needsProof ||
      (isScreenshotProof && !!selectedFile) ||
      (isTextProof && proofText.trim().length > 0))

  async function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    spawnRipple(e, 'tdm-ripple')
    if (!task || !canSubmit) return

    setSubmitting(true)
    setSubmitError(null)
    try {
      let proofValue: string | undefined

      if (isScreenshotProof && selectedFile) {
        proofValue = await uploadProofScreenshot(selectedFile, task.id, user?.id)
      } else if (isTextProof) {
        proofValue = proofText.trim()
      }

      await submitTaskProof(task.id, proofValue)
      setSubmitted(true)
    } catch (err) {
      if (isSessionExpired(err)) {
        clearAuthSession()
        navigate('/login', { replace: true })
        return
      }
      console.error('[TaskDetail] submit failed:', err)
      if (err instanceof ApiError) setSubmitError(err.message)
      else if (err instanceof Error) setSubmitError(err.message)
      else setSubmitError('Something went wrong while submitting. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // task.worker_earn_kobo is in KOBO - use formatNairaFromKobo for correct display
  const earnedDisplay = task ? formatNairaFromKobo(task.worker_earn_kobo) : '₦0'
  const filled = task ? task.completed_count : 0
  const percent = task && task.quantity > 0 ? Math.round((filled / task.quantity) * 100) : 0
  const jobIdShort = task ? task.id.slice(0, 8).toUpperCase() : ''
  const postedLabel = task ? timeAgo(task.created_at) : ''
  const expiresLabel = task ? formatDateShort(task.expires_at) : ''
  // NOTE: location + screenshot target count aren't returned by the API yet —
  // shown as placeholders until the backend adds them.
  const mockLocation = 'Nigeria'
  const mockScreenshotTarget = isScreenshotProof ? '1' : '—'

  return (
    <div className="task-modern-page">
      <DashboardHeader user={user} onLogout={handleLogout} />

      {/* Breadcrumb hero, matches dashboard's Home > Dashboard pattern */}
      <div className="tdm-page-header">
        <div className="tdm-page-orb-1" />
        <div className="tdm-page-orb-2" />
        <div className="tdm-page-orb-3" />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="tdm-page-header-content"
        >
          <h1 className="tdm-page-title">Job Details</h1>
          <div className="tdm-breadcrumb">
            <button type="button" onClick={() => navigate('/dashboard')}>
              Home
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="tdm-breadcrumb-active">Job Details</span>
          </div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <TaskDetailModernSkeleton />
          </motion.div>
        ) : loadError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="tdm-content-wrapper"
          >
            <div className="tdm-error-box">{loadError}</div>
          </motion.div>
        ) : task ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {/* HERO */}
            <div className="tdm-hero-wrapper">
              <div className="tdm-hero-card">
                <div className="tdm-hero-top">
                  <span className="tdm-category-badge">
                    {task.category_name}
                  </span>
                  <span className="tdm-subcategory-pill">
                    {task.subcategory_name}
                  </span>
                </div>

                <h2 className="tdm-hero-title">{task.job_description}</h2>

                <div className="tdm-hero-meta">
                  <span><User size={14} /> {task.advertiser_username}</span>
                  <span><Calendar size={14} /> {postedLabel}</span>
                  <span><MapPin size={14} /> {mockLocation}</span>
                </div>

                <div className="tdm-hero-stats">
                  <div>
                    <strong>{earnedDisplay}</strong>
                    <span>You Earn</span>
                  </div>
                  <div>
                    <strong>{task.spots_remaining}</strong>
                    <span>Slots Left</span>
                  </div>
                  <div>
                    <strong>{task.quantity}</strong>
                    <span>Total Slots</span>
                  </div>
                  <div>
                    <strong>{mockScreenshotTarget}</strong>
                    <span>Screenshots</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="tdm-content-wrapper">
              {/* DESCRIPTION */}
              <div className="tdm-white-card">
                <div className="tdm-section-title">
                  <Info size={16} /> Job Description
                </div>
                <p>{task.job_description}</p>
                <p>Complete the action on the link below, then submit your proof.</p>
              </div>

              {/* WARNING */}
              <div className="tdm-warning-box">
                <AlertTriangle size={18} />
                <div>
                  <strong>Read the description FIRST before clicking</strong>
                  <p>Only click when you are ready to complete the task.</p>
                </div>
              </div>

              {/* OPEN LINK */}
              <button type="button" className="tdm-open-btn" onClick={handlePerformJob}>
                <ExternalLink size={18} /> Open Task Link
              </button>

              {submitted ? (
                <div className="tdm-success-box">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Submitted! Your proof is pending review.</span>
                </div>
              ) : taskUnavailable ? (
                <div className="tdm-unavailable-box">
                  This task is no longer accepting submissions.
                </div>
              ) : (
                <div className="tdm-white-card">
                  <div className="tdm-section-title">
                    <Upload size={16} /> Submit Your Proof
                  </div>

                  <div className="tdm-pin-note">
                    📌 <strong>Important:</strong> Your proof must clearly show the
                    completed task. Fake or incorrect proof may result in rejection.
                  </div>

                  {(isTextProof || !needsProof) && (
                    <>
                      <label className="tdm-label">
                        What did you do? {needsProof && <span className="tdm-required">*</span>}
                      </label>
                      <textarea
                        className="tdm-input"
                        placeholder="e.g. I followed the account and liked 3 posts as required..."
                        value={proofText}
                        onChange={(e) => setProofText(e.target.value)}
                        disabled={!needsProof}
                      />
                    </>
                  )}

                  {isScreenshotProof && (
                    <>
                      <label className="tdm-label">
                        Upload Screenshot <span className="tdm-required">*</span>
                      </label>

                      {previewUrl ? (
                        <div className="tdm-preview">
                          <img src={previewUrl} alt="Selected proof" />
                          <button
                            type="button"
                            className="tdm-preview-remove"
                            onClick={clearFile}
                            aria-label="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="tdm-upload-box">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                          />
                          <Upload size={28} />
                          <p><strong>Click to upload</strong> or drag &amp; drop</p>
                          <span>JPG, PNG, GIF, WEBP — max 5 MB</span>
                        </label>
                      )}
                    </>
                  )}

                  {submitError && <div className="tdm-error-box">{submitError}</div>}

                  <button
                    type="button"
                    className="tdm-submit-btn"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 tdm-spinner" /> Submitting…
                      </>
                    ) : (
                      <>Submit Proof</>
                    )}
                  </button>
                </div>
              )}

              {/* JOB DETAILS */}
              <div className="tdm-white-card">
                <div className="tdm-section-title">
                  <CheckCircle size={16} /> Job Details
                </div>

                <div className="tdm-progress">
                  <div className="tdm-progress-bar" style={{ width: `${percent}%` }} />
                </div>

                <div className="tdm-progress-meta">
                  <span>{task.spots_remaining} spots remaining</span>
                  <span>{filled}/{task.quantity} filled</span>
                </div>

                <div className="tdm-details-grid">
                  <div><span>Job ID</span><strong>{jobIdShort}</strong></div>
                  <div><span>You Earn</span><strong>{earnedDisplay}</strong></div>
                  <div><span>Posted</span><strong>{postedLabel}</strong></div>
                  <div><span>Expires</span><strong>{expiresLabel}</strong></div>
                  <div><span>Proof Required</span><strong>{needsProof ? 'Yes' : 'No'}</strong></div>
                  <div><span>Posted By</span><strong>@{task.advertiser_username}</strong></div>
                  <div><span>Category</span><strong>{task.category_name}</strong></div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <BottomNav role={user?.role} />
    </div>
  )
}

function TaskDetailModernSkeleton() {
  return (
    <>
      <div className="tdm-hero-wrapper">
        <div className="tdm-hero-card tdm-skel-hero">
          <div className="tdm-hero-top">
            <span className="tdm-skel-block" style={{ width: '5rem', height: '1.4rem', borderRadius: '999px' }} />
            <span className="tdm-skel-block" style={{ width: '6rem', height: '1.4rem', borderRadius: '999px' }} />
          </div>
          <div className="tdm-skel-block" style={{ width: '80%', height: '1.6rem', margin: '0.75rem 0' }} />
          <div className="tdm-skel-block" style={{ width: '60%', height: '1rem', marginBottom: '1.2rem' }} />
          <div className="tdm-hero-stats">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="tdm-skel-block" style={{ width: '3.5rem', height: '1rem', margin: '0 auto 0.4rem' }} />
                <div className="tdm-skel-block" style={{ width: '4.5rem', height: '0.7rem', margin: '0 auto' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tdm-content-wrapper">
        <div className="tdm-white-card">
          <div className="tdm-skel-block" style={{ width: '40%', height: '1rem', marginBottom: '0.8rem' }} />
          <div className="tdm-skel-block" style={{ width: '100%', height: '0.8rem', marginBottom: '0.5rem' }} />
          <div className="tdm-skel-block" style={{ width: '90%', height: '0.8rem' }} />
        </div>

        <div className="tdm-white-card">
          <div className="tdm-skel-block" style={{ width: '50%', height: '1rem', marginBottom: '0.8rem' }} />
          <div className="tdm-skel-block" style={{ width: '100%', height: '5.5rem', marginBottom: '0.8rem' }} />
          <div className="tdm-skel-block" style={{ width: '100%', height: '7rem' }} />
        </div>
      </div>
    </>
  )
}
