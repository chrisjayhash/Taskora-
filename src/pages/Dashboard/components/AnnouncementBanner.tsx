import { ShieldCheck } from 'lucide-react'

export default function AnnouncementBanner({ items }: { items: string[] }) {
  const loop = [...items, ...items]
  return (
    <div className="dash-announce">
      <div className="dash-announce-track animate-marquee">
        {loop.map((text, i) => (
          <div key={i} className="dash-announce-item">
            <span>{text}</span>
            <ShieldCheck className="h-3.5 w-3.5 dash-announce-icon" />
          </div>
        ))}
      </div>
    </div>
  )
}
