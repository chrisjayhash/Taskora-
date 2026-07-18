import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Eye } from 'lucide-react'
import { getMySubmissions } from '../../api/tasks'
import { ApiError } from '../../api/http'
import { clearAuthSession, getStoredUser } from '../../lib/auth-storage'
import { formatNairaFromKobo } from '../../lib/money'
import DashboardHeader from '../Dashboard/components/DashboardHeader'
import BottomNav from '../Dashboard/components/BottomNav'
import './submissions.css'

export default function SubmissionsPage() {
  const navigate = useNavigate()
  const user = getStoredUser()

  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      try {
        const res = await getMySubmissions()
        setSubmissions(res.submissions ?? [])
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearAuthSession()
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [navigate])

  function handleLogout() {
    clearAuthSession()
    navigate('/')
  }

  return (
    <div className="sub-page">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <div className="sub-shell">
        <h1 className="sub-title">Submissions</h1>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="sub-list">
            {submissions.map((s) => (
              <div key={s.id} className="sub-modern-card">
                <div className="sub-modern-top" />

                <div className="sub-modern-body">
                  <div className="sub-modern-header">
                    <h3>{s.category_name} - {s.subcategory_name}</h3>
                    <span className={`sub-badge ${s.status}`}>
                      {s.status === 'approved' ? 'Approved — Paid' :
                       s.status === 'pending' ? 'Pending Review' :
                       'Rejected'}
                    </span>
                  </div>

                  <div className="sub-modern-date">
                    <Calendar size={14} /> {new Date(s.submitted_at).toDateString()}
                  </div>

                  <div className="sub-modern-earn">
                    You earn: <strong>{formatNairaFromKobo(s.worker_earn_kobo)}</strong>
                  </div>

                  <button className="sub-view-btn">
                    <Eye size={16}/> View My Proof
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav role={user?.role} />
    </div>
  )
}
