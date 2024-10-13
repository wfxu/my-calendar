import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: Number(userId) },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: `Error fetching tasks: ${(error as Error).message}` }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  try {
    const { name, content, plannedCompletion, status, overdueTime } = await req.json();

    if (!name || !content || !plannedCompletion || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        name,
        content,
        plannedCompletion: new Date(plannedCompletion),
        status,
        overdueTime: overdueTime ? new Date(overdueTime) : null,
        userId: Number(userId),
      },
    });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: `Error creating task: ${(error as Error).message}` }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const taskId = req.nextUrl.searchParams.get('taskId');
  try {
    const task = await prisma.task.delete({
      where: {
        id: Number(taskId),
        userId: Number(userId),
      },
    });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: `Error deleting task: ${(error as Error).message}` }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const taskId = req.nextUrl.searchParams.get('taskId');

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  try {
    const { name, content, plannedCompletion, status, overdueTime } = await req.json();

    if (!name || !content || !plannedCompletion || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const task = await prisma.task.update({
      where: {
        id: Number(taskId),
        userId: Number(userId),
      },
      data: {
        name,
        content,
        plannedCompletion: new Date(plannedCompletion),
        status,
        overdueTime: overdueTime ? new Date(overdueTime) : null,
      },
    });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: `Error updating task: ${(error as Error).message}` }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}