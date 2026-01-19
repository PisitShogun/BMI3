import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { weight, height } = await request.json();

    if (!weight || !height) {
      return NextResponse.json(
        { error: 'Weight and height are required' },
        { status: 400 }
      );
    }

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));

    // Save to database
    const { rows } = await db`
      INSERT INTO records (user_id, weight, height, bmi) 
      VALUES (${userId}, ${weight}, ${height}, ${bmi}) 
      RETURNING id
    `;
    const id = rows[0].id;

    return NextResponse.json(
      { 
        message: 'Record saved successfully', 
        id: id,
        bmi 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Save BMI error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
