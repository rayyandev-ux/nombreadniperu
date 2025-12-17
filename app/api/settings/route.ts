import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

async function getUser(request: Request) {
  const cookieStore = await cookies();
  const cookieAuth = cookieStore.get('auth_token');
  if (cookieAuth) {
    try {
      const decoded: any = jwt.verify(cookieAuth.value, JWT_SECRET);
      return decoded.user; // user_id (email or whatever was used)
    } catch (e) {}
  }
  return null;
}

export async function GET(request: Request) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const res = await pool.query('SELECT * FROM user_settings WHERE user_id = $1', [user]);
    if (res.rows.length > 0) {
        return NextResponse.json({ success: true, settings: res.rows[0] });
    }
    return NextResponse.json({ success: true, settings: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { factiliza_token, dniperu_token, dniperu_security, dniperu_cc_token, dniperu_cc_sig } = body;

    await pool.query(
        `INSERT INTO user_settings (user_id, factiliza_token, dniperu_token, dniperu_security, dniperu_cc_token, dniperu_cc_sig, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         ON CONFLICT (user_id) 
         DO UPDATE SET 
            factiliza_token = $2, 
            dniperu_token = $3, 
            dniperu_security = $4, 
            dniperu_cc_token = $5, 
            dniperu_cc_sig = $6,
            updated_at = NOW()`,
        [user, factiliza_token, dniperu_token, dniperu_security, dniperu_cc_token, dniperu_cc_sig]
    );

    return NextResponse.json({ success: true, message: 'Settings saved' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
