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
    <section id="metodología" style={{ padding: '128px 24px', overflow: 'hidden', position: 'relative' }}>
      {/* Fade-in top edge — softens the slide-up over Hero */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 120,
        background: 'linear-gradient(to bottom, #000 0%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>

        {/* ─── Left ─── */}
        <div ref={leftRef} className="itl-fade-up">
          <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: 22 }}>
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

          <p style={{ fontSize: 17, lineHeight: 1.76, color: 'rgba(255,255,255,0.46)', marginBottom: 36 }}>
            Operar sin una estructura definida lleva a decisiones impulsivas y emocionales, y a resultados inconsistentes. El problema no es la falta de conocimiento. Es la falta de un proceso que puedas aplicar y repetir. Institutional Trading Lab organiza el trading en un sistema claro: entender la estructura, aplicar una estrategia concreta y ejecutar con control.
          </p>

        </div>

        {/* ─── Right — depth panel ─── */}
        <div ref={rightRef} className="itl-fade-up" style={{ position: 'relative' }}>

          {/* Depth wrapper applies the shared 3-D transform to ALL layers */}
          <div style={{
            transform: 'perspective(1100px) rotateY(-7deg) rotateX(3deg)',
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
          }}>

            {/* ── Layer 3 — furthest shadow ── */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0,
              borderRadius: 16,
              background: '#050505',
              border: '1px solid rgba(212,176,84,0.04)',
              transform: 'translateZ(-32px) translateX(22px) translateY(14px)',
            }} />

            {/* ── Layer 2 — mid shadow ── */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0,
              borderRadius: 16,
              background: '#080808',
              border: '1px solid rgba(212,176,84,0.07)',
              transform: 'translateZ(-16px) translateX(11px) translateY(7px)',
            }} />

            {/* ── Main device frame ── */}
            <div style={{
              position: 'relative',
              borderRadius: 14,
              overflow: 'hidden',
              background: '#0d0d0d',
              border: '1px solid rgba(212,176,84,0.18)',
              boxShadow: [
                '-6px 12px 48px rgba(0,0,0,0.7)',
                '0 0 0 1px rgba(255,255,255,0.03)',
                '-2px 0 28px rgba(212,176,84,0.07)',
              ].join(', '),
            }}>
              {/* Gold glow top-left corner */}
              <div aria-hidden="true" style={{
                position: 'absolute', top: -40, left: -40,
                width: 200, height: 200,
                background: 'radial-gradient(circle, rgba(212,176,84,0.22) 0%, transparent 65%)',
                borderRadius: '50%', zIndex: 2, pointerEvents: 'none',
              }} />

              {/* Image — natural proportions, no letterbox */}
              <img
                src="/panel-itl.png"
                alt="Panel ITL trading dashboard"
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  position: 'relative', zIndex: 1,
                }}
              />

              {/* Subtle right-edge fade into black */}
              <div aria-hidden="true" style={{
                position: 'absolute', inset: 0, zIndex: 3,
                background: 'linear-gradient(to right, transparent 55%, rgba(0,0,0,0.45) 82%, rgba(0,0,0,0.85) 100%)',
              }} />
            </div>
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
