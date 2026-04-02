import { useRef, useEffect, useState } from 'react'

/* ─── Starfield canvas (WebGL-like canvas 2D) ─── */
function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf

    const COUNT = 160
    let W, H, stars = []

    function resize() {
      W = canvas.width = canvas.offsetWidth * window.devicePixelRatio
      H = canvas.height = canvas.offsetHeight * window.devicePixelRatio
      canvas.style.width = canvas.offsetWidth + 'px'
      canvas.style.height = canvas.offsetHeight + 'px'
    }

    function seed() {
      stars = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: (Math.random() * 0.9 + 0.2) * window.devicePixelRatio,
        speed: (Math.random() * 0.3 + 0.06) * window.devicePixelRatio,
        alpha: Math.random() * 0.45 + 0.08,
        twinkle: Math.random() * Math.PI * 2,
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      for (const s of stars) {
        s.y -= s.speed
        s.twinkle += 0.02
        const a = s.alpha * (0.7 + 0.3 * Math.sin(s.twinkle))
        if (s.y + s.r < 0) {
          s.y = H + s.r
          s.x = Math.random() * W
        }
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(() => { resize(); seed() })
    ro.observe(canvas)
    resize(); seed(); draw()
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        /* safe-zone mask — stars only in outer ring */
        maskImage: 'radial-gradient(ellipse 62% 58% at 35% 52%, transparent 0%, rgba(0,0,0,0.05) 40%, black 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 62% 58% at 35% 52%, transparent 0%, rgba(0,0,0,0.05) 40%, black 75%)',
      }}
    />
  )
}

/* ─── Typing animation ─── */
const CYCLE_WORDS = ['consistencia', 'precisión', 'disciplina', 'estructura']

function TypingWord() {
  const [word, setWord] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const wordIdx = useRef(0)
  const charIdx = useRef(0)
  const deleting = useRef(false)

  useEffect(() => {
    // cursor blink
    const blink = setInterval(() => setShowCursor(v => !v), 520)
    return () => clearInterval(blink)
  }, [])

  useEffect(() => {
    let tid

    function tick() {
      const target = CYCLE_WORDS[wordIdx.current]

      if (!deleting.current) {
        charIdx.current++
        setWord(target.slice(0, charIdx.current))
        if (charIdx.current === target.length) {
          deleting.current = true
          tid = setTimeout(tick, 1800)
          return
        }
        tid = setTimeout(tick, 90)
      } else {
        charIdx.current--
        setWord(target.slice(0, charIdx.current))
        if (charIdx.current === 0) {
          deleting.current = false
          wordIdx.current = (wordIdx.current + 1) % CYCLE_WORDS.length
          tid = setTimeout(tick, 320)
          return
        }
        tid = setTimeout(tick, 48)
      }
    }

    tid = setTimeout(tick, 700)
    return () => clearTimeout(tid)
  }, [])

  return (
    <span style={{ color: '#d4b054', whiteSpace: 'nowrap' }}>
      {word}
      <span style={{
        display: 'inline-block',
        width: 2, height: '0.85em',
        background: '#d4b054',
        marginLeft: 2,
        verticalAlign: 'middle',
        opacity: showCursor ? 1 : 0,
        transition: 'opacity 0.1s',
        borderRadius: 1,
      }} />
    </span>
  )
}

export default function Hero() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '120px 24px 80px',
      overflow: 'hidden',
    }}>
      <Starfield />

      {/* Ambient gold center glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '42%', left: '28%',
        transform: 'translate(-50%, -50%)',
        width: 480, height: 480,
        background: 'radial-gradient(ellipse, rgba(212,176,84,0.035) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 760, paddingLeft: 'max(0px, calc((100vw - 1100px) / 2))' }}>
        {/* Section label */}
        <div style={{
          fontSize: 11, fontWeight: 500, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)',
          marginBottom: 28,
        }}>
          Institucional Trading Lab · Metodología Profesional
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(34px, 5.5vw, 72px)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.035em',
          background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.8) 48%, rgba(255,255,255,0.4) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 32,
          maxWidth: 680,
        }}>
          Aprende una estrategia sistematizada para operar con claridad, control y{' '}
          <TypingWord />
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 16,
          lineHeight: 1.72,
          color: 'rgba(255,255,255,0.48)',
          maxWidth: 520,
          marginBottom: 44,
        }}>
          Un sistema claro y replicable para que desarrolles criterio propio y tomes decisiones con lógica en cada trade.
        </p>

        {/* Ghost CTA */}
        <button
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '0 32px', height: 52,
            borderRadius: 9999,
            border: '1px solid rgba(212,176,84,0.3)',
            background: 'transparent',
            color: '#d4b054',
            fontSize: 14, fontWeight: 500,
            fontFamily: 'inherit',
            letterSpacing: '0.01em',
            cursor: 'pointer',
            transition: 'border-color 0.3s, background 0.3s, box-shadow 0.3s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(212,176,84,0.85)'
            e.currentTarget.style.background = 'rgba(212,176,84,0.06)'
            e.currentTarget.style.boxShadow = '0 0 28px rgba(212,176,84,0.18)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(212,176,84,0.3)'
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Ver cómo funciona
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  )
}
