export interface RegistrationData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  event_id: string;
  event_name: string;
  entry_fee: number;
  razorpay_payment_id?: string;
  payment_status?: string;
  created_at?: string;
  registration_type?: 'solo' | 'team';
  team_name?: string;
  team_size?: number;
  branch?: string;
  year?: string;
}

export interface TeamMemberData {
  name: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  role: 'leader' | 'member';
}
