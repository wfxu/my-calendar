// src/app/api/tasks/route.ts
import { NextResponse } from 'next/server';

const tasks = [
  { id: 1, title: 'Task 1', date: '2024-09-11', completed: false },
  { id: 2, title: 'Task 2', date: '2024-09-12', completed: true },
  { id: 3, title: 'Task 3', date: '2024-09-13', completed: false },
  { id: 4, title: 'Task 4', date: '2024-09-14', completed: true },
  { id: 5, title: 'Task 5', date: '2024-09-15', completed: false },
  { id: 6, title: 'Task 6', date: '2024-09-16', completed: true },
  { id: 7, title: 'Task 7', date: '2024-09-17', completed: false },
  { id: 8, title: 'Task 8', date: '2024-09-18', completed: true },
  { id: 9, title: 'Task 9', date: '2024-09-19', completed: false },
  { id: 10, title: 'Task 10', date: '2024-09-20', completed: true },
  // 更多假数据
];

export async function GET() {
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const newTask = await request.json();
  newTask.id = tasks.length + 1;
  tasks.push(newTask);
  return NextResponse.json(newTask);
}
