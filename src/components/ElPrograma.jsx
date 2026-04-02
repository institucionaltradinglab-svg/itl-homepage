import { useRef, useEffect, useCallback } from 'react'

/* ─── Fade-up hook ─── */
function useFadeUp(delay = 0) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.transitionDelay = `${delay}ms`
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('itl-vis'); obs.unobserve(el) } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return ref
}

/* ─── Spotlight card (pointer-tracking gold glow) ─── */
function SpotlightCard({ children, style }) {
  const ref = useRef(null)

  const handleMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    el.style.setProperty('--spotlight', '1')
  }, [])

  const handleLeave = useCallback(() => {
    const el = ref.current
    if (el) el.style.setProperty('--spotlight', '0')
  }, [])

  return (
    <div
      ref={ref}
      className="spotlight-card"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        '--spotlight': 0,
        '--mx': '50%',
        '--my': '50%',
        background: '#0a0a0a',
        border: '1px solid rgba(212,176,84,0.1)',
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'default',
        transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease, border-color 0.35s ease',
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.02)'
        e.currentTarget.style.boxShadow = '0 8px 40px rgba(212,176,84,0.1), 0 0 0 1px rgba(212,176,84,0.2)'
        e.currentTarget.style.borderColor = 'rgba(212,176,84,0.22)'
      }}
      onMouseLeave2={e => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = 'rgba(212,176,84,0.1)'
      }}
    >
      {/* Spotlight radial */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        borderRadius: 'inherit',
        background: 'radial-gradient(280px circle at var(--mx) var(--my), rgba(212,176,84,0.07) 0%, transparent 65%)',
        opacity: 'var(--spotlight)',
        transition: 'opacity 0.2s',
      }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}

/* ─── Icons ─── */
const IconPlay = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9" stroke="#d4b054" strokeWidth="1.3"/>
    <polygon points="8,7 14,10 8,13" fill="#d4b054"/>
  </svg>
)
const IconChart = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="13" width="3" height="5" rx="1" fill="#d4b054" opacity="0.5"/>
    <rect x="8.5" y="8" width="3" height="10" rx="1" fill="#d4b054" opacity="0.75"/>
    <rect x="15" y="2" width="3" height="16" rx="1" fill="#d4b054"/>
  </svg>
)
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="7" cy="6" r="3" stroke="#d4b054" strokeWidth="1.3"/>
    <circle cx="14" cy="6" r="2.5" stroke="#d4b054" strokeWidth="1.3"/>
    <path d="M1 18c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#d4b054" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M14 11c2.21 0 4 1.79 4 4" stroke="#d4b054" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)
const IconTerminal = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="3" width="16" height="14" rx="3" stroke="#d4b054" strokeWidth="1.3"/>
    <path d="M6 7l3 3-3 3" stroke="#d4b054" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="11" y1="13" x2="15" y2="13" stroke="#d4b054" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

const CARDS = [
  {
    Icon: IconPlay,
    title: 'Sesiones en Live',
    body: 'Sesiones en directo de análisis de mercado, operativas en vivo y resolución de dudas en tiempo real con el equipo.',
    media: null,
    badge: 'LIVE',
  },
  {
    Icon: IconChart,
    title: 'Análisis de Mercado',
    body: 'Análisis diario de mercado con niveles institucionales, contexto de sesión y sesgo de dirección.',
    media: '/market-analysis.png',
  },
  {
    Icon: IconUsers,
    title: 'Comunidad Privada',
    body: 'Comunidad exclusiva con dirección de mercado diaria, alertas de entradas en vivo y cultura de excelencia operativa.',
    media: '/panel-itl.png',
  },
  {
    Icon: IconTerminal,
    title: 'Algoryze X',
    body: 'Plataforma de backtesting, journal de trading e indicadores premium para apoyarte en tu operativa.',
    media: '/algoryze-x.png',
    badge: 'PRO',
  },
]

function ProgramCard({ card, delay }) {
  const cardRef = useFadeUp(delay)
  return (
    <div ref={cardRef} className="itl-fu">
      <SpotlightCard>
        {/* Media */}
        <div style={{ height: 190, background: '#050505', position: 'relative', overflow: 'hidden' }}>
          {card.title === 'Sesiones en Live' ? (
            <video src="/live-trading.mp4" autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : card.media ? (
            <img src={card.media} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#080808' }} />
          )}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.15) 50%, transparent 100%)',
          }} />
          {card.badge && (
            <div style={{
              position: 'absolute', top: 12, left: 12, zIndex: 3,
              padding: '3px 10px', borderRadius: 9999,
              background: 'rgba(212,176,84,0.12)',
              border: '1px solid rgba(212,176,84,0.35)',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#d4b054',
            }}>
              {card.badge}
            </div>
          )}
        </div>
        {/* Text */}
        <div style={{ padding: '20px 22px 26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <card.Icon />
            <h3 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.015em' }}>{card.title}</h3>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.68, color: 'rgba(255,255,255,0.42)' }}>{card.body}</p>
        </div>
      </SpotlightCard>
    </div>
  )
}

export default function ElPrograma() {
  const titleRef = useFadeUp(0)

  return (
    <section id="programa" style={{ padding: '128px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div ref={titleRef} className="itl-fu">
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: 16 }}>
            El Programa
          </p>
          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 38px)',
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(160deg, #fff 0%, rgba(255,255,255,0.55) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: 56, maxWidth: 520,
          }}>
            Todo lo que necesitas para construir una operativa sólida
          </h2>
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {CARDS.map((card, i) => <ProgramCard key={card.title} card={card} delay={i * 80} />)}
        </div>
      </div>

      <style>{`
        .itl-fu { opacity: 0; transform: translateY(28px); transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1); }
        .itl-fu.itl-vis { opacity: 1; transform: translateY(0); }
        .spotlight-card:hover { transform: scale(1.02) !important; box-shadow: 0 8px 40px rgba(212,176,84,0.1) !important; border-color: rgba(212,176,84,0.22) !important; }
      `}</style>
    </section>
  )
}
