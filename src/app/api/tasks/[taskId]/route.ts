// app/api/tasks/[taskId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface UpdateData {
  name?: string;
  content?: string;
  plannedCompletion?: Date;
  actualCompletion?: Date;
  overdueTime?: number | null;
  isCompleted?: boolean;
}


export async function GET(req: NextRequest) {
  const taskId = req.nextUrl.pathname.split('/').pop();

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(taskId) },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: `Error fetching task: ${(error as Error).message}` }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: NextRequest) {
  const taskId = req.nextUrl.pathname.split('/').pop();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  try {
    const { name, content, plannedCompletion, isCompleted } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updateData: UpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (content !== undefined) updateData.content = content;
    if (plannedCompletion !== undefined) {
      const plannedCompletionDate = new Date(plannedCompletion);
      updateData.plannedCompletion = plannedCompletionDate;

      const currentDate = new Date();
      if (currentDate > plannedCompletionDate) {
        const timeDifference = currentDate.getTime() - plannedCompletionDate.getTime(); // Get time difference in milliseconds
        updateData.overdueTime = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
      } else {
        updateData.overdueTime = null;
      }
    }
    if (isCompleted !== undefined) {
      updateData.isCompleted = isCompleted;
      updateData.actualCompletion = new Date();
    }

    const task = await prisma.task.update({
      where: {
        id: Number(taskId),
        userId: Number(userId),
      },
      data: updateData,
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: `Error updating task: ${(error as Error).message}` }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest) {
  const taskId = req.nextUrl.pathname.split('/').pop();

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  try {
    await prisma.task.delete({
      where: { id: Number(taskId) },
    });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: `Error deleting task: ${(error as Error).message}` }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}