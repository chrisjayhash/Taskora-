export function openExternalLink(url: string) {
  const w = window.open(url, '_blank', 'noopener,noreferrer')
  if (!w) window.location.href = url
}
