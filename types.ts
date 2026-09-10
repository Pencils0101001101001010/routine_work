export interface JOB_PREFERENCES {
  id: string;
  user_id: string;
  job_title: string;
  location: string;
  active: boolean;
  last_checked_at: string;
}

export interface USERS {
  id: string;
  whatsapp_number: string;
  name: string;
  is_active: boolean;
  created_at: string;
}
