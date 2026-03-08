export default function WaveMark({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size * 0.636}
      viewBox="0 0 44 20"
      fill="none"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path
        d="M2 10 C6 2, 12 2, 16 10 C20 18, 26 18, 30 10 C34 2, 40 2, 42 10"
        stroke="var(--accent-main)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
