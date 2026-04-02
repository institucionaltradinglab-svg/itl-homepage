import { useState, useRef, useEffect } from 'react'

const FAQ_ITEMS = [
  {
    q: '¿Necesito experiencia previa para entrar al programa?',
    a: 'No es necesaria experiencia avanzada, pero sí disposición para aprender de forma estructurada. El programa está diseñado para que pases de operar por intuición a operar con sistema, independientemente de tu nivel actual.',
  },
  {
    q: '¿Qué diferencia a ITL de otros programas de trading?',
    a: 'Usamos una metodología institucional real — la misma lógica que aplican mesas de operación profesionales — adaptada para traders individuales. No vendemos señales ni estrategias mágicas. Construimos criterio.',
  },
  {
    q: '¿Qué mercados cubre la metodología?',
    a: 'La metodología es aplicable a futuros (ES, NQ, MES, MNQ), Forex y cripto con suficiente liquidez. Las sesiones en live se centran principalmente en futuros del índice S&P 500.',
  },
  {
    q: '¿Qué es Algoryze X y cómo funciona?',
    a: 'Algoryze X es nuestra plataforma de análisis propietaria. Combina lectura de order flow, análisis de liquidez y contexto de sesión para darte un sesgo claro antes de cada operación.',
  },
  {
    q: '¿Cómo accedo al live trading?',
    a: 'Las sesiones en vivo se realizan en horario de mercado americano (apertura de NY). Quedan grabadas para acceso posterior. Ves operaciones reales, sin edición ni dramatismo.',
  },
  {
    q: '¿Hay garantía o período de prueba?',
    a: 'Sí. Si en los primeros 7 días consideras que el programa no es lo que esperabas, te devolvemos el 100% sin preguntas. Creemos en el programa porque sabemos lo que entrega.',
  },
  {
    q: '¿Cuánto tiempo debo dedicar por semana?',
    a: 'Con 2-3 horas diarias de estudio y práctica es suficiente para avanzar de forma consistente. El programa está diseñado para encajar con quienes tienen trabajo u otras obligaciones.',
  },
]

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false)
  const bodyRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (bodyRef.current) setHeight(bodyRef.current.scrollHeight)
  }, [])

  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '22px 0',
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontFamily: 'inherit',
          fontSize: 15,
          fontWeight: 500,
          textAlign: 'left',
          cursor: 'pointer',
          gap: 20,
        }}
        aria-expanded={open}
      >
        <span style={{ lineHeight: 1.45 }}>{item.q}</span>

        {/* Gold expand icon — no orange */}
        <span style={{
          width: 24, height: 24,
          borderRadius: '50%',
          border: `1px solid ${open ? 'rgba(212,176,84,0.6)' : 'rgba(212,176,84,0.25)'}`,
          background: open ? 'rgba(212,176,84,0.07)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.3s, background 0.3s',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          color: '#d4b054',
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <line x1="5" y1="1" x2="5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
      </button>

      {/* Answer — smooth height transition */}
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? `${height + 32}px` : '0px',
        transition: 'max-height 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        <div ref={bodyRef} style={{ paddingBottom: 24 }}>
          <p style={{
            fontSize: 14, lineHeight: 1.76,
            color: 'rgba(255,255,255,0.44)',
          }}>
            {item.a}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const titleRef = useRef(null)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          obs.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="faq" style={{ padding: '128px 24px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        <div
          ref={titleRef}
          style={{
            opacity: 0, transform: 'translateY(24px)',
            transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)',
            marginBottom: 56,
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: 16 }}>
            FAQ
          </p>
          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(160deg, #fff 0%, rgba(255,255,255,0.55) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Preguntas frecuentes
          </h2>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {FAQ_ITEMS.map((item, i) => <FAQItem key={item.q} item={item} index={i} />)}
        </div>
      </div>
    </section>
  )
}
