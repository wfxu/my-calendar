import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  console.log('Middleware is running');

  const tokenCookie = cookies().get('token');
  const token = tokenCookie?.value; // 提取实际的 cookie 值

  if (!token) {
    console.log('No token found');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    console.log('Token found, verifying...');
    const { payload } = await jwtVerify(token, secret);

    // 自动续签
    console.log('Token verified, renewing...');
    const newToken = await new SignJWT({ userId: payload.userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(secret);

    console.log('Token renewed');
    const res = NextResponse.next();
    res.cookies.set('token', newToken, { httpOnly: true, sameSite: 'strict', secure: true });
    return res;
  } catch (error) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico|login|sitemap.xml).*)'],
};
