export function initTheme() {
  const saved = localStorage.getItem('taskora_theme')
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme')
  if (current === 'dark') {
    document.documentElement.removeAttribute('data-theme')
    localStorage.setItem('taskora_theme', 'light')
  } else {
    document.documentElement.setAttribute('data-theme', 'dark')
    localStorage.setItem('taskora_theme', 'dark')
  }
}
