// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface WhereClause {
  userId: number;
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
  plannedCompletion?: {
    gte?: Date;
    lte?: Date;
  };
  actualCompletion?: {
    gte?: Date;
    lte?: Date;
  };
  isCompleted?: boolean;
}

type FilterByKeys = 'createdAt' | 'plannedCompletion' | 'actualCompletion';

interface taskData {
  name: string;
  content?: string;
  plannedCompletion: Date;
  actualCompletion?: Date;
  isCompleted: boolean;
  overdueTime?: number | null;
  userId: number;
}


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // const userId = searchParams.get('userId');
    const userId = '1';
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const filterBy = searchParams.get('filterBy') as FilterByKeys; // 可以是 'createdAt', 'plannedCompletion', 'actualCompletion'
    const isCompleted = searchParams.get('isCompleted');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const where: WhereClause = { userId: parseInt(userId) };

    if (isCompleted) {
      where.isCompleted = isCompleted === 'true';
    }

    if (start || end) {
      const startDate = start ? new Date(start) : null;
      const endDate = end ? new Date(end) : null;
    
      if ((startDate && isNaN(startDate.getTime())) || (endDate && isNaN(endDate.getTime()))) {
        return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
      }
    
      if (startDate && endDate) {
        where[filterBy] = {
          gte: startDate,
          lte: endDate,
        };
      } else if (startDate) {
        where[filterBy] = {
          gte: startDate,
        };
      } else if (endDate) {
        where[filterBy] = {
          lte: endDate,
        };
      }
    }

    const tasks = await prisma.task.findMany({
      where,
    });

    return NextResponse.json(tasks);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: `Error fetching tasks: ${err.message}` }, { status: 500 });
  }
}

// 处理 POST 请求
export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    
    const userId = searchParams.get('userId');
    // const userId = '1';
  try {
    const { name, content, plannedCompletion, isCompleted } = await req.json();
    console.log(name, content, plannedCompletion, isCompleted)

    if (!name || !plannedCompletion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const taskData: taskData = {
        name,
        plannedCompletion: new Date(plannedCompletion),
        isCompleted,
        userId: Number(userId),
    };

    // Only add content if it is defined and not empty
    if (content) {
        taskData.content = content;
    }

    if (isCompleted) {
        const currentDate = new Date();
        const plannedCompletionDate = new Date(plannedCompletion);
        if (currentDate > plannedCompletionDate) {
          const timeDifference = currentDate.getTime() - plannedCompletionDate.getTime(); // Get time difference in milliseconds
          taskData.overdueTime = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
        } else {
          taskData.overdueTime = null;
        }
    }

    const task = await prisma.task.create({
        data: taskData,
    });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: `Error creating task: ${(error as Error).message}` }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}