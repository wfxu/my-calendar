import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
    const { name, email_req, password } = await req.json();
    
    const email = email_req || `${name}@example.com`;

    // 对密码进行哈希处理
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json(user);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: `Error creating user: ${err.message}` }, { status: 500 });
  }
}