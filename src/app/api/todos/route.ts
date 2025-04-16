import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const [rows] = await db.query('SELECT * FROM todos ORDER BY id DESC');
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { title } = await request.json();

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const [result]: any = await db.query('INSERT INTO todos (title) VALUES (?)', [title]);

  return NextResponse.json({ id: result.insertId, title });
}
