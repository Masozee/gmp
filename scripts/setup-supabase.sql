-- This script sets up the Supabase database schema with proper Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE IF EXISTS auth.users ENABLE ROW LEVEL SECURITY;

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  priority TEXT,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS on tasks table
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for tasks - users can only see their own tasks
CREATE POLICY "Users can view their own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policy for tasks - users can insert their own tasks
CREATE POLICY "Users can insert their own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policy for tasks - users can update their own tasks
CREATE POLICY "Users can update their own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policy for tasks - users can delete their own tasks
CREATE POLICY "Users can delete their own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Create subtasks table
CREATE TABLE IF NOT EXISTS public.subtasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on subtasks table
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for subtasks - users can only see subtasks of their own tasks
CREATE POLICY "Users can view their own subtasks" ON public.subtasks
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.tasks WHERE id = task_id
    )
  );

-- Create RLS policy for subtasks - users can insert subtasks for their own tasks
CREATE POLICY "Users can insert their own subtasks" ON public.subtasks
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.tasks WHERE id = task_id
    )
  );

-- Create RLS policy for subtasks - users can update subtasks of their own tasks
CREATE POLICY "Users can update their own subtasks" ON public.subtasks
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.tasks WHERE id = task_id
    )
  );

-- Create RLS policy for subtasks - users can delete subtasks of their own tasks
CREATE POLICY "Users can delete their own subtasks" ON public.subtasks
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.tasks WHERE id = task_id
    )
  );

-- Create notes table
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on notes table
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for notes - users can only see notes for their own tasks
CREATE POLICY "Users can view their own notes" ON public.notes
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.tasks WHERE id = task_id
    )
  );

-- Create RLS policy for notes - users can insert notes for their own tasks
CREATE POLICY "Users can insert their own notes" ON public.notes
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.tasks WHERE id = task_id
    )
  );

-- Create RLS policy for notes - users can update notes for their own tasks
CREATE POLICY "Users can update their own notes" ON public.notes
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.tasks WHERE id = task_id
    )
  );

-- Create RLS policy for notes - users can delete notes for their own tasks
CREATE POLICY "Users can delete their own notes" ON public.notes
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.tasks WHERE id = task_id
    )
  );

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for profiles - users can see all profiles
CREATE POLICY "Anyone can view profiles" ON public.profiles
  FOR SELECT USING (true);

-- Create RLS policy for profiles - users can only update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create an empty profile for the new user
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 