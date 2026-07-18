import type { MouseEvent } from 'react'

export function spawnRipple(
  e: MouseEvent<HTMLButtonElement>,
  className = 'task-btn-ripple',
) {
  const btn = e.currentTarget
  const rect = btn.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2

  const span = document.createElement('span')
  span.className = className
  span.style.width = `${size}px`
  span.style.height = `${size}px`
  span.style.left = `${x}px`
  span.style.top = `${y}px`

  btn.appendChild(span)
  span.addEventListener('animationend', () => span.remove())
}
