import React, { useEffect, useRef } from 'react'
import { getEventMeta, formatTimeAgo } from '../lib/helpers'

export default function CommentaryItem({ item, fresh }) {
  const { minute, eventType, actor, team, message, createdAt } = item
  const meta = getEventMeta(eventType)
  const ref = useRef(null)

  useEffect(() => {
    if (fresh && ref.current) {
      ref.current.animate(
        [
          { opacity: 0, transform: 'translateY(-10px)', background: meta.color + '18' },
          { opacity: 1, transform: 'translateY(0)',     background: 'transparent' },
        ],
        { duration: 600, easing: 'ease-out', fill: 'forwards' }
      )
    }
  }, [fresh, meta.color])

  return (
    <div
      ref={ref}
      style={{
        display: 'flex', gap: 12,
        padding: '10px 0',
        borderBottom: '1px solid var(--border)',
        animation: fresh ? undefined : 'fadeIn .3s ease',
      }}
    >
      {/* minute bubble */}
      <div style={{ flexShrink: 0, paddingTop: 2 }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: meta.color + '18',
          border: `1px solid ${meta.color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
        }}>
          {minute != null ? (
            <>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 13, color: meta.color, lineHeight: 1,
              }}>{minute}'</span>
            </>
          ) : (
            <span style={{ fontSize: 14 }}>{meta.icon}</span>
          )}
        </div>
      </div>

      {/* content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
          {eventType && (
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11,
              letterSpacing: '.6px', textTransform: 'uppercase',
              color: meta.color,
            }}>{meta.label}</span>
          )}
          {actor && (
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{actor}</span>
          )}
          {team && (
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>· {team}</span>
          )}
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 'auto' }}>
            {formatTimeAgo(createdAt)}
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
          {message}
        </p>
      </div>
    </div>
  )
}
