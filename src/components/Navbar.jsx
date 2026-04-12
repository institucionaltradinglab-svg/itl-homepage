import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'Metodología', href: '#metodología' },
  { label: 'Programa',    href: '#programa'    },
  { label: 'Resultados',  href: '#resultados'  },
  { label: 'FAQ',         href: '#faq'         },
]

function AnimatedNavLink({ label, href, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      style={{
        textDecoration: 'none',
        padding: '8px 12px',
        display: 'inline-flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        height: 34,
      }}
    >
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
      <span style={{
        position: 'absolute',
        top: '100%',
        left: '12px',
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: '-0.01em',
        lineHeight: 1,
        color: '#ffffff',
        transition: 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)',
      }} className="nav-label-hover">
        {label}
      </span>
    </a>
  )
}

function HamburgerIcon({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      {open ? (
        <>
          <line x1="4" y1="4" x2="16" y2="16" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="16" y1="4" x2="4" y2="16" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <line x1="3" y1="6"  x2="17" y2="6"  stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="3" y1="10" x2="17" y2="10" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="3" y1="14" x2="17" y2="14" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
        </>
      )}
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 100, display: 'flex', justifyContent: 'center',
        padding: '14px 16px',
        pointerEvents: 'none',
      }}>
        <nav style={{
          display: 'flex', alignItems: 'center',
          background: 'rgba(8,8,8,0.88)',
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
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)',
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
                display: 'block',
              }}>
                Institucional<br />Trading Lab
              </span>
            </div>
          </div>

          {/* Center nav links — hidden on mobile */}
          <div className="nav-links-desktop" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {NAV_LINKS.map(({ label, href }) => (
              <AnimatedNavLink key={label} label={label} href={href} />
            ))}
          </div>

          {/* Login button — hidden on mobile */}
          <a href="https://hub.institucionaltradinglab.com/auth" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }} className="nav-login-desktop">
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
              Login Alumno
            </button>
          </a>

          {/* Hamburger — visible only on mobile */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            style={{
              display: 'none',
              alignItems: 'center', justifyContent: 'center',
              width: 36, height: 34,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              marginLeft: 'auto',
              flexShrink: 0,
            }}
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </nav>
      </header>

      {/* Mobile dropdown menu */}
      <div
        className="nav-mobile-menu"
        style={{
          position: 'fixed',
          top: menuOpen ? 80 : 70,
          left: 16, right: 16,
          zIndex: 99,
          background: 'rgba(8,8,8,0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(212,176,84,0.1)',
          borderRadius: 20,
          overflow: 'hidden',
          maxHeight: menuOpen ? 360 : 0,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'max-height 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease, top 0.3s ease',
          display: 'none',
        }}
      >
        <div style={{ padding: '8px 0' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={closeMenu}
              style={{
                display: 'block',
                padding: '14px 24px',
                fontSize: 15,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.65)',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                transition: 'color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {label}
            </a>
          ))}
          <div style={{ padding: '16px 24px' }}>
            <a
              href="https://hub.institucionaltradinglab.com/auth"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: 44,
                borderRadius: 9999,
                border: '1px solid rgba(212,176,84,0.4)',
                color: '#d4b054',
                fontSize: 14, fontWeight: 500,
                textDecoration: 'none',
                transition: 'border-color 0.25s, background 0.25s',
              }}
            >
              Login Alumno
            </a>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          onClick={closeMenu}
          style={{
            position: 'fixed', inset: 0, zIndex: 98,
            background: 'rgba(0,0,0,0.5)',
            display: 'none',
          }}
          className="nav-backdrop"
        />
      )}

      <style>{`
        a:hover .nav-label-default { transform: translateY(-200%); }
        a:hover .nav-label-hover   { transform: translateY(-200%); }

        @media (max-width: 768px) {
          .nav-links-desktop  { display: none !important; }
          .nav-login-desktop  { display: none !important; }
          .nav-hamburger      { display: flex !important; }
          .nav-mobile-menu    { display: block !important; }
          .nav-backdrop       { display: block !important; }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .nav-links-desktop a { padding: 8px 8px !important; }
        }
      `}</style>
    </>
  )
}
