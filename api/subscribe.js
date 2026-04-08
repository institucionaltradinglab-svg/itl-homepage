export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido' })
  }

  const { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, MAILCHIMP_DC } = process.env
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_DC) {
    return res.status(500).json({ error: 'Configuración incompleta' })
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
        merge_fields: {
          SOURCE: 'homepage-itl-new',
        },
      }),
    })

    const data = await mc.json()

    // 400 with title "Member Exists" = already subscribed, treat as success
    if (mc.status === 400 && data.title === 'Member Exists') {
      return res.status(200).json({ ok: true, alreadySubscribed: true })
    }

    if (!mc.ok) {
      console.error('Mailchimp error:', data)
      return res.status(500).json({ error: 'Error al suscribirse' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: 'Error del servidor' })
  }
}
