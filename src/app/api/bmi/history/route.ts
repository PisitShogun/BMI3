import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get recent 10 records
    const records = db.prepare(
      'SELECT * FROM records WHERE user_id = ? ORDER BY created_at DESC LIMIT 10'
    ).all(userId);

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error('Fetch history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
