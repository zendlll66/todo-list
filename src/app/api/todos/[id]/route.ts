import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// DELETE (Delete todo)
export async function DELETE(_: Request, context: unknown) {
    const { params } = context as { params: { id: string } };
    const { id } = params;
    await db.query('DELETE FROM todos WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
}

// PUT (Edit todo)
export async function PUT(
    request: Request,
    context: unknown
) {
    const { params } = context as { params: { id: string } };
    const { id } = params;
    const { title } = await request.json();

    if (!title) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const [result]: any = await db.query('UPDATE todos SET title = ? WHERE id = ?', [title, id]);

    if (result.affectedRows === 0) {
        return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id, title });
}

