// src/pages/LandingPage.tsx (or wherever your LandingPage lives)
import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* HEADER */}
      <header className="w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/truexpanse-logo.png"
              alt="TrueXpanse"
              className="h-8 w-auto"
            />
            <span className="hidden sm:inline text-xs font-semibold tracking-[0.25em] text-slate-400 uppercase">
              Massive Action Tracker
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <a href="#how-it-works" className="text-slate-300 hover:text-white transition">
              How it works
            </a>
            <a href="#pricing" className="text-slate-300 hover:text-white transition">
              Pricing
            </a>
            {/* existing accounts login */}
            <a
              href="/login"
              className="px-4 py-2 rounded-full border border-slate-600 text-sm font-semibold hover:border-red-500 hover:text-red-300 transition"
            >
              Login
            </a>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* HERO */}
        <section className="bg-slate-950">
          <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-red-400 uppercase mb-4">
                SALES EXECUTION PLATFORM
              </p>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6">
                Turn Massive Activity into
                <span className="text-red-500"> Predictable Revenue</span>.
              </h1>
              <p className="text-base lg:text-lg text-slate-300 mb-6">
                Massive Action Tracker (MAT) gives your team one powerful command
                center for daily outreach, pipeline, and revenue. No more
                scattered spreadsheets, missed follow-ups, or mystery numbers.
              </p>
              <ul className="space-y-2 text-sm text-slate-300 mb-8">
                <li>• Track calls, texts, emails, appointments, and deals in one view</li>
                <li>• See daily KPIs and revenue in real time—by rep or by team</li>
                <li>• Built-in coaching prompts to keep reps focused on the right actions</li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm shadow-lg shadow-red-600/30 hover:bg-red-500 transition"
                >
                  Start Free 7-Day Trial
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-600 text-sm font-semibold text-slate-100 hover:border-slate-400 transition"
                >
                  Watch MAT in Action
                </a>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                No contracts • Cancel anytime • Perfect for remote and in-field sales teams
              </p>
            </div>

            {/* LIGHT HERO PANEL */}
            <div className="bg-slate-50 text-slate-900 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-slate-900/70">
              <h3 className="text-sm font-semibold text-red-600 mb-4 uppercase tracking-wide">
                Today&apos;s Command Center
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Pipeline Health</span>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold">
                    On track
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl bg-slate-900 text-slate-50 p-3">
                    <p className="text-slate-400 mb-1">New Leads</p>
                    <p className="text-lg font-bold">27</p>
                    <p className="text-[11px] text-emerald-300 mt-1">+9 vs. yesterday</p>
                  </div>
                  <div className="rounded-xl bg-slate-900 text-slate-50 p-3">
                    <p className="text-slate-400 mb-1">Appointments</p>
                    <p className="text-lg font-bold">11</p>
                    <p className="text-[11px] text-emerald-300 mt-1">5 held today</p>
                  </div>
                  <div className="rounded-xl bg-slate-900 text-slate-50 p-3">
                    <p className="text-slate-400 mb-1">Revenue</p>
                    <p className="text-lg font-bold">$18,400</p>
                    <p className="text-[11px] text-emerald-300 mt-1">Week-to-date</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 p-3 bg-white">
                  <p className="text-xs font-semibold text-slate-600 mb-2">
                    Today&apos;s Top Targets
                  </p>
                  <ul className="space-y-1 text-xs">
                    <li>▢ Call 25 past-due quotes</li>
                    <li>▢ Book 5 follow-up demos</li>
                    <li>▢ Reactivate 10 cold opportunities</li>
                  </ul>
                </div>

                <p className="mt-4 text-[11px] text-slate-500">
                  MAT turns your team&apos;s activity into a clear, simple scorecard—
                  so everyone knows exactly what to do to hit the number.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS / BENEFITS */}
        <section
          id="how-it-works"
          className="bg-slate-900/80 border-y border-slate-800"
        >
          <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">
                A scoreboard your sales team will actually use.
              </h2>
              <p className="text-sm text-slate-300">
                MAT was built by a sales coach who lives in the trenches with
                contractors, agencies, and small business teams. Every screen is
                designed to keep reps moving, not buried in admin.
              </p>
            </div>
            <div className="space-y-4 text-sm text-slate-200">
              <h3 className="font-semibold text-slate-100">
                1. Track the actions that move the needle
              </h3>
              <p className="text-slate-300">
                Calls, texts, emails, door knocks, demos, quotes, closes—MAT
                captures the daily grind and rolls it into clean KPI dashboards.
              </p>
              <h3 className="font-semibold text-slate-100 mt-4">
                2. See your pipeline in real time
              </h3>
              <p className="text-slate-300">
                Know exactly how many new leads, hot prospects, and new clients
                came in today, this week, and this month—by rep or by team.
              </p>
            </div>
            <div className="space-y-4 text-sm text-slate-200">
              <h3 className="font-semibold text-slate-100">
                3. Coach your team with real numbers
              </h3>
              <p className="text-slate-300">
                End-of-day reports and simple trend charts show who&apos;s
                winning, who&apos;s stuck, and where you can coach for
                immediate gains.
              </p>
              <h3 className="font-semibold text-slate-100 mt-4">
                4. Keep everything in one workspace
              </h3>
              <p className="text-slate-300">
                No more chasing spreadsheets and sticky notes. MAT keeps
                activity tracking, pipeline, revenue, and coaching prompts in
                one clean, easy-to-use platform.
              </p>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="bg-slate-50 text-slate-900">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold tracking-[0.25em] text-red-500 uppercase mb-3">
                SIMPLE PLANS
              </p>
              <h2 className="text-3xl font-extrabold mb-3">
                Choose the Massive Action plan that fits your team.
              </h2>
              <p className="text-sm text-slate-500 max-w-2xl mx-auto">
                Start with a 7-day free trial. No credit card required. Upgrade
                or cancel anytime.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Solo */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col shadow-sm">
                <h3 className="text-sm font-semibold text-slate-700 mb-1">
                  Solo Producer
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  For commission-driven closers who want a daily scoreboard.
                </p>
                <p className="text-3xl font-extrabold mb-1">$39</p>
                <p className="text-xs text-slate-500 mb-4">per month • 1 user</p>
                <ul className="text-xs text-slate-600 space-y-2 mb-6">
                  <li>• Day View with KPIs & revenue</li>
                  <li>• Prospecting & pipeline tracking</li>
                  <li>• End-of-day reports for self-review</li>
                  <li>• AI image & copy prompts for marketing</li>
                </ul>
                <a
                  href="/signup?plan=solo"
                  className="mt-auto inline-flex justify-center px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 hover:border-red-500 hover:text-red-600 transition"
                >
                  Start Solo Trial
                </a>
              </div>

              {/* Team */}
              <div className="rounded-3xl border border-red-500 bg-slate-900 text-slate-50 p-6 flex flex-col shadow-xl shadow-red-500/30 relative overflow-hidden">
                <span className="absolute top-4 right-4 text-[10px] font-semibold bg-red-500 text-white px-2 py-1 rounded-full tracking-wide">
                  MOST POPULAR
                </span>
                <h3 className="text-sm font-semibold mb-1">Team Workspace</h3>
                <p className="text-xs text-slate-300 mb-4">
                  For leaders who want every rep focused on the right actions.
                </p>
                <p className="text-3xl font-extrabold mb-1">$149</p>
                <p className="text-xs text-slate-400 mb-4">
                  per month • up to 10 users
                </p>
                <ul className="text-xs text-slate-200 space-y-2 mb-6">
                  <li>• Everything in Solo Producer</li>
                  <li>• Manager dashboard & team KPIs</li>
                  <li>• Pipeline & new clients pages</li>
                  <li>• EOD reports by rep for coaching</li>
                  <li>• Priority feature updates</li>
                </ul>
                <a
                  href="/signup?plan=team"
                  className="mt-auto inline-flex justify-center px-4 py-2 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-500 transition"
                >
                  Start Team Trial
                </a>
              </div>

              {/* Coaching */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col shadow-sm">
                <h3 className="text-sm font-semibold text-slate-700 mb-1">
                  Team + Coaching
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  For serious teams that want ongoing strategy and accountability.
                </p>
                <p className="text-3xl font-extrabold mb-1">$399</p>
                <p className="text-xs text-slate-500 mb-4">
                  per month • up to 10 users
                </p>
                <ul className="text-xs text-slate-600 space-y-2 mb-6">
                  <li>• Everything in Team Workspace</li>
                  <li>• 1 monthly group coaching call</li>
                  <li>• Call review & pipeline strategy</li>
                  <li>• Implementation checklists for leaders</li>
                </ul>
                <a
                  href="/signup?plan=coaching"
                  className="mt-auto inline-flex justify-center px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 hover:border-red-500 hover:text-red-600 transition"
                >
                  Apply for Coaching Plan
                </a>
              </div>
            </div>

            <p className="mt-6 text-[11px] text-slate-500 text-center">
              Need more than 10 users or private coaching for your leadership
              team? Reach out from inside the app and we&apos;ll customize a
              plan.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TrueXpanse. All rights reserved.</p>
          <p>Built for sales teams who believe in massive action and measurable results.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
