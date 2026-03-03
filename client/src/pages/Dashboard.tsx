import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function ScoreRing({ value, label, color, icon }: { value: number; label: string; color: string; icon: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-border" />
          <circle
            cx="48" cy="48" r={radius} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl">{icon}</span>
          <span className="text-lg font-bold text-foreground leading-none">{value}</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
  );
}

function ScoreBar({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const today = useMemo(() => getTodayStr(), []);

  const { data: profile } = trpc.ascend.getProfile.useQuery();
  const { data: todayCheckIn } = trpc.ascend.getTodayCheckIn.useQuery({ date: today });
  const { data: recentScores } = trpc.ascend.getRecentScores.useQuery({ days: 30 });

  // Redirect to onboarding if no profile
  if (profile === null) {
    navigate("/onboarding");
    return null;
  }

  const latestScore = recentScores?.[0];
  const ascendScore = latestScore?.ascendScore ?? 0;
  const momentum = latestScore?.momentum ?? 0;
  const trajectory = latestScore?.trajectory ?? 0;
  const alignment = latestScore?.alignment ?? 0;

  const streak = profile?.currentStreak ?? 0;
  const morningDone = todayCheckIn?.morningCompleted ?? false;
  const eveningDone = todayCheckIn?.eveningCompleted ?? false;

  const getScoreLabel = (score: number) => {
    if (score >= 85) return { label: "Ascending", color: "#22c55e" };
    if (score >= 65) return { label: "Building", color: "#f59e0b" };
    if (score >= 40) return { label: "Steady", color: "#3b82f6" };
    return { label: "Starting", color: "#94a3b8" };
  };

  const scoreInfo = getScoreLabel(ascendScore);

  // 30-day chart data
  const chartData = (recentScores ?? []).slice(0, 14).reverse();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>A</span>
            </div>
            <span className="font-bold text-lg tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>ASCEND</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.name}</span>
            <Button variant="ghost" size="sm" onClick={() => navigate("/weekly")} className="text-xs">
              📊 Weekly
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Date + Greeting */}
        <div>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-2xl font-bold mt-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>
            {streak > 0 ? `Day ${streak} of your ascent` : "Begin your ascent"}
          </h1>
        </div>

        {/* ASCEND Score Hero */}
        <div className="bg-card border border-border rounded-2xl p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2">Your ASCEND Score</p>
          <div className="relative inline-block mb-3">
            <div className="text-7xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: scoreInfo.color }}>
              {ascendScore}
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold mb-5"
            style={{ backgroundColor: scoreInfo.color + "20", color: scoreInfo.color }}>
            ✦ {scoreInfo.label}
          </div>

          {/* Three rings */}
          <div className="flex justify-around mt-2">
            <ScoreRing value={momentum} label="Momentum" color="#3b82f6" icon="⚡" />
            <ScoreRing value={trajectory} label="Trajectory" color="#f59e0b" icon="📈" />
            <ScoreRing value={alignment} label="Alignment" color="#8b5cf6" icon="✦" />
          </div>
        </div>

        {/* Score breakdown */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Score Breakdown</h2>
          <ScoreBar value={momentum} label="⚡ Momentum — Are you showing up?" color="#3b82f6" />
          <ScoreBar value={trajectory} label="📈 Trajectory — Are your numbers moving?" color="#f59e0b" />
          <ScoreBar value={alignment} label="✦ Alignment — Are you living your values?" color="#8b5cf6" />
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            Complete your morning ritual and evening check-in daily to keep all three dimensions rising.
          </p>
        </div>

        {/* Today's Actions */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Today's Rituals</h2>
          <div className="space-y-3">
            <button
              onClick={() => !morningDone && navigate("/morning")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                morningDone
                  ? "border-green-500/30 bg-green-50/50 dark:bg-green-950/20"
                  : "border-primary/40 bg-primary/5 hover:bg-primary/10"
              }`}
            >
              <span className="text-2xl">{morningDone ? "✅" : "🌅"}</span>
              <div className="flex-1">
                <div className="font-semibold text-sm">{morningDone ? "Morning Ritual Complete" : "Morning Ritual"}</div>
                <div className="text-xs text-muted-foreground">
                  {morningDone
                    ? `Priorities set: ${todayCheckIn?.priority1 || "—"}`
                    : "Set your 3 priorities, financial action & spiritual check-in"}
                </div>
              </div>
              {!morningDone && <span className="text-primary font-bold text-lg">→</span>}
            </button>

            <button
              onClick={() => !eveningDone && navigate("/evening")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                eveningDone
                  ? "border-green-500/30 bg-green-50/50 dark:bg-green-950/20"
                  : morningDone
                  ? "border-border hover:bg-muted/30"
                  : "border-border opacity-50 cursor-not-allowed"
              }`}
            >
              <span className="text-2xl">{eveningDone ? "✅" : "🌙"}</span>
              <div className="flex-1">
                <div className="font-semibold text-sm">{eveningDone ? "Evening Check-in Complete" : "Evening Check-in"}</div>
                <div className="text-xs text-muted-foreground">
                  {eveningDone
                    ? `Win: ${todayCheckIn?.winOfTheDay || "—"}`
                    : morningDone
                    ? "Review your priorities and log your wins"
                    : "Complete your morning ritual first"}
                </div>
              </div>
              {!eveningDone && morningDone && <span className="text-muted-foreground font-bold text-lg">→</span>}
            </button>
          </div>
        </div>

        {/* 14-day trend */}
        {chartData.length > 1 && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              14-Day Trend
            </h2>
            <div className="flex items-end gap-1 h-20">
              {chartData.map((d, i) => {
                const height = Math.max((d.ascendScore / 100) * 80, 4);
                const isLatest = i === chartData.length - 1;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-sm transition-all"
                      style={{
                        height: `${height}px`,
                        backgroundColor: isLatest ? "#f59e0b" : "#3b82f6",
                        opacity: isLatest ? 1 : 0.5 + (i / chartData.length) * 0.5,
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{chartData[0]?.scoreDate?.slice(5) ?? ""}</span>
              <span>Today</span>
            </div>
          </div>
        )}

        {/* 90-day goal */}
        {profile?.ninetyDayGoal && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h2 className="font-bold text-sm mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Your 90-Day Goal
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">"{profile.ninetyDayGoal}"</p>
              </div>
            </div>
          </div>
        )}

        {/* Streak */}
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="text-4xl">🔥</div>
          <div>
            <div className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              {streak} day{streak !== 1 ? "s" : ""}
            </div>
            <div className="text-sm text-muted-foreground">
              {streak === 0
                ? "Start your streak today"
                : streak === 1
                ? "You've started. Don't stop."
                : streak < 7
                ? "Building momentum. Keep going."
                : streak < 30
                ? "You're in the rhythm. This is where it compounds."
                : "You're in rare company. This is who you are now."}
            </div>
          </div>
          {profile?.longestStreak && profile.longestStreak > streak && (
            <div className="ml-auto text-right">
              <div className="text-xs text-muted-foreground">Best</div>
              <div className="font-bold text-sm">{profile.longestStreak}d</div>
            </div>
          )}
        </div>

        {/* Weekly report CTA */}
        <Button
          variant="outline"
          className="w-full py-5 rounded-xl border-border"
          onClick={() => navigate("/weekly")}
        >
          📊 View Weekly Report & AI Insight
        </Button>

        {/* Bottom padding */}
        <div className="h-6" />
      </div>
    </div>
  );
}
