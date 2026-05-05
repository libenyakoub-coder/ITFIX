import { supabase } from '@/lib/supabase';
import type { UserRole } from '@/types/types';

export async function getUserRole(): Promise<UserRole | null> {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  if (user.email === 'lisa@itfix.com') {
    return 'admin';
  }

  const { data: technician } = await supabase
    .from('technicians')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (technician) {
    return 'technician';
  }

  return 'employee';
}

export async function uploadScreenshot(file: File): Promise<string | null> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(`Authentication error: ${userError?.message || 'User not logged in'}`);
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('bug-screenshots')
    .upload(fileName, file);

  if (error) {
    console.error('Upload error:', error);
    throw new Error(`Screenshot upload failed: ${error.message}`);
  }

  if (!data) {
    throw new Error('Screenshot upload failed: No data returned');
  }

  const { data: urlData } = supabase.storage
    .from('bug-screenshots')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}