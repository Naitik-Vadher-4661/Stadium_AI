import { NextResponse } from 'next/server';
import { getGateData, updateGateData } from '@/lib/crowd/store';
import { simulateNextTick } from '@/lib/crowd/simulator';

// Note: In Vercel, cron jobs hit an endpoint. It should ideally be protected by a cron secret,
// but we leave it open for local MVP testing (or check headers if needed).
export async function POST(req: Request) {
  try {
    // Protect route from public execution
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const currentData = await getGateData();
    const newData = simulateNextTick(currentData);
    await updateGateData(newData);

    return NextResponse.json({ success: true, updatedCount: newData.length });
  } catch (error) {
    console.error('Simulator tick error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Allow GET for easy manual triggering during dev
export async function GET(req: Request) {
  return POST(req);
}
