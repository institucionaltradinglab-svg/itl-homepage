export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Handle both pre-parsed body (Vercel sometimes parses it) and raw stream
  let email
  try {
    let parsed = req.body
    if (typeof parsed === 'string') parsed = JSON.parse(parsed)
    if (!parsed) {
      const raw = await new Promise((resolve, reject) => {
        let data = ''
        req.on('data', chunk => { data += chunk })
        req.on('end', () => resolve(data))
        req.on('error', reject)
      })
      parsed = JSON.parse(raw)
    }
    email = parsed.email
  } catch (e) {
    return res.status(400).json({ error: 'Error parseando body: ' + e.message })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido' })
  }

  const { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, MAILCHIMP_DC } = process.env

  if (!MAILCHIMP_API_KEY) return res.status(500).json({ error: 'Falta MAILCHIMP_API_KEY' })
  if (!MAILCHIMP_LIST_ID) return res.status(500).json({ error: 'Falta MAILCHIMP_LIST_ID' })
  if (!MAILCHIMP_DC)      return res.status(500).json({ error: 'Falta MAILCHIMP_DC' })

  const url = `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`

  try {
    const mc = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        tags: ['homepage-itl-new'],
      }),
    })

    const data = await mc.json()

    if (mc.status === 400 && data.title === 'Member Exists') {
      return res.status(200).json({ ok: true, alreadySubscribed: true })
    }

    if (!mc.ok) {
      // Return full Mailchimp error so we can debug
      return res.status(500).json({ error: `Mailchimp: ${data.title} — ${data.detail}` })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    return res.status(500).json({ error: 'Fetch error: ' + err.message })
  }
}
