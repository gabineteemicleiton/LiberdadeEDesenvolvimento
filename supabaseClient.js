import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabase = createClient(
  'https://qirsmhgmkcvbidipnsnw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcnNtaGdta2N2YmlkaXBuc253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzM4MDUsImV4cCI6MjA2ODk0OTgwNX0.W0JZkkw_2uOPSHsjYthUcbiaVXKCrO2asm96InPwmDc'
);

// Helper functions for database operations
export async function saveToSupabase(table, data) {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert([data])
      .select();
    
    if (error) throw error;
    console.log(`✅ Dados salvos na tabela ${table}:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Erro ao salvar na tabela ${table}:`, error);
    throw error;
  }
}

export async function getFromSupabase(table, filters = {}) {
  try {
    let query = supabase.from(table).select('*');
    
    Object.keys(filters).forEach(key => {
      query = query.eq(key, filters[key]);
    });
    
    const { data, error } = await query;
    
    if (error) throw error;
    console.log(`✅ Dados obtidos da tabela ${table}:`, data);
    return data;
  } catch (error) {
    console.error(`❌ Erro ao obter dados da tabela ${table}:`, error);
    throw error;
  }
}

export async function updateSupabase(table, id, data) {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    console.log(`✅ Dados atualizados na tabela ${table}:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Erro ao atualizar tabela ${table}:`, error);
    throw error;
  }
}

export async function deleteFromSupabase(table, id) {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    console.log(`✅ Registro deletado da tabela ${table}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao deletar da tabela ${table}:`, error);
    throw error;
  }
}