import { useScrollAnimation } from '../../hooks/useScrollAnimation'

export default function ScrollReveal({ children, className = '', style = {} }) {
  const [ref, visible] = useScrollAnimation()
  return (
    <div
      ref={ref}
      className={`${className} ${visible ? 'scroll-visible' : ''}`.trim()}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)', ...style }}
    >
      {children}
    </div>
  )
}
