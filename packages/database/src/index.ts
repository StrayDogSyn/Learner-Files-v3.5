// Export Supabase clients
export { supabase, supabaseAdmin, createSupabaseClient } from './client';

// Export types
export type {
  Database,
  Tables,
  Service,
  InsertService,
  UpdateService,
  Row,
  Insert,
  Update
} from './types';

// Export services
export {
  serviceService,
  authService
} from './services';

// Export all utilities
export * from './utils';

// Export error handling
export * from './error-handler';

// Export common Supabase types
export type {
  User,
  Session,
  AuthError,
  PostgrestError,
  RealtimeChannel,
  RealtimePostgresChangesPayload
} from '@supabase/supabase-js';