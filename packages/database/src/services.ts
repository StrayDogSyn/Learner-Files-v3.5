import { supabase } from './client';
import { withErrorHandling } from './error-handler';
import type { Row, Update } from './types';

// Type aliases for better readability
type Service = Row<'services'>;
type ServiceUpdate = Update<'services'>;

// Service functions for the services table

export const serviceService = {
  async getServices() {
    return withErrorHandling(async () => {
      const { data, error } = await (supabase as any)
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }, 'DATABASE_ERROR' as any);
  },

  async createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) {
    return withErrorHandling(async () => {
      const { data, error } = await (supabase as any)
        .from('services')
        .insert(service)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }, 'DATABASE_ERROR' as any);
  },

  async updateService(id: string, updates: Partial<ServiceUpdate>) {
    return withErrorHandling(async () => {
      const { data, error } = await (supabase as any)
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }, 'DATABASE_ERROR' as any);
  }
};



export const authService = {
  async signIn(email: string, password: string) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    }, 'AUTHENTICATION_ERROR' as any);
  },

  async signOut() {
    return withErrorHandling(async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }, 'AUTHENTICATION_ERROR' as any);
  },

  async getCurrentUser() {
    return withErrorHandling(async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    }, 'AUTHENTICATION_ERROR' as any);
  }
};