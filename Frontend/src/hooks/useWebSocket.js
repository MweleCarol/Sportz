import { useEffect, useRef, useCallback, useState } from 'react'

const WS_URL = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`

export function useWebSocket({ onMatchCreated, onCommentary }) {
  const wsRef = useRef(null)
  const [status, setStatus] = useState('connecting') // connecting | connected | disconnected
  const subsRef = useRef(new Set())

  const send = useCallback((payload) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload))
    }
  }, [])

  const subscribe = useCallback((matchId) => {
    subsRef.current.add(matchId)
    send({ type: 'subscribe', matchId })
  }, [send])

  const unsubscribe = useCallback((matchId) => {
    subsRef.current.delete(matchId)
    send({ type: 'unsubscribe', matchId })
  }, [send])

  useEffect(() => {
    let reconnectTimer

    function connect() {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        setStatus('connected')
        // Re-subscribe to any existing subs
        subsRef.current.forEach(id => {
          ws.send(JSON.stringify({ type: 'subscribe', matchId: id }))
        })
      }

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data)
          if (msg.type === 'match_created') onMatchCreated?.(msg.data)
          if (msg.type === 'commentary') onCommentary?.(msg.data)
        } catch { /* ignore */ }
      }

      ws.onclose = () => {
        setStatus('disconnected')
        reconnectTimer = setTimeout(connect, 3000)
      }

      ws.onerror = () => {
        ws.close()
      }
    }

    connect()

    return () => {
      clearTimeout(reconnectTimer)
      wsRef.current?.close()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { status, subscribe, unsubscribe }
}
