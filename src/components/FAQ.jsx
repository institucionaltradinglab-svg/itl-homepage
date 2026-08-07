import { useState, useRef, useEffect } from 'react'

const FAQ_ITEMS = [
  {
    q: '¿Cuándo son las sesiones en vivo?',
    a: 'Las sesiones en directo se realizan en horarios adaptados a diferentes zonas horarias. Las operativas en live son principalmente durante la sesión de New York y las clases de teoría por las tardes (horario España).',
  },
  {
    q: '¿En qué mercados se puede aplicar la estrategia?',
    a: 'La estrategia se puede aplicar en: Forex, Criptos, Índices (NASDAQ, SP500), Commodities (Oro) y Futuros.',
  },
  {
    q: '¿El acceso al contenido es de por vida?',
    a: 'Sí, una vez compras el Bootcamp tienes acceso de por vida a todo el material grabado, actualizaciones del curso y la comunidad de alumnos.',
  },
  {
    q: '¿Por cuánto tiempo puedo usar los indicadores?',
    a: 'Tu compra incluye 12 meses de licencia para Algoryze X, que incluye todos los indicadores premium, journaling y backtesting. Después puedes renovar a precio reducido de alumni.',
  },
  {
    q: '¿Incluye soporte personalizado?',
    a: 'Sí, tienes acceso a un chat de soporte 1 a 1, sesiones de Q&A en vivo, y corrección personalizada de tus ejercicios y operaciones.',
  },
]

function FAQItem({ item, isOpen, onToggle }) {
  const bodyRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (bodyRef.current) setHeight(bodyRef.current.scrollHeight)
  }, [])

  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        onClick={onToggle}
        className="itl-faq-question"
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
        aria-expanded={isOpen}
      >
        <span style={{ lineHeight: 1.45 }}>{item.q}</span>

        <span style={{
          width: 24, height: 24,
          borderRadius: '50%',
          border: `1px solid ${isOpen ? 'rgba(212,176,84,0.6)' : 'rgba(212,176,84,0.25)'}`,
          background: isOpen ? 'rgba(212,176,84,0.07)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          transition: 'transform 0.38s cubic-bezier(0.22,1,0.36,1), border-color 0.3s, background 0.3s',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          color: '#d4b054',
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <line x1="5" y1="1" x2="5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
      </button>

      <div style={{
        overflow: 'hidden',
        maxHeight: isOpen ? `${height + 32}px` : '0px',
        transition: 'max-height 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        <div ref={bodyRef} style={{ paddingBottom: 24 }}>
          <p className="itl-faq-answer" style={{ fontSize: 14, lineHeight: 1.76, color: 'rgba(255,255,255,0.44)' }}>
            {item.a}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
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
          <p className="itl-section-label" style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: 16 }}>
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
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem
              key={item.q}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
