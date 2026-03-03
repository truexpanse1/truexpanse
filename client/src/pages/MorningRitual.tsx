import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

const FINANCIAL_ACTIONS = [
  { value: "earn", label: "💵 Earn", desc: "Make a sale, close a deal, invoice a client" },
  { value: "invest", label: "📈 Invest", desc: "Put money into an asset or opportunity" },
  { value: "track", label: "📊 Track", desc: "Review finances, update budget, log income" },
  { value: "learn", label: "📚 Learn", desc: "Study a financial concept or strategy" },
];

const SPIRITUAL_STATES = [
  { value: "grounded", label: "🙏 Grounded", desc: "Centered, at peace, ready" },
  { value: "neutral", label: "😐 Neutral", desc: "Present but not fully charged" },
  { value: "need_support", label: "🤲 Need Support", desc: "Struggling, need prayer or reflection" },
];

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function MorningRitual() {
  const [, navigate] = useLocation();
  const today = getTodayStr();

  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  const [finAction, setFinAction] = useState("");
  const [finNote, setFinNote] = useState("");
  const [spiritual, setSpiritual] = useState("");
  const [intention, setIntention] = useState("");

  const saveMorning = trpc.ascend.saveMorning.useMutation({
    onSuccess: () => navigate("/dashboard"),
  });

  const canSubmit = p1.trim() && p2.trim() && p3.trim() && finAction && spiritual;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">🌅</div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {getGreeting()}
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Your morning ritual takes about 5 minutes.</p>
        </div>

        {/* Section 1: Three Priorities */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-5">
          <h2 className="font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            🎯 Your 3 Priorities Today
          </h2>
          <p className="text-sm text-muted-foreground mb-4">What are the three things that will move the needle most today?</p>
          <div className="space-y-3">
            {[
              { val: p1, set: setP1, label: "Priority #1 (most important)" },
              { val: p2, set: setP2, label: "Priority #2" },
              { val: p3, set: setP3, label: "Priority #3" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <Input
                  value={item.val}
                  onChange={e => item.set(e.target.value)}
                  placeholder={item.label}
                  className="bg-background border-border"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Financial Action */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-5">
          <h2 className="font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            💰 Financial Action
          </h2>
          <p className="text-sm text-muted-foreground mb-4">What financial move will you make today?</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {FINANCIAL_ACTIONS.map(a => (
              <button
                key={a.value}
                onClick={() => setFinAction(a.value)}
                className={`rounded-xl p-3 border-2 text-left transition-all ${
                  finAction === a.value ? "border-primary bg-primary/5" : "border-border bg-background"
                }`}
              >
                <div className="font-semibold text-sm mb-0.5">{a.label}</div>
                <div className="text-xs text-muted-foreground leading-snug">{a.desc}</div>
              </button>
            ))}
          </div>
          {finAction && (
            <Input
              value={finNote}
              onChange={e => setFinNote(e.target.value)}
              placeholder="Briefly describe your financial action today..."
              className="bg-background border-border"
            />
          )}
        </div>

        {/* Section 3: Spiritual State */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-5">
          <h2 className="font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            ✝️ Spiritual Check-in
          </h2>
          <p className="text-sm text-muted-foreground mb-4">How are you showing up spiritually today?</p>
          <div className="space-y-3">
            {SPIRITUAL_STATES.map(s => (
              <button
                key={s.value}
                onClick={() => setSpiritual(s.value)}
                className={`w-full rounded-xl p-4 border-2 text-left transition-all flex items-center gap-3 ${
                  spiritual === s.value ? "border-primary bg-primary/5" : "border-border bg-background"
                }`}
              >
                <span className="text-2xl">{s.label.split(" ")[0]}</span>
                <div>
                  <div className="font-semibold text-sm">{s.label.split(" ").slice(1).join(" ")}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </div>
                {spiritual === s.value && <span className="ml-auto text-primary font-bold">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Intention (optional) */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            ✦ Morning Intention <span className="text-muted-foreground font-normal text-sm">(optional)</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-4">One sentence. How do you want to show up today?</p>
          <Textarea
            value={intention}
            onChange={e => setIntention(e.target.value)}
            placeholder="Today I will show up as..."
            className="min-h-[80px] resize-none bg-background border-border"
          />
        </div>

        {/* Submit */}
        <Button
          size="lg"
          disabled={!canSubmit || saveMorning.isPending}
          onClick={() => saveMorning.mutate({
            date: today,
            priority1: p1,
            priority2: p2,
            priority3: p3,
            financialAction: finAction,
            financialNote: finNote,
            spiritualState: spiritual,
            morningIntention: intention,
          })}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 text-lg rounded-xl shadow-lg shadow-primary/20"
        >
          {saveMorning.isPending ? "Saving..." : "Start My Day ✦"}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          <button onClick={() => navigate("/dashboard")} className="underline underline-offset-2">
            Skip for now
          </button>
        </p>
      </div>
    </div>
  );
}
