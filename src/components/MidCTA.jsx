import { useRef, useEffect } from 'react'

/* ─── Gold orb — pure CSS, matches screenshot ─── */
function GoldOrb() {
  const wrapperRef = useRef(null)

  // Scroll entrance: scale 0.82 → 1, fade in
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translate(-50%, -50%) scale(1)'
          obs.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* Entrance wrapper — centered absolute */}
      <div
        ref={wrapperRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%) scale(0.82)',
          opacity: 0,
          transition: 'opacity 1.1s cubic-bezier(0.22,1,0.36,1), transform 1.1s cubic-bezier(0.22,1,0.36,1)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {/* 1. Diffuse warm fill */}
        <div className="gold-orb-fill" style={{
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(120,75,0,0.55) 0%, rgba(70,42,0,0.25) 45%, transparent 70%)',
          filter: 'blur(52px)',
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
        }} />

        {/* 2. Main gold ring with glow */}
        <div className="gold-orb-ring" style={{
          borderRadius: '50%',
          border: '1.5px solid rgba(212,176,84,0.6)',
          position: 'relative',
        }} />
      </div>

      <style>{`
        .gold-orb-fill {
          width: 560px; height: 560px;
        }
        .gold-orb-ring {
          width: 480px; height: 480px;
          box-shadow:
            0 0 30px 14px rgba(212,176,84,0.22),
            0 0 80px 40px rgba(212,176,84,0.11),
            0 0 160px 80px rgba(212,176,84,0.06),
            inset 0 0 60px rgba(212,176,84,0.07);
          animation: orb-breathe 4.5s ease-in-out infinite;
        }
        @keyframes orb-breathe {
          0%, 100% { transform: scale(1);    opacity: 0.85; }
          50%       { transform: scale(1.06); opacity: 1;    }
        }
        @media (max-width: 768px) {
          .gold-orb-fill {
            width: 320px !important;
            height: 320px !important;
            filter: blur(36px) !important;
          }
          .gold-orb-ring {
            width: 280px !important;
            height: 280px !important;
            box-shadow:
              0 0 22px 10px rgba(212,176,84,0.28),
              0 0 55px 28px rgba(212,176,84,0.15),
              0 0 110px 55px rgba(212,176,84,0.08),
              inset 0 0 40px rgba(212,176,84,0.1) !important;
          }
        }
      `}</style>
    </>
  )
}

export default function MidCTA() {
  const textRef = useRef(null)

  useEffect(() => {
    const el = textRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          obs.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section style={{
      position: 'relative',
      padding: '120px 24px',
      overflow: 'hidden',
      textAlign: 'center',
    }}>
      {/* Gold orb background */}
      <GoldOrb />

      {/* Vignette — keeps edges pure black */}
      <div aria-hidden="true" className="orb-vignette" style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 52% 56% at 50% 50%, transparent 0%, rgba(0,0,0,0.35) 52%, #000 70%)',
      }} />
      <style>{`.orb-vignette { background: radial-gradient(ellipse 52% 56% at 50% 50%, transparent 0%, rgba(0,0,0,0.35) 52%, #000 70%); } @media (max-width: 768px) { .orb-vignette { background: radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.2) 55%, #000 78%) !important; } }`}</style>

      {/* Content */}
      <div
        ref={textRef}
        style={{
          position: 'relative', zIndex: 2,
          maxWidth: 580, margin: '0 auto',
          opacity: 0,
          transform: 'translateY(22px)',
          transition: 'opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <h2 style={{
          fontSize: 'clamp(28px, 4.2vw, 52px)',
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: '-0.035em',
          color: '#ffffff',
          marginBottom: 20,
        }}>
          Deja de operar sin estructura. Empieza a seguir un sistema.
        </h2>

        <p style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.45)',
          marginBottom: 40,
        }}>
          Desarrolla una operativa basada en reglas claras, ejecución consciente y consistencia a largo plazo.
        </p>

        <a href="https://itl-vsl.vercel.app" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <button
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '0 36px', height: 52,
              borderRadius: 9999,
              border: '1px solid rgba(212,176,84,0.4)',
              background: 'transparent',
              color: '#d4b054',
              fontSize: 14, fontWeight: 500,
              fontFamily: 'inherit', cursor: 'pointer',
              transition: 'border-color 0.3s, background 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(212,176,84,0.9)'
              e.currentTarget.style.background   = 'rgba(212,176,84,0.07)'
              e.currentTarget.style.boxShadow    = '0 0 28px rgba(212,176,84,0.2)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(212,176,84,0.4)'
              e.currentTarget.style.background  = 'transparent'
              e.currentTarget.style.boxShadow   = 'none'
            }}
          >
            Empieza hoy
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </a>
      </div>
    </section>
  )
}
