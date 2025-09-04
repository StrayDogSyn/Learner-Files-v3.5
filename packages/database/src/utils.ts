import { supabase } from './client';
import type { Database } from './types';

// Generic error handling
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Handle Supabase errors consistently
export function handleSupabaseError(error: any): never {
  throw new DatabaseError(
    error.message || 'Database operation failed',
    error.code,
    error.details
  );
}

// Pagination helper
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function paginate<T>(
  query: any,
  options: PaginationOptions = {}
): Promise<PaginatedResult<T>> {
  const { page = 1, limit = 10 } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query
    .range(from, to)
    .select('*', { count: 'exact' });

  if (error) handleSupabaseError(error);

  return {
    data: data || [],
    count: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  };
}

// Search helper
export interface SearchOptions {
  query: string;
  columns: string[];
  limit?: number;
}

export async function searchTable<T>(
  tableName: keyof Database['public']['Tables'],
  options: SearchOptions
): Promise<T[]> {
  const { query: searchQuery, columns, limit = 50 } = options;
  
  let query = supabase.from(tableName).select('*');
  
  // Build OR condition for multiple columns
  const orConditions = columns
    .map(col => `${col}.ilike.%${searchQuery}%`)
    .join(',');
  
  query = query.or(orConditions);
  
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data, error } = await query;
  
  if (error) handleSupabaseError(error);
  
  return (data || []) as T[];
}

// Batch insert helper - using any to bypass strict typing
export async function batchInsert(
  tableName: string,
  records: Record<string, any>[],
  batchSize: number = 100
): Promise<any[]> {
  const results: any[] = [];
  
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    
    const { data, error } = await (supabase as any)
      .from(tableName)
      .insert(batch)
      .select();
    
    if (error) handleSupabaseError(error);
    
    if (data) {
      results.push(...data);
    }
  }
  
  return results;
}

// Real-time subscription helper
export function subscribeToTable(
  tableName: string,
  callback: (payload: any) => void,
  filter?: string
) {
  let subscription = (supabase as any)
    .channel(`${tableName}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: tableName,
        filter
      },
      callback
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

// File upload helper
export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Blob,
  options?: {
    cacheControl?: string;
    contentType?: string;
    upsert?: boolean;
  }
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, options);

  if (error) handleSupabaseError(error);

  return data;
}

// Get public URL for uploaded file
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}

// Generate signed URL for private files
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) handleSupabaseError(error);

  return data.signedUrl;
}

// Validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Date helpers
export function formatDate(date: string | Date): string {
  return new Date(date).toISOString();
}

export function isValidDate(date: string): boolean {
  return !isNaN(Date.parse(date));
}

// Environment helpers
export function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return value;
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

// Generic CRUD operations
export interface CrudOptions {
  select?: string;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

// Generic create function - using any to bypass strict typing
export async function createRecord(
  tableName: string,
  data: Record<string, any>
): Promise<any> {
  const { data: result, error } = await (supabase as any)
    .from(tableName)
    .insert(data)
    .select()
    .single();

  if (error) handleSupabaseError(error);
  return result;
}

// Generic read function
export async function getRecord(
  tableName: string,
  id: string
): Promise<any | null> {
  const { data, error } = await (supabase as any)
    .from(tableName)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Record not found
    }
    handleSupabaseError(error);
  }

  return data;
}

// Generic read all function
export async function getRecords(
  tableName: string,
  options: CrudOptions = {}
): Promise<any[]> {
  const { select = '*', orderBy, limit } = options;
  
  let query = (supabase as any).from(tableName).select(select);
  
  if (orderBy) {
    query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
  }
  
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data, error } = await query;
  
  if (error) handleSupabaseError(error);
  return data || [];
}

// Generic update function
export async function updateRecord(
  tableName: string,
  id: string,
  updates: Record<string, any>
): Promise<any> {
  const { data, error } = await (supabase as any)
    .from(tableName)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) handleSupabaseError(error);
  return data;
}

// Generic delete function
export async function deleteRecord(
  tableName: string,
  id: string
): Promise<void> {
  const { error } = await (supabase as any)
    .from(tableName)
    .delete()
    .eq('id', id);

  if (error) handleSupabaseError(error);
}

// Generic filter function
export async function filterRecords(
  tableName: string,
  filters: Record<string, any>,
  options: CrudOptions = {}
): Promise<any[]> {
  const { select = '*', orderBy, limit } = options;
  
  let query = (supabase as any).from(tableName).select(select);
  
  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      query = query.in(key, value);
    } else if (value !== null && value !== undefined) {
      query = query.eq(key, value);
    }
  });
  
  if (orderBy) {
    query = query.order(orderBy.column, { ascending: orderBy.ascending });
  }
  
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data, error } = await query;
  
  if (error) handleSupabaseError(error);
  return data || [];
}

// Upsert function (insert or update)
export async function upsertRecord(
  tableName: string,
  data: Record<string, any>,
  onConflict?: string
): Promise<any> {
  const { data: result, error } = await (supabase as any)
    .from(tableName)
    .upsert(data, { onConflict })
    .select()
    .single();

  if (error) handleSupabaseError(error);
  return result;
}

// Count records
export async function countRecords(
  tableName: string,
  filters?: Record<string, any>
): Promise<number> {
  let query = (supabase as any).from(tableName).select('*', { count: 'exact', head: true });
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
  }
  
  const { count, error } = await query;
  
  if (error) handleSupabaseError(error);
  return count || 0;
}