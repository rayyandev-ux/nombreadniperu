import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { Resend } from 'resend';

// Provide a dummy key for build time if the env var is missing
const resendApiKey = process.env.RESEND_API_KEY || 're_123456789';
const resend = new Resend(resendApiKey);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const MAIL_FROM = process.env.MAIL_FROM || 'onboarding@resend.dev';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
         return NextResponse.json({ success: false, message: 'Faltan credenciales' }, { status: 400 });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: 'Credenciales incorrectas' }, { status: 401 });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        email TEXT PRIMARY KEY,
        code TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL
      );
    `);

    // Save code (upsert)
    await pool.query(`
      INSERT INTO verification_codes (email, code, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '10 minutes')
      ON CONFLICT (email) 
      DO UPDATE SET code = $2, expires_at = NOW() + INTERVAL '10 minutes';
    `, [email, verificationCode]);

    // Send email
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      to: [email],
      subject: 'Código de Verificación - raean API',
      html: `<p>Tu código de verificación es: <strong>${verificationCode}</strong></p><p>Este código expira en 10 minutos.</p>`
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ success: false, message: 'Error enviando correo' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Código enviado' });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}
