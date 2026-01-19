import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'daily'; // daily, weekly, monthly, yearly

    let groupByFormat;
    switch (period) {
      case 'weekly':
        groupByFormat = '%Y-%W';
        break;
      case 'monthly':
        groupByFormat = '%Y-%m';
        break;
      case 'yearly':
        groupByFormat = '%Y';
        break;
      case 'daily':
      default:
        groupByFormat = '%Y-%m-%d';
        break;
    }

    // Get aggregated stats
    const stats = db.prepare(`
      SELECT 
        strftime('${groupByFormat}', created_at) as period,
        COUNT(*) as count,
        ROUND(AVG(bmi), 2) as avgBmi,
        MIN(bmi) as minBmi,
        MAX(bmi) as maxBmi
      FROM records 
      WHERE user_id = ?
      GROUP BY period
      ORDER BY period DESC
      LIMIT 30
    `).all(userId);

    // Get overall summary
    const summary = db.prepare(`
      SELECT 
        COUNT(*) as totalRecords,
        ROUND(AVG(bmi), 2) as overallAvgBmi
      FROM records 
      WHERE user_id = ?
    `).get(userId);

    return NextResponse.json({ stats, summary }, { status: 200 });
  } catch (error) {
    console.error('Fetch reports error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
