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
  id: string;
  userId: string;
  jobTitle: string;
  location: string;
  active: boolean;
  lastCheckedAt: Date | null;
}
