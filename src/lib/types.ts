export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  created_at?: string;
}

export interface Appointment {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service_id: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm:ss
  end_time: string; // HH:mm:ss
  status: AppointmentStatus;
  notes: string | null;
  created_at?: string;
}

export interface BusinessHour {
  id: string;
  weekday: number; // 0 = Sunday, 6 = Saturday
  is_open: boolean;
  start_time: string; // HH:mm:ss
  end_time: string; // HH:mm:ss
}

export interface BlockedDate {
  id: string;
  blocked_date: string; // YYYY-MM-DD
  reason: string | null;
  created_at?: string;
}

export interface BusinessSettings {
  id: string;
  business_name: string | null;
  business_email: string | null;
  business_phone: string | null;
  business_address: string | null;
  slot_interval_minutes: number;
  booking_notice_hours: number;
  created_at?: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  label: string;
}
