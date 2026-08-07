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

/* ─── Icons — sized for the large placeholder area ─── */
const IconPlay = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="24" stroke="#d4b054" strokeWidth="1.4"/>
    <polygon points="22,18 36,26 22,34" fill="#d4b054"/>
  </svg>
)
const IconChart = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <rect x="6"  y="34" width="8"  height="12" rx="2" fill="#d4b054" opacity="0.45"/>
    <rect x="22" y="22" width="8"  height="24" rx="2" fill="#d4b054" opacity="0.7"/>
    <rect x="38" y="6"  width="8"  height="40" rx="2" fill="#d4b054"/>
  </svg>
)
const IconUsers = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <circle cx="18" cy="16" r="8"  stroke="#d4b054" strokeWidth="1.4"/>
    <circle cx="36" cy="15" r="6"  stroke="#d4b054" strokeWidth="1.4"/>
    <path d="M2 46c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="#d4b054" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M36 27c5.523 0 10 4.477 10 10" stroke="#d4b054" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)
const IconTerminal = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <rect x="4" y="8" width="44" height="36" rx="7" stroke="#d4b054" strokeWidth="1.4"/>
    <path d="M16 18l10 8-10 8" stroke="#d4b054" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="30" y1="34" x2="44" y2="34" stroke="#d4b054" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

const CARDS = [
  {
    Icon: IconPlay,
    title: 'Sesiones en Live',
    body: 'Sesiones en directo de análisis de mercado, operativas en vivo y resolución de dudas en tiempo real con el equipo.',
    media: null,   // gold icon placeholder only
  },
  {
    Icon: IconChart,
    title: 'Análisis de Mercado',
    body: 'Análisis diario de mercado con niveles institucionales, contexto de sesión y sesgo de dirección.',
    video: '/operativa-itl.mp4',
    media: null,   // gold icon placeholder only
  },
  {
    Icon: IconUsers,
    title: 'Comunidad Privada',
    body: 'Comunidad exclusiva con dirección de mercado diaria, alertas de entradas en vivo y cultura de excelencia operativa.',
    media: '/panel-itl.png',
    video: '/discord-itl.mp4',
  },
  {
    Icon: IconTerminal,
    title: 'Algoryze X',
    body: 'Plataforma de backtesting, journal de trading e indicadores premium para apoyarte en tu operativa.',
    media: '/algoryze-x.png',
    video: '/algoryze-itl.mp4',
    startTime: 1,
  },
]

function ProgramCard({ card, delay }) {
  const cardRef = useFadeUp(delay)
  return (
    <div ref={cardRef} className="itl-fu">
      <SpotlightCard>
        {/* ── Media area ── */}
        <div className="program-card-media" style={{ background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
          <video
            src={card.video || '/live-trading.mp4'}
            autoPlay muted loop playsInline preload="auto"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onLoadedMetadata={e => { if (card.startTime) e.target.currentTime = card.startTime }}
          />
          {/* subtle bottom fade for text legibility */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.1) 40%, transparent 100%)',
          }} />
        </div>

        {/* ── Text block at bottom ── */}
        <div style={{ padding: '22px 24px 28px' }}>
          <h3 className="itl-card-title" style={{
            fontSize: 17, fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#d4b054',
            marginBottom: 8,
          }}>
            {card.title}
          </h3>
          <p className="itl-card-body" style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(255,255,255,0.42)' }}>
            {card.body}
          </p>
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
          <p className="itl-section-label" style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: 16 }}>
            El Programa
          </p>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 56px)',
            fontWeight: 800, lineHeight: 1.08,
            letterSpacing: '-0.035em',
            background: 'linear-gradient(160deg, #fff 0%, rgba(255,255,255,0.55) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: 48, maxWidth: 620,
          }}>
            Todo lo que necesitas para operar como un institucional
          </h2>
        </div>

        {/* Cards grid — 2 columns × 2 rows */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {CARDS.map((card, i) => <ProgramCard key={card.title} card={card} delay={i * 80} />)}
        </div>
      </div>

      <style>{`
        .itl-fu { opacity: 0; transform: translateY(28px); transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1); }
        .itl-fu.itl-vis { opacity: 1; transform: translateY(0); }
        .spotlight-card:hover { transform: scale(1.02) !important; box-shadow: 0 8px 40px rgba(212,176,84,0.1) !important; border-color: rgba(212,176,84,0.22) !important; }
        .program-card-media { height: 280px; }
        @media (max-width: 768px) {
          .program-card-media { height: 200px; }
        }
      `}</style>
    </section>
  )
}
