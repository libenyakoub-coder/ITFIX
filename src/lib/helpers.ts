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
    console.error('No user found');
    return null;
  }
 
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;
 
  // Upload the file
  const { data, error } = await supabase.storage
    .from('bug-screenshots')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
 
  if (error || !data) {
    console.error('Upload error:', error);
    return null;
  }
 
  // Get the public URL using the path returned from upload
  const { data: urlData } = supabase.storage
    .from('bug-screenshots')
    .getPublicUrl(data.path);
 
  if (!urlData?.publicUrl) {
    console.error('Failed to get public URL');
    return null;
  }
 
  console.log('Screenshot uploaded successfully:', urlData.publicUrl);
  return urlData.publicUrl;
}