import { supabase } from './src/client';
import type { InsertService, UpdateService } from './src/types';

// Test insert operation
const testInsert = async () => {
  const newService: InsertService = {
    name: 'Test Service',
    category: 'test'
  };
  
  const { data, error } = await supabase
    .from('services')
    .insert(newService)
    .select()
    .single();
    
  return data;
};

// Test update operation
const testUpdate = async () => {
  const updates: UpdateService = {
    name: 'Updated Service',
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', 'test