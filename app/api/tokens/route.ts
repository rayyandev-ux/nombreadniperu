import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

async function getUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  if (!token) return null;
  try {
    return jwt.verify(token.value, JWT_SECRET) as { user: string };
  } catch (e) {
    return null;
  }
}

export async function GET() {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const result = await pool.query('SELECT * FROM tokens ORDER BY created_at DESC');
    const tokens = result.rows.map(t => ({
      ...t,
      displayToken: `...${t.token.slice(-10)}`,
      fullToken: t.token // In a real app, maybe don't send this unless requested explicitly
    }));
    return NextResponse.json({ success: true, tokens });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error fetching tokens' }, { status: 500 });
  }
}

export async function POST() {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const token = jwt.sign(
        { user: user.user, type: 'api_access' }, 
        JWT_SECRET, 
        { expiresIn: '30d' }
    );
    
    await pool.query(
        'INSERT INTO tokens (token, created_by, usage_count) VALUES ($1, $2, 0)',
        [token, user.user]
    );
    
    return NextResponse.json({ success: true, token, message: 'Token generado' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error generating token' }, { status: 500 });
  }
}
