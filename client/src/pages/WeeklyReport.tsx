import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function getWeekDates() {
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

export default function WeeklyReport() {
  const [, navigate] = useLocation();
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const weekDates = useMemo(() => getWeekDates(), []);

  const { data: profile } = trpc.ascend.getProfile.useQuery();
  const { data: recentScores } = trpc.ascend.getRecentScores.useQuery({ days: 30 });
  const { data: recentCheckIns } = trpc.ascend.getRecentCheckIns.useQuery({ days: 7 });

  const getWeeklyInsight = trpc.ascend.getWeeklyInsight.useMutation({
    onSuccess: (data) => setAiInsight(data),
  });

  // Last 7 days scores
  const weekScores = useMemo(() => {
    if (!recentScores) return [];
    return weekDates.map(date => recentScores.find(s => s.scoreDate === date) ?? null);
  }, [recentScores, weekDates]);

  const validScores = weekScores.filter(Boolean) as NonNullable<typeof weekScores[0]>[];
  const avgScore = validScores.length > 0
    ? Math.round(validScores.reduce((s, r) => s + r!.ascendScore, 0) / validScores.length)
    : 0;
  const avgMomentum = validScores.length > 0
    ? Math.round(validScores.reduce((s, r) => s + r!.momentum, 0) / validScores.length)
    : 0;
  const avgTrajectory = validScores.length > 0
    ? Math.round(validScores.reduce((s, r) => s + r!.trajectory, 0) / validScores.length)
    : 0;
  const avgAlignment = validScores.length > 0
    ? Math.round(validScores.reduce((s, r) => s + r!.alignment, 0) / validScores.length)
    : 0;

  const daysCompleted = weekScores.filter(s => s?.morningCompleted && s?.eveningCompleted).length;

  // 90-day projection
  const last30Scores = recentScores?.slice(0, 30) ?? [];
  const projectedScore = last30Scores.length >= 7
    ? Math.min(100, Math.round(avgScore * 1.15)) // Simple projection: 15% improvement if consistent
    : null;

  const checkInsMap = useMemo(() => {
    const map: Record<string, typeof recentCheckIns extends (infer T)[] | undefined ? T : never> = {};
    recentCheckIns?.forEach(c => { if (c) map[c.checkInDate] = c; });
    return map;
  }, [recentCheckIns]);

  const handleGetInsight = () => {
    if (!validScores.length) return;
    getWeeklyInsight.mutate({
      scores: validScores.map(s => ({
        scoreDate: s!.scoreDate,
        ascendScore: s!.ascendScore,
        momentum: s!.momentum,
        trajectory: s!.trajectory,
        alignment: s!.alignment,
      })),
      ninetyDayGoal: profile?.ninetyDayGoal ?? undefined,
      whyStatement: profile?.whyStatement ?? undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Weekly Report</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(weekDates[0]).toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
              {new Date(weekDates[6]).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-5">
          <h2 className="font-bold text-lg mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Week at a Glance
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-background rounded-xl p-4 text-center border border-border">
              <div className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#f59e0b" }}>
                {avgScore}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Avg ASCEND Score</div>
            </div>
            <div className="bg-background rounded-xl p-4 text-center border border-border">
              <div className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#22c55e" }}>
                {daysCompleted}/7
              </div>
              <div className="text-xs text-muted-foreground mt-1">Full Days Completed</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "⚡ Momentum", value: avgMomentum, color: "#3b82f6" },
              { label: "📈 Trajectory", value: avgTrajectory, color: "#f59e0b" },
              { label: "✦ Alignment", value: avgAlignment, color: "#8b5cf6" },
            ].map(item => (
              <div key={item.label} className="bg-background rounded-xl p-3 text-center border border-border">
                <div className="text-xl font-bold" style={{ color: item.color }}>{item.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily breakdown */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-5">
          <h2 className="font-bold text-lg mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Daily Breakdown
          </h2>
          <div className="space-y-2">
            {weekDates.map((date, i) => {
              const score = weekScores[i];
              const checkIn = checkInsMap[date];
              const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" });
              const dayNum = new Date(date).getDate();
              const isToday = date === getTodayStr();
              const isFuture = date > getTodayStr();

              return (
                <div key={date} className={`flex items-center gap-3 p-3 rounded-xl ${isToday ? "bg-primary/5 border border-primary/20" : "bg-background border border-border"}`}>
                  <div className="w-10 text-center flex-shrink-0">
                    <div className="text-xs text-muted-foreground">{dayName}</div>
                    <div className="font-bold text-sm">{dayNum}</div>
                  </div>
                  {isFuture ? (
                    <div className="flex-1 text-xs text-muted-foreground italic">Future</div>
                  ) : score ? (
                    <>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 bg-border rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-amber-500" style={{ width: `${score.ascendScore}%` }} />
                          </div>
                          <span className="text-sm font-bold text-foreground w-8 text-right">{score.ascendScore}</span>
                        </div>
                        {checkIn?.winOfTheDay && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">🏆 {checkIn.winOfTheDay}</p>
                        )}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <span title="Morning">{score.morningCompleted ? "🌅" : "⬜"}</span>
                        <span title="Evening">{score.eveningCompleted ? "🌙" : "⬜"}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 text-xs text-muted-foreground italic">
                      {isToday ? "Complete today's rituals" : "No check-in"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 90-Day Projection */}
        {projectedScore !== null && (
          <div className="bg-card border border-border rounded-2xl p-5 mb-5">
            <h2 className="font-bold text-lg mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              🔮 90-Day Projection
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">{avgScore}</div>
                <div className="text-xs text-muted-foreground">Current avg</div>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-1 bg-border rounded-full" />
                <span className="text-lg">→</span>
                <div className="flex-1 h-1 bg-primary/30 rounded-full" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{projectedScore}</div>
                <div className="text-xs text-muted-foreground">In 90 days</div>
              </div>
            </div>
            {profile?.ninetyDayGoal && (
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed border-t border-border pt-3">
                🎯 Goal: "{profile.ninetyDayGoal}"
              </p>
            )}
          </div>
        )}

        {/* AI Insight */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-8">
          <h2 className="font-bold text-lg mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            🤖 AI Coach Insight
          </h2>
          {aiInsight ? (
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {aiInsight}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Get a personalized coaching insight based on your week's data — what you did well, where to focus, and one specific action for next week.
              </p>
              <Button
                onClick={handleGetInsight}
                disabled={getWeeklyInsight.isPending || validScores.length === 0}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-5"
              >
                {getWeeklyInsight.isPending
                  ? "Generating insight..."
                  : validScores.length === 0
                  ? "Complete check-ins to unlock"
                  : "✨ Generate My Weekly Insight"}
              </Button>
            </>
          )}
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}
