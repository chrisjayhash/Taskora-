export default function TaskCardSkeleton() {
  return (
    <div className="task-skel">
      <div className="task-skel-banner" />

      <div className="task-skel-body">
        <div className="task-skel-row">
          <div className="task-skel-pill" />
          <div className="task-skel-pill" />
          <div className="task-skel-bar grow" />
        </div>

        <div className="task-skel-row">
          <div className="task-skel-bar xl" />
        </div>

        <div className="task-skel-row">
          <div className="task-skel-bar sm" />
          <div className="task-skel-bar md" />
          <div className="task-skel-bar sm" />
        </div>

        <div className="task-skel-row">
          <div className="task-skel-bar md" />
          <div className="task-skel-bar md" />
        </div>

        <div className="task-skel-actions">
          <div className="task-skel-btn" />
          <div className="task-skel-btn" />
        </div>
      </div>
    </div>
  )
}
