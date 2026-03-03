import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

const PILLARS = [
  { key: "prosperity", icon: "💰", name: "Prosperity", desc: "Earn, invest, and build recurring income" },
  { key: "promote", icon: "📈", name: "Promote", desc: "Grow your business with the Promoter Blueprint" },
  { key: "purpose", icon: "✝️", name: "Purpose", desc: "Faith, intention, and daily spiritual alignment" },
  { key: "people", icon: "❤️", name: "People", desc: "Family, relationships, and meaningful connections" },
] as const;

type PillarKey = "prosperity" | "promote" | "purpose" | "people";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [why, setWhy] = useState("");
  const [goal, setGoal] = useState("");
  const [pillars, setPillars] = useState<Record<PillarKey, boolean>>({
    prosperity: true,
    promote: true,
    purpose: true,
    people: true,
  });

  const [, navigate] = useLocation();
  const saveOnboarding = trpc.ascend.saveOnboarding.useMutation({
    onSuccess: () => navigate("/dashboard"),
  });

  const togglePillar = (key: PillarKey) => {
    const active = Object.values(pillars).filter(Boolean).length;
    if (pillars[key] && active <= 2) return; // Keep at least 2
    setPillars(p => ({ ...p, [key]: !p[key] }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>A</span>
        </div>
        <span className="font-bold text-2xl tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>ASCEND</span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-10">
        {[1, 2, 3].map(i => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i === step ? "bg-primary w-8" : i < step ? "bg-primary/60" : "bg-border"}`} />
        ))}
      </div>

      {/* Step 1: Why */}
      {step === 1 && (
        <div className="w-full max-w-lg text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Why do you want to ASCEND?
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            This is your anchor. When things get hard, your <em>why</em> is what keeps you moving.
          </p>
          <Textarea
            value={why}
            onChange={e => setWhy(e.target.value)}
            placeholder="I want to ASCEND because..."
            className="min-h-[140px] text-base resize-none mb-6 bg-card border-border"
          />
          <Button
            size="lg"
            disabled={why.trim().length < 10}
            onClick={() => setStep(2)}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 text-lg rounded-xl"
          >
            Continue →
          </Button>
        </div>
      )}

      {/* Step 2: 90-Day Goal */}
      {step === 2 && (
        <div className="w-full max-w-lg text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            What do you want in 90 days?
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Be specific. Not "be healthier" — but "lose 15 pounds" or "close 3 new clients." Numbers don't lie.
          </p>
          <Textarea
            value={goal}
            onChange={e => setGoal(e.target.value)}
            placeholder="In 90 days, I will have..."
            className="min-h-[140px] text-base resize-none mb-6 bg-card border-border"
          />
          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={() => setStep(1)} className="flex-1 py-6 rounded-xl">
              ← Back
            </Button>
            <Button
              size="lg"
              disabled={goal.trim().length < 10}
              onClick={() => setStep(3)}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 text-lg rounded-xl"
            >
              Continue →
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Pillars */}
      {step === 3 && (
        <div className="w-full max-w-lg text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Choose your pillars
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            These are the areas of life you'll track. You can always adjust later.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {PILLARS.map(p => (
              <button
                key={p.key}
                onClick={() => togglePillar(p.key)}
                className={`rounded-2xl p-5 border-2 text-left transition-all ${
                  pillars[p.key]
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">{p.icon}</div>
                <div className="font-bold text-sm mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{p.name}</div>
                <div className="text-xs text-muted-foreground leading-snug">{p.desc}</div>
                {pillars[p.key] && (
                  <div className="mt-2 text-xs text-primary font-semibold">✓ Active</div>
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={() => setStep(2)} className="flex-1 py-6 rounded-xl">
              ← Back
            </Button>
            <Button
              size="lg"
              disabled={saveOnboarding.isPending}
              onClick={() => saveOnboarding.mutate({ whyStatement: why, ninetyDayGoal: goal, pillars })}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 text-lg rounded-xl"
            >
              {saveOnboarding.isPending ? "Saving..." : "Begin My Ascent ✦"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
