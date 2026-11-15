// Supabase Client and Database Sync Service
import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'carenest_supabase_url';
const STORAGE_KEY_KEY = 'carenest_supabase_key';

let cachedClient = null;

export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) || '' : '';

  return {
    url: localUrl || envUrl,
    key: localKey || envKey,
    isConfigured: Boolean((localUrl || envUrl) && (localKey || envKey))
  };
}

export function saveSupabaseCredentials(url, key) {
  if (typeof window !== 'undefined') {
    if (url && key) {
      localStorage.setItem(STORAGE_KEY_URL, url.trim());
      localStorage.setItem(STORAGE_KEY_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_URL);
      localStorage.removeItem(STORAGE_KEY_KEY);
    }
  }
  cachedClient = null;
}

export function getSupabaseClient() {
  const { url, key, isConfigured } = getSupabaseCredentials();
  if (!isConfigured) return null;

  if (!cachedClient) {
    try {
      cachedClient = createClient(url, key, {
        auth: { persistSession: true }
      });
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return cachedClient;
}

// Test connection by doing a light ping
export async function testSupabaseConnection(url, key) {
  try {
    const testClient = createClient(url.trim(), key.trim());
    const { error } = await testClient.from('carenest_settings').select('count', { count: 'exact', head: true });
    // Even if table doesn't exist yet, a 404 or empty response means connection succeeded
    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      return { success: false, message: error.message || 'Connection failed' };
    }
    return { success: true, message: 'Connected to Supabase successfully!' };
  } catch (err) {
    return { success: false, message: err.message || 'Network error connecting to Supabase.' };
  }
}

// Generates complete PostgreSQL schema SQL script for Supabase SQL Editor
export function generateSupabaseSchemaSQL() {
  return `-- ==========================================================
-- CareNest PostgreSQL Schema for Supabase
-- Run this in your Supabase Project -> SQL Editor
-- ==========================================================

-- 1. Patients Table
CREATE TABLE IF NOT EXISTS carenest_patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  preferred_name TEXT,
  age INTEGER,
  blood_group TEXT,
  phone TEXT,
  passcode TEXT DEFAULT '1234',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Medications Table
CREATE TABLE IF NOT EXISTS carenest_medications (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES carenest_patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  generic_name TEXT,
  dosage TEXT NOT NULL,
  form TEXT DEFAULT 'Tablet',
  frequency TEXT NOT NULL,
  time_slots JSONB DEFAULT '[]'::jsonb,
  timing_group TEXT,
  instructions TEXT,
  food_relation TEXT,
  pill_color TEXT,
  pill_color_name TEXT,
  pill_shape TEXT,
  prescribed_by TEXT,
  purpose TEXT,
  refill_remaining INTEGER DEFAULT 30,
  refill_total INTEGER DEFAULT 30,
  refill_threshold INTEGER DEFAULT 7,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Dose Logs Table (Tracks taken, pending, skipped)
CREATE TABLE IF NOT EXISTS carenest_dose_logs (
  id TEXT PRIMARY KEY,
  medication_id TEXT REFERENCES carenest_medications(id) ON DELETE CASCADE,
  patient_id TEXT REFERENCES carenest_patients(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  scheduled_time TEXT NOT NULL,
  status TEXT NOT NULL, -- 'taken', 'pending', 'skipped', 'missed'
  taken_at TIMESTAMP WITH TIME ZONE,
  logged_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Doctor Appointments Table
CREATE TABLE IF NOT EXISTS carenest_appointments (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES carenest_patients(id) ON DELETE CASCADE,
  doctor_name TEXT NOT NULL,
  specialty TEXT,
  hospital_or_clinic TEXT,
  address TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  phone TEXT,
  purpose TEXT,
  prep_instructions TEXT,
  status TEXT DEFAULT 'Upcoming',
  is_telehealth BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Care Notes / Family Journal Table
CREATE TABLE IF NOT EXISTS carenest_care_notes (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES carenest_patients(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_role TEXT,
  avatar TEXT,
  tag TEXT DEFAULT 'General',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS carenest_notifications (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES carenest_patients(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  urgent BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (optional for demo)
ALTER TABLE carenest_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE carenest_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE carenest_dose_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE carenest_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE carenest_care_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE carenest_notifications ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for demo access
CREATE POLICY "Public full access for carenest demo" ON carenest_patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for medications" ON carenest_medications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for dose logs" ON carenest_dose_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for appointments" ON carenest_appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for care notes" ON carenest_care_notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for notifications" ON carenest_notifications FOR ALL USING (true) WITH CHECK (true);
`;
}
