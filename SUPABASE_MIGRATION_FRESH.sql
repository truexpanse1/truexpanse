-- AI Mentor Coach - FRESH Supabase Migration
-- This will DROP existing tables and recreate them with proper snake_case naming
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ixmwydjdxkmdcbrqgnna/sql/new

-- ============================================
-- DROP ALL EXISTING TABLES (in reverse order due to foreign keys)
-- ============================================
DROP TABLE IF EXISTS kpis CASCADE;
DROP TABLE IF EXISTS eod_reflections CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS daily_tasks CASCADE;
DROP TABLE IF EXISTS coaching_plans CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS influencers CASCADE;
DROP TABLE IF EXISTS domains CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop trigger and function if they exist
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  open_id VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  login_method VARCHAR(64),
  role VARCHAR(10) DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin')),
  
  -- User preferences and settings
  selected_domain_id INTEGER,
  selected_influencer_id INTEGER,
  onboarding_completed BOOLEAN DEFAULT FALSE NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  last_signed_in TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_users_open_id ON users(open_id);

-- ============================================
-- 2. DOMAINS TABLE
-- ============================================
CREATE TABLE domains (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  assessment_categories JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================
-- 3. INFLUENCERS TABLE
-- ============================================
CREATE TABLE influencers (
  id SERIAL PRIMARY KEY,
  domain_id INTEGER NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  title VARCHAR(200),
  bio TEXT,
  image_url TEXT,
  
  -- Coaching characteristics
  coaching_style TEXT,
  voice_characteristics JSONB,
  
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_influencers_domain ON influencers(domain_id);

-- ============================================
-- 4. ASSESSMENTS TABLE
-- ============================================
CREATE TABLE assessments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  domain_id INTEGER NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  influencer_id INTEGER NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
  
  -- Assessment data
  responses JSONB,
  scores JSONB,
  
  -- AI analysis
  ai_analysis TEXT,
  strengths JSONB,
  weaknesses JSONB,
  
  completed_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_assessments_user ON assessments(user_id);
CREATE INDEX idx_assessments_domain ON assessments(domain_id);

-- ============================================
-- 5. COACHING PLANS TABLE
-- ============================================
CREATE TABLE coaching_plans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  
  -- Goals
  short_term_goals JSONB,
  long_term_goals JSONB,
  
  -- AI insights and adjustments
  ai_insights TEXT,
  difficulty_level INTEGER DEFAULT 3 NOT NULL,
  
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_coaching_plans_user ON coaching_plans(user_id);
CREATE INDEX idx_coaching_plans_assessment ON coaching_plans(assessment_id);

-- ============================================
-- 6. DAILY TASKS TABLE
-- ============================================
CREATE TABLE daily_tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coaching_plan_id INTEGER REFERENCES coaching_plans(id) ON DELETE SET NULL,
  
  -- Task details
  title VARCHAR(500) NOT NULL,
  description TEXT,
  task_date TIMESTAMP NOT NULL,
  
  -- Task metadata
  ai_generated BOOLEAN DEFAULT FALSE NOT NULL,
  difficulty_level INTEGER DEFAULT 3 NOT NULL,
  estimated_minutes INTEGER,
  category VARCHAR(100),
  
  -- Completion tracking
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  completed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_daily_tasks_user ON daily_tasks(user_id);
CREATE INDEX idx_daily_tasks_date ON daily_tasks(task_date);
CREATE INDEX idx_daily_tasks_plan ON daily_tasks(coaching_plan_id);

-- ============================================
-- 7. USER PROGRESS TABLE
-- ============================================
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  
  -- Daily metrics
  tasks_completed INTEGER DEFAULT 0 NOT NULL,
  tasks_assigned INTEGER DEFAULT 0 NOT NULL,
  completion_rate REAL DEFAULT 0 NOT NULL,
  
  -- Behavioral patterns
  average_completion_time INTEGER,
  reflection_quality INTEGER,
  streak_days INTEGER DEFAULT 0 NOT NULL,
  
  -- AI adjustments
  ai_adjustments JSONB,
  
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  UNIQUE(user_id, date)
);

CREATE INDEX idx_user_progress_user_date ON user_progress(user_id, date);

-- ============================================
-- 8. EOD REFLECTIONS TABLE
-- ============================================
CREATE TABLE eod_reflections (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  
  -- Domain-specific responses
  responses JSONB,
  
  -- AI analysis
  ai_analysis TEXT,
  sentiment VARCHAR(50),
  key_insights JSONB,
  
  -- Next-day adjustments
  suggested_adjustments TEXT,
  
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_eod_reflections_user_date ON eod_reflections(user_id, date);

-- ============================================
-- 9. KPIS TABLE
-- ============================================
CREATE TABLE kpis (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  
  -- Domain-specific KPIs (stored as JSON for flexibility)
  metrics JSONB,
  
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_kpis_user ON kpis(user_id);
CREATE INDEX idx_kpis_date ON kpis(date);

-- ============================================
-- TRIGGER: Update updated_at on users table
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
