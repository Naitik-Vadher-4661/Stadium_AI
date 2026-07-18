import { GateStatus } from '@/types/crowd';

export function GateCard({ gate }: { gate: GateStatus }) {
  const isCritical = gate.status === 'critical';
  const isWarning = gate.status === 'warning';
  
  const statusColor = isCritical
    ? 'bg-red-50 border-red-200 text-red-900'
    : isWarning
    ? 'bg-yellow-50 border-yellow-200 text-yellow-900'
    : 'bg-green-50 border-green-200 text-green-900';

  const barColor = isCritical ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className={`p-4 border rounded-lg shadow-sm ${statusColor}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">{gate.gate_name}</h3>
        <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 bg-white/50 rounded-full">
          {gate.status}
        </span>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Occupancy</span>
            <span className="font-medium">{gate.occupancy_percent}%</span>
          </div>
          <div className="w-full bg-black/10 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${barColor} transition-all duration-500`}
              style={{ width: `${gate.occupancy_percent}%` }}
              role="progressbar"
              aria-valuenow={gate.occupancy_percent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <div>
            <span className="block opacity-75">Queue</span>
            <span className="font-semibold">{gate.queue_length} people</span>
          </div>
          <div className="text-right">
            <span className="block opacity-75">Entry Rate</span>
            <span className="font-semibold">{gate.entry_rate} / min</span>
          </div>
        </div>
      </div>
    </div>
  );
}
