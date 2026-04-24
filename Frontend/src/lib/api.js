const BASE = '/matches'

export async function fetchMatches(limit = 50) {
  const res = await fetch(`${BASE}?limit=${limit}`)
  if (!res.ok) throw new Error('Failed to fetch matches')
  const { data } = await res.json()
  return data
}

export async function createMatch(payload) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Failed to create match')
  }
  const { data } = await res.json()
  return data
}

export async function fetchCommentary(matchId, limit = 50) {
  const res = await fetch(`${BASE}/${matchId}/commentary?limit=${limit}`)
  if (!res.ok) throw new Error('Failed to fetch commentary')
  const { data } = await res.json()
  return data
}

export async function postCommentary(matchId, payload) {
  const res = await fetch(`${BASE}/${matchId}/commentary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Failed to post commentary')
  }
  const { data } = await res.json()
  return data
}
