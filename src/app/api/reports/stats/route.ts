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

    let dateFormat;
    switch (period) {
      case 'weekly':
        dateFormat = 'YYYY-IW'; // ISO Week
        break;
      case 'monthly':
        dateFormat = 'YYYY-MM';
        break;
      case 'yearly':
        dateFormat = 'YYYY';
        break;
      case 'daily':
      default:
        dateFormat = 'YYYY-MM-DD';
        break;
    }

    // Get aggregated stats
    // Note: In Vercel Postgres, we use standard PostgreSQL syntax.
    // to_char is used for date formatting.
    // AVG returns a float, we cast to numeric for rounding.
    const { rows: stats } = await db`
      SELECT 
        to_char(created_at, ${dateFormat}) as period,
        COUNT(*) as count,
        ROUND(AVG(bmi)::numeric, 2) as avgBmi,
        MIN(bmi) as minBmi,
        MAX(bmi) as maxBmi
      FROM records 
      WHERE user_id = ${userId}
      GROUP BY period
      ORDER BY period DESC
      LIMIT 30
    `;

    // Get overall summary
    const { rows: summaryRows } = await db`
      SELECT 
        COUNT(*) as totalRecords,
        ROUND(AVG(bmi)::numeric, 2) as overallAvgBmi
      FROM records 
      WHERE user_id = ${userId}
    `;
    
    const summary = summaryRows[0];

    return NextResponse.json({ stats, summary }, { status: 200 });
  } catch (error) {
    console.error('Fetch reports error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
