-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'advocate', 'volunteer', 'instructor')),
  domain_access TEXT[] DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cases table (Justice Reform)
CREATE TABLE cases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('criminal', 'civil', 'family', 'immigration', 'housing', 'employment')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed', 'resolved')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  client_id UUID REFERENCES profiles(id),
  assigned_advocate_id UUID REFERENCES profiles(id),
  metadata JSONB DEFAULT '{}',
  documents TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create volunteer_opportunities table
CREATE TABLE volunteer_opportunities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  organization TEXT,
  location TEXT,
  is_remote BOOLEAN DEFAULT FALSE,
  skills_required TEXT[],
  time_commitment TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'filled', 'cancelled')),
  contact_email TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create courses table (Education)
CREATE TABLE courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  category TEXT NOT NULL,
  level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_hours INTEGER,
  rating DECIMAL(3,2) DEFAULT 0.0,
  price DECIMAL(10,2) DEFAULT 0.0,
  is_published BOOLEAN DEFAULT FALSE,
  thumbnail_url TEXT,
  skills TEXT[],
  prerequisites TEXT[],
  learning_objectives TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create services table (Business)
CREATE TABLE services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price_range TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  features TEXT[],
  target_audience TEXT[],
  delivery_method TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ai_sessions table (Cross-domain AI interactions)
CREATE TABLE ai_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  domain TEXT NOT NULL CHECK (domain IN ('corporate', 'justice', 'education', 'business', 'tech')),
  session_type TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  messages JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_category ON cases(category);
CREATE INDEX idx_cases_client_id ON cases(client_id);
CREATE INDEX idx_cases_assigned_advocate_id ON cases(assigned_advocate_id);
CREATE INDEX idx_volunteer_opportunities_status ON volunteer_opportunities(status);
CREATE INDEX idx_volunteer_opportunities_is_remote ON volunteer_opportunities(is_remote);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_is_published ON courses(is_published);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_ai_sessions_user_id ON ai_sessions(user_id);
CREATE INDEX idx_ai_sessions_domain ON ai_sessions(domain);
CREATE INDEX idx_ai_sessions_created_at ON ai_sessions(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Cases: Users can view cases they're involved in, advocates can view all
CREATE POLICY "Users can view their own cases" ON cases
  FOR SELECT USING (
    auth.uid() = client_id OR 
    auth.uid() = assigned_advocate_id OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'advocate')
    )
  );

CREATE POLICY "Advocates can create cases" ON cases
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'advocate')
    )
  );

CREATE POLICY "Advocates can update cases" ON cases
  FOR UPDATE USING (
    auth.uid() = assigned_advocate_id OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'advocate')
    )
  );

-- Volunteer opportunities: Public read, admin/advocate write
CREATE POLICY "Volunteer opportunities are viewable by everyone" ON volunteer_opportunities
  FOR SELECT USING (true);

CREATE POLICY "Admins and advocates can manage volunteer opportunities" ON volunteer_opportunities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'advocate')
    )
  );

-- Courses: Public read for published, instructor/admin write
CREATE POLICY "Published courses are viewable by everyone" ON courses
  FOR SELECT USING (is_published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Instructors and admins can manage courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'instructor')
    )
  );

-- Services: Public read for active, admin write
CREATE POLICY "Active services are viewable by everyone" ON services
  FOR SELECT USING (is_active = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage services" ON services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- AI Sessions: Users can only access their own sessions
CREATE POLICY "Users can view their own AI sessions" ON ai_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI sessions" ON ai_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI sessions" ON ai_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON profiles TO anon, authenticated;
GRANT ALL PRIVILEGES ON profiles TO authenticated;

GRANT SELECT ON cases TO anon, authenticated;
GRANT ALL PRIVILEGES ON cases TO authenticated;

GRANT SELECT ON volunteer_opportunities TO anon, authenticated;
GRANT ALL PRIVILEGES ON volunteer_opportunities TO authenticated;

GRANT SELECT ON courses TO anon, authenticated;
GRANT ALL PRIVILEGES ON courses TO authenticated;

GRANT SELECT ON services TO anon, authenticated;
GRANT ALL PRIVILEGES ON services TO authenticated;

GRANT SELECT ON ai_sessions TO anon, authenticated;
GRANT ALL PRIVILEGES ON ai_sessions TO authenticated;

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_volunteer_opportunities_updated_at BEFORE UPDATE ON volunteer_opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_sessions_updated_at BEFORE UPDATE ON ai_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();