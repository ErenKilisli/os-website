import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const { from, subject, message } = await req.json()

    if (!from || !subject || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'SYSTEM_V01 Contact <onboarding@resend.dev>',
      to: 'ibr@himerenkilisli.com',
      replyTo: from,
      subject: `[SYSTEM_V01] ${subject}`,
      text: `From: ${from}\n\n${message}`,
      html: `
        <div style="font-family: monospace; background: #0d0e0f; color: #fff; padding: 24px; border-radius: 8px;">
          <div style="color: #484fb9; font-size: 18px; font-weight: bold; margin-bottom: 16px;">
            📨 SYSTEM_V01 — New Message
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #9097ff; padding: 4px 12px 4px 0; white-space: nowrap;">FROM:</td>
              <td style="color: #eaea00;">${from}</td>
            </tr>
            <tr>
              <td style="color: #9097ff; padding: 4px 12px 4px 0; white-space: nowrap;">TO:</td>
              <td style="color: #eaea00;">ibr@himerenkilisli.com</td>
            </tr>
            <tr>
              <td style="color: #9097ff; padding: 4px 12px 4px 0; white-space: nowrap;">SUBJECT:</td>
              <td style="color: #ffffff;">${subject}</td>
            </tr>
          </table>
          <hr style="border-color: #333; margin: 16px 0;" />
          <div style="color: #d3d4d5; white-space: pre-wrap; line-height: 1.6;">${message.replace(/\n/g, '<br/>')}</div>
          <hr style="border-color: #333; margin: 16px 0;" />
          <div style="color: #555; font-size: 11px;">Sent via SYSTEM_V01 personal portfolio</div>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Mail send error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
