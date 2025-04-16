"use client";
import React, { useState, useEffect } from "react";

const TodoList = () => {
    const [todos, setTodos] = useState<{ id: number; title: string }[]>([]);
    const [newTodo, setNewTodo] = useState("");
    const [editingTodo, setEditingTodo] = useState<{ id: number; title: string } | null>(null);

    // Fetch todos when component mounts
    useEffect(() => {
        const fetchTodos = async () => {
            const response = await fetch("/api/todos");
            const data = await response.json();
            setTodos(data);
        };

        fetchTodos();
    }, []);

    // Add new todo
    const addTodo = async () => {
        if (!newTodo) return;
    
        try {
            const response = await fetch("/api/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: newTodo }),
            });
    
            if (!response.ok) {
                console.error("Failed to add todo:", response.statusText);
                return;
            }
    
            const data = await response.json();
            setTodos([...todos, data]); // Add new todo to the list
            setNewTodo(""); // Clear input field
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    // Edit todo
    const editTodo = async (id: number, newTitle: string) => {
        const response = await fetch(`/api/todos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: newTitle }),
        });

        const updatedTodo = await response.json();
        setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo)); // Update the todo in the list
        setEditingTodo(null); // Reset editing mode
    };

    // Delete todo
    const deleteTodo = async (id: number) => {
        await fetch(`/api/todos/${id}`, {
            method: "DELETE",
        });
        setTodos(todos.filter(todo => todo.id !== id)); // Remove deleted todo from the list
    };

    return (
        <div className="max-w-lg mx-auto p-4 shadow-md">
            <h1 className="text-3xl font-semibold text-center mb-4">Todo List</h1>

            <div className="flex mb-6">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    required
                    placeholder="Enter a task"
                    className="p-2 border rounded-md w-full mr-4"
                />
                <button
                    onClick={addTodo}
                    className="p-2 bg-green-400 text-white rounded-md hover:bg-green-600"
                >
                    Add
                </button>
            </div>

            <ul className="space-y-3">
                {todos.map((todo) => (
                    <li key={todo.id} className="flex justify-between items-center p-3 border-b border-gray-200 rounded-md">
                        {editingTodo?.id === todo.id ? (
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    value={editingTodo.title}
                                    onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                                    placeholder="Edit task title"
                                    className="p-2 border rounded-md"
                                />
                                <button
                                    onClick={() => editTodo(todo.id, editingTodo.title)}
                                    className="p-2 bg-green-500 text-white rounded-md hover:bg-green-400"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingTodo(null)}
                                    className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex w-full justify-between items-center  ">
                                <span className="text-xl">{todo.title}</span>
                                <div className="space-x-5">
                                    <button
                                        onClick={() => setEditingTodo({ id: todo.id, title: todo.title })}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-400 "
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-400"
                                    >
                                        Delete
                                    </button></div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
