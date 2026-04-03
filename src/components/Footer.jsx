import { useState } from 'react'

const IcoTelegram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22 3L2 10.5l6.75 2.25M22 3l-9 13.5-2.25-4.5M22 3L8.75 12.75m0 0L11 20.5l3-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>
)
const IcoInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)
const IcoYoutube = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.5 8s-.3-2-1.2-2.9c-1.1-1.1-2.4-1.1-3-1.2C15.6 3.75 12 3.75 12 3.75s-3.6 0-6.3.15c-.6.1-1.9.1-3 1.2C1.8 6 1.5 8 1.5 8S1.25 10.2 1.25 12.4s.25 4.4.25 4.4.3 2 1.2 2.9c1.1 1.1 2.6 1.05 3.3 1.17C8.2 21.07 12 21.1 12 21.1s3.6 0 6.3-.23c.6-.1 1.9-.1 3-1.2.9-.9 1.2-2.9 1.2-2.9s.25-2.2.25-4.4-.25-4.4-.25-4.4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <polygon points="10,9.5 15.5,12 10,14.5" fill="currentColor"/>
  </svg>
)

const SOCIAL = [
  { label: 'Telegram',  Icon: IcoTelegram,  href: 'https://t.me/institucionaltradinglab'              },
  { label: 'Instagram', Icon: IcoInstagram, href: 'https://www.instagram.com/fxtrading.lab/'          },
  { label: 'YouTube',   Icon: IcoYoutube,   href: 'https://www.youtube.com/@InstitucionalTradingLab'  },
]

const NAV_LINKS = [
  { label: 'Metodología', href: '#metodología' },
  { label: 'Programa',    href: '#programa'    },
  { label: 'Comunidad',   href: '#resultados'  },
  { label: 'FAQ',         href: '#faq'         },
]

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ padding: '56px 32px 36px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Desktop: 3-col | Mobile: stacked */}
        <div className="footer-main">

          {/* Left: logo + social */}
          <div className="footer-brand">
            <div style={{ marginBottom: 20 }}>
              <img src="/text-logo.png" alt="Institucional Trading Lab" style={{ height: 28, width: 'auto', opacity: 0.75 }} />
            </div>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
              {SOCIAL.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{ color: 'rgba(212,176,84,0.45)', display: 'flex', alignItems: 'center', transition: 'color 0.2s ease' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#d4b054'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,176,84,0.45)'}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Center: nav links */}
          <div className="footer-nav">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Right: subscribe */}
          <div className="footer-subscribe">
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, marginBottom: 14 }}>
              Recibe dirección y oportunidades semanales gratis
            </p>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
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
                  color: 'rgba(255,255,255,0.55)', fontSize: 13, flex: 1,
                  fontFamily: 'inherit', minWidth: 0,
                }}
              />
              <button
                style={{
                  padding: '0 18px', height: 34,
                  borderRadius: 9999, border: 'none',
                  background: '#d4b054', color: '#0a0a0a',
                  fontSize: 13, fontWeight: 600,
                  fontFamily: 'inherit', cursor: 'pointer',
                  transition: 'background 0.2s, box-shadow 0.2s',
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#e0c060'
                  e.currentTarget.style.boxShadow = '0 0 18px rgba(212,176,84,0.35)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#d4b054'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Suscríbete
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.04)',
          flexWrap: 'wrap', gap: 10,
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
            © 2026 Institucional Trading Lab. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Cookies'].map(l => (
              <a key={l} href="#" style={{
                fontSize: 11, color: 'rgba(255,255,255,0.2)',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
              >
                {l}
              </a>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        .footer-main {
          display: grid;
          grid-template-columns: 220px 1fr 320px;
          gap: 40px;
          align-items: start;
          margin-bottom: 48px;
        }
        .footer-nav {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }
        @media (max-width: 768px) {
          .footer-main {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
            margin-bottom: 36px !important;
          }
          .footer-brand {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .footer-nav {
            flex-direction: row !important;
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px 24px !important;
            border-top: 1px solid rgba(255,255,255,0.05);
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding: 24px 0;
          }
          .footer-subscribe {
            text-align: center;
          }
          .footer-subscribe p {
            font-size: 13px;
          }
        }
      `}</style>
    </footer>
  )
}
