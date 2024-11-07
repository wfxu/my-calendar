import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { SignJWT } from 'jose';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { name, password } = await req.json();

  // 查找用户
  const user = await prisma.user.findUnique({
    where: { name },
  });

  if (!user || user.password !== password) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // 创建JWT
  const token = await new SignJWT({ userName: user.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('3d')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  const response = NextResponse.json({ success: true });
  response.cookies.set('token', token, { httpOnly: true, sameSite: 'strict', secure: true });

  return response;
}
