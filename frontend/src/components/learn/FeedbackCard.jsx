const styles = {
  card: {
    background: 'var(--bg-card)',
    backdropFilter: 'blur(12px)',
    border: '1px solid var(--border-light)',
    borderLeft: '4px solid var(--accent-main)',
    borderRadius: 20,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
  },
  header: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--primary-text)' },
  body: { margin: 0, fontSize: 16, lineHeight: 1.55, color: 'var(--primary-text)' },
  suggested: { fontSize: 12, fontWeight: 600, color: 'var(--primary-text-muted)', marginBottom: 4 },
  row: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  tryBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--rec-high)',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    padding: '4px 0',
  },
}

export default function FeedbackCard({ feedback, suggestedCase, onTrySuggested }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.header}>Here’s what to focus on</h3>
      <p style={styles.body}>{feedback}</p>
      {suggestedCase && (
        <>
          <p style={styles.suggested}>Suggested next</p>
          <div style={styles.row}>
            <span className="text-h3" style={{ margin: 0 }}>{suggestedCase}</span>
            <button type="button" style={styles.tryBtn} onClick={onTrySuggested}>
              Try it →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
