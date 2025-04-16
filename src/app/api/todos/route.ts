import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const [rows] = await db.query('SELECT * FROM todos ORDER BY id DESC');
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
    try {
        const { title } = await request.json();
        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const [result]: any = await db.query('INSERT INTO todos (title) VALUES (?)', [title]);
        const newTodo = { id: result.insertId, title };
        return NextResponse.json(newTodo); // ส่ง response ที่เป็น JSON
    } catch (error) {
        console.error("Error in POST /api/todos:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
