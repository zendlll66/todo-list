// app/api/test-db/route.ts
import { db } from '@/lib/db'; // เชื่อมต่อฐานข้อมูล
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // ดึงข้อมูลจากตาราง todos
    const [rows]: [any[], any] = await db.query('SELECT * FROM todos');

    // แปลงข้อมูล Buffer ให้เป็น string
    const todos = rows.map((row) => ({
      id: row.id, // แปลง Buffer เป็น number
      title: row.title.toString('utf-8'), // แปลง Buffer เป็น string
      created_at: row.created_at.toISOString(), // แปลงเป็น ISO string
    }));

    return NextResponse.json({ todos });
  } catch (error: any) {
    return NextResponse.json({ message: '❌ DB connection failed', error: error.message }, { status: 500 });
  }
}
