import React, { useState, useRef } from 'react'
import { postCommentary } from '../lib/api'
import { matchMinute } from '../lib/helpers'

const EVENT_TYPES = [
  { value: '', label: '💬 Comment' },
  { value: 'goal', label: '⚽ Goal' },
  { value: 'yellow_card', label: '🟨 Yellow Card' },
  { value: 'card', label: '🟥 Red Card' },
  { value: 'substitution', label: '🔄 Substitution' },
  { value: 'foul', label: '⚠️ Foul' },
  { value: 'var', label: '📺 VAR' },
  { value: 'injury', label: '🩹 Injury' },
]

export default function UserCommentBox({ matchId, startTime, onPosted }) {
  const [text, setText] = useState('')
  const [eventType, setEventType] = useState('')
  const [actor, setActor] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const textRef = useRef(null)

  const remaining = 280 - text.length
  const canSubmit = text.trim().length > 0 && !submitting && remaining >= 0

  async function handleSubmit() {
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    try {
      const minute = matchMinute(startTime) ?? 0
      const payload = {
        message: text.trim(),
        minute,
        ...(eventType ? { eventType } : {}),
        ...(actor.trim() ? { actor: actor.trim() } : {}),
      }
      const result = await postCommentary(matchId, payload)
      setText('')
      setActor('')
      setEventType('')
      setExpanded(false)
      onPosted?.(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }

  return (
    <div style={{
      background: 'var(--bg-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'border-color .2s',
    }}>
      {/* header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: expanded ? '1px solid var(--border)' : 'none',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: 'var(--accent-dim)',
          border: '1px solid rgba(232,255,71,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, flexShrink: 0,
        }}>
          👤
        </div>
        <div
          onClick={() => { setExpanded(true); setTimeout(() => textRef.current?.focus(), 50) }}
          style={{
            flex: 1, fontSize: 13, color: 'var(--text-tertiary)',
            cursor: 'text', padding: '6px 0',
          }}
        >
          {expanded ? null : 'Add commentary… (⌘↵ to post)'}
        </div>
      </div>

      {/* expanded body */}
      {expanded && (
        <div style={{ padding: '12px 16px', animation: 'fadeIn .2s ease' }}>
          {/* event type pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {EVENT_TYPES.map(et => (
              <button
                key={et.value}
                onClick={() => setEventType(et.value)}
                style={{
                  fontSize: 11, padding: '4px 10px', borderRadius: 20,
                  border: `1px solid ${eventType === et.value ? 'rgba(232,255,71,.5)' : 'var(--border)'}`,
                  background: eventType === et.value ? 'var(--accent-dim)' : 'var(--bg-3)',
                  color: eventType === et.value ? 'var(--accent)' : 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all .15s',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {et.label}
              </button>
            ))}
          </div>

          {/* actor field */}
          <input
            type="text"
            placeholder="Player / actor (optional)"
            value={actor}
            onChange={e => setActor(e.target.value)}
            style={{
              width: '100%', background: 'var(--bg-3)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              padding: '7px 12px', fontSize: 13, color: 'var(--text-primary)',
              marginBottom: 8, outline: 'none',
            }}
          />

          {/* textarea */}
          <textarea
            ref={textRef}
            rows={3}
            maxLength={280}
            placeholder="What's happening on the pitch?…"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%', resize: 'vertical', minHeight: 72,
              background: 'var(--bg-3)',
              border: `1px solid ${text.length > 0 ? 'rgba(232,255,71,0.25)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px', fontSize: 13,
              color: 'var(--text-primary)', outline: 'none',
              lineHeight: 1.5, transition: 'border-color .15s',
            }}
          />

          {/* footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontSize: 11, color: remaining < 40 ? 'var(--live-red)' : 'var(--text-tertiary)',
              }}>{remaining}</span>
              {error && (
                <span style={{ fontSize: 11, color: 'var(--live-red)' }}>{error}</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { setExpanded(false); setText(''); setError(null) }}
                style={{
                  fontSize: 12, padding: '6px 14px', borderRadius: 20,
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)', cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                style={{
                  fontSize: 12, fontWeight: 600, padding: '6px 18px', borderRadius: 20,
                  background: canSubmit ? 'var(--accent)' : 'var(--bg-4)',
                  border: 'none',
                  color: canSubmit ? 'var(--accent-text)' : 'var(--text-tertiary)',
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  transition: 'all .15s',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {submitting ? (
                  <span style={{
                    width: 12, height: 12, border: '2px solid currentColor',
                    borderTopColor: 'transparent', borderRadius: '50%',
                    animation: 'spin .7s linear infinite', display: 'inline-block',
                  }} />
                ) : null}
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
