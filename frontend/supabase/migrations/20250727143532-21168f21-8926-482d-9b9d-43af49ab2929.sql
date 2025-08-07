-- Create admin table
CREATE TABLE public.admin (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create experts table
CREATE TABLE public.experts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  specialty TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0.0,
  interviews INTEGER DEFAULT 0,
  location TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'busy', 'offline')),
  last_interview DATE,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scheduled_calls table
CREATE TABLE public.scheduled_calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  candidate_phone TEXT,
  position TEXT NOT NULL,
  interview_date DATE NOT NULL,
  interview_time TIME NOT NULL,
  expert_id UUID NOT NULL REFERENCES public.experts(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES public.admin(id) ON DELETE CASCADE,
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_calls ENABLE ROW LEVEL SECURITY;

-- Create policies for admin table
CREATE POLICY "Admin can view all admins" 
ON public.admin 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can insert admin" 
ON public.admin 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin can update admin" 
ON public.admin 
FOR UPDATE 
USING (true);

-- Create policies for experts table
CREATE POLICY "Anyone can view experts" 
ON public.experts 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert experts" 
ON public.experts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update experts" 
ON public.experts 
FOR UPDATE 
USING (true);

-- Create policies for scheduled_calls table
CREATE POLICY "Anyone can view scheduled calls" 
ON public.scheduled_calls 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert scheduled calls" 
ON public.scheduled_calls 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update scheduled calls" 
ON public.scheduled_calls 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admin_updated_at
  BEFORE UPDATE ON public.admin
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_experts_updated_at
  BEFORE UPDATE ON public.experts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scheduled_calls_updated_at
  BEFORE UPDATE ON public.scheduled_calls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample admin user
INSERT INTO public.admin (name, email, phone) VALUES 
('John Admin', 'admin@company.com', '+1 (555) 0100');

-- Insert sample experts
INSERT INTO public.experts (name, email, phone, specialty, rating, interviews, location, status, last_interview) VALUES 
('Dr. Sarah Chen', 'sarah@techcorp.com', '+1 (555) 0123', 'AI & Machine Learning', 4.9, 24, 'San Francisco, CA', 'available', '2024-04-10'),
('Marcus Rodriguez', 'marcus@fintech.io', '+1 (555) 0124', 'Fintech & Blockchain', 4.8, 18, 'New York, NY', 'busy', '2024-04-09'),
('Dr. Emily Watson', 'emily@healthtech.com', '+1 (555) 0125', 'Healthcare Innovation', 4.7, 32, 'Boston, MA', 'available', '2024-04-08');