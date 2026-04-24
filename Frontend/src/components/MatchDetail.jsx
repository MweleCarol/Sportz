import React, { useEffect, useState, useRef, useCallback } from 'react'
import { fetchCommentary } from '../lib/api'
import { getSportMeta, formatKickoff, matchMinute } from '../lib/helpers'
import CommentaryItem from './CommentaryItem'
import UserCommentBox from './UserCommentBox'

function ScoreHero({ match }) {
  const { homeTeam, awayTeam, homeScore, awayScore, sport, status, startTime, endTime } = match
  const meta = getSportMeta(sport)
  const min = status === 'live' ? matchMinute(startTime) : null

  return (
    <div style={{
      background: `linear-gradient(135deg, var(--bg-2) 0%, var(--bg-3) 100%)`,
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px 28px 20px',
      marginBottom: 16,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* decorative circle */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 160, height: 160, borderRadius: '50%',
        background: meta.color + '08', pointerEvents: 'none',
      }} />

      {/* top meta */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{meta.icon}</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
            color: meta.color, letterSpacing: '.8px', textTransform: 'uppercase',
          }}>{sport}</span>
        </div>
        {status === 'live' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--live-red)',
              animation: 'pulse-dot 1.2s infinite',
              boxShadow: '0 0 8px var(--live-red)',
            }} />
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 15, color: 'var(--live-red)', letterSpacing: '.5px',
            }}>
              {min !== null ? `${min}'` : 'LIVE'}
            </span>
          </div>
        )}
        {status === 'finished' && (
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--font-display)', letterSpacing: '.5px' }}>
            FULL TIME
          </span>
        )}
        {status === 'scheduled' && (
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            {formatKickoff(startTime)}
          </span>
        )}
      </div>

      {/* score */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 52, lineHeight: 1, color: 'var(--text-primary)',
            letterSpacing: '-2px',
          }}>{homeScore}</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 600,
            fontSize: 18, color: 'var(--text-secondary)', marginTop: 6,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{homeTeam}</div>
        </div>

        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 300,
          color: 'var(--text-tertiary)', paddingBottom: 8, flexShrink: 0,
        }}>:</div>

        <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 52, lineHeight: 1, color: 'var(--text-primary)',
            letterSpacing: '-2px',
          }}>{awayScore}</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 600,
            fontSize: 18, color: 'var(--text-secondary)', marginTop: 6,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            direction: 'rtl',
          }}>{awayTeam}</div>
        </div>
      </div>

      {/* accent line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${meta.color}88, transparent)`,
      }} />
    </div>
  )
}

export default function MatchDetail({ match, freshCommentaryIds }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const listRef = useRef(null)

  const loadCommentary = useCallback(async () => {
    try {
      const data = await fetchCommentary(match.id, 50)
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [match.id])

  useEffect(() => {
    setLoading(true)
    setItems([])
    loadCommentary()
  }, [loadCommentary])

  // When a new WS commentary event arrives, prepend it if not already present
  useEffect(() => {
    if (!freshCommentaryIds?.length) return
    // Re-fetch to stay in sync (avoids duplicates)
    loadCommentary()
  }, [freshCommentaryIds, loadCommentary])

  function handlePosted(newItem) {
    setItems(prev => [newItem, ...prev])
  }

  return (
    <div style={{ animation: 'slide-in-right .3s ease' }}>
      <ScoreHero match={match} />

      {/* user comment box – only for live matches */}
      {match.status === 'live' && (
        <div style={{ marginBottom: 16 }}>
          <UserCommentBox
            matchId={match.id}
            startTime={match.startTime}
            onPosted={handlePosted}
          />
        </div>
      )}

      {/* commentary feed */}
      <div style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '14px 18px 12px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 13, letterSpacing: '.7px', textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}>Commentary</span>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            {items.length} events
          </span>
        </div>

        <div
          ref={listRef}
          style={{ padding: '0 18px', maxHeight: 460, overflowY: 'auto' }}
        >
          {loading && (
            <div style={{ padding: '24px 0', textAlign: 'center' }}>
              <span style={{
                display: 'inline-block', width: 18, height: 18,
                border: '2px solid var(--border)', borderTopColor: 'var(--accent)',
                borderRadius: '50%', animation: 'spin .7s linear infinite',
              }} />
            </div>
          )}

          {!loading && items.length === 0 && (
            <div style={{ padding: '28px 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
              {match.status === 'scheduled'
                ? 'Commentary will appear when the match starts.'
                : 'No commentary yet.'}
            </div>
          )}

          {items.map((item) => (
            <CommentaryItem
              key={item.id}
              item={item}
              fresh={freshCommentaryIds?.includes(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
