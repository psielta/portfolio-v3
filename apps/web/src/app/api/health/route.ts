import { NextResponse } from 'next/server';
import prisma from '@portfolio/db';

export async function GET() {
  try {
    await prisma.$queryRawUnsafe('SELECT 1');

    return NextResponse.json(
      { status: 'ok', timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'database unreachable' },
      { status: 503 }
    );
  }
}
