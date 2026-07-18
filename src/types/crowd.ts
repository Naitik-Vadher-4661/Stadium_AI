export type GateStatusType = 'normal' | 'warning' | 'critical';

export interface GateStatus {
  id: string;
  gate_name: string;
  occupancy_percent: number; // 0-100
  queue_length: number;      // Number of people in queue
  entry_rate: number;        // People per minute entering
  max_capacity: number;
  status: GateStatusType;
  updated_at: string;
}

export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertType = 'redirect' | 'capacity_warning' | 'queue_surge' | 'general';

export interface CrowdAlert {
  id: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  message: string;
  affected_gates: string[];
  recommendation?: string;
  is_resolved: boolean;
  created_at: string;
}
