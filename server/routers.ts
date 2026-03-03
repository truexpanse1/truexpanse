import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import {
  getAscendProfile,
  upsertAscendProfile,
  getTodayCheckIn,
  upsertCheckIn,
  getRecentScores,
  upsertAscendScore,
  getRecentCheckIns,
} from "./db";

// ---- Score calculation helper ----
function computeAscendScore(checkIn: {
  morningCompleted: boolean;
  eveningCompleted: boolean;
  priority1Done?: string | null;
  priority2Done?: string | null;
  priority3Done?: string | null;
  spiritualState?: string | null;
  financialAction?: string | null;
  prosperityNote?: string | null;
  promoteNote?: string | null;
  purposeNote?: string | null;
  peopleNote?: string | null;
}, streak: number) {
  // Momentum: consistency (streak + daily check-in completion)
  const morningPoints = checkIn.morningCompleted ? 40 : 0;
  const eveningPoints = checkIn.eveningCompleted ? 30 : 0;
  const streakBonus = Math.min(streak * 2, 30);
  const momentum = Math.min(morningPoints + eveningPoints + streakBonus, 100);

  // Trajectory: priorities done + financial action taken
  const doneMap: Record<string, number> = { yes: 33, partial: 17, no: 0 };
  const p1 = doneMap[checkIn.priority1Done ?? "no"] ?? 0;
  const p2 = doneMap[checkIn.priority2Done ?? "no"] ?? 0;
  const p3 = doneMap[checkIn.priority3Done ?? "no"] ?? 0;
  const finBonus = checkIn.financialAction ? 10 : 0;
  const trajectory = Math.min(p1 + p2 + p3 + finBonus, 100);

  // Alignment: spiritual check-in + pillar notes logged
  const spiritualPoints = checkIn.spiritualState ? 25 : 0;
  const pillarPoints = [
    checkIn.prosperityNote,
    checkIn.promoteNote,
    checkIn.purposeNote,
    checkIn.peopleNote,
  ].filter(Boolean).length * 18;
  const alignment = Math.min(spiritualPoints + pillarPoints, 100);

  // Composite (weighted)
  const ascendScore = Math.round(momentum * 0.35 + trajectory * 0.40 + alignment * 0.25);

  return {
    momentum: Math.round(momentum),
    trajectory: Math.round(trajectory),
    alignment: Math.round(alignment),
    ascendScore,
  };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  ascend: router({
    // Get or create the user's ASCEND profile
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      const profile = await getAscendProfile(ctx.user.id);
      return profile ?? null;
    }),

    // Save onboarding data
    saveOnboarding: protectedProcedure
      .input(z.object({
        whyStatement: z.string().min(1),
        ninetyDayGoal: z.string().min(1),
        pillars: z.object({
          prosperity: z.boolean(),
          promote: z.boolean(),
          purpose: z.boolean(),
          people: z.boolean(),
        }),
      }))
      .mutation(async ({ ctx, input }) => {
        return upsertAscendProfile({
          userId: ctx.user.id,
          whyStatement: input.whyStatement,
          ninetyDayGoal: input.ninetyDayGoal,
          pillars: input.pillars,
          onboardingCompleted: true,
        });
      }),

    // Get today's check-in
    getTodayCheckIn: protectedProcedure
      .input(z.object({ date: z.string() })) // YYYY-MM-DD
      .query(async ({ ctx, input }) => {
        return getTodayCheckIn(ctx.user.id, input.date) ?? null;
      }),

    // Save morning ritual
    saveMorning: protectedProcedure
      .input(z.object({
        date: z.string(),
        priority1: z.string(),
        priority2: z.string(),
        priority3: z.string(),
        financialAction: z.string(),
        financialNote: z.string().optional(),
        spiritualState: z.string(),
        morningIntention: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const checkIn = await upsertCheckIn({
          userId: ctx.user.id,
          checkInDate: input.date,
          morningCompleted: true,
          morningCompletedAt: new Date(),
          priority1: input.priority1,
          priority2: input.priority2,
          priority3: input.priority3,
          financialAction: input.financialAction,
          financialNote: input.financialNote,
          spiritualState: input.spiritualState,
          morningIntention: input.morningIntention,
        });

        // Update streak
        const profile = await getAscendProfile(ctx.user.id);
        const today = input.date;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split("T")[0];
        const streak = profile?.lastCheckInDate === yStr
          ? (profile?.currentStreak ?? 0) + 1
          : 1;

        await upsertAscendProfile({
          userId: ctx.user.id,
          currentStreak: streak,
          longestStreak: Math.max(streak, profile?.longestStreak ?? 0),
          lastCheckInDate: today,
        });

        return checkIn;
      }),

    // Save evening check-in
    saveEvening: protectedProcedure
      .input(z.object({
        date: z.string(),
        priority1Done: z.enum(["yes", "partial", "no"]),
        priority2Done: z.enum(["yes", "partial", "no"]),
        priority3Done: z.enum(["yes", "partial", "no"]),
        winOfTheDay: z.string(),
        improveTomorrow: z.string(),
        prosperityNote: z.string().optional(),
        promoteNote: z.string().optional(),
        purposeNote: z.string().optional(),
        peopleNote: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const checkIn = await upsertCheckIn({
          userId: ctx.user.id,
          checkInDate: input.date,
          eveningCompleted: true,
          eveningCompletedAt: new Date(),
          priority1Done: input.priority1Done,
          priority2Done: input.priority2Done,
          priority3Done: input.priority3Done,
          winOfTheDay: input.winOfTheDay,
          improveTomorrow: input.improveTomorrow,
          prosperityNote: input.prosperityNote,
          promoteNote: input.promoteNote,
          purposeNote: input.purposeNote,
          peopleNote: input.peopleNote,
        });

        // Compute and save score
        const profile = await getAscendProfile(ctx.user.id);
        const scores = computeAscendScore(checkIn, profile?.currentStreak ?? 0);
        await upsertAscendScore({
          userId: ctx.user.id,
          scoreDate: input.date,
          ...scores,
          morningCompleted: checkIn.morningCompleted,
          eveningCompleted: true,
        });

        return { checkIn, scores };
      }),

    // Get recent scores (for dashboard chart)
    getRecentScores: protectedProcedure
      .input(z.object({ days: z.number().default(30) }))
      .query(async ({ ctx, input }) => {
        return getRecentScores(ctx.user.id, input.days);
      }),

    // Get recent check-ins (for weekly report)
    getRecentCheckIns: protectedProcedure
      .input(z.object({ days: z.number().default(7) }))
      .query(async ({ ctx, input }) => {
        return getRecentCheckIns(ctx.user.id, input.days);
      }),

    // AI weekly insight
    getWeeklyInsight: protectedProcedure
      .input(z.object({
        scores: z.array(z.object({
          scoreDate: z.string(),
          ascendScore: z.number(),
          momentum: z.number(),
          trajectory: z.number(),
          alignment: z.number(),
        })),
        ninetyDayGoal: z.string().optional(),
        whyStatement: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const avgScore = input.scores.length > 0
          ? Math.round(input.scores.reduce((s, r) => s + r.ascendScore, 0) / input.scores.length)
          : 0;
        const trend = input.scores.length >= 2
          ? input.scores[0].ascendScore - input.scores[input.scores.length - 1].ascendScore
          : 0;

        const prompt = `You are a compassionate but honest life coach reviewing a client's weekly ASCEND data.

Their 90-day goal: "${input.ninetyDayGoal || "Not set"}"
Their Why: "${input.whyStatement || "Not set"}"

This week's scores (most recent first):
${input.scores.map(s => `- ${s.scoreDate}: ASCEND ${s.ascendScore} (Momentum ${s.momentum}, Trajectory ${s.trajectory}, Alignment ${s.alignment})`).join("\n")}

Average score this week: ${avgScore}
Score trend: ${trend > 0 ? `+${trend} (improving)` : trend < 0 ? `${trend} (declining)` : "flat"}

Write a 3-paragraph weekly insight:
1. Acknowledge what they did well this week (be specific about the scores)
2. Identify the one dimension (Momentum, Trajectory, or Alignment) that needs the most attention and why
3. Give one specific, actionable recommendation for next week that connects to their 90-day goal

Keep it warm, honest, and motivating. No fluff. Under 200 words total.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are a compassionate, direct life coach who gives honest, actionable feedback." },
            { role: "user", content: prompt },
          ],
        });

        return response.choices[0]?.message?.content ?? "Keep showing up. Every day counts.";
      }),
  }),
});

export type AppRouter = typeof appRouter;
