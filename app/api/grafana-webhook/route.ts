import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = body.title || 'System Alert Notification';
    const state = body.state;
    const alerts = body.alerts || [];

    const alertDetails = alerts.map((a: any) => `
      <li>
        <strong>${a.labels.alertname}</strong>: ${a.annotations.description || 'No description'}
      </li>
    `).join('');

    await resend.emails.send({
      from: 'Alert System <noreply@yourdomain.com>',
      to: ['alert@yourdomain.com'],
      subject: `[${state.toUpperCase()}] ${title}`,
      html: `
        <h2>Grafana Alert Status: ${state}</h2>
        <ul>${alertDetails}</ul>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process alert' }, { status: 500 });
  }
}