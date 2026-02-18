import { eq, and, desc, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  domains,
  influencers,
  assessments,
  coachingPlans,
  dailyTasks,
  userProgress,
  eodReflections,
  kpis,
  type Domain,
  type Influencer,
  type Assessment,
  type CoachingPlan,
  type DailyTask,
  type UserProgress,
  type EodReflection,
  type Kpi,
  type InsertDomain,
  type InsertInfluencer,
  type InsertAssessment,
  type InsertCoachingPlan,
  type InsertDailyTask,
  type InsertUserProgress,
  type InsertEodReflection,
  type InsertKpi,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ===== USER MANAGEMENT =====

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserPreferences(userId: number, preferences: {
  selectedDomainId?: number;
  selectedInfluencerId?: number;
  onboardingCompleted?: boolean;
}) {
  const db = await getDb();
  if (!db) return;

  await db.update(users).set(preferences).where(eq(users.id, userId));
}

// ===== DOMAINS =====

export async function getAllDomains(): Promise<Domain[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(domains);
}

export async function getDomainById(id: number): Promise<Domain | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(domains).where(eq(domains.id, id)).limit(1);
  return result[0];
}

export async function createDomain(domain: InsertDomain): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(domains).values(domain);
  return Number((result as any).insertId);
}

// ===== INFLUENCERS =====

export async function getInfluencersByDomain(domainId: number): Promise<Influencer[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(influencers).where(eq(influencers.domainId, domainId));
}

export async function getInfluencerById(id: number): Promise<Influencer | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(influencers).where(eq(influencers.id, id)).limit(1);
  return result[0];
}

export async function createInfluencer(influencer: InsertInfluencer): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(influencers).values(influencer);
  return Number((result as any).insertId);
}

// ===== ASSESSMENTS =====

export async function createAssessment(assessment: InsertAssessment): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(assessments).values(assessment);
  return Number((result as any).insertId);
}

export async function getLatestAssessment(userId: number): Promise<Assessment | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(assessments)
    .where(eq(assessments.userId, userId))
    .orderBy(desc(assessments.completedAt))
    .limit(1);

  return result[0];
}

export async function getAssessmentById(id: number): Promise<Assessment | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(assessments).where(eq(assessments.id, id)).limit(1);
  return result[0];
}

// ===== COACHING PLANS =====

export async function createCoachingPlan(plan: InsertCoachingPlan): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(coachingPlans).values(plan);
  return Number((result as any).insertId);
}

export async function getCurrentCoachingPlan(userId: number): Promise<CoachingPlan | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const now = new Date();
  const result = await db
    .select()
    .from(coachingPlans)
    .where(
      and(
        eq(coachingPlans.userId, userId),
        lte(coachingPlans.startDate, now),
        gte(coachingPlans.endDate, now)
      )
    )
    .limit(1);

  return result[0];
}

// ===== DAILY TASKS =====

export async function createDailyTask(task: InsertDailyTask): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(dailyTasks).values(task);
  return Number((result as any).insertId);
}

export async function getTasksByDate(userId: number, date: Date): Promise<DailyTask[]> {
  const db = await getDb();
  if (!db) return [];

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return db
    .select()
    .from(dailyTasks)
    .where(
      and(
        eq(dailyTasks.userId, userId),
        gte(dailyTasks.taskDate, startOfDay),
        lte(dailyTasks.taskDate, endOfDay)
      )
    );
}

export async function completeTask(taskId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db
    .update(dailyTasks)
    .set({ completed: true, completedAt: new Date() })
    .where(eq(dailyTasks.id, taskId));
}

export async function uncompleteTask(taskId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db
    .update(dailyTasks)
    .set({ completed: false, completedAt: null })
    .where(eq(dailyTasks.id, taskId));
}

// ===== USER PROGRESS =====

export async function createOrUpdateProgress(progress: InsertUserProgress): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(userProgress).values(progress).onDuplicateKeyUpdate({
    set: progress,
  });
}

export async function getProgressByDate(userId: number, date: Date): Promise<UserProgress | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const result = await db
    .select()
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, userId),
        gte(userProgress.date, startOfDay),
        lte(userProgress.date, endOfDay)
      )
    )
    .limit(1);

  return result[0];
}

export async function getProgressHistory(userId: number, days: number = 30): Promise<UserProgress[]> {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), gte(userProgress.date, startDate)))
    .orderBy(desc(userProgress.date));
}

// ===== EOD REFLECTIONS =====

export async function createEodReflection(reflection: InsertEodReflection): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(eodReflections).values(reflection);
  return Number((result as any).insertId);
}

export async function getReflectionByDate(userId: number, date: Date): Promise<EodReflection | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const result = await db
    .select()
    .from(eodReflections)
    .where(
      and(
        eq(eodReflections.userId, userId),
        gte(eodReflections.date, startOfDay),
        lte(eodReflections.date, endOfDay)
      )
    )
    .limit(1);

  return result[0];
}

// ===== KPIs =====

export async function createOrUpdateKpi(kpi: InsertKpi): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(kpis).values(kpi).onDuplicateKeyUpdate({
    set: kpi,
  });
}

export async function getKpisByDateRange(
  userId: number,
  startDate: Date,
  endDate: Date
): Promise<Kpi[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(kpis)
    .where(
      and(
        eq(kpis.userId, userId),
        gte(kpis.date, startDate),
        lte(kpis.date, endDate)
      )
    )
    .orderBy(desc(kpis.date));
}
