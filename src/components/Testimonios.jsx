import { useRef, useEffect } from 'react'

/* ─── Data — headline variant has a bold title, stars variant shows rating ─── */
const TESTIMONIALS = [
  {
    variant: 'stars',
    name: 'Asahel M.',
    location: 'España',
    initials: 'AM',
    date: 'Abril 2025',
    text: 'Es una formación bien estructurada y bien explicada, de principio a fin. Con ejercicios prácticos, corrección de los mismos, operativa en directo más acompañamiento. Todo ello unido a un grupo activo que te ayudará en tu crecimiento como trader.',
  },
  {
    variant: 'headline',
    headline: 'En dos meses logré lo que en años no pude.',
    name: 'Samuel G.',
    location: 'España',
    initials: 'SG',
    date: 'Marzo 2026',
    text: 'Muy agradecido con toda la formación y la atención a cada alumno, 100% recomendable. Solo en dos meses conseguí lo que en años nunca pude.',
  },
  {
    variant: 'stars',
    name: 'Vicente L.',
    location: 'Venezuela',
    initials: 'VL',
    date: 'Marzo 2026',
    text: 'El curso muy claro y lo explican para que cualquier persona pueda entender y aplicarlo. El trato muy cercano y con rápida respuesta a cualquier duda. Además estoy fondeado y haciendo retiros.',
  },
  {
    variant: 'headline',
    headline: 'Calidad humana y compromiso real.',
    name: 'Sandra M.',
    location: 'Colombia',
    initials: 'SM',
    date: 'Diciembre 2025',
    text: 'Llevo un mes con ellos y he sentido que no estoy sola en este proceso. Son organizados, comprometidos y noto que tienen calidad humana, que es muy importante.',
  },
  {
    variant: 'headline',
    headline: 'Confianza desde el minuto uno.',
    name: 'Elvingp.',
    location: 'España',
    initials: 'EP',
    date: 'Diciembre 2025',
    text: 'Desde el minuto 1 me dio total confianza. Siempre están atentos a resolver cualquier situación y ofreciendo contenido de calidad. Sin duda, si comenzase de 0, lo volvería a escoger sin ninguna duda.',
  },
  {
    variant: 'stars',
    name: 'Verónica R.',
    location: 'España',
    initials: 'VR',
    date: 'Marzo 2026',
    text: 'Me di cuenta enseguida de que esto es lo que quería y necesitaba. En unos pocos meses conseguí una cuenta de fondeo, a la primera y con muy buen resultado. Gracias equipo.',
  },
]

/* ─── Stars row ─── */
function Stars() {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 15 15" fill="#d4b054">
          <path d="M7.5 1l1.6 3.6 3.9.57-2.83 2.75.67 3.88L7.5 10.1 4.16 11.8l.67-3.88L2 5.17l3.9-.57L7.5 1z"/>
        </svg>
      ))}
    </div>
  )
}

/* ─── Single card ─── */
function TestimonioCard({ t, delay }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.transitionDelay = `${delay}ms`
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('tst-in'); obs.unobserve(el) } },
      { threshold: 0.06 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className="tst-card"
      style={{
        background: '#111111',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        padding: '28px 26px',
        breakInside: 'avoid',
        marginBottom: 14,
      }}
    >
      {/* Top — headline or stars */}
      {t.variant === 'headline' ? (
        <p style={{
          fontSize: 17,
          fontWeight: 700,
          lineHeight: 1.3,
          letterSpacing: '-0.02em',
          color: '#ffffff',
          marginBottom: 14,
        }}>
          {t.headline}
        </p>
      ) : (
        <Stars />
      )}

      {/* Review body */}
      <p style={{
        fontSize: 14,
        lineHeight: 1.72,
        color: 'rgba(255,255,255,0.52)',
        marginBottom: 24,
      }}>
        {t.text}
      </p>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 38, height: 38,
          borderRadius: '50%',
          background: 'rgba(212,176,84,0.1)',
          border: '1px solid rgba(212,176,84,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700,
          color: '#d4b054', letterSpacing: '0.04em',
          flexShrink: 0,
        }}>
          {t.initials}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
            {t.name}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
            {t.location}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Section ─── */
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

  /* Split 6 cards across 3 columns: [0,3], [1,4], [2,5] */
  const cols = [
    TESTIMONIALS.filter((_, i) => i % 3 === 0),
    TESTIMONIALS.filter((_, i) => i % 3 === 1),
    TESTIMONIALS.filter((_, i) => i % 3 === 2),
  ]

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
          <p style={{
            fontSize: 11, fontWeight: 500, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: 16,
          }}>
            Testimonios
          </p>
          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 38px)',
            fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em',
            background: 'linear-gradient(160deg, #fff 0%, rgba(255,255,255,0.55) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            maxWidth: 400,
          }}>
            Lo que dicen nuestros alumnos
          </h2>
        </div>

        {/* 3-column masonry grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, alignItems: 'start' }}>
          {cols.map((col, ci) => (
            <div key={ci}>
              {col.map((t, ri) => (
                <TestimonioCard key={t.name} t={t} delay={(ci * 2 + ri) * 80} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .tst-card {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .tst-card.tst-in { opacity: 1; transform: translateY(0); }
        @media (max-width: 768px) {
          #resultados .tst-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
