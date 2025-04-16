import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, context: { params: { id: string } }) {
    try {
        const params = await context.params; // ใช้ await กับ context.params
        const { id } = params; // ดึง id ออกมา
        const { title } = await request.json();

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        await db.query('UPDATE todos SET title = ? WHERE id = ?', [title, id]);
        const updatedTodo = { id, title };
        return NextResponse.json(updatedTodo);
    } catch (error) {
        console.error("Error in PUT /api/todos/[id]:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
    try {
        const params = await context.params; // ใช้ await กับ context.params
        const { id } = params; // ดึง id ออกมา

        await db.query('DELETE FROM todos WHERE id = ?', [id]);
        return NextResponse.json({ message: "Todo deleted successfully" });
    } catch (error) {
        console.error("Error in DELETE /api/todos/[id]:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}