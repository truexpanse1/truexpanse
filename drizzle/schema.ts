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

// ============================================================
// ASCEND — Life Growth Operating System Tables
// ============================================================

/**
 * ASCEND user profile — stores onboarding data and pillar preferences
 */
export const ascendProfiles = pgTable("ascend_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),

  // Onboarding
  whyStatement: text("why_statement"),       // "I want to ASCEND because..."
  ninetyDayGoal: text("ninety_day_goal"),    // What they want to achieve in 90 days
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),

  // Pillar activation (which pillars the user tracks)
  pillars: json("pillars").$type<{
    prosperity: boolean;
    promote: boolean;
    purpose: boolean;
    people: boolean;
  }>().default({ prosperity: true, promote: true, purpose: true, people: true }),

  // Streak tracking
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastCheckInDate: text("last_check_in_date"), // YYYY-MM-DD

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AscendProfile = typeof ascendProfiles.$inferSelect;
export type InsertAscendProfile = typeof ascendProfiles.$inferInsert;

/**
 * ASCEND daily check-ins — morning ritual + evening reflection per day
 */
export const ascendCheckIns = pgTable("ascend_check_ins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  checkInDate: text("check_in_date").notNull(), // YYYY-MM-DD

  // Morning Ritual
  morningCompleted: boolean("morning_completed").default(false).notNull(),
  morningCompletedAt: timestamp("morning_completed_at"),
  priority1: text("priority_1"),
  priority2: text("priority_2"),
  priority3: text("priority_3"),
  financialAction: varchar("financial_action", { length: 50 }), // earn | invest | track | learn
  financialNote: text("financial_note"),
  spiritualState: varchar("spiritual_state", { length: 50 }), // grounded | neutral | need_support
  morningIntention: text("morning_intention"),

  // Evening Check-in
  eveningCompleted: boolean("evening_completed").default(false).notNull(),
  eveningCompletedAt: timestamp("evening_completed_at"),
  priority1Done: varchar("priority_1_done", { length: 20 }), // yes | partial | no
  priority2Done: varchar("priority_2_done", { length: 20 }),
  priority3Done: varchar("priority_3_done", { length: 20 }),
  winOfTheDay: text("win_of_the_day"),
  improveTomorrow: text("improve_tomorrow"),

  // Pillar activity logs (what they did in each pillar today)
  prosperityNote: text("prosperity_note"),
  promoteNote: text("promote_note"),
  purposeNote: text("purpose_note"),
  peopleNote: text("people_note"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AscendCheckIn = typeof ascendCheckIns.$inferSelect;
export type InsertAscendCheckIn = typeof ascendCheckIns.$inferInsert;

/**
 * ASCEND daily scores — computed after evening check-in
 */
export const ascendScores = pgTable("ascend_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  scoreDate: text("score_date").notNull(), // YYYY-MM-DD

  // Three dimensions (0-100 each)
  momentum: real("momentum").default(0).notNull(),    // Consistency / streak / check-in rate
  trajectory: real("trajectory").default(0).notNull(), // Numbers moving in right direction
  alignment: real("alignment").default(0).notNull(),   // Living according to stated values

  // Composite score
  ascendScore: real("ascend_score").default(0).notNull(), // Weighted average

  // Pillar sub-scores (0-100 each)
  prosperityScore: real("prosperity_score").default(0),
  promoteScore: real("promote_score").default(0),
  purposeScore: real("purpose_score").default(0),
  peopleScore: real("people_score").default(0),

  // Completion flags
  morningCompleted: boolean("morning_completed").default(false).notNull(),
  eveningCompleted: boolean("evening_completed").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AscendScore = typeof ascendScores.$inferSelect;
export type InsertAscendScore = typeof ascendScores.$inferInsert;
