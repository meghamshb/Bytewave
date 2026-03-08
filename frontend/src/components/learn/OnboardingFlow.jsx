/**
 * OnboardingFlow
 *
 * Shown once per account (keyed by userId) on first visit to /learn.
 * Three-step flow:
 *   1. Welcome + name confirmation
 *   2. Pick your weakest topic (sets the first "Next for you")
 *   3. CTA — "Let's find your gap in under 60 seconds"
 *
 * Stores completion in localStorage so it never shows twice.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { track, EVENTS } from '../../hooks/useAnalytics'

const ONBOARDED_KEY = (id) => `bw_onboarded_${id}`

export function useOnboarding() {
  const { user } = useAuth()
  if (!user) return { shouldShow: false, markDone: () => {} }
  const key = ONBOARDED_KEY(user.id)
  const shouldShow = !localStorage.getItem(key)
  const markDone = () => localStorage.setItem(key, '1')
  return { shouldShow, markDone }
}

const TOPICS = [
  { id: 'motion',      label: 'Kinematics & Motion',       emoji: '🏃' },
  { id: 'forces',      label: "Forces & Newton's Laws",    emoji: '⚡' },
  { id: 'energy',      label: 'Energy & Work',             emoji: '🔋' },
  { id: 'waves',       label: 'Waves & Sound',             emoji: '🌊' },
  { id: 'electricity', label: 'Electricity & Circuits',    emoji: '💡' },
  { id: 'magnetism',   label: 'Magnetism',                 emoji: '🧲' },
  { id: 'light',       label: 'Light & Optics',            emoji: '🔬' },
  { id: 'heat',        label: 'Heat & Thermodynamics',     emoji: '🌡️' },
  { id: 'gravity',     label: 'Gravity & Orbits',          emoji: '🌍' },
  { id: 'quantum',     label: 'Atoms & Nuclear Physics',   emoji: '⚛️' },
]

const EASE = [0.22, 1, 0.36, 1]

export default function OnboardingFlow({ onDone }) {
  const { user, updateName } = useAuth()
  const navigate = useNavigate()
  const [step,    setStep]    = useState(0)
  const [name,    setName]    = useState(user?.name || '')
  const [picked,  setPicked]  = useState([])

  const saveName = () => {
    if (name.trim()) updateName(name.trim())
  }

  const toggleTopic = (id) => {
    setPicked(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }

  const finish = () => {
    if (picked.length) localStorage.setItem('bw_focus_topics', JSON.stringify(picked))
    track(EVENTS.ONBOARDING_DONE, { topics: picked.length })
    onDone()
    navigate('/learn/choose-case?skill=' + (picked[0] || 'motion'))
  }

  const steps = [
    // ── Step 0: Welcome ─────────────────────────────────────────────────────
    <div key="welcome" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>👋</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: 'var(--primary-text)' }}>
        Welcome to Byte Wave
      </h2>
      <p style={{ fontSize: 14, color: 'var(--primary-text-muted)', margin: '0 0 28px', lineHeight: 1.65 }}>
        We'll find your physics gaps and build a personalised study plan in under 60 seconds. Let's set you up.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary-text-muted)', textAlign: 'left' }}>
          What should we call you?
        </label>
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (saveName(), setStep(1))}
          placeholder="Your first name…"
          style={{
            padding: '13px 16px', borderRadius: 10, fontSize: 14,
            background: 'var(--primary-bg)', border: '1.5px solid rgba(99,102,241,0.4)',
            color: 'var(--primary-text)', outline: 'none', boxShadow: '0 0 0 3px rgba(99,102,241,0.12)',
          }}
        />
      </div>
      <button onClick={() => { saveName(); setStep(1) }} style={BTN}>
        Let's go →
      </button>
    </div>,

    // ── Step 1: Topic picker ──────────────────────────────────────────────────
    <div key="topics">
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, margin: '0 0 6px', color: 'var(--primary-text)' }}>
        Which topics are you studying?
      </h2>
      <p style={{ fontSize: 13, color: 'var(--primary-text-muted)', margin: '0 0 20px' }}>
        Pick the ones you're currently covering. We'll prioritise cases from these first.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        {TOPICS.map(({ id, label, emoji }) => {
          const active = picked.includes(id)
          return (
            <button
              key={id}
              onClick={() => toggleTopic(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                background: active ? 'rgba(99,102,241,0.1)' : 'var(--primary-bg)',
                border: `1.5px solid ${active ? 'rgba(99,102,241,0.5)' : 'var(--border-light)'}`,
                color: active ? '#818cf8' : 'var(--primary-text)',
                fontSize: 13, fontWeight: 600, textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{emoji}</span>
              <span style={{ lineHeight: 1.3 }}>{label}</span>
              {active && (
                <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width={14} height={14} viewBox="0 0 14 14" fill="none">
                  <circle cx={7} cy={7} r={7} fill="#6366f1"/>
                  <path d="M4 7l2 2 4-4" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => setStep(0)} style={BTN_BACK}>← Back</button>
        <button
          onClick={() => setStep(2)}
          disabled={!picked.length}
          style={{ ...BTN, flex: 1, opacity: picked.length ? 1 : 0.4, cursor: picked.length ? 'pointer' : 'not-allowed' }}
        >
          {picked.length ? `Continue with ${picked.length} topic${picked.length > 1 ? 's' : ''} →` : 'Pick at least one topic'}
        </button>
      </div>
    </div>,

    // ── Step 2: Launch ────────────────────────────────────────────────────────
    <div key="launch" style={{ textAlign: 'center' }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
        background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 32, boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
      }}>🎯</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, margin: '0 0 8px', color: 'var(--primary-text)' }}>
        You're all set, {name || 'Student'}!
      </h2>
      <p style={{ fontSize: 14, color: 'var(--primary-text-muted)', margin: '0 0 8px', lineHeight: 1.65 }}>
        We're starting with <strong style={{ color: '#818cf8' }}>{TOPICS.find(t => t.id === picked[0])?.label || picked[0]}</strong>.
      </p>
      <p style={{ fontSize: 13, color: 'var(--primary-text-muted)', margin: '0 0 28px' }}>
        Answer one case. The AI will pinpoint exactly what you need to review — in under 60 seconds.
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => setStep(1)} style={BTN_BACK}>← Back</button>
        <button onClick={finish} style={{ ...BTN, flex: 1 }}>
          Find my first gap →
        </button>
      </div>
      <button
        onClick={() => { onDone(); navigate('/learn') }}
        style={{ background: 'none', border: 'none', color: 'var(--primary-text-muted)', fontSize: 12, cursor: 'pointer', marginTop: 12 }}
      >
        Skip for now — go to dashboard
      </button>
    </div>,
  ]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(6,6,20,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ ease: EASE, duration: 0.4 }}
        style={{
          width: '100%', maxWidth: 480,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 24,
          padding: '36px 32px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28, justifyContent: 'center' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: i === step ? 24 : 8, height: 8, borderRadius: 100,
              background: i === step ? '#6366f1' : i < step ? 'rgba(99,102,241,0.4)' : 'var(--border-light)',
              transition: 'all 0.25s ease',
            }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ ease: EASE, duration: 0.28 }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

const BTN = {
  padding: '13px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700,
  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff',
  border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
}
const BTN_BACK = {
  padding: '13px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600,
  background: 'var(--primary-bg)', color: 'var(--primary-text-muted)',
  border: '1px solid var(--border-light)', cursor: 'pointer', flexShrink: 0,
}
