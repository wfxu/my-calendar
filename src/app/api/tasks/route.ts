// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface ErrorWithMessage {
  message: string;
}
// 处理 GET 请求
export async function GET(req: NextRequest) {
  try {
    // 获取所有用户
    console.log(req)
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    const err = error as ErrorWithMessage;
    return NextResponse.json({ error: `Error fetching users: ${err.message}` }, { status: 500 });
  }
}

// 处理 POST 请求
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email } = data;

    // 创建新用户
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    const err = error as ErrorWithMessage;
    return NextResponse.json({ error: `Error creating user: ${err.message}` }, { status: 500 });
  }
}

// 处理 PUT 请求
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, name, email } = data;

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    const err = error as ErrorWithMessage;
    return NextResponse.json({ error: `Error updating user: ${err.message}` }, { status: 500 });
  }
}

// 处理 DELETE 请求
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    // 删除用户
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    const err = error as ErrorWithMessage;
    return NextResponse.json({ error: `Error deleting user: ${err.message}` }, { status: 500 });
  }
}
