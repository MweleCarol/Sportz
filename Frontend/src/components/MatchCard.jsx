import React, { useEffect, useRef } from 'react'
import { getSportMeta, formatKickoff, matchMinute } from '../lib/helpers'

function StatusBadge({ status, startTime }) {
  if (status === 'live') {
    const min = matchMinute(startTime)
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'var(--live-red-dim)',
        border: '1px solid rgba(255,68,68,0.25)',
        borderRadius: 20, padding: '3px 10px',
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%', background: 'var(--live-red)',
          animation: 'pulse-dot 1.2s infinite',
          boxShadow: '0 0 6px var(--live-red)',
        }} />
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 13, letterSpacing: '.5px', color: 'var(--live-red)',
        }}>
          {min !== null ? `${min}'` : 'LIVE'}
        </span>
      </div>
    )
  }
  if (status === 'finished') {
    return (
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12,
        letterSpacing: '.6px', color: 'var(--text-tertiary)',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--border)',
        borderRadius: 20, padding: '3px 10px',
      }}>FT</span>
    )
  }
  return (
    <span style={{
      fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 11,
      color: 'var(--text-tertiary)', letterSpacing: '.2px',
    }}>
      {formatKickoff(startTime)}
    </span>
  )
}

export default function MatchCard({ match, selected, onClick }) {
  const { sport, homeTeam, awayTeam, status, homeScore, awayScore, startTime } = match
  const meta = getSportMeta(sport)
  const cardRef = useRef(null)

  // Flash on score change
  const prevScores = useRef({ homeScore, awayScore })
  useEffect(() => {
    if (
      cardRef.current &&
      (prevScores.current.homeScore !== homeScore || prevScores.current.awayScore !== awayScore)
    ) {
      cardRef.current.animate(
        [{ background: 'rgba(232,255,71,0.12)' }, { background: 'transparent' }],
        { duration: 800, easing: 'ease-out' }
      )
    }
    prevScores.current = { homeScore, awayScore }
  }, [homeScore, awayScore])

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      style={{
        background: selected ? 'var(--bg-3)' : 'var(--bg-2)',
        border: `1px solid ${selected ? meta.color + '55' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '16px 18px',
        cursor: 'pointer',
        transition: 'border-color .2s, background .2s, transform .15s',
        animation: 'fadeInUp .35s ease both',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--border-hover)' }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      {/* top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 17 }}>{meta.icon}</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11,
            color: meta.color, letterSpacing: '.7px', textTransform: 'uppercase',
          }}>{sport}</span>
        </div>
        <StatusBadge status={status} startTime={startTime} />
      </div>

      {/* score row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* home */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 28, lineHeight: 1, color: 'var(--text-primary)',
            letterSpacing: '-0.5px',
          }}>{homeScore}</div>
          <div style={{
            fontSize: 12, color: 'var(--text-secondary)',
            marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{homeTeam}</div>
        </div>

        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600,
          color: 'var(--text-tertiary)', flexShrink: 0,
        }}>—</div>

        {/* away */}
        <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 28, lineHeight: 1, color: 'var(--text-primary)',
            letterSpacing: '-0.5px',
          }}>{awayScore}</div>
          <div style={{
            fontSize: 12, color: 'var(--text-secondary)',
            marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{awayTeam}</div>
        </div>
      </div>

      {/* selected accent line */}
      {selected && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 2, background: meta.color,
        }} />
      )}
    </div>
  )
}
