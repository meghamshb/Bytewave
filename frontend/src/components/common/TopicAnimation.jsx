// Animated SVG physics illustrations — shared between Landing tiles and Skill Map cards.

const accent = 'var(--accent-main)'
const muted  = 'var(--primary-text-muted)'

export default function TopicAnimation({ topicId, size = 56 }) {
  const s = size / 56   // scale factor
  const wrap = {
    width: size, height: size,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  }

  switch (topicId) {
    case 'motion':
      return (
        <div style={wrap}>
          <svg viewBox="0 0 40 28" fill="none" style={{ width: size * 1.1, height: size * 0.7 }}>
            <line x1="4" y1="24" x2="4" y2="4"  stroke={muted} strokeWidth="1" />
            <line x1="4" y1="24" x2="36" y2="24" stroke={muted} strokeWidth="1" />
            <line x1="4" y1="20" x2="36" y2="4"  stroke={muted} strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
            <path d="M4 20 L36 4" stroke={accent} strokeWidth="2" strokeLinecap="round"
              strokeDasharray="44" strokeDashoffset="44"
              style={{ animation: 'tile-slope-draw 2s ease-out infinite' }} />
            <g style={{ animation: 'tile-motion-slide 2s ease-in-out infinite' }}>
              <circle cx="20" cy="12" r="3.5" fill={accent} opacity="0.9" />
            </g>
          </svg>
        </div>
      )

    case 'forces':
      return (
        <div style={wrap}>
          <svg viewBox="0 0 36 24" fill="none" style={{ width: size * 1.1, height: size * 0.75 }}>
            <line x1="2" y1="20" x2="34" y2="20" stroke={muted} strokeWidth="1" strokeDasharray="3 2" />
            <path d="M6 14 L6 10 L8 10 L8 14 Z" stroke={accent} strokeWidth="1.5" fill="none" />
            <path d="M8 12 L14 12 M13 10 L14 12 L13 14" stroke={accent} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            <g style={{ animation: 'tile-motion-slide 2.2s ease-in-out infinite' }}>
              <rect x="16" y="10" width="8" height="8" rx="1" fill={accent} opacity="0.9" />
            </g>
          </svg>
        </div>
      )

    case 'energy': {
      const CX = 26, CY = 16, R = 9, TEETH = 8
      const gearPath = (cx, cy, r, teeth) => {
        const pts = []
        for (let i = 0; i < teeth * 2; i++) {
          const a   = (i / (teeth * 2)) * Math.PI * 2
          const rad = i % 2 === 0 ? r : r * 0.72
          pts.push(`${cx + Math.cos(a) * rad},${cy + Math.sin(a) * rad}`)
        }
        return `M${pts.join('L')}Z`
      }
      return (
        <div style={wrap}>
          <svg viewBox="0 0 44 32" fill="none" style={{ width: size * 1.1, height: size * 0.8 }}>
            <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: 'tile-gear-cw 3s linear infinite' }}>
              <path d={gearPath(CX, CY, R, TEETH)} stroke={accent} strokeWidth="1.2" fill="rgba(99,102,241,0.15)" />
              <circle cx={CX} cy={CY} r="3" fill={accent} opacity="0.7" />
            </g>
            <g style={{ transformOrigin: `${CX - R * 1.72}px ${CY}px`, animation: 'tile-gear-ccw 3s linear infinite' }}>
              <path d={gearPath(CX - R * 1.72, CY, R * 0.75, 6)} stroke={accent} strokeWidth="1.2" fill="rgba(99,102,241,0.12)" opacity="0.85" />
              <circle cx={CX - R * 1.72} cy={CY} r="2.2" fill={accent} opacity="0.6" />
            </g>
          </svg>
        </div>
      )
    }

    case 'waves':
      return (
        <div style={wrap}>
          <svg viewBox="0 0 48 24" fill="none" style={{ width: size * 1.2, height: size * 0.6, overflow: 'hidden' }}>
            <line x1="0" y1="12" x2="48" y2="12" stroke={muted} strokeWidth="0.5" opacity="0.25" />
            <g style={{ animation: 'tile-sound-breathe 1.6s ease-in-out infinite' }}>
              <g style={{ animation: 'tile-sound-scroll 0.9s linear infinite' }}>
                <path d="M0 12 C3 4,9 4,12 12 C15 20,21 20,24 12 C27 4,33 4,36 12 C39 20,45 20,48 12 C51 4,57 4,60 12"
                  stroke={accent} strokeWidth="5" fill="none" opacity="0.18" strokeLinecap="round" />
              </g>
            </g>
            <g style={{ animation: 'tile-sound-breathe 1.6s ease-in-out infinite' }}>
              <g style={{ animation: 'tile-sound-scroll 0.9s linear infinite' }}>
                <path d="M0 12 C3 4,9 4,12 12 C15 20,21 20,24 12 C27 4,33 4,36 12 C39 20,45 20,48 12 C51 4,57 4,60 12"
                  stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
              </g>
            </g>
          </svg>
        </div>
      )

    case 'light':
      return (
        <div style={wrap}>
          <svg viewBox="0 0 44 36" fill="none" style={{ width: size * 1.1, height: size * 0.9 }}>
            <line x1="2"  y1="18" x2="42" y2="18" stroke={muted} strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6" />
            <line x1="22" y1="2"  x2="22" y2="34" stroke={muted} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4" />
            <path d="M22 18 L6 4"   stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="22" strokeDashoffset="22" style={{ animation: 'tile-light-ray-in 2.4s ease-in-out infinite 0s' }} />
            <path d="M22 18 L38 4"  stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="22" strokeDashoffset="22" style={{ animation: 'tile-light-ray-in 2.4s ease-in-out infinite 0.3s' }} />
            <path d="M22 18 L38 32" stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="22" strokeDashoffset="22" style={{ animation: 'tile-light-ray-in 2.4s ease-in-out infinite 0.6s' }} />
            <circle cx="22" cy="18" r="2" fill={accent} />
          </svg>
        </div>
      )

    case 'electricity':
      return (
        <div style={wrap}>
          <svg viewBox="0 0 44 36" fill="none" style={{ width: size * 1.1, height: size * 0.9 }}>
            <rect x="4"  y="14" width="6"  height="10" rx="1" stroke={accent} strokeWidth="1.2" fill="none" />
            <line x1="6"  y1="16" x2="6"  y2="22" stroke={accent} strokeWidth="1" opacity="0.5" />
            <rect x="30" y="14" width="10" height="8" rx="1" stroke={muted}   strokeWidth="1"   fill="none" opacity="0.7" />
            <path d="M10 19 L30 19 M30 19 L30 10 L10 10 L10 19" stroke={accent} strokeWidth="1.2" fill="none" strokeLinejoin="round" />
            <path d="M10 19 L30 19 M30 19 L30 10 L10 10 L10 19" stroke={accent} strokeWidth="2" fill="none" strokeLinejoin="round" strokeDasharray="5 103" style={{ animation: 'tile-circuit-flow 2s linear infinite' }} />
          </svg>
        </div>
      )

    case 'magnetism': {
      const extA = 'M4 22 Q4 12 30 10 Q56 12 56 22'
      const extB = 'M4 22 Q4 2  30 0  Q56 2  56 22'
      const extC = 'M4 22 Q4 32 30 34 Q56 32 56 22'
      const extD = 'M4 22 Q4 42 30 44 Q56 42 56 22'
      return (
        <div style={wrap}>
          <svg viewBox="0 0 60 44" fill="none" style={{ width: size * 1.2, height: size * 0.85 }}>
            <path d={extA} stroke={accent} strokeWidth="1.2" fill="none" opacity="0.22" strokeLinecap="round" />
            <path d={extB} stroke={accent} strokeWidth="0.8" fill="none" opacity="0.12" strokeLinecap="round" />
            <path d={extC} stroke={accent} strokeWidth="1.2" fill="none" opacity="0.22" strokeLinecap="round" />
            <path d={extD} stroke={accent} strokeWidth="0.8" fill="none" opacity="0.12" strokeLinecap="round" />
            <path d={extA} stroke={accent} strokeWidth="2"   fill="none" strokeLinecap="round" strokeDasharray="6 54"  style={{ animation: 'tile-magext-tight 1.8s linear infinite 0s' }} />
            <path d={extB} stroke={accent} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeDasharray="5 73" opacity="0.6" style={{ animation: 'tile-magext-wide 2.6s linear infinite 0.5s' }} />
            <path d={extC} stroke={accent} strokeWidth="2"   fill="none" strokeLinecap="round" strokeDasharray="6 54"  style={{ animation: 'tile-magext-tight 1.8s linear infinite 0.9s' }} />
            <path d={extD} stroke={accent} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeDasharray="5 73" opacity="0.6" style={{ animation: 'tile-magext-wide 2.6s linear infinite 1.4s' }} />
            <line x1="53" y1="20" x2="7" y2="20" stroke={accent} strokeWidth="1.8" strokeDasharray="4 44" style={{ animation: 'tile-magint 1.4s linear infinite 0s' }} />
            <line x1="53" y1="24" x2="7" y2="24" stroke={accent} strokeWidth="1.8" strokeDasharray="4 44" style={{ animation: 'tile-magint 1.4s linear infinite 0.7s' }} />
            <rect x="4"  y="17" width="22" height="10" rx="2" fill="rgba(99,102,241,0.3)" stroke={accent} strokeWidth="1.5" />
            <text x="15" y="24.5" fill={accent} fontSize="5.5" fontWeight="800" fontFamily="monospace" textAnchor="middle">N</text>
            <rect x="34" y="17" width="22" height="10" rx="2" fill="rgba(180,60,60,0.18)" stroke="#f87171" strokeWidth="1.5" />
            <text x="45" y="24.5" fill="#f87171" fontSize="5.5" fontWeight="800" fontFamily="monospace" textAnchor="middle">S</text>
          </svg>
        </div>
      )
    }

    case 'heat':
      return (
        <div style={wrap}>
          <svg viewBox="0 0 44 44" fill="none" style={{ width: size, height: size }}>
            <rect x="18" y="3"  width="8"  height="25" rx="4" stroke={accent} strokeWidth="1.5" fill="rgba(99,102,241,0.08)" />
            <rect x="19.5" y="5" width="5" height="23" rx="2.5" fill={accent} opacity="0.8"
              style={{ transformBox: 'fill-box', transformOrigin: 'center bottom', animation: 'tile-mercury-rise 2.2s ease-in-out infinite' }} />
            <circle cx="22" cy="35" r="7"   stroke={accent} strokeWidth="1.5" fill="rgba(99,102,241,0.08)" />
            <circle cx="22" cy="35" r="5.2" fill={accent} opacity="0.85" style={{ animation: 'tile-bulb-pulse 2.2s ease-in-out infinite' }} />
            <path d="M31 34 Q33 30 31 26 Q29 22 31 18" stroke={accent} strokeWidth="1.4" strokeLinecap="round" fill="none" style={{ animation: 'tile-heat-wavy 1.8s ease-in-out infinite 0s' }} />
            <path d="M36 34 Q38 30 36 26 Q34 22 36 18" stroke={accent} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" style={{ animation: 'tile-heat-wavy 1.8s ease-in-out infinite 0.45s' }} />
          </svg>
        </div>
      )

    case 'gravity':
      return (
        <div style={wrap}>
          <svg viewBox="0 0 44 44" fill="none" style={{ width: size, height: size }}>
            <ellipse cx="20" cy="22" rx="17" ry="9" stroke={muted} strokeWidth="1" strokeDasharray="3 2.5" opacity="0.5"
              style={{ transform: 'rotate(-12deg)', transformOrigin: '20px 22px' }} />
            <circle cx="20" cy="22" r="10" stroke={accent} strokeWidth="0.8" fill="none"
              style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'tile-star-glow 2.5s ease-in-out infinite' }} />
            <circle cx="20" cy="22" r="5.5" fill={accent} opacity="0.95" />
            <circle cx="20" cy="22" r="2.6" fill="#fbbf24" opacity="0.95"
              style={{ animation: 'tile-gravity-orbit 3.2s linear infinite' }} />
          </svg>
        </div>
      )

    case 'quantum':
      return (
        <div style={wrap}>
          <svg viewBox="0 0 44 44" fill="none" style={{ width: size, height: size, overflow: 'visible' }}>
            {[0, 60, 120].map((rot, i) => (
              <g key={rot} style={{ transformOrigin: '22px 22px', transform: `rotate(${rot}deg) scaleY(0.33)` }}>
                <circle cx="22" cy="22" r="15" stroke={accent} strokeWidth="1" fill="none" opacity="0.35" />
                <g style={{ transformOrigin: '22px 22px', animation: `tile-atom-electron ${2 + i * 0.5}s linear infinite ${i * 0.55}s` }}>
                  <circle cx="37" cy="22" r="2.2" fill={accent} opacity="0.95"
                    style={{ transformOrigin: '37px 22px', transform: 'scaleY(3)' }} />
                </g>
              </g>
            ))}
            <circle cx="22" cy="22" r="7.5" stroke={accent} strokeWidth="0.8" fill="none"
              style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'tile-nucleus-pulse 1.6s ease-in-out infinite' }} />
            <circle cx="20.5" cy="21"   r="3" fill="#f87171" opacity="0.9" />
            <circle cx="23.5" cy="21"   r="3" fill={muted}   opacity="0.55" />
            <circle cx="22"   cy="24.5" r="3" fill="#f87171" opacity="0.9" />
            <circle cx="22"   cy="18"   r="3" fill={muted}   opacity="0.55" />
          </svg>
        </div>
      )

    default:
      return <div style={{ ...wrap, fontSize: size * 0.55 }}>◆</div>
  }
}
