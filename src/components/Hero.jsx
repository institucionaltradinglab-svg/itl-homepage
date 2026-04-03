import { useRef, useEffect, useState } from 'react'

/* ═══════════════════════════════════════════════
   WebGL SHOOTING-STAR STARFIELD
   - Static glowing dots (GL_POINTS, soft glow fragment)
   - Shooting star streaks: each streak = N trail points
     from bright/large head → dim/small tail
   - Additive blending for natural glow
   - CSS mask hides the safe zone in center
   - Subtle mouse-driven horizontal drift
═══════════════════════════════════════════════ */

const VS = /* glsl */`
  attribute vec2  a_pos;
  attribute float a_alpha;
  attribute float a_size;
  varying   float v_alpha;
  void main() {
    gl_Position = vec4(a_pos, 0.0, 1.0);
    gl_PointSize = a_size;
    v_alpha = a_alpha;
  }
`

const FS = /* glsl */`
  precision mediump float;
  varying float v_alpha;
  void main() {
    vec2  c    = gl_PointCoord - 0.5;
    float d    = length(c) * 2.0;
    if (d > 1.0) discard;
    float core = smoothstep(0.35, 0.0,  d);
    float glow = smoothstep(1.0,  0.35, d) * 0.45;
    float a    = clamp((core + glow) * v_alpha, 0.0, 1.0);
    gl_FragColor = vec4(1.0, 1.0, 1.0, a);
  }
`

function compileShader(gl, type, src) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  return sh
}

function StarfieldGL() {
  const canvasRef = useRef(null)
  const mouseRef  = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false })
    if (!gl) return

    /* ── Program ── */
    const prog = gl.createProgram()
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER,   VS))
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FS))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const aPos   = gl.getAttribLocation(prog, 'a_pos')
    const aAlpha = gl.getAttribLocation(prog, 'a_alpha')
    const aSize  = gl.getAttribLocation(prog, 'a_size')

    /* ── Blending ── */
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)   // additive — creates natural glow

    /* ── Static dots ── */
    const N_DOTS = 90
    const dotPos   = new Float32Array(N_DOTS * 2)
    const dotAlpha = new Float32Array(N_DOTS)
    const dotSize  = new Float32Array(N_DOTS)

    for (let i = 0; i < N_DOTS; i++) {
      dotPos[i * 2]     = Math.random() * 2 - 1
      dotPos[i * 2 + 1] = Math.random() * 2 - 1
      dotAlpha[i]       = Math.random() * 0.35 + 0.06
      dotSize[i]        = Math.random() * 1.8 + 0.6
    }

    /* ── Shooting streaks ── */
    const N_STREAKS = 38
    const TRAIL     = 10   // points per streak (head=0 → tail=9)

    // Each streak: position, speed, length, baseAlpha, drift
    const streaks = Array.from({ length: N_STREAKS }, () => {
      const edge = Math.random() > 0.4   // bias toward edges
      return {
        x:     edge ? (Math.random() * 0.5 + 0.55) * (Math.random() > 0.5 ? 1 : -1)
                    : (Math.random() * 2 - 1),
        y:     Math.random() * 2 - 1,
        speed: Math.random() * 0.007 + 0.003,
        len:   Math.random() * 0.11 + 0.04,
        alpha: Math.random() * 0.65 + 0.25,
        drift: (Math.random() - 0.5) * 0.0004,
      }
    })

    const TOTAL_STREAK_PTS = N_STREAKS * TRAIL
    const stPos   = new Float32Array(TOTAL_STREAK_PTS * 2)
    const stAlpha = new Float32Array(TOTAL_STREAK_PTS)
    const stSize  = new Float32Array(TOTAL_STREAK_PTS)

    /* ── GPU buffers ── */
    const bufDotPos   = gl.createBuffer()
    const bufDotAlpha = gl.createBuffer()
    const bufDotSize  = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, bufDotPos);   gl.bufferData(gl.ARRAY_BUFFER, dotPos,   gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, bufDotAlpha); gl.bufferData(gl.ARRAY_BUFFER, dotAlpha, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, bufDotSize);  gl.bufferData(gl.ARRAY_BUFFER, dotSize,  gl.STATIC_DRAW)

    const bufStPos   = gl.createBuffer()
    const bufStAlpha = gl.createBuffer()
    const bufStSize  = gl.createBuffer()

    /* ── Helpers ── */
    function bindDraw(posBuf, alphaBuf, sizeBuf, count) {
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
      gl.enableVertexAttribArray(aPos)
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

      gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuf)
      gl.enableVertexAttribArray(aAlpha)
      gl.vertexAttribPointer(aAlpha, 1, gl.FLOAT, false, 0, 0)

      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf)
      gl.enableVertexAttribArray(aSize)
      gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0)

      gl.drawArrays(gl.POINTS, 0, count)
    }

    /* ── Resize ── */
    let W = 1, H = 1, raf

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = Math.round(canvas.offsetWidth  * dpr)
      H = Math.round(canvas.offsetHeight * dpr)
      canvas.width  = W
      canvas.height = H
      gl.viewport(0, 0, W, H)
    }

    /* ── Render loop ── */
    function render() {
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      const mx = mouseRef.current.x   // normalised -1..1

      /* Update streak positions */
      for (let i = 0; i < N_STREAKS; i++) {
        const s = streaks[i]

        // Move upward + subtle mouse drift
        s.y += s.speed
        s.x += s.drift + mx * 0.0008

        // Respawn below when fully off top
        if (s.y - s.len > 1.1) {
          s.y = -1.1
          s.x = Math.random() > 0.4
            ? (Math.random() * 0.55 + 0.5) * (Math.random() > 0.5 ? 1 : -1)
            : (Math.random() * 2 - 1)
          s.alpha = Math.random() * 0.65 + 0.25
          s.speed = Math.random() * 0.007 + 0.003
          s.len   = Math.random() * 0.11 + 0.04
          s.drift = (Math.random() - 0.5) * 0.0004
        }

        /* Write TRAIL points: 0=head (bright, big) → TRAIL-1=tail (dim, tiny) */
        for (let j = 0; j < TRAIL; j++) {
          const t  = j / (TRAIL - 1)            // 0 head → 1 tail
          const pt = i * TRAIL + j

          stPos[pt * 2]     = s.x
          stPos[pt * 2 + 1] = s.y - s.len * t   // tail is below head in NDC

          stAlpha[pt] = (1 - t) * (1 - t) * s.alpha   // quadratic fade
          stSize[pt]  = (1 - t * 0.75) * (2.2 + s.alpha * 1.4)
        }
      }

      /* Upload streak data */
      gl.bindBuffer(gl.ARRAY_BUFFER, bufStPos);   gl.bufferData(gl.ARRAY_BUFFER, stPos,   gl.DYNAMIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER, bufStAlpha); gl.bufferData(gl.ARRAY_BUFFER, stAlpha, gl.DYNAMIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER, bufStSize);  gl.bufferData(gl.ARRAY_BUFFER, stSize,  gl.DYNAMIC_DRAW)

      /* Draw streaks first (behind dots) */
      bindDraw(bufStPos, bufStAlpha, bufStSize, TOTAL_STREAK_PTS)

      /* Draw static dots on top */
      bindDraw(bufDotPos, bufDotAlpha, bufDotSize, N_DOTS)

      raf = requestAnimationFrame(render)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    render()

    /* Mouse tracking */
    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('mousemove', onMove)
      gl.deleteProgram(prog)
      ;[bufDotPos, bufDotAlpha, bufDotSize, bufStPos, bufStAlpha, bufStSize]
        .forEach(b => gl.deleteBuffer(b))
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        /* Safe-zone — center fade so streaks stay at edges */
        maskImage:
          'radial-gradient(ellipse 54% 62% at 50% 50%, transparent 0%, rgba(0,0,0,0.04) 32%, black 72%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 54% 62% at 50% 50%, transparent 0%, rgba(0,0,0,0.04) 32%, black 72%)',
      }}
    />
  )
}

/* ═══════════════════════════════════════════════
   TYPING WORD
═══════════════════════════════════════════════ */
const CYCLE_WORDS = ['consistencia', 'precisión', 'disciplina', 'estructura']

function TypingWord() {
  const [word,       setWord]       = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const wordIdx  = useRef(0)
  const charIdx  = useRef(0)
  const deleting = useRef(false)

  useEffect(() => {
    const id = setInterval(() => setShowCursor(v => !v), 520)
    return () => clearInterval(id)
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
          tid = setTimeout(tick, 1900)
        } else {
          tid = setTimeout(tick, 88)
        }
      } else {
        charIdx.current--
        setWord(target.slice(0, charIdx.current))
        if (charIdx.current === 0) {
          deleting.current = false
          wordIdx.current = (wordIdx.current + 1) % CYCLE_WORDS.length
          tid = setTimeout(tick, 300)
        } else {
          tid = setTimeout(tick, 46)
        }
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
        width: 2.5, height: '0.8em',
        background: '#d4b054',
        marginLeft: 3,
        verticalAlign: 'middle',
        opacity: showCursor ? 1 : 0,
        borderRadius: 1,
      }} />
    </span>
  )
}

/* ═══════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════ */
export default function Hero() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 32px 80px',
      overflow: 'hidden',
    }}>
      {/* WebGL starfield */}
      <StarfieldGL />

      {/* Ambient gold glow in upper-center behind headline */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '38%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 400,
        background: 'radial-gradient(ellipse, rgba(212,176,84,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 860,
        width: '100%',
        textAlign: 'center',
      }}>
        <h1 style={{
          /* ≈ text-4xl → text-5xl → text-6xl */
          fontSize: 'clamp(28px, 4vw, 58px)',
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: '-0.035em',
          background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.8) 48%, rgba(255,255,255,0.38) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 28,
        }}>
          Aprende una estrategia sistematizada para operar con claridad, control y{' '}
          <TypingWord />
        </h1>

        <p style={{
          fontSize: 16,
          lineHeight: 1.72,
          color: 'rgba(255,255,255,0.46)',
          maxWidth: 480,
          margin: '0 auto 44px',
        }}>
          Un sistema claro y replicable para que desarrolles criterio propio y tomes decisiones con lógica en cada trade.
        </p>

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
            cursor: 'pointer',
            transition: 'border-color 0.3s, background 0.3s, box-shadow 0.3s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(212,176,84,0.88)'
            e.currentTarget.style.background   = 'rgba(212,176,84,0.06)'
            e.currentTarget.style.boxShadow    = '0 0 28px rgba(212,176,84,0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(212,176,84,0.3)'
            e.currentTarget.style.background  = 'transparent'
            e.currentTarget.style.boxShadow   = 'none'
          }}
          onClick={() => document.getElementById('metodología')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Ver cómo funciona
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 3v8M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  )
}
