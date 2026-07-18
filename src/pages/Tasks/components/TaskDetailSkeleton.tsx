export default function TaskDetailSkeleton() {
  return (
    <div className="task-detail-skel">
      <div className="task-skel-banner" style={{ height: '11rem', borderRadius: '1.15rem' }} />

      <div className="task-detail-skel-body">
        <div className="task-skel-row">
          <div className="task-skel-pill" />
          <div className="task-skel-pill" />
        </div>
        <div className="task-skel-row">
          <div className="task-skel-bar xl" />
        </div>
        <div className="task-skel-row">
          <div className="task-skel-bar grow" />
        </div>
        <div className="task-skel-row">
          <div className="task-skel-bar sm" />
          <div className="task-skel-bar md" />
          <div className="task-skel-bar sm" />
          <div className="task-skel-bar md" />
        </div>
      </div>

      <div className="task-detail-skel-card">
        <div className="task-skel-bar lg" />
        <div className="task-skel-btn" style={{ marginTop: '0.6rem' }} />
      </div>

      <div className="task-detail-skel-card">
        <div className="task-skel-bar lg" />
        <div
          className="task-skel-banner"
          style={{ height: '7rem', marginTop: '0.6rem', borderRadius: '0.9rem' }}
        />
        <div className="task-skel-btn" style={{ marginTop: '0.6rem' }} />
      </div>
    </div>
  )
}
