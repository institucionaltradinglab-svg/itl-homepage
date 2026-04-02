import { useRef, useEffect } from 'react'
import createGlobe from 'cobe'

/* ─── Gold Globe with pulse rings ─── */
function PulseGlobe() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const phiRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: 560,
      height: 560,
      phi: 0,
      theta: 0.2,
      dark: 1,
      diffuse: 1.0,
      mapSamples: 18000,
      mapBrightness: 4,
      baseColor: [0.1, 0.07, 0.01],
      markerColor: [0.83, 0.69, 0.33],
      glowColor: [0.83, 0.69, 0.33],
      markers: [
        { location: [40.4168, -3.7038], size: 0.06 },
        { location: [19.4326, -99.1332], size: 0.05 },
        { location: [4.7110, -74.0721], size: 0.05 },
        { location: [10.4806, -66.9036], size: 0.05 },
        { location: [23.6345, -102.5528], size: 0.04 },
        { location: [51.5074, -0.1278], size: 0.04 },
        { location: [-34.6037, -58.3816], size: 0.04 },
      ],
      onRender(state) {
        phiRef.current += 0.004
        state.phi = phiRef.current + pointerRef.current.x * 0.5
        state.theta = 0.2 + pointerRef.current.y * 0.2
      },
    })

    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      pointerRef.current = {
        x: ((e.clientX - rect.left - rect.width / 2) / rect.width),
        y: ((e.clientY - rect.top - rect.height / 2) / rect.height),
      }
    }
    window.addEventListener('mousemove', handleMove)

    return () => { globe.destroy(); window.removeEventListener('mousemove', handleMove) }
  }, [])

  // Scroll entrance animation
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'scale(1)'
          obs.unobserve(el)
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: 560, height: 560,
        opacity: 0,
        transform: 'scale(0.82)',
        transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* Pulse rings */}
      {[0, 0.5, 1.0].map((delay, i) => (
        <div key={i} aria-hidden="true" style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: 380, height: 380,
          marginLeft: -190, marginTop: -190,
          borderRadius: '50%',
          border: '1px solid rgba(212,176,84,0.3)',
          animation: `globe-pulse 2.4s ${delay}s ease-out infinite`,
          zIndex: 0,
        }} />
      ))}

      {/* Globe canvas */}
      <canvas
        ref={canvasRef}
        width={560}
        height={560}
        style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
      />

      {/* Radial gold glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: '15%',
        background: 'radial-gradient(ellipse, rgba(212,176,84,0.16) 0%, transparent 70%)',
        filter: 'blur(24px)',
        borderRadius: '50%',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
    </div>
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
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section style={{ position: 'relative', padding: '100px 24px', overflow: 'hidden', textAlign: 'center' }}>
      {/* Globe — absolute center */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
      }}>
        <PulseGlobe />
      </div>

      {/* Dark radial vignette over globe */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 58% 58% at 50% 50%, transparent 0%, #000 65%)',
        zIndex: 1, pointerEvents: 'none',
      }} />

      {/* Content */}
      <div
        ref={textRef}
        style={{
          position: 'relative', zIndex: 2,
          maxWidth: 580, margin: '0 auto',
          opacity: 0,
          transform: 'translateY(24px)',
          transition: 'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: 24 }}>
          Empieza ahora
        </p>

        <h2 style={{
          fontSize: 'clamp(26px, 3.8vw, 48px)',
          fontWeight: 800, lineHeight: 1.08,
          letterSpacing: '-0.035em',
          background: 'linear-gradient(160deg, #fff 0%, rgba(255,255,255,0.55) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          marginBottom: 20,
        }}>
          Deja de operar sin estructura. Empieza a seguir un sistema.
        </h2>

        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.42)', marginBottom: 40 }}>
          Desarrolla una operativa basada en reglas claras, ejecución consciente y consistencia a largo plazo.
        </p>

        <button
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '0 36px', height: 52,
            borderRadius: 9999,
            border: '1px solid rgba(212,176,84,0.35)',
            background: 'transparent',
            color: '#d4b054',
            fontSize: 14, fontWeight: 500,
            fontFamily: 'inherit', cursor: 'pointer',
            transition: 'border-color 0.3s, background 0.3s, box-shadow 0.3s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(212,176,84,0.9)'
            e.currentTarget.style.background = 'rgba(212,176,84,0.07)'
            e.currentTarget.style.boxShadow = '0 0 32px rgba(212,176,84,0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(212,176,84,0.35)'
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Empieza hoy
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes globe-pulse {
          0%   { transform: scale(0.85); opacity: 0.7; }
          100% { transform: scale(1.6);  opacity: 0; }
        }
      `}</style>
    </section>
  )
}
