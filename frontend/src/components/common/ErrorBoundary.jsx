import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ByteWave] Uncaught error:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#060614', color: '#fff', textAlign: 'center',
        padding: '24px', gap: 0,
        fontFamily: 'system-ui, sans-serif',
      }}>
        <style>{`
          @keyframes eb-spin { to { transform: rotate(360deg); } }
          @keyframes eb-spin-rev { to { transform: rotate(-360deg); } }
          @keyframes eb-pulse { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.06)} }
        `}</style>

        {/* Mini black-hole illustration */}
        <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 32 }}>
          {/* Lensing glow */}
          <div style={{
            position: 'absolute', inset: -20,
            borderRadius: '50%',
            background: 'transparent',
            boxShadow: '0 0 40px 20px rgba(99,102,241,0.2)',
            animation: 'eb-pulse 2s ease-in-out infinite',
          }} />
          {/* Accretion disk */}
          <div style={{
            position: 'absolute', inset: 10,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #f97316, #fbbf24, #a78bfa, #6366f1, #f97316)',
            animation: 'eb-spin 2.5s linear infinite',
            filter: 'blur(1px)', opacity: 0.8,
          }} />
          {/* Mask */}
          <div style={{
            position: 'absolute', inset: 28,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #000 60%, transparent 100%)',
          }} />
          {/* Event horizon */}
          <div style={{
            position: 'absolute', inset: 32,
            borderRadius: '50%', background: '#000',
            boxShadow: '0 0 0 2px rgba(139,92,246,0.5)',
          }} />
          {/* Counter-ring */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            border: '1px solid rgba(129,140,248,0.15)',
            animation: 'eb-spin-rev 6s linear infinite',
          }} />
        </div>

        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
          color: 'rgba(239,68,68,0.7)', textTransform: 'uppercase', marginBottom: 12,
        }}>Runtime error</div>

        <h1 style={{
          fontSize: 28, fontWeight: 800, margin: '0 0 10px',
          fontFamily: 'system-ui, sans-serif',
          background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Something went wrong</h1>

        <p style={{
          fontSize: 14, color: 'rgba(255,255,255,0.45)',
          maxWidth: 340, lineHeight: 1.65, margin: '0 0 32px',
        }}>
          It seems part of Byte Wave crossed the event horizon. Refresh the page or head back home.
        </p>

        {this.state.error && (
          <pre style={{
            fontSize: 11, color: 'rgba(239,68,68,0.6)',
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.15)',
            borderRadius: 8, padding: '10px 16px', maxWidth: 480,
            textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            marginBottom: 28,
          }}>
            {this.state.error.message}
          </pre>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 22px', borderRadius: 10,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Refresh page
          </button>
          <a
            href="/"
            style={{
              padding: '10px 22px', borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontSize: 14, fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
            }}
          >
            Back to home →
          </a>
        </div>
      </div>
    )
  }
}
