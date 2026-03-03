import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

const pillars = [
  {
    icon: "💰",
    name: "Prosperity",
    color: "bg-amber-50 border-amber-200",
    textColor: "text-amber-800",
    description: "Track what you earn, invest, and build toward recurring income.",
  },
  {
    icon: "📈",
    name: "Promote",
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-800",
    description: "Execute the Promoter Blueprint — Traffic, Holding Pattern, Selling Event.",
  },
  {
    icon: "✝️",
    name: "Purpose",
    color: "bg-purple-50 border-purple-200",
    textColor: "text-purple-800",
    description: "Stay grounded in what matters most — faith, intention, and daily alignment.",
  },
  {
    icon: "❤️",
    name: "People",
    color: "bg-rose-50 border-rose-200",
    textColor: "text-rose-800",
    description: "Invest in the relationships that make success worth having.",
  },
];

const dimensions = [
  {
    name: "Momentum",
    color: "text-blue-600",
    ring: "border-blue-400",
    icon: "🔵",
    description: "Are you showing up consistently? Your streak and daily completion rate.",
  },
  {
    name: "Trajectory",
    color: "text-green-600",
    ring: "border-green-400",
    icon: "🟢",
    description: "Are your numbers moving in the right direction week over week?",
  },
  {
    name: "Alignment",
    color: "text-purple-600",
    ring: "border-purple-400",
    icon: "🟣",
    description: "Are you living according to what you said matters most?",
  },
];

export default function Home() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading ASCEND...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>A</span>
            </div>
            <span className="font-bold text-lg tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>ASCEND</span>
          </div>
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            <span>✦</span>
            <span>Your Daily Growth Operating System</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Build the Life<br />
            <span className="text-primary italic">You Actually Want</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
            ASCEND won't make growth easy. It will make sure every hard thing you do moves you forward — and shows you the proof.
          </p>

          <p className="text-base text-muted-foreground max-w-xl mx-auto mb-10">
            Three honest scores. Four pillars of life. One daily ritual that compounds into the future you've been working toward.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => window.location.href = getLoginUrl()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-10 py-6 text-lg rounded-xl shadow-lg shadow-primary/20"
            >
              Start Your Ascent →
            </Button>
            <p className="text-sm text-muted-foreground">Free to start. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* ASCEND Score Section */}
      <section className="py-20 px-4 sm:px-6 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your Score. Your Mirror.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every morning you check one number — your ASCEND Score. It's built from three dimensions that never lie.
            </p>
          </div>

          {/* Score Visual */}
          <div className="flex justify-center mb-12">
            <div className="relative w-44 h-44">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-border" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 42 * 0.87} ${2 * Math.PI * 42}`}
                  className="text-primary" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>87</span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">ASCEND Score</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {dimensions.map((dim) => (
              <div key={dim.name} className="bg-background rounded-2xl p-6 border border-border text-center">
                <div className={`w-14 h-14 rounded-full border-4 ${dim.ring} flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">{dim.icon}</span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${dim.color}`} style={{ fontFamily: "'Playfair Display', serif" }}>{dim.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{dim.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four Pillars Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Four Pillars. One Life.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ASCEND tracks what actually matters — not just your business, but your whole life. Because success without balance isn't success.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((pillar) => (
              <div key={pillar.name} className={`rounded-2xl p-6 border ${pillar.color} flex gap-4 items-start`}>
                <div className="text-3xl flex-shrink-0">{pillar.icon}</div>
                <div>
                  <h3 className={`text-lg font-bold mb-1 ${pillar.textColor}`} style={{ fontFamily: "'Playfair Display', serif" }}>{pillar.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Ritual Section */}
      <section className="py-20 px-4 sm:px-6 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              The 10-Minute Daily Ritual
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Not a system that demands hours. A ritual that takes minutes — and compounds into years.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                time: "Morning",
                icon: "🌅",
                title: "Set Your 3 Priorities",
                desc: "Choose the three things that will move the needle today. Set your financial action. Check in spiritually. Takes 5 minutes.",
                color: "border-amber-200 bg-amber-50",
              },
              {
                time: "Evening",
                icon: "🌙",
                title: "Log Your Day",
                desc: "Did you do your priorities? What was your win? What will you do differently tomorrow? Takes 60 seconds.",
                color: "border-blue-200 bg-blue-50",
              },
              {
                time: "Weekly",
                icon: "📊",
                title: "Review Your Trajectory",
                desc: "See your 7-day trend. Get your 90-day projection. Read your AI-generated insight. Know exactly where you're headed.",
                color: "border-purple-200 bg-purple-50",
              },
            ].map((step) => (
              <div key={step.time} className={`rounded-2xl p-6 border ${step.color}`}>
                <div className="text-3xl mb-3">{step.icon}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{step.time}</div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Truth Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-2xl sm:text-3xl font-medium leading-relaxed text-foreground mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            "You cannot want progress and an easy life. But you <em>can</em> want progress and a <strong>purposeful</strong> one."
          </blockquote>
          <p className="text-muted-foreground mb-10">
            ASCEND is built for the 10% who are ready to do the work — and want a system that honors both their ambition and their life.
          </p>
          <Button
            size="lg"
            onClick={() => window.location.href = getLoginUrl()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-10 py-6 text-lg rounded-xl shadow-lg shadow-primary/20"
          >
            Begin Your Ascent →
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-border text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs" style={{ fontFamily: "'Playfair Display', serif" }}>A</span>
          </div>
          <span className="font-bold tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>ASCEND</span>
        </div>
        <p className="text-sm text-muted-foreground">© 2026 TrueXpanse. Build the life you actually want.</p>
      </footer>
    </div>
  );
}
