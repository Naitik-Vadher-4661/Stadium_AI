import { CrowdAlert } from '@/types/crowd';
import { AlertTriangle, Info, BellRing } from 'lucide-react';

export function AlertFeed({ alerts }: { alerts: CrowdAlert[] }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        <p>No active alerts. All operations normal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" role="feed" aria-label="Crowd Intelligence Alerts">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg border-l-4 shadow-sm bg-white ${
            alert.severity === 'critical'
              ? 'border-l-red-500'
              : alert.severity === 'warning'
              ? 'border-l-yellow-500'
              : 'border-l-blue-500'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3 mt-1">
              {alert.severity === 'critical' ? (
                <AlertTriangle className="w-5 h-5 text-red-500" aria-hidden="true" />
              ) : alert.severity === 'warning' ? (
                <BellRing className="w-5 h-5 text-yellow-500" aria-hidden="true" />
              ) : (
                <Info className="w-5 h-5 text-blue-500" aria-hidden="true" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  alert.severity === 'critical' ? 'text-red-700' : alert.severity === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                }`}>
                  {alert.alert_type.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(alert.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-900 font-medium mb-1">{alert.message}</p>
              {alert.recommendation && (
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mt-2 border border-gray-100">
                  <span className="font-semibold block mb-1">Recommendation:</span>
                  {alert.recommendation}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
