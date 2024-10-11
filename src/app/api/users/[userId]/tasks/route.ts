import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ErrorWithMessage {
    message: string;
  }
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: Number(userId) },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    const err = error as ErrorWithMessage;
    return NextResponse.json({ error: `Error fetching tasks: ${err.message}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
    const { userId } = params;
    try {
      const { name, content, plannedCompletion, status, overdueTime } = await req.json();
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
        const err = error as ErrorWithMessage;  
        return NextResponse.json({ error: `Error creating task: ${err.message}` }, { status: 500 });
    }
  }
  