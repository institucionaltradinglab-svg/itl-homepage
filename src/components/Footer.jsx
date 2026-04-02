import { useState } from 'react'

const IcoTelegram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22 3L2 10.5l6.75 2.25M22 3l-9 13.5-2.25-4.5M22 3L8.75 12.75m0 0L11 20.5l3-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>
)
const IcoInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)
const IcoYoutube = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22.5 8s-.3-2-1.2-2.9c-1.1-1.1-2.4-1.1-3-1.2C15.6 3.75 12 3.75 12 3.75s-3.6 0-6.3.15c-.6.1-1.9.1-3 1.2C1.8 6 1.5 8 1.5 8S1.25 10.2 1.25 12.4s.25 4.4.25 4.4.3 2 1.2 2.9c1.1 1.1 2.6 1.05 3.3 1.17C8.2 21.07 12 21.1 12 21.1s3.6 0 6.3-.23c.6-.1 1.9-.1 3-1.2.9-.9 1.2-2.9 1.2-2.9s.25-2.2.25-4.4-.25-4.4-.25-4.4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <polygon points="10,9.5 15.5,12 10,14.5" fill="currentColor"/>
  </svg>
)

const SOCIAL = [
  { label: 'Telegram', Icon: IcoTelegram },
  { label: 'Instagram', Icon: IcoInstagram },
  { label: 'YouTube', Icon: IcoYoutube },
]

const NAV_LINKS = ['Metodología', 'Programa', 'Resultados', 'FAQ']

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer style={{ position: 'relative' }}>
      {/* Gold glow line at top */}
      <div style={{
        height: 1,
        background: 'linear-gradient(to right, transparent, rgba(212,176,84,0.35) 30%, rgba(212,176,84,0.35) 70%, transparent)',
        boxShadow: '0 0 18px rgba(212,176,84,0.2)',
      }} />

      <div style={{ padding: '56px 32px 40px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Main row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr auto',
          gap: 40,
          alignItems: 'center',
          marginBottom: 48,
        }}>
          {/* Left: logo + social */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <img src="/logo-itl.png" alt="ITL" style={{ height: 26, width: 'auto' }} />
              <img src="/text-logo.png" alt="Institucional Trading Lab" style={{ height: 13, width: 'auto', opacity: 0.6 }} />
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              {SOCIAL.map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  style={{
                    color: 'rgba(212,176,84,0.5)',
                    display: 'flex', alignItems: 'center',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#d4b054'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,176,84,0.5)'}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Center: nav links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, alignItems: 'center' }}>
            {NAV_LINKS.map(l => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                style={{
                  fontSize: 13, color: 'rgba(255,255,255,0.38)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.78)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.38)'}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Right: pill subscribe */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(212,176,84,0.1)',
            borderRadius: 9999,
            padding: '5px 5px 5px 18px',
            gap: 8,
          }}>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', fontSize: 12, width: 148,
                fontFamily: 'inherit',
              }}
            />
            <button style={{
              padding: '0 16px', height: 30,
              borderRadius: 9999,
              border: '1px solid rgba(212,176,84,0.35)',
              background: 'transparent',
              color: '#d4b054',
              fontSize: 11, fontWeight: 500,
              fontFamily: 'inherit', cursor: 'pointer',
              transition: 'border-color 0.25s, background 0.25s',
              whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(212,176,84,0.85)'
                e.currentTarget.style.background = 'rgba(212,176,84,0.07)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(212,176,84,0.35)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.04)',
          flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)' }}>
            © 2026 Institucional Trading Lab. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Cookies'].map(l => (
              <a key={l} href="#" style={{
                fontSize: 11, color: 'rgba(255,255,255,0.22)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.22)'}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
