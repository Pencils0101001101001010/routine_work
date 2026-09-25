export interface User {
  id?: string;
  name: string;
  email: string;
  whatsapp_number: string;
  password: string;
  is_active?: boolean;
  created_at?: string;
}

export interface JobPreference {
  id?: string;
  user_id?: string;
  job_title: string;
  location: string;
}

export interface NotificationLog {
  id?: string;
  user_id?: string;
  job_match_id?: string;
  status?: string;
  sent_at?: string;
  job_title?: string;
  company?: string;
}
