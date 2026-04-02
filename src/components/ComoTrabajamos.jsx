import { useRef, useEffect } from 'react'

function useFadeUp(threshold = 0.12) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('itl-visible'); obs.unobserve(el) } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}

export default function ComoTrabajamos() {
  const leftRef = useFadeUp()
  const rightRef = useFadeUp(0.08)

  return (
    <section id="metodología" style={{ padding: '128px 24px', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>

        {/* ─── Left ─── */}
        <div ref={leftRef} className="itl-fade-up">
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: 22 }}>
            Cómo Trabajamos
          </p>

          <h2 style={{
            fontSize: 'clamp(24px, 3.2vw, 40px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(160deg, #fff 0%, rgba(255,255,255,0.55) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 24,
          }}>
            Sin claridad, no hay control — y sin control no hay consistencia
          </h2>

          <p style={{ fontSize: 15, lineHeight: 1.76, color: 'rgba(255,255,255,0.46)', marginBottom: 36 }}>
            Operar sin una estructura definida lleva a decisiones impulsivas y emocionales, y a resultados inconsistentes. El problema no es la falta de conocimiento. Es la falta de un proceso que puedas aplicar y repetir. Institutional Trading Lab organiza el trading en un sistema claro: entender la estructura, aplicar una estrategia concreta y ejecutar con control.
          </p>

          <button
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '0 28px', height: 48,
              borderRadius: 9999,
              border: '1px solid rgba(212,176,84,0.3)',
              background: 'transparent',
              color: '#d4b054',
              fontSize: 13, fontWeight: 500,
              fontFamily: 'inherit', cursor: 'pointer',
              transition: 'border-color 0.3s, background 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(212,176,84,0.85)'
              e.currentTarget.style.background = 'rgba(212,176,84,0.06)'
              e.currentTarget.style.boxShadow = '0 0 24px rgba(212,176,84,0.16)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(212,176,84,0.3)'
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Ver cómo funciona
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* ─── Right — depth panel ─── */}
        <div ref={rightRef} className="itl-fade-up" style={{ position: 'relative', height: 440 }}>
          {/* Depth card 3 — furthest */}
          <div style={{
            position: 'absolute', inset: 0,
            top: 28, left: 20, right: -20,
            background: '#060606',
            border: '1px solid rgba(212,176,84,0.05)',
            borderRadius: 20,
            transform: 'perspective(1000px) rotateY(-3deg) rotateX(2deg) scale(0.93)',
            transformOrigin: 'left center',
          }} />
          {/* Depth card 2 */}
          <div style={{
            position: 'absolute', inset: 0,
            top: 14, left: 10, right: -10,
            background: '#090909',
            border: '1px solid rgba(212,176,84,0.07)',
            borderRadius: 20,
            transform: 'perspective(1000px) rotateY(-3deg) rotateX(2deg) scale(0.97)',
            transformOrigin: 'left center',
          }} />

          {/* Main panel */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: 20,
            overflow: 'hidden',
            border: '1px solid rgba(212,176,84,0.14)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), -4px 4px 32px rgba(212,176,84,0.05)',
            transform: 'perspective(1000px) rotateY(-3deg) rotateX(2deg)',
            transformOrigin: 'left center',
            background: '#0a0a0a',
          }}>
            {/* Gold glow top-left */}
            <div aria-hidden="true" style={{
              position: 'absolute', top: -50, left: -50,
              width: 240, height: 240,
              background: 'radial-gradient(circle, rgba(212,176,84,0.25) 0%, transparent 65%)',
              borderRadius: '50%', zIndex: 2, pointerEvents: 'none',
            }} />
            <img
              src="/panel-itl.png"
              alt="Panel ITL trading dashboard"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Gradient fade right */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, transparent 45%, rgba(0,0,0,0.6) 75%, #000 100%)',
              zIndex: 1,
            }} />
          </div>
        </div>
      </div>

      <style>{`
        .itl-fade-up { opacity: 0; transform: translateY(32px); transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .itl-fade-up.itl-visible { opacity: 1; transform: translateY(0); }
        @media (max-width: 768px) {
          #metodología > div { grid-template-columns: 1fr !important; }
          #metodología > div > div:last-child { height: 260px !important; }
        }
      `}</style>
    </section>
  )
}
