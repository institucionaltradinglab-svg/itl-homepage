import { useState, useEffect } from 'react'

const NAV_LINKS = ['Metodología', 'Programa', 'Resultados', 'FAQ']

function AnimatedNavLink({ label, href }) {
  return (
    <a
      href={href}
      style={{
        textDecoration: 'none',
        padding: '8px 14px',
        display: 'inline-flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        height: 34,
      }}
    >
      {/* visible copy */}
      <span style={{
        display: 'block',
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: '-0.01em',
        lineHeight: 1,
        color: 'rgba(255,255,255,0.55)',
        transition: 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)',
      }} className="nav-label-default">
        {label}
      </span>
      {/* hover copy — sits exactly one line below */}
      <span style={{
        position: 'absolute',
        top: '100%',
        left: '14px',
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: '-0.01em',
        lineHeight: 1,
        color: '#ffffff',
        transition: 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)',
      }} className="nav-label-hover">
        {label}
      </span>
      <style>{`
        a:hover .nav-label-default { transform: translateY(-200%); }
        a:hover .nav-label-hover   { transform: translateY(-200%); }
      `}</style>
    </a>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      zIndex: 100, display: 'flex', justifyContent: 'center',
      padding: '18px 24px',
      pointerEvents: 'none',
    }}>
      <nav style={{
        display: 'flex', alignItems: 'center',
        background: 'rgba(8,8,8,0.82)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(212,176,84,0.1)',
        borderRadius: 9999,
        padding: '7px 8px 7px 18px',
        width: '100%', maxWidth: 780,
        boxShadow: scrolled
          ? '0 0 0 1px rgba(212,176,84,0.07), 0 12px 48px rgba(0,0,0,0.7)'
          : '0 4px 24px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.4s ease',
        pointerEvents: 'auto',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 8 }}>
          <img src="/logo-itl.png" alt="ITL logo" style={{ height: 28, width: 'auto', flexShrink: 0 }} />
          <div style={{
            overflow: 'hidden',
            transition: 'max-width 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease',
            maxWidth: scrolled ? 0 : 130,
            opacity: scrolled ? 0 : 1,
          }}>
            <img src="/text-logo.png" alt="Institucional Trading Lab" style={{ height: 15, width: 'auto', display: 'block' }} />
          </div>
        </div>

        {/* Center nav links */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {NAV_LINKS.map(label => (
            <AnimatedNavLink key={label} label={label} href={`#${label.toLowerCase()}`} />
          ))}
        </div>

        {/* Student Login CTA */}
        <a href="https://hub.institucionaltradinglab.com/auth" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <button style={{
          padding: '0 18px',
          height: 34,
          borderRadius: 9999,
          border: '1px solid rgba(212,176,84,0.4)',
          background: 'transparent',
          color: '#d4b054',
          fontSize: 12,
          fontWeight: 500,
          fontFamily: 'inherit',
          letterSpacing: '0.01em',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(212,176,84,0.85)'
            e.currentTarget.style.background = 'rgba(212,176,84,0.07)'
            e.currentTarget.style.boxShadow = '0 0 18px rgba(212,176,84,0.15)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(212,176,84,0.4)'
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Student Login
        </button>
        </a>
      </nav>
    </header>
  )
}
