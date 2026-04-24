export const SPORT_META = {
  football:   { icon: '⚽', color: '#3dff9a', label: 'Football' },
  basketball: { icon: '🏀', color: '#ffb84d', label: 'Basketball' },
  tennis:     { icon: '🎾', color: '#e8ff47', label: 'Tennis' },
  cricket:    { icon: '🏏', color: '#4dabff', label: 'Cricket' },
  rugby:      { icon: '🏉', color: '#ff8c4d', label: 'Rugby' },
  baseball:   { icon: '⚾', color: '#c084fc', label: 'Baseball' },
  default:    { icon: '🏆', color: '#e8ff47', label: 'Sport' },
}

export function getSportMeta(sport) {
  return SPORT_META[sport?.toLowerCase()] ?? SPORT_META.default
}

export const EVENT_META = {
  goal:         { label: 'Goal',         color: '#3dff9a',  icon: '⚽' },
  card:         { label: 'Card',         color: '#ff4444',  icon: '🟥' },
  yellow_card:  { label: 'Yellow Card',  color: '#ffb84d',  icon: '🟨' },
  substitution: { label: 'Sub',          color: '#4dabff',  icon: '🔄' },
  kickoff:      { label: 'Kick-off',     color: '#e8ff47',  icon: '▶️' },
  halftime:     { label: 'Half Time',    color: '#c084fc',  icon: '⏸' },
  fulltime:     { label: 'Full Time',    color: '#ff8c4d',  icon: '🏁' },
  injury:       { label: 'Injury',       color: '#ff4444',  icon: '🩹' },
  var:          { label: 'VAR',          color: '#4dabff',  icon: '📺' },
  foul:         { label: 'Foul',         color: '#ffb84d',  icon: '⚠️' },
  default:      { label: 'Update',       color: '#aaaaaa',  icon: '💬' },
}

export function getEventMeta(eventType) {
  return EVENT_META[eventType?.toLowerCase()] ?? EVENT_META.default
}

export function formatKickoff(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString([], {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function formatTimeAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function matchMinute(startTime) {
  if (!startTime) return null
  const elapsed = Math.floor((Date.now() - new Date(startTime).getTime()) / 60000)
  return Math.min(elapsed, 90)
}
