import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
        return NextResponse.json({ success: false, message: 'Faltan datos' }, { status: 400 });
    }

    const result = await pool.query(
      'SELECT * FROM verification_codes WHERE email = $1 AND code = $2 AND expires_at > NOW()',
      [email, code]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Código inválido o expirado' }, { status: 400 });
    }

    // Success
    // 1. Delete code
    await pool.query('DELETE FROM verification_codes WHERE email = $1', [email]);

    // 2. Set Auth Cookie (JWT)
    const token = jwt.sign({ user: email }, JWT_SECRET, { expiresIn: '30d' });
    
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return NextResponse.json({ success: true, message: 'Autenticado correctamente' });

  } catch (error) {
    console.error('Verify Error:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}
