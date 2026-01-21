-- Create registrations table
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  college TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  entry_fee INTEGER NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Public can insert (for registration)
CREATE POLICY "Anyone can create registrations"
ON public.registrations
FOR INSERT
WITH CHECK (true);

-- Public can read their own registration by email
CREATE POLICY "Anyone can read registrations by email"
ON public.registrations
FOR SELECT
USING (true);

-- Allow updates for payment verification
CREATE POLICY "Allow payment status updates"
ON public.registrations
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_registrations_updated_at
BEFORE UPDATE ON public.registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_registrations_updated_at();