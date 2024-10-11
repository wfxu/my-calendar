import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
interface ErrorWithMessage {
    message: string;
  }
export async function GET(req: NextRequest) {
  try {
    console.log(req.url)
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    const err = error as ErrorWithMessage;
    return NextResponse.json({ error: `Error fetching users: ${err.message}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    try {
      const { name, email }  = await req.json();
      const user = await prisma.user.create({
        data: { name, email },
      });
      return NextResponse.json(user);
    } catch (error) {
        const err = error as ErrorWithMessage;
        return NextResponse.json({ error: `Error creating user: ${err.message}` }, { status: 500 });
    }
  }