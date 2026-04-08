export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Parse body manually (Vercel doesn't auto-parse for plain functions)
  let body = ''
  try {
    body = await new Promise((resolve, reject) => {
      let data = ''
      req.on('data', chunk => { data += chunk })
      req.on('end', () => resolve(data))
      req.on('error', reject)
    })
  } catch {
    return res.status(400).json({ error: 'Error leyendo el body' })
  }

  let email
  try {
    const parsed = JSON.parse(body)
    email = parsed.email
  } catch {
    return res.status(400).json({ error: 'JSON inválido' })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido' })
  }

  const { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, MAILCHIMP_DC } = process.env
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_DC) {
    return res.status(500).json({ error: 'Variables de entorno no configuradas' })
  }

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
      console.error('Mailchimp error:', data)
      return res.status(500).json({ error: data.detail || 'Error al suscribirse' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: 'Error del servidor' })
  }
}
