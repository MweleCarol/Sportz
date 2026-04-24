import React from 'react'

export default function WSStatus({ status }) {
  const map = {
    connected:    { dot: '#3dff9a', label: 'Live' },
    connecting:   { dot: '#ffb84d', label: 'Connecting…' },
    disconnected: { dot: '#ff4444', label: 'Reconnecting…' },
  }
  const { dot, label } = map[status] ?? map.disconnected

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 7,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 20, padding: '5px 12px',
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: dot, flexShrink: 0,
        animation: status === 'connected' ? 'pulse-dot 2s infinite' : 'none',
        boxShadow: status === 'connected' ? `0 0 6px ${dot}` : 'none',
      }} />
      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '.3px' }}>
        {label}
      </span>
    </div>
  )
}
