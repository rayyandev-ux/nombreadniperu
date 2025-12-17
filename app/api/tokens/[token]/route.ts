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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const { token } = await params;

  try {
    const result = await pool.query('DELETE FROM tokens WHERE token = $1 RETURNING *', [token]);
    if (result.rowCount && result.rowCount > 0) {
      return NextResponse.json({ success: true, message: 'Token eliminado' });
    }
    return NextResponse.json({ success: false, message: 'Token no encontrado' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error deleting token' }, { status: 500 });
  }
}
