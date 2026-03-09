import { useState } from 'react'
import teamProfiles from '../../data/teamProfiles'

function LinkedInIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function BuilderCard({ profile }) {
  const [hovered, setHovered] = useState(false)
  const { name, role, contribution, statement, avatar, linkedinUrl, initials, accentColor } = profile

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? `${accentColor}40` : 'var(--border-light)'}`,
        borderRadius: 20,
        padding: '28px 24px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 16px 48px ${accentColor}20, 0 0 0 1px ${accentColor}18`
          : '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, border-color 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 220,
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${accentColor}, ${accentColor}60)`,
        opacity: hovered ? 1 : 0.35,
        transition: 'opacity 0.3s ease',
      }} />

      {/* Avatar + identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            style={{
              width: 50, height: 50, borderRadius: '50%',
              objectFit: 'cover',
              border: `2px solid ${hovered ? accentColor : `${accentColor}40`}`,
              boxShadow: hovered ? `0 0 18px ${accentColor}35` : 'none',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              flexShrink: 0,
            }}
          />
        ) : (
          <div style={{
            width: 50, height: 50, borderRadius: '50%',
            background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`,
            border: `2px solid ${hovered ? accentColor : `${accentColor}40`}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 800, color: accentColor,
            boxShadow: hovered ? `0 0 18px ${accentColor}35` : 'none',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            flexShrink: 0,
          }}>
            {initials}
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 15, fontWeight: 700,
            color: 'var(--primary-text)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span>{name}</span>
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="team-linkedin"
                style={{
                  color: '#0a66c2',
                  display: 'flex', flexShrink: 0,
                  transition: 'color 0.2s ease, transform 0.2s ease',
                }}
                onClick={e => e.stopPropagation()}
                aria-label={`${name} on LinkedIn`}
              >
                <LinkedInIcon />
              </a>
            )}
          </div>
          <div style={{
            fontSize: 12, fontWeight: 600, color: accentColor,
            marginTop: 2,
          }}>
            {role}
          </div>
        </div>
      </div>

      {/* Contribution */}
      <div style={{
        fontSize: 11, fontWeight: 600,
        color: 'var(--primary-text-muted)',
        padding: '6px 10px',
        background: `${accentColor}08`,
        border: `1px solid ${accentColor}15`,
        borderRadius: 8,
        lineHeight: 1.5,
      }}>
        {contribution}
      </div>

      {/* Statement — pinned to bottom */}
      <blockquote style={{
        margin: 0, padding: 0,
        fontSize: 13.5, lineHeight: 1.7,
        color: 'var(--primary-text)',
        fontStyle: 'italic',
        marginTop: 'auto',
        opacity: 0.85,
      }}>
        "{statement}"
      </blockquote>
    </div>
  )
}

export default function TeamSection() {
  const topRow = teamProfiles.slice(0, 3)
  const bottomRow = teamProfiles.slice(3)

  return (
    <section style={{
      padding: '88px 24px 96px',
      background: 'var(--bg-card)',
      borderTop: '1px solid var(--border-light)',
      borderBottom: '1px solid var(--border-light)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 980, margin: '0 auto', position: 'relative' }}>
        <div style={{
          fontSize: 10, fontWeight: 800,
          letterSpacing: '0.12em',
          color: 'var(--accent-main)',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: 10,
        }}>
          Built by students
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(26px, 4vw, 34px)', fontWeight: 700,
          textAlign: 'center',
          color: 'var(--primary-text)',
          margin: '0 0 8px',
          letterSpacing: '-0.02em',
        }}>
          Meet the builders
        </h2>
        <p style={{
          textAlign: 'center',
          fontSize: 14,
          color: 'var(--primary-text-muted)',
          margin: '0 auto 52px',
          maxWidth: 440,
          lineHeight: 1.6,
        }}>
          Five friends who got tired of studying blind, so they built something better.
        </p>

        {/* Row 1: 3 cards */}
        <div className="team-row-top" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          marginBottom: 20,
        }}>
          {topRow.map(p => <BuilderCard key={p.name} profile={p} />)}
        </div>

        {/* Row 2: 2 cards, centered */}
        <div className="team-row-bottom" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 20,
          maxWidth: 640,
          margin: '0 auto',
        }}>
          {bottomRow.map(p => <BuilderCard key={p.name} profile={p} />)}
        </div>
      </div>

      <style>{`
        .team-linkedin:hover {
          color: #0a66c2 !important;
          transform: scale(1.15);
        }
        @media (max-width: 860px) {
          .team-row-top { grid-template-columns: repeat(2, 1fr) !important; }
          .team-row-bottom { grid-template-columns: repeat(2, 1fr) !important; max-width: 100% !important; }
        }
        @media (max-width: 540px) {
          .team-row-top { grid-template-columns: 1fr !important; }
          .team-row-bottom { grid-template-columns: 1fr !important; max-width: 100% !important; }
        }
      `}</style>
    </section>
  )
}
