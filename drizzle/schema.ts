import { pgTable, serial, varchar, text, timestamp, json, boolean, integer, real } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("login_method", { length: 64 }),
  role: varchar("role", { length: 10 }).default("user").notNull(),
  
  // User preferences and settings
  selectedDomainId: integer("selected_domain_id"),
  selectedInfluencerId: integer("selected_influencer_id"),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Life domains (Business, Fitness, Biblical, Athletics, Relationships, Leadership)
 */
export const domains = pgTable("domains", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }), // lucide-react icon name
  assessmentCategories: json("assessment_categories").$type<string[]>(), // e.g., ["Mindset", "Sales Skills", "Business Strategy"]
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Domain = typeof domains.$inferSelect;
export type InsertDomain = typeof domains.$inferInsert;

/**
 * Influencer personas (Jesus, Jordan, Jobs, Goggins, etc.)
 */
export const influencers = pgTable("influencers", {
  id: serial("id").primaryKey(),
  domainId: integer("domain_id").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  title: varchar("title", { length: 200 }), // e.g., "6-time NBA Champion"
  bio: text("bio"),
  imageUrl: text("image_url"),
  
  // Coaching characteristics
  coachingStyle: text("coaching_style"), // Description of how they coach
  voiceCharacteristics: json("voice_characteristics").$type<{
    tone?: string;
    phrases?: string[];
    approach?: string;
  }>(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Influencer = typeof influencers.$inferSelect;
export type InsertInfluencer = typeof influencers.$inferInsert;

/**
 * User assessments - stores responses and scores
 */
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  domainId: integer("domain_id").notNull(),
  influencerId: integer("influencer_id").notNull(),
  
  // Assessment data
  responses: json("responses").$type<Record<string, any>>(), // Question ID -> Answer
  scores: json("scores").$type<{
    overall: number;
    categories: Record<string, number>;
  }>(),
  
  // AI analysis
  aiAnalysis: text("ai_analysis"),
  strengths: json("strengths").$type<string[]>(),
  weaknesses: json("weaknesses").$type<string[]>(),
  
  completedAt: timestamp("completed_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;

/**
 * AI-generated coaching plans (weekly)
 */
export const coachingPlans = pgTable("coaching_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  assessmentId: integer("assessment_id").notNull(),
  weekNumber: integer("week_number").notNull(), // Week number since start
  
  // Goals
  shortTermGoals: json("short_term_goals").$type<string[]>(),
  longTermGoals: json("long_term_goals").$type<string[]>(),
  
  // AI insights and adjustments
  aiInsights: text("ai_insights"),
  difficultyLevel: integer("difficulty_level").default(3).notNull(), // 1-5 scale
  
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CoachingPlan = typeof coachingPlans.$inferSelect;
export type InsertCoachingPlan = typeof coachingPlans.$inferInsert;

/**
 * Daily tasks (AI-generated and user-created)
 */
export const dailyTasks = pgTable("daily_tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  coachingPlanId: integer("coaching_plan_id"),
  
  // Task details
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  taskDate: timestamp("task_date").notNull(),
  
  // Task metadata
  aiGenerated: boolean("ai_generated").default(false).notNull(),
  difficultyLevel: integer("difficulty_level").default(3).notNull(),
  estimatedMinutes: integer("estimated_minutes"),
  category: varchar("category", { length: 100 }), // e.g., "Workout", "Prospecting", "Prayer"
  
  // Completion tracking
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DailyTask = typeof dailyTasks.$inferSelect;
export type InsertDailyTask = typeof dailyTasks.$inferInsert;

/**
 * User progress tracking for adaptive learning
 */
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").notNull(),
  
  // Daily metrics
  tasksCompleted: integer("tasks_completed").default(0).notNull(),
  tasksAssigned: integer("tasks_assigned").default(0).notNull(),
  completionRate: real("completion_rate").default(0).notNull(), // 0-1
  
  // Behavioral patterns
  averageCompletionTime: integer("average_completion_time"), // minutes
  reflectionQuality: integer("reflection_quality"), // 1-5 scale (AI-scored)
  streakDays: integer("streak_days").default(0).notNull(),
  
  // AI adjustments
  aiAdjustments: json("ai_adjustments").$type<{
    difficultyChange?: number;
    reasonsForChange?: string[];
    insights?: string[];
  }>(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

/**
 * End-of-day reflections
 */
export const eodReflections = pgTable("eod_reflections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").notNull(),
  
  // Domain-specific responses
  responses: json("responses").$type<Record<string, string>>(), // Question -> Answer
  
  // AI analysis
  aiAnalysis: text("ai_analysis"),
  sentiment: varchar("sentiment", { length: 50 }), // positive, neutral, negative
  keyInsights: json("key_insights").$type<string[]>(),
  
  // Next-day adjustments
  suggestedAdjustments: text("suggested_adjustments"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type EodReflection = typeof eodReflections.$inferSelect;
export type InsertEodReflection = typeof eodReflections.$inferInsert;

/**
 * KPI tracking
 */
export const kpis = pgTable("kpis", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").notNull(),
  
  // Domain-specific KPIs (stored as JSON for flexibility)
  metrics: json("metrics").$type<Record<string, number>>(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Kpi = typeof kpis.$inferSelect;
export type InsertKpi = typeof kpis.$inferInsert;
