export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Core Business Types - Define interfaces first
export interface Service {
  id: string;
  name: string;
  category: 'consulting' | 'automation' | 'analysis' | 'training';
  description: string | null;
  features: any[] | null;
  pricing_tiers: any | null;
  delivery_time: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CaseStudy {
  id: string;
  client_name: string;
  industry?: string;
  challenge?: string;
  solution?: string;
  results?: any;
  metrics?: any;
  testimonial?: string;
  published_at?: string;
}

export interface Quote {
  id: string;
  service_ids?: string[];
  client_info?: any;
  requirements?: string;
  ai_analysis?: any;
  quoted_price?: number;
  valid_until?: string;
  status?: 'draft' | 'sent' | 'accepted' | 'expired';
  created_at?: string;
  updated_at?: string;
}

export interface Partner {
  id: string;
  company_name: string;
  contact_info?: any;
  services_offered?: string[];
  commission_rate?: number;
  performance_metrics?: any;
  status?: 'pending' | 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface Contract {
  id: string;
  quote_id?: string;
  client_id?: string;
  terms?: string;
  ai_generated?: boolean;
  signed_at?: string;
  document_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Analytics and Cross-Domain Types
export interface AnalyticsEvent {
  id: string;
  action: string;
  category: string;
  label?: string;
  value?: number;
  domain: string;
  user_id: string;
  session_id: string;
  timestamp: string;
  page_url?: string;
  referrer?: string;
  user_agent?: string;
  ip_address?: string;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  website_url?: string;
  location?: string;
  timezone?: string;
  language?: string;
  theme?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  two_factor_enabled?: boolean;
  profile_visibility?: 'public' | 'private' | 'friends';
  last_active_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Education Domain Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Challenge {
  id: string;
  type: 'coding' | 'intimate' | 'mixed';
  title: string;
  description: string;
  content: any;
  difficulty: number;
  metadata?: any;
  created_at?: string;
}

export interface UserProgress {
  id: string;
  user_id?: string;
  challenge_id?: string;
  score: number;
  time_spent: number;
  submission_code?: string;
  completed_at?: string;
}

export interface LearnerProfile {
  id: string;
  user_id: string;
  slack_user_id: string;
  name: string;
  email?: string;
  track?: string;
  current_week?: number;
  skills?: string[];
  goals?: string[];
  mentor_id?: string;
  timezone?: string;
  github_username?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  created_at?: string;
  updated_at?: string;
  last_active?: string;
  completion_rate?: number;
  challenges_completed?: number;
  challenges_failed?: number;
  mentor_sessions_attended?: number;
  mentor_sessions_missed?: number;
  days_inactive?: number;
  achievement_badges?: string[];
  preferences?: any;
}

// Search and API Types
export interface SearchIndex {
  id: string;
  title: string;
  content: string;
  url: string;
  domain: string;
  content_type: string;
  tags?: string[];
  metadata?: any;
  search_vector?: any;
  created_at?: string;
  updated_at?: string;
  indexed_at?: string;
}

export interface ApiRoute {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  domain: string;
  target_url: string;
  description?: string;
  is_active?: boolean;
  requires_auth?: boolean;
  rate_limit_per_minute?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      services: {
        Row: Service;
        Insert: Omit<Service, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Service, 'id' | 'created_at'>>;
      };
      case_studies: {
        Row: CaseStudy;
        Insert: Omit<CaseStudy, 'id' | 'published_at'>;
        Update: Partial<Omit<CaseStudy, 'id'>>;
      };
      quotes: {
        Row: Quote;
        Insert: Omit<Quote, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Quote, 'id' | 'created_at'>>;
      };
      partners: {
        Row: Partner;
        Insert: Omit<Partner, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Partner, 'id' | 'created_at'>>;
      };
      contracts: {
        Row: Contract;
        Insert: Omit<Contract, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Contract, 'id' | 'created_at'>>;
      };
      analytics_events: {
        Row: AnalyticsEvent;
        Insert: Omit<AnalyticsEvent, 'id' | 'created_at'>;
        Update: Partial<Omit<AnalyticsEvent, 'id' | 'created_at'>>;
      };
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'id' | 'created_at'>>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      challenges: {
        Row: Challenge;
        Insert: Omit<Challenge, 'id' | 'created_at'>;
        Update: Partial<Omit<Challenge, 'id' | 'created_at'>>;
      };
      user_progress: {
        Row: UserProgress;
        Insert: Omit<UserProgress, 'id'>;
        Update: Partial<Omit<UserProgress, 'id'>>;
      };
      learner_profiles: {
        Row: LearnerProfile;
        Insert: Omit<LearnerProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<LearnerProfile, 'id' | 'created_at'>>;
      };
      search_index: {
        Row: SearchIndex;
        Insert: Omit<SearchIndex, 'id' | 'created_at' | 'updated_at' | 'indexed_at'>;
        Update: Partial<Omit<SearchIndex, 'id' | 'created_at'>>;
      };
      api_routes: {
        Row: ApiRoute;
        Insert: Omit<ApiRoute, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ApiRoute, 'id' | 'created_at'>>;
      };
      

    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Export Tables type
export type Tables = Database['public']['Tables'];

// Generic helper types
export type Row<T extends keyof Tables> = Tables[T]['Row'];
export type Insert<T extends keyof Tables> = Tables[T]['Insert'];
export type Update<T extends keyof Tables> = Tables[T]['Update'];

// Core business types (already defined above)
// export type Service = Database['public']['Tables']['services']['Row'];
// export type CaseStudy = Database['public']['Tables']['case_studies']['Row'];
// export type Quote = Database['public']['Tables']['quotes']['Row'];
// export type Partner = Database['public']['Tables']['partners']['Row'];
// export type Contract = Database['public']['Tables']['contracts']['Row'];
// export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row'];
// export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
// export type User = Database['public']['Tables']['users']['Row'];
// export type Challenge = Database['public']['Tables']['challenges']['Row'];
// export type UserProgress = Database['public']['Tables']['user_progress']['Row'];
// export type LearnerProfile = Database['public']['Tables']['learner_profiles']['Row'];
// export type SearchIndex = Database['public']['Tables']['search_index']['Row'];
// export type ApiRoute = Database['public']['Tables']['api_routes']['Row'];

// Insert types
export type InsertService = Database['public']['Tables']['services']['Insert'];
export type InsertCaseStudy = Database['public']['Tables']['case_studies']['Insert'];
export type InsertQuote = Database['public']['Tables']['quotes']['Insert'];
export type InsertPartner = Database['public']['Tables']['partners']['Insert'];
export type InsertContract = Database['public']['Tables']['contracts']['Insert'];
export type InsertAnalyticsEvent = Database['public']['Tables']['analytics_events']['Insert'];
export type InsertUserProfile = Database['public']['Tables']['user_profiles']['Insert'];
export type InsertUser = Database['public']['Tables']['users']['Insert'];
export type InsertChallenge = Database['public']['Tables']['challenges']['Insert'];
export type InsertUserProgress = Database['public']['Tables']['user_progress']['Insert'];
export type InsertLearnerProfile = Database['public']['Tables']['learner_profiles']['Insert'];
export type InsertSearchIndex = Database['public']['Tables']['search_index']['Insert'];
export type InsertApiRoute = Database['public']['Tables']['api_routes']['Insert'];

// Update types
export type UpdateService = Database['public']['Tables']['services']['Update'];
export type UpdateCaseStudy = Database['public']['Tables']['case_studies']['Update'];
export type UpdateQuote = Database['public']['Tables']['quotes']['Update'];
export type UpdatePartner = Database['public']['Tables']['partners']['Update'];
export type UpdateContract = Database['public']['Tables']['contracts']['Update'];
export type UpdateAnalyticsEvent = Database['public']['Tables']['analytics_events']['Update'];
export type UpdateUserProfile = Database['public']['Tables']['user_profiles']['Update'];
export type UpdateUser = Database['public']['Tables']['users']['Update'];
export type UpdateChallenge = Database['public']['Tables']['challenges']['Update'];
export type UpdateUserProgress = Database['public']['Tables']['user_progress']['Update'];
export type UpdateLearnerProfile = Database['public']['Tables']['learner_profiles']['Update'];
export type UpdateSearchIndex = Database['public']['Tables']['search_index']['Update'];
export type UpdateApiRoute = Database['public']['Tables']['api_routes']['Update'];

// Additional Analytics Types

export interface AnalyticsDailyStats {
  id: string;
  date: string;
  domain: string;
  category: string;
  action: string;
  count?: number;
  total_value?: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserJourney {
  id: string;
  user_id: string;
  session_id: string;
  domain: string;
  action: string;
  label?: string;
  timestamp: string;
  sequence_number?: number;
  created_at?: string;
}

export interface ConversionEvent {
  id: string;
  user_id: string;
  session_id: string;
  domain: string;
  conversion_type: string;
  value?: number;
  currency?: string;
  timestamp: string;
  funnel_step?: number;
  attribution_source?: string;
  created_at?: string;
}

export interface CrossDomainSession {
  id: string;
  session_id: string;
  user_id: string;
  start_domain: string;
  current_domain: string;
  domains_visited?: string[];
  session_start: string;
  last_activity: string;
  is_active?: boolean;
  total_page_views?: number;
  total_events?: number;
  created_at?: string;
  updated_at?: string;
}

// Additional Search Types

export interface SearchQuery {
  id: string;
  query: string;
  user_id?: string;
  domain: string;
  results_count?: number;
  clicked_result_id?: string;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

export interface SearchSuggestion {
  id: string;
  suggestion: string;
  category?: string;
  popularity_score?: number;
  domains?: string[];
  created_at?: string;
  updated_at?: string;
}

// Additional User Types

export interface UserPreferences {
  id: string;
  user_id?: string;
  domain: string;
  category: string;
  key: string;
  value?: any;
  created_at?: string;
  updated_at?: string;
}

export interface UserSocialConnection {
  id: string;
  user_id?: string;
  provider: string;
  provider_user_id: string;
  username?: string;
  profile_url?: string;
  avatar_url?: string;
  connected_at?: string;
  last_synced_at?: string;
  is_active?: boolean;
}

export interface UserDomainActivity {
  id: string;
  user_id?: string;
  domain: string;
  first_visit_at?: string;
  last_visit_at?: string;
  visit_count?: number;
  total_time_spent?: string;
  preferences?: any;
  permissions?: any;
  created_at?: string;
  updated_at?: string;
}

export interface UserAchievement {
  id: string;
  user_id?: string;
  achievement_type: string;
  achievement_id: string;
  domain: string;
  title: string;
  description?: string;
  icon_url?: string;
  points?: number;
  earned_at?: string;
  is_visible?: boolean;
  metadata?: any;
}

export interface UserCrossDomainSession {
  id: string;
  user_id?: string;
  session_token: string;
  domains?: string[];
  created_at?: string;
  expires_at: string;
  last_used_at?: string;
  is_active?: boolean;
  metadata?: any;
}

// Messaging Types
export interface MessageThread {
  id: string;
  title?: string;
  type: 'direct' | 'group' | 'support';
  domain: string;
  created_by?: string;
  is_archived?: boolean;
  last_message_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ThreadParticipant {
  id: string;
  thread_id?: string;
  user_id?: string;
  role?: 'member' | 'admin' | 'moderator';
  joined_at?: string;
  left_at?: string;
  is_active?: boolean;
  permissions?: any;
}

export interface Message {
  id: string;
  thread_id?: string;
  sender_id?: string;
  content: string;
  message_type?: 'text' | 'image' | 'file' | 'system';
  attachments?: any[];
  reply_to_id?: string;
  is_edited?: boolean;
  edited_at?: string;
  is_deleted?: boolean;
  deleted_at?: string;
  metadata?: any;
  created_at?: string;
}

export interface MessageReadStatus {
  id: string;
  message_id?: string;
  user_id?: string;
  read_at?: string;
  thread_id?: string;
}

export interface Notification {
  id: string;
  user_id?: string;
  type: string;
  title: string;
  message?: string;
  data?: any;
  is_read?: boolean;
  read_at?: string;
  action_url?: string;
  domain?: string;
  created_at?: string;
}

export interface UserPresence {
  id: string;
  user_id?: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
  last_seen_at?: string;
  current_domain?: string;
  activity?: string;
  updated_at?: string;
}

// Cross-Domain Types
export interface CrossDomainRoute {
  id: string;
  source_domain: string;
  target_domain: string;
  route_path: string;
  target_path: string;
  requires_auth?: boolean;
  allowed_roles?: string[];
  is_active?: boolean;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
}

// Referral Types
export interface ReferralCode {
  id: string;
  code: string;
  user_id?: string;
  domain: string;
  type?: 'user' | 'campaign' | 'partner';
  max_uses?: number;
  current_uses?: number;
  expires_at?: string;
  is_active?: boolean;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
}

export interface ReferralCampaign {
  id: string;
  name: string;
  description?: string;
  domain: string;
  reward_type?: 'percentage' | 'fixed' | 'credits';
  reward_value?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  target_audience?: any;
  rules?: any;
  created_at?: string;
  updated_at?: string;
}

export interface Referral {
  id: string;
  referrer_id?: string;
  referee_id?: string;
  referral_code?: string;
  campaign_id?: string;
  domain: string;
  status?: 'pending' | 'completed' | 'cancelled';
  conversion_event?: string;
  conversion_value?: number;
  reward_amount?: number;
  reward_currency?: string;
  completed_at?: string;
  created_at?: string;
}

export interface ReferralReward {
  id: string;
  referral_id?: string;
  user_id?: string;
  reward_type?: 'percentage' | 'fixed' | 'credits';
  amount?: number;
  currency?: string;
  status?: 'pending' | 'paid' | 'cancelled';
  paid_at?: string;
  payment_method?: string;
  payment_reference?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReferralAnalytics {
  id: string;
  campaign_id?: string;
  domain: string;
  date: string;
  total_referrals?: number;
  successful_conversions?: number;
  total_reward_amount?: number;
  top_referrer_id?: string;
  conversion_rate?: number;
  created_at?: string;
}

export interface CrossDomainReferral {
  id: string;
  referrer_id?: string;
  source_domain: string;
  target_domain: string;
  referral_data?: any;
  conversion_tracked?: boolean;
  created_at?: string;
}

// Additional API Types

export interface ApiKey {
  id: string;
  key_hash: string;
  user_id?: string;
  name?: string;
  domain: string;
  permissions?: string[];
  rate_limit?: number;
  expires_at?: string;
  last_used_at?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface ApiRateLimit {
  id: string;
  api_key_id?: string;
  user_id?: string;
  domain: string;
  endpoint?: string;
  requests_count?: number;
  window_start?: string;
  window_end?: string;
  limit_exceeded?: boolean;
  created_at?: string;
}

export interface ApiRequestLog {
  id: string;
  api_key_id?: string;
  user_id?: string;
  domain: string;
  method: string;
  endpoint: string;
  status_code?: number;
  response_time?: number;
  request_size?: number;
  response_size?: number;
  ip_address?: string;
  user_agent?: string;
  error_message?: string;
  created_at?: string;
}

export interface CrossDomainShare {
  id: string;
  user_id?: string;
  source_domain: string;
  target_domain: string;
  content_type: string;
  content_id: string;
  share_data?: any;
  expires_at?: string;
  access_count?: number;
  max_access?: number;
  created_at?: string;
}

export interface DomainConfig {
  id: string;
  domain: string;
  config_key: string;
  config_value?: any;
  is_public?: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Domain-Specific Types

// Carnal Domain Types
export interface CarnalProfile {
  id: string;
  user_id?: string;
  display_name?: string;
  age?: number;
  location?: string;
  bio?: string;
  interests?: string[];
  relationship_status?: string;
  looking_for?: string[];
  photos?: string[];
  verification_status?: 'pending' | 'verified' | 'rejected';
  privacy_settings?: any;
  is_active?: boolean;
  last_active_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Additional Challenge Types

export interface ChallengeTest {
  id: string;
  challenge_id?: string;
  test_type?: string;
  test_data?: any;
  expected_result?: any;
  weight?: number;
  is_active?: boolean;
  created_at?: string;
}

// Additional Couple Types

export interface Couple {
  id: string;
  partner1_id?: string;
  partner2_id?: string;
  relationship_start?: string;
  status?: 'active' | 'paused' | 'ended';
  privacy_level?: 'private' | 'friends' | 'public';
  shared_goals?: string[];
  preferences?: any;
  created_at?: string;
  updated_at?: string;
}

export interface CoupleSession {
  id: string;
  couple_id?: string;
  session_type?: string;
  title?: string;
  description?: string;
  scheduled_at?: string;
  duration?: string;
  status?: 'scheduled' | 'active' | 'completed' | 'cancelled';
  notes?: string;
  rating?: number;
  feedback?: any;
  created_at?: string;
  updated_at?: string;
}

export interface SessionChallenge {
  id: string;
  session_id?: string;
  challenge_id?: string;
  status?: 'assigned' | 'in_progress' | 'completed' | 'skipped';
  partner1_response?: any;
  partner2_response?: any;
  completion_time?: string;
  score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AiChatLog {
  id: string;
  user_id?: string;
  session_id?: string;
  message_type?: 'user' | 'ai' | 'system';
  content: string;
  context?: any;
  ai_model?: string;
  tokens_used?: number;
  response_time?: number;
  created_at?: string;
}

// Learning Domain Types
export interface Project {
  id: string;
  title: string;
  description?: string;
  category?: string;
  difficulty_level?: number;
  estimated_hours?: number;
  technologies?: string[];
  repository_url?: string;
  demo_url?: string;
  status?: 'draft' | 'active' | 'completed' | 'archived';
  created_by?: string;
  mentor_id?: string;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectLike {
  id: string;
  project_id?: string;
  user_id?: string;
  created_at?: string;
}

// Additional Learning Types

export interface ProgressEntry {
  id: string;
  user_id?: string;
  project_id?: string;
  entry_type?: 'daily' | 'milestone' | 'reflection';
  title?: string;
  content?: string;
  hours_worked?: number;
  challenges_faced?: string;
  learnings?: string;
  next_steps?: string;
  mood_rating?: number;
  energy_level?: number;
  tags?: string[];
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SlackChallenge {
  id: string;
  title: string;
  description?: string;
  challenge_type?: string;
  difficulty?: number;
  points?: number;
  time_limit?: string;
  is_active?: boolean;
  completion_criteria?: any;
  created_at?: string;
  updated_at?: string;
}

export interface MentorProfile {
  id: string;
  user_id?: string;
  expertise_areas?: string[];
  experience_years?: number;
  mentoring_style?: string;
  availability?: any;
  max_mentees?: number;
  current_mentees?: number;
  hourly_rate?: number;
  bio?: string;
  achievements?: string[];
  languages?: string[];
  timezone?: string;
  is_accepting_mentees?: boolean;
  rating?: number;
  total_sessions?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Standup {
  id: string;
  user_id?: string;
  date: string;
  yesterday_work?: string;
  today_plan?: string;
  blockers?: string;
  mood?: number;
  energy_level?: number;
  learning_highlight?: string;
  goals_progress?: any;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Achievement {
  id: string;
  user_id?: string;
  achievement_type: string;
  title: string;
  description?: string;
  icon?: string;
  points?: number;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  earned_at?: string;
  criteria_met?: any;
  is_visible?: boolean;
  created_at?: string;
}

export interface PairSession {
  id: string;
  participant1_id?: string;
  participant2_id?: string;
  project_id?: string;
  session_type?: 'coding' | 'review' | 'planning' | 'debugging';
  scheduled_at?: string;
  duration?: string;
  status?: 'scheduled' | 'active' | 'completed' | 'cancelled';
  notes?: string;
  rating_p1?: number;
  rating_p2?: number;
  feedback?: any;
  recording_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  description?: string;
  requirements?: string[];
  location?: string;
  salary_range?: string;
  employment_type?: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience_level?: 'entry' | 'mid' | 'senior' | 'lead';
  technologies?: string[];
  application_url?: string;
  posted_by?: string;
  is_active?: boolean;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  description?: string;
  resource_type?: 'article' | 'video' | 'course' | 'book' | 'tool' | 'tutorial';
  url?: string;
  author?: string;
  difficulty_level?: number;
  estimated_time?: string;
  topics?: string[];
  rating?: number;
  review_count?: number;
  is_free?: boolean;
  price?: number;
  currency?: string;
  added_by?: string;
  is_approved?: boolean;
  created_at?: string;
  updated_at?: string;
}

// System Types
export interface SystemHealthLog {
  id: string;
  service_name: string;
  status?: 'healthy' | 'warning' | 'critical' | 'down';
  response_time?: number;
  error_rate?: number;
  cpu_usage?: number;
  memory_usage?: number;
  disk_usage?: number;
  active_connections?: number;
  error_message?: string;
  metadata?: any;
  checked_at?: string;
  created_at?: string;
}

export interface AdminAlert {
  id: string;
  alert_type?: 'system' | 'security' | 'performance' | 'business';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message?: string;
  source?: string;
  affected_service?: string;
  is_resolved?: boolean;
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
  created_at?: string;
  updated_at?: string;
}