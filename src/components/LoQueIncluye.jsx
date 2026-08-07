import { useRef, useEffect } from 'react'

function useFadeUp(delay = 0) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.transitionDelay = `${delay}ms`
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('lqi-vis'); obs.unobserve(el) } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return ref
}

/* ─── Icons ─── */
const IcoStrategy = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="2" y="14" width="3" height="6" rx="1" fill="#d4b054" opacity="0.5"/>
    <rect x="9.5" y="7" width="3" height="13" rx="1" fill="#d4b054" opacity="0.75"/>
    <rect x="17" y="1" width="3" height="19" rx="1" fill="#d4b054"/>
  </svg>
)
const IcoAlgoryze = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="2" y="2" width="18" height="18" rx="4" stroke="#d4b054" strokeWidth="1.3"/>
    <path d="M6 16l3-6 3 4 2-3 2 5" stroke="#d4b054" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IcoLive = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="3" fill="#d4b054"/>
    <circle cx="11" cy="11" r="3" fill="#d4b054" opacity="0.25">
      <animate attributeName="r" values="3;7;3" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.25;0;0.25" dur="2s" repeatCount="indefinite"/>
    </circle>
    <path d="M3.5 3.5A10.5 10.5 0 0 0 .5 11a10.5 10.5 0 0 0 10.5 10.5A10.5 10.5 0 0 0 21.5 11 10.5 10.5 0 0 0 18.5 3.5" stroke="#d4b054" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)
const IcoFunding = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M11 1l2.2 6.1H20l-5.3 3.9 2 6.1L11 13.4l-5.7 3.7 2-6.1L2 7.1h6.8L11 1z" stroke="#d4b054" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
)
const IcoSupport = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M19 5H3a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h8l4 4V18h4a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" stroke="#d4b054" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
)
const IcoCommunity = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="8" cy="7" r="3.5" stroke="#d4b054" strokeWidth="1.3"/>
    <circle cx="15.5" cy="6.5" r="2.5" stroke="#d4b054" strokeWidth="1.3"/>
    <path d="M1 20c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#d4b054" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M15.5 12c2.485 0 4.5 2.015 4.5 4.5" stroke="#d4b054" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

const CARDS = [
  {
    Icon: IcoStrategy,
    title: 'Estrategia Institucional',
    body: 'Aprende una estrategia clara y sistematizada, desde la base hasta la ejecución.',
  },
  {
    Icon: IcoAlgoryze,
    title: 'Algoryze X',
    body: 'Accede a nuestra plataforma exclusiva de backtesting, journal de trading avanzado e indicadores premium para apoyarte en tu operativa.',
  },
  {
    Icon: IcoLive,
    title: 'Sesiones en Live',
    body: 'Sesiones en directo de análisis de mercado, operativas en vivo y resolución de dudas en tiempo real con el equipo.',
  },
  {
    Icon: IcoFunding,
    title: 'Estrategia de Fondeo',
    body: 'Metodología probada y replicable para superar challenges con gestión de riesgo avanzado y modelos de entrada de alta precisión.',
  },
  {
    Icon: IcoSupport,
    title: 'Soporte Personalizado',
    body: 'Chat de soporte 1-1, corrección de operativas y feedback directo y continuo sobre tu desarrollo como trader.',
  },
  {
    Icon: IcoCommunity,
    title: 'Comunidad Privada',
    body: 'Comunidad exclusiva con dirección de mercado diaria, alertas de entradas en vivo y cultura de excelencia operativa.',
  },
]

function GlassCard({ item, delay }) {
  const ref = useFadeUp(delay)

  return (
    <div
      ref={ref}
      className="lqi-fu"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(212,176,84,0.09)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 18,
        padding: '28px 24px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(212,176,84,0.22)'
        e.currentTarget.style.transform = 'scale(1.01) translateY(-2px)'
        e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(212,176,84,0.07), 0 12px 32px rgba(0,0,0,0.4)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(212,176,84,0.09)'
        e.currentTarget.style.transform = 'scale(1) translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Inner top glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(to right, transparent, rgba(212,176,84,0.25), transparent)',
      }} />

      <div style={{ marginBottom: 18 }}>
        <item.Icon />
      </div>

      <h3 className="lqi-card-title" style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 10 }}>
        {item.title}
      </h3>

      <p className="itl-card-body" style={{ fontSize: 13, lineHeight: 1.68, color: 'rgba(255,255,255,0.42)' }}>
        {item.body}
      </p>
    </div>
  )
}

export default function LoQueIncluye() {
  const titleRef = useFadeUp(0)

  return (
    <section style={{ padding: '128px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div ref={titleRef} className="lqi-fu">
          <p className="itl-section-label" style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: 16 }}>
            Lo Que Incluye
          </p>
          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 38px)',
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(160deg, #fff 0%, rgba(255,255,255,0.55) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: 56, maxWidth: 520,
          }}>
            Todo lo que incluye tu proceso dentro del Bootcamp
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {CARDS.map((item, i) => <GlassCard key={item.title} item={item} delay={i * 70} />)}
        </div>
      </div>

      <style>{`
        .lqi-fu { opacity: 0; transform: translateY(28px); transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1); }
        .lqi-fu.lqi-vis { opacity: 1; transform: translateY(0); }
      `}</style>
    </section>
  )
}
