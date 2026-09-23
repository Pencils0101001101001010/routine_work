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
