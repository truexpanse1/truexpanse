import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, boolean, float } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // User preferences and settings
  selectedDomainId: int("selectedDomainId"),
  selectedInfluencerId: int("selectedInfluencerId"),
  onboardingCompleted: boolean("onboardingCompleted").default(false).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Life domains (Business, Fitness, Biblical, Athletics, Relationships, Leadership)
 */
export const domains = mysqlTable("domains", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }), // lucide-react icon name
  assessmentCategories: json("assessmentCategories").$type<string[]>(), // e.g., ["Mindset", "Sales Skills", "Business Strategy"]
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Domain = typeof domains.$inferSelect;
export type InsertDomain = typeof domains.$inferInsert;

/**
 * Influencer personas (Jesus, Jordan, Jobs, Goggins, etc.)
 */
export const influencers = mysqlTable("influencers", {
  id: int("id").autoincrement().primaryKey(),
  domainId: int("domainId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  title: varchar("title", { length: 200 }), // e.g., "6-time NBA Champion"
  bio: text("bio"),
  imageUrl: text("imageUrl"),
  
  // Coaching characteristics
  coachingStyle: text("coachingStyle"), // Description of how they coach
  voiceCharacteristics: json("voiceCharacteristics").$type<{
    tone?: string;
    phrases?: string[];
    approach?: string;
  }>(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Influencer = typeof influencers.$inferSelect;
export type InsertInfluencer = typeof influencers.$inferInsert;

/**
 * User assessments - stores responses and scores
 */
export const assessments = mysqlTable("assessments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  domainId: int("domainId").notNull(),
  influencerId: int("influencerId").notNull(),
  
  // Assessment data
  responses: json("responses").$type<Record<string, any>>(), // Question ID -> Answer
  scores: json("scores").$type<{
    overall: number;
    categories: Record<string, number>;
  }>(),
  
  // AI analysis
  aiAnalysis: text("aiAnalysis"),
  strengths: json("strengths").$type<string[]>(),
  weaknesses: json("weaknesses").$type<string[]>(),
  
  completedAt: timestamp("completedAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;

/**
 * AI-generated coaching plans (weekly)
 */
export const coachingPlans = mysqlTable("coachingPlans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  assessmentId: int("assessmentId").notNull(),
  weekNumber: int("weekNumber").notNull(), // Week number since start
  
  // Goals
  shortTermGoals: json("shortTermGoals").$type<string[]>(),
  longTermGoals: json("longTermGoals").$type<string[]>(),
  
  // AI insights and adjustments
  aiInsights: text("aiInsights"),
  difficultyLevel: int("difficultyLevel").default(3).notNull(), // 1-5 scale
  
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CoachingPlan = typeof coachingPlans.$inferSelect;
export type InsertCoachingPlan = typeof coachingPlans.$inferInsert;

/**
 * Daily tasks (AI-generated and user-created)
 */
export const dailyTasks = mysqlTable("dailyTasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  coachingPlanId: int("coachingPlanId"),
  
  // Task details
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  taskDate: timestamp("taskDate").notNull(),
  
  // Task metadata
  aiGenerated: boolean("aiGenerated").default(false).notNull(),
  difficultyLevel: int("difficultyLevel").default(3).notNull(),
  estimatedMinutes: int("estimatedMinutes"),
  category: varchar("category", { length: 100 }), // e.g., "Workout", "Prospecting", "Prayer"
  
  // Completion tracking
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyTask = typeof dailyTasks.$inferSelect;
export type InsertDailyTask = typeof dailyTasks.$inferInsert;

/**
 * User progress tracking for adaptive learning
 */
export const userProgress = mysqlTable("userProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: timestamp("date").notNull(),
  
  // Daily metrics
  tasksCompleted: int("tasksCompleted").default(0).notNull(),
  tasksAssigned: int("tasksAssigned").default(0).notNull(),
  completionRate: float("completionRate").default(0).notNull(), // 0-1
  
  // Behavioral patterns
  averageCompletionTime: int("averageCompletionTime"), // minutes
  reflectionQuality: int("reflectionQuality"), // 1-5 scale (AI-scored)
  streakDays: int("streakDays").default(0).notNull(),
  
  // AI adjustments
  aiAdjustments: json("aiAdjustments").$type<{
    difficultyChange?: number;
    reasonsForChange?: string[];
    insights?: string[];
  }>(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

/**
 * End-of-day reflections
 */
export const eodReflections = mysqlTable("eodReflections", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: timestamp("date").notNull(),
  
  // Domain-specific responses
  responses: json("responses").$type<Record<string, string>>(), // Question -> Answer
  
  // AI analysis
  aiAnalysis: text("aiAnalysis"),
  sentiment: varchar("sentiment", { length: 50 }), // positive, neutral, negative
  keyInsights: json("keyInsights").$type<string[]>(),
  
  // Next-day adjustments
  suggestedAdjustments: text("suggestedAdjustments"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EodReflection = typeof eodReflections.$inferSelect;
export type InsertEodReflection = typeof eodReflections.$inferInsert;

/**
 * KPI tracking
 */
export const kpis = mysqlTable("kpis", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: timestamp("date").notNull(),
  
  // Domain-specific KPIs (stored as JSON for flexibility)
  metrics: json("metrics").$type<Record<string, number>>(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Kpi = typeof kpis.$inferSelect;
export type InsertKpi = typeof kpis.$inferInsert;
