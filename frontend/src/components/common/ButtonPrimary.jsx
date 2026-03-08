const styles = {
  btn: {
    padding: '14px 28px',
    borderRadius: 8,
    background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.12) 100%)',
    color: '#fff',
    border: '2px solid var(--accent-main)',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.03em',
    boxShadow: '0 2px 0 rgba(99, 102, 241, 0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  },
  btnBlock: { width: '100%' },
  text: {
    background: 'none',
    color: 'var(--rec-high)',
    border: 'none',
    borderBottom: '1px solid var(--graph-axis)',
    borderRadius: 0,
    padding: '8px 0',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
  },
}

export function ButtonPrimary({ children, onClick, block, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      style={{
        ...styles.btn,
        ...(block ? styles.btnBlock : {}),
        ...(disabled ? { opacity: 0.45, cursor: 'not-allowed' } : {}),
      }}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  )
}

export function ButtonText({ children, onClick }) {
  return (
    <button type="button" style={styles.text} onClick={onClick}>
      {children}
    </button>
  )
}
