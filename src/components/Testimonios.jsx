import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const TESTIMONIALS = [
  {
    name: 'Asahel M.',
    location: 'España',
    initials: 'AM',
    date: 'Abril 2025',
    text: 'Es una formación bien estructurada y bien explicada, de principio a fin. Con ejercicios prácticos, corrección de los mismos, operativa en directo más acompañamiento. Todo ello unido a un grupo activo que te ayudará en tu crecimiento como trader.',
  },
  {
    name: 'Samuel G.',
    location: 'España',
    initials: 'SG',
    date: 'Marzo 2026',
    text: 'Muy agradecido con toda la formación y la atención a cada alumno, 100% recomendable. Solo en dos meses conseguí lo que en años nunca pude.',
  },
  {
    name: 'Vicente L.',
    location: 'Venezuela',
    initials: 'VL',
    date: 'Marzo 2026',
    text: 'El curso muy claro y lo explican para que cualquier persona pueda entender y aplicarlo. El trato muy cercano y con rápida respuesta a cualquier duda. Además estoy fondeado y haciendo retiros.',
  },
  {
    name: 'Sandra M.',
    location: 'Colombia',
    initials: 'SM',
    date: 'Diciembre 2025',
    text: 'Llevo un mes con ellos y he sentido que no estoy sola en este proceso. Son organizados, comprometidos y noto que tienen calidad humana, que es muy importante.',
  },
  {
    name: 'Elvingp.',
    location: 'España',
    initials: 'EP',
    date: 'Diciembre 2025',
    text: 'Desde el minuto 1 me dio total confianza. Siempre están atentos a resolver cualquier situación y ofreciendo contenido de calidad. Sin duda, si comenzase de 0, lo volvería a escoger sin ninguna duda.',
  },
  {
    name: 'Anónimo',
    location: 'España',
    initials: '—',
    date: 'Marzo 2026',
    text: 'Me di cuenta enseguida de que esto es lo que quería y necesitaba. En unos pocos meses conseguí una cuenta de fondeo, a la primera y con muy buen resultado. Gracias equipo.',
  },
]

const Star = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="#d4b054">
    <path d="M6.5 1l1.4 3.1H11l-2.6 1.9.99 3.1-2.89-2.1-2.89 2.1.99-3.1L2 4.1h3.1L6.5 1z"/>
  </svg>
)

const TrustpilotCheck = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <circle cx="5.5" cy="5.5" r="5" fill="rgba(212,176,84,0.12)"/>
    <path d="M3 5.5l2 2L8 3.5" stroke="#d4b054" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function TestimonioCard({ t }) {
  return (
    <div style={{
      background: '#0a0a0a',
      border: '1px solid rgba(212,176,84,0.09)',
      borderRadius: 16,
      padding: '24px',
      marginBottom: 12,
      flexShrink: 0,
    }}>
      {/* Stars */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
        {[...Array(5)].map((_, i) => <Star key={i} />)}
      </div>

      {/* Text */}
      <p style={{
        fontSize: 13, lineHeight: 1.72,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 20,
      }}>
        "{t.text}"
      </p>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'rgba(212,176,84,0.08)',
          border: '1px solid rgba(212,176,84,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: '#d4b054', letterSpacing: '0.04em',
          flexShrink: 0,
        }}>
          {t.initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {t.name}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', marginTop: 1 }}>
            {t.location} · {t.date}
          </div>
        </div>
      </div>

      {/* Trustpilot badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <TrustpilotCheck />
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em' }}>
          Verificado en Trustpilot
        </span>
      </div>
    </div>
  )
}

/* Scrolling column — duplicated for seamless loop */
function ScrollColumn({ items, duration, reverse = false }) {
  return (
    <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
      <motion.div
        animate={{ translateY: reverse ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {/* Duplicate for seamless loop */}
        {[...items, ...items].map((t, i) => (
          <TestimonioCard key={`${t.name}-${i}`} t={t} />
        ))}
      </motion.div>
    </div>
  )
}

export default function Testimonios() {
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

  // Split into 3 columns
  const col1 = TESTIMONIALS.slice(0, 2)
  const col2 = TESTIMONIALS.slice(2, 4)
  const col3 = TESTIMONIALS.slice(4, 6)

  return (
    <section id="resultados" style={{ padding: '128px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div
          ref={titleRef}
          style={{
            opacity: 0, transform: 'translateY(24px)',
            transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)',
            marginBottom: 56,
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: 16 }}>
            Testimonios
          </p>
          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 38px)',
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(160deg, #fff 0%, rgba(255,255,255,0.55) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            maxWidth: 400,
          }}>
            Lo que dicen nuestros alumnos
          </h2>
        </div>

        {/* Scrolling columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          maxHeight: 680,
          overflow: 'hidden',
          /* fade top and bottom */
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}>
          <ScrollColumn items={col1} duration={14} />
          <ScrollColumn items={col2} duration={18} reverse />
          <ScrollColumn items={col3} duration={16} />
        </div>
      </div>
    </section>
  )
}
