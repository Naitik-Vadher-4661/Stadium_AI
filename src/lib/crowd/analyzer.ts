import { GateStatus, CrowdAlert } from '@/types/crowd';
import { generateId } from 'ai';

/**
 * Analyzes current gate data and uses Groq to generate plain-language alerts 
 * and redirect recommendations if thresholds are breached.
 */
export async function analyzeCrowdData(gateData: GateStatus[]): Promise<CrowdAlert[]> {
  // Find gates that need attention
  const criticalGates = gateData.filter(g => g.status === 'critical' || g.status === 'warning');
  
  if (criticalGates.length === 0) {
    return []; // No alerts needed
  }

  // Find normal gates that could be used for redirects
  const normalGates = gateData.filter(g => g.status === 'normal');

  const prompt = `
You are an AI Operational Intelligence Assistant for a stadium during the FIFA World Cup.
Analyze the following gate data and generate a concise, actionable alert for the organizers.

Critical/Warning Gates:
${criticalGates.map(g => `- ${g.gate_name}: ${g.occupancy_percent}% occupancy, ${g.queue_length} in queue, ${g.entry_rate}/min entry rate`).join('\n')}

Normal/Available Gates:
${normalGates.map(g => `- ${g.gate_name}: ${g.occupancy_percent}% occupancy, ${g.queue_length} in queue, ${g.entry_rate}/min entry rate`).join('\n')}

Task:
1. Identify the most critical issue.
2. Formulate a plain-language alert message (e.g., "Gate 3 is nearing maximum capacity with a rapidly growing queue.").
3. Provide a specific redirect recommendation (e.g., "Recommend redirecting fans to Gate 1, which currently has a 5-minute wait.").
4. Keep it highly professional and brief.

Output format MUST be valid JSON with the following structure:
{
  "alert_type": "redirect" | "capacity_warning" | "queue_surge",
  "severity": "warning" | "critical",
  "message": "The main alert message",
  "recommendation": "The action recommendation"
}
`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      }),
    });

    if (!res.ok) {
      throw new Error(`Groq API error: ${res.status}`);
    }

    const data = await res.json();
    const result = JSON.parse(data.choices[0].message.content);

    return [{
      id: generateId(),
      alert_type: result.alert_type || 'general',
      severity: result.severity || 'warning',
      message: result.message || 'High congestion detected.',
      recommendation: result.recommendation || 'Deploy crowd control team.',
      affected_gates: criticalGates.map(g => g.gate_name),
      is_resolved: false,
      created_at: new Date().toISOString(),
    }];
  } catch (error) {
    console.error('Failed to generate GenAI alert:', error);
    // Fallback alert if AI fails
    return criticalGates.map(g => ({
      id: generateId(),
      alert_type: 'capacity_warning',
      severity: g.status as 'warning' | 'critical',
      message: `System Fallback: ${g.gate_name} is at ${g.occupancy_percent}% capacity.`,
      recommendation: 'Please investigate visually.',
      affected_gates: [g.gate_name],
      is_resolved: false,
      created_at: new Date().toISOString(),
    }));
  }
}
