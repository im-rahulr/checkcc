
-- Create a table to track online users
CREATE TABLE public.online_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unique constraint to prevent duplicate entries
ALTER TABLE public.online_users ADD CONSTRAINT unique_user_online UNIQUE (user_id);

-- Enable Row Level Security
ALTER TABLE public.online_users ENABLE ROW LEVEL SECURITY;

-- Create policies for online users
CREATE POLICY "Anyone can view online users count" 
  ON public.online_users 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own presence" 
  ON public.online_users 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own presence" 
  ON public.online_users 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own presence" 
  ON public.online_users 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime for online users tracking
ALTER TABLE public.online_users REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.online_users;

-- Create function to cleanup old online users (older than 5 minutes)
CREATE OR REPLACE FUNCTION public.cleanup_offline_users()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM public.online_users 
  WHERE last_seen < (now() - interval '5 minutes');
$$;

-- Create function to update user presence
CREATE OR REPLACE FUNCTION public.update_user_presence(user_uuid uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  INSERT INTO public.online_users (user_id, last_seen)
  VALUES (user_uuid, now())
  ON CONFLICT (user_id)
  DO UPDATE SET last_seen = now();
$$;
