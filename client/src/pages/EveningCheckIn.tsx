import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

type Done = "yes" | "partial" | "no";

const DONE_OPTIONS: { value: Done; label: string; color: string }[] = [
  { value: "yes", label: "✅ Done", color: "border-green-500 bg-green-50 text-green-800" },
  { value: "partial", label: "⚡ Partial", color: "border-amber-500 bg-amber-50 text-amber-800" },
  { value: "no", label: "❌ Not done", color: "border-red-400 bg-red-50 text-red-800" },
];

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function EveningCheckIn() {
  const [, navigate] = useLocation();
  const today = getTodayStr();

  // Fetch today's morning priorities
  const { data: checkIn } = trpc.ascend.getTodayCheckIn.useQuery({ date: today });

  const [p1Done, setP1Done] = useState<Done>("no");
  const [p2Done, setP2Done] = useState<Done>("no");
  const [p3Done, setP3Done] = useState<Done>("no");
  const [win, setWin] = useState("");
  const [improve, setImprove] = useState("");
  const [prosperityNote, setProsperityNote] = useState("");
  const [promoteNote, setPromoteNote] = useState("");
  const [purposeNote, setPurposeNote] = useState("");
  const [peopleNote, setPeopleNote] = useState("");

  const saveEvening = trpc.ascend.saveEvening.useMutation({
    onSuccess: () => navigate("/dashboard"),
  });

  const canSubmit = win.trim().length > 0 && improve.trim().length > 0;

  const priorities = [
    { label: checkIn?.priority1 || "Priority #1", done: p1Done, setDone: setP1Done },
    { label: checkIn?.priority2 || "Priority #2", done: p2Done, setDone: setP2Done },
    { label: checkIn?.priority3 || "Priority #3", done: p3Done, setDone: setP3Done },
  ];

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">🌙</div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Evening Check-in
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <p className="text-sm text-muted-foreground mt-1">60 seconds. Honest reflection. Then rest.</p>
        </div>

        {/* Section 1: Priorities Review */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-5">
          <h2 className="font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            🎯 How did your priorities go?
          </h2>
          <p className="text-sm text-muted-foreground mb-5">Be honest. This is your mirror.</p>
          <div className="space-y-5">
            {priorities.map((p, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium text-foreground truncate">{p.label}</span>
                </div>
                <div className="flex gap-2">
                  {DONE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => p.setDone(opt.value)}
                      className={`flex-1 py-2 px-2 rounded-lg border-2 text-xs font-semibold transition-all ${
                        p.done === opt.value ? opt.color + " border-opacity-100" : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Win + Improve */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-5">
          <h2 className="font-bold text-lg mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            🏆 Reflect
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">
                What was your win today?
              </label>
              <Textarea
                value={win}
                onChange={e => setWin(e.target.value)}
                placeholder="Even a small win counts. What moved forward today?"
                className="min-h-[80px] resize-none bg-background border-border"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">
                What will you do differently tomorrow?
              </label>
              <Textarea
                value={improve}
                onChange={e => setImprove(e.target.value)}
                placeholder="One specific thing you'll change or improve..."
                className="min-h-[80px] resize-none bg-background border-border"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Pillar Notes (optional) */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            ✦ Pillar Notes <span className="text-muted-foreground font-normal text-sm">(optional)</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Log anything notable in your four pillars today. This feeds your Alignment score.
          </p>
          <div className="space-y-3">
            {[
              { icon: "💰", label: "Prosperity", val: prosperityNote, set: setProsperityNote, ph: "Financial activity today..." },
              { icon: "📈", label: "Promote", val: promoteNote, set: setPromoteNote, ph: "Business or promotional activity..." },
              { icon: "✝️", label: "Purpose", val: purposeNote, set: setPurposeNote, ph: "Spiritual or personal growth..." },
              { icon: "❤️", label: "People", val: peopleNote, set: setPeopleNote, ph: "Relationship or family moment..." },
            ].map(item => (
              <div key={item.label} className="flex gap-3 items-start">
                <span className="text-xl mt-2 flex-shrink-0">{item.icon}</span>
                <Textarea
                  value={item.val}
                  onChange={e => item.set(e.target.value)}
                  placeholder={item.ph}
                  className="min-h-[60px] resize-none bg-background border-border text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button
          size="lg"
          disabled={!canSubmit || saveEvening.isPending}
          onClick={() => saveEvening.mutate({
            date: today,
            priority1Done: p1Done,
            priority2Done: p2Done,
            priority3Done: p3Done,
            winOfTheDay: win,
            improveTomorrow: improve,
            prosperityNote,
            promoteNote,
            purposeNote,
            peopleNote,
          })}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 text-lg rounded-xl shadow-lg shadow-primary/20"
        >
          {saveEvening.isPending ? "Saving..." : "Complete My Day ✦"}
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
