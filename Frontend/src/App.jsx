import React, { useState, useEffect, useCallback, useRef } from 'react'
import { fetchMatches } from './lib/api'
import { useWebSocket } from './hooks/useWebSocket'
import MatchCard from './components/MatchCard'
import MatchDetail from './components/MatchDetail'
import WSStatus from './components/WSStatus'
import './styles/globals.css'

const FILTERS = [
  { key: 'all',       label: 'All' },
  { key: 'live',      label: '● Live' },
  { key: 'scheduled', label: 'Upcoming' },
  { key: 'finished',  label: 'Finished' },
]

export default function App() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const [freshCommentaryIds, setFreshCommentaryIds] = useState([])
  const prevSelectedRef = useRef(null)

  // WS callbacks
  const handleMatchCreated = useCallback((match) => {
    setMatches(prev => [match, ...prev])
  }, [])

  const handleCommentary = useCallback((comment) => {
    setFreshCommentaryIds(prev => [...prev, comment.id])
    // clear after animation window
    setTimeout(() => {
      setFreshCommentaryIds(prev => prev.filter(id => id !== comment.id))
    }, 2000)
  }, [])

  const { status, subscribe, unsubscribe } = useWebSocket({
    onMatchCreated: handleMatchCreated,
    onCommentary: handleCommentary,
  })

  // Load matches
  useEffect(() => {
    fetchMatches(50)
      .then(setMatches)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Subscribe/unsubscribe on selection change
  useEffect(() => {
    if (prevSelectedRef.current !== null) unsubscribe(prevSelectedRef.current)
    if (selectedId !== null) subscribe(selectedId)
    prevSelectedRef.current = selectedId
  }, [selectedId, subscribe, unsubscribe])

  const filtered = filter === 'all'
    ? matches
    : matches.filter(m => m.status === filter)

  const selectedMatch = matches.find(m => m.id === selectedId) ?? null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-0)' }}>

      {/* ── header ── */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,12,15,0.85)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'var(--accent)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 15,
          }}>⚡</div>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 22, letterSpacing: '-0.5px', color: 'var(--text-primary)',
          }}>SPORTZ</span>
        </div>
        <WSStatus status={status} />
      </header>

      {/* ── body ── */}
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: selectedMatch ? '380px 1fr' : '1fr',
        gap: 24, padding: '24px',
        alignItems: 'start',
      }}>

        {/* ── left column: filter + cards ── */}
        <div>
          {/* filter tabs */}
          <div style={{
            display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap',
          }}>
            {FILTERS.map(f => {
              const active = filter === f.key
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  style={{
                    fontFamily: 'var(--font-display)', fontWeight: 600,
                    fontSize: 13, letterSpacing: '.4px', textTransform: 'uppercase',
                    padding: '6px 16px', borderRadius: 20,
                    border: `1px solid ${active ? 'rgba(232,255,71,.4)' : 'var(--border)'}`,
                    background: active ? 'var(--accent-dim)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all .15s',
                  }}
                >
                  {f.label}
                </button>
              )
            })}
          </div>

          {/* match list */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <span style={{
                display: 'inline-block', width: 22, height: 22,
                border: '2px solid var(--border)', borderTopColor: 'var(--accent)',
                borderRadius: '50%', animation: 'spin .7s linear infinite',
              }} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '48px 0',
              color: 'var(--text-tertiary)', fontSize: 14,
            }}>
              No {filter !== 'all' ? filter : ''} matches found.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map((m, i) => (
                <div key={m.id} style={{ animationDelay: `${i * 40}ms` }}>
                  <MatchCard
                    match={m}
                    selected={m.id === selectedId}
                    onClick={() => setSelectedId(id => id === m.id ? null : m.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── right column: detail ── */}
        {selectedMatch && (
          <div style={{ position: 'sticky', top: 72 }}>
            <MatchDetail
              match={selectedMatch}
              freshCommentaryIds={freshCommentaryIds}
            />
          </div>
        )}
      </div>
    </div>
  )
}
