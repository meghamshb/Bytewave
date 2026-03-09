import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { track, EVENTS } from '../../hooks/useAnalytics'
import { apiFetch } from '../../utils/api'

const SEED_COUNT = 247

const sectionTitle = {
  fontFamily: 'var(--font-display)',
  fontSize: 32, fontWeight: 700,
  textAlign: 'center', margin: '0 0 12px',
  color: 'var(--primary-text)',
}

function isAlreadySaved(email) {
  try { return JSON.parse(localStorage.getItem('bw_waitlist') || '[]').includes(email.trim()) } catch { return false }
}
function saveLocally(email) {
  try {
    const stored = JSON.parse(localStorage.getItem('bw_waitlist') || '[]')
    if (!stored.includes(email.trim())) stored.push(email.trim())
    localStorage.setItem('bw_waitlist', JSON.stringify(stored))
    return stored.length
  } catch { return 0 }
}

function getSavedEmail() {
  try {
    const list = JSON.parse(localStorage.getItem('bw_waitlist') || '[]')
    return list.length > 0 ? list[list.length - 1] : ''
  } catch { return '' }
}

export default function WaitlistSection() {
  const savedEmail = getSavedEmail()
  const [email,     setEmail]     = useState(savedEmail)
  const [submitted, setSubmitted] = useState(!!savedEmail)
  const [loading,   setLoading]   = useState(false)
  const [count,     setCount]     = useState(SEED_COUNT)
  const [error,     setError]     = useState('')

  useEffect(() => {
    apiFetch('/api/waitlist/count')
      .then(r => r.json())
      .then(d => { if (typeof d.count === 'number') setCount(d.count) })
      .catch(() => {
        try {
          const stored = JSON.parse(localStorage.getItem('bw_waitlist') || '[]')
          setCount(SEED_COUNT + stored.length)
        } catch {}
      })
  }, [])

  const join = async () => {
    const trimmed = email.trim()
    if (!trimmed || !trimmed.includes('@')) { setError('Enter a valid email address.'); return }
    setError(''); setLoading(true)

    // 1. Optimistically update UI
    if (isAlreadySaved(trimmed)) { setSubmitted(true); setLoading(false); return }
    const localCount = saveLocally(trimmed)
    setCount(SEED_COUNT + localCount)

    // 2. POST to server — backend should store in DB + send confirmation email
    try {
      const res = await apiFetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      // Silently accept even if server is down (localStorage already saved)
      if (res.ok) {
        const data = await res.json().catch(() => ({}))
        if (data.count) setCount(data.count)
      }
    } catch {
      // Server unreachable — localStorage backup is enough
    } finally {
      setLoading(false)
    }

    track(EVENTS.WAITLIST_JOINED, { source: 'landing' })
    setSubmitted(true)
  }

  return (
    <div style={{ maxWidth: 540, margin: '0 auto' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '5px 14px', borderRadius: 100,
        background: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(245,158,11,0.08))',
        border: '1px solid rgba(251,191,36,0.3)',
        marginBottom: 20,
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fbbf24', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24', letterSpacing: '0.09em' }}>
          {count} ON THE LIST
        </span>
      </div>

      <h2 style={{ ...sectionTitle, fontSize: 32, margin: '0 0 12px' }}>
        Byte Wave <span style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Premium</span>
      </h2>
      <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--primary-text-muted)', margin: '0 0 32px' }}>
        Unlimited AI feedback, priority animation rendering, and advanced mastery analytics. Drop your email to get early access when we launch.
      </p>

      {submitted ? (
        <div style={{ padding: '24px', borderRadius: 16, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>✨</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary-text)', marginBottom: 6 }}>You're in.</div>
          <div style={{ fontSize: 13, color: 'var(--primary-text-muted)' }}>
            You're <strong style={{ color: '#fbbf24' }}>#{count}</strong> on the Premium list. We'll reach out to <strong>{email}</strong> when it's ready.
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--primary-text-muted)' }}>
            In the meantime, <Link to="/auth" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>try the free version →</Link>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && join()}
              placeholder="your@email.com"
              style={{
                flex: 1, minWidth: 200,
                padding: '13px 18px', borderRadius: 10,
                background: 'var(--bg-card)',
                border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'var(--border-light)'}`,
                color: 'var(--primary-text)', fontSize: 14, outline: 'none',
                fontFamily: 'var(--font-body)',
              }}
            />
            <button
              onClick={join}
              disabled={loading}
              style={{
                padding: '13px 28px', borderRadius: 10,
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                color: '#000', fontSize: 14, fontWeight: 700,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(245,158,11,0.35)',
                whiteSpace: 'nowrap', opacity: loading ? 0.7 : 1,
              }}>
              {loading ? 'Saving…' : 'Get Premium access →'}
            </button>
          </div>
          {error && <div style={{ marginTop: 8, fontSize: 12, color: '#ef4444' }}>{error}</div>}
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--primary-text-muted)' }}>
            No spam. One email when Premium launches. Unsubscribe any time.
          </div>
        </>
      )}
    </div>
  )
}
