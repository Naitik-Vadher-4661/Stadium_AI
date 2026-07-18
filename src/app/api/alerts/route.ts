import { NextResponse } from 'next/server';
import { getGateData, getActiveAlerts, addAlerts } from '@/lib/crowd/store';
import { analyzeCrowdData } from '@/lib/crowd/analyzer';
import { checkRateLimit } from '@/utils/rateLimit';

// Throttle LLM calls to max 1 per 30 seconds
let lastAnalysisTime = 0;

export async function GET(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const isAllowed = await checkRateLimit(ip);
    if (!isAllowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const gateData = await getGateData();
    let currentAlerts = await getActiveAlerts();
    const now = Date.now();

    // If there are critical/warning gates and we haven't analyzed recently, generate an alert
    const needsAnalysis = gateData.some(g => g.status !== 'normal');
    if (needsAnalysis && now - lastAnalysisTime > 30000) {
      lastAnalysisTime = now;

      const newAlerts = await analyzeCrowdData(gateData);
      if (newAlerts.length > 0) {
        await addAlerts(newAlerts);
        currentAlerts = await getActiveAlerts(); // Refresh from store
      }
    }

    return NextResponse.json(currentAlerts);
  } catch (error) {
    console.error('Error fetching/generating alerts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
