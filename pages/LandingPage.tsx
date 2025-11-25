import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050111] text-white">
      {/* Top Nav */}
      <header className="sticky top-0 z-30 bg-[#050111]/80 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 flex items-center justify-center text-xs font-black">
              MAT
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-[0.18em] uppercase text-white/80">
                TRUEXPANSE
              </div>
              <div className="text-xs text-white/50 -mt-0.5">
                Massive Action Tracker
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#product" className="hover:text-white transition">
              Product
            </a>
            <a href="#results" className="hover:text-white transition">
              Results
            </a>
            <a href="#how-it-works" className="hover:text-white transition">
              How it works
            </a>
            <a href="#pricing" className="hover:text-white transition">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Existing accounts login */}
            <a
              href="/login"
              className="px-4 py-2 rounded-full text-sm font-medium border border-white/20 hover:border-white/60 hover:bg-white/5 transition"
            >
              Login
            </a>
            {/* Trial CTA – adjust href if you have a dedicated signup route */}
            <a
              href="#pricing"
              className="hidden sm:inline-flex px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-red-500 shadow-lg shadow-purple-500/40 hover:brightness-110 transition"
            >
              Start 7-Day Free Trial
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-600/40 blur-3xl" />
          <div className="pointer-events-none absolute -right-40 top-40 h-80 w-80 rounded-full bg-fuchsia-500/30 blur-3xl" />

          <div className="max-w-6xl mx-auto px-4 lg:px-0 py-16 lg:py-24 grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-400/50 bg-purple-500/10 text-[11px] font-medium uppercase tracking-[0.2em] text-purple-200 mb-6">
                ⚡ New • Built for 10X sales teams
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.3rem] font-black leading-tight mb-4">
                Turn a messy sales day into a
                <span className="inline-block ml-2 px-3 py-1 rounded-full bg-white text-[#050111] text-2xl align-middle">
                  10X pipeline
                </span>
              </h1>

              <p className="text-lg text-white/65 max-w-xl mb-6">
                Massive Action Tracker (MAT) gives every rep a crystal-clear
                scoreboard for calls, texts, meetings, and revenue — and gives
                leaders real-time visibility on who’s actually moving the needle.
              </p>

              <ul className="text-sm text-white/70 space-y-2 mb-8">
                <li>• Track all KPIs: calls, appointments, demos, deals, and revenue</li>
                <li>• See pipeline health at a glance — today, this week, this month</li>
                <li>• Built-in coaching prompts to keep reps taking massive action</li>
              </ul>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#pricing"
                  className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-red-500 shadow-lg shadow-purple-500/40 hover:brightness-110 transition"
                >
                  Start 7-Day Free Trial
                </a>
                <a
                  href="#results"
                  className="text-sm font-medium text-white/75 hover:text-white underline-offset-4 hover:underline"
                >
                  See live-style results ↓
                </a>
              </div>

              <p className="text-xs text-white/40 mt-4">
                No contracts • Cancel anytime • Designed by a 10X sales coach
              </p>
            </div>

            {/* Mock “app preview” card */}
            <div className="relative">
              <div className="rounded-3xl bg-white/5 border border-white/10 p-5 shadow-[0_0_60px_rgba(168,85,247,0.35)]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                      TODAY&apos;S DASHBOARD
                    </div>
                    <div className="text-sm text-white/80">Nov 24 • Don’s Team</div>
                  </div>
                  <div className="px-3 py-1 text-xs rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/40">
                    🔥 On-track for goal
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  {[
                    { label: 'Calls', value: '47', target: '40' },
                    { label: 'Appointments', value: '9', target: '8' },
                    { label: 'Demos', value: '4', target: '3' },
                    { label: 'Deals Closed', value: '3', target: '2' },
                  ].map((kpi) => (
                    <div
                      key={kpi.label}
                      className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] text-white/60">{kpi.label}</span>
                        <span className="text-[10px] text-emerald-300">Goal {kpi.target}</span>
                      </div>
                      <div className="text-lg font-bold">{kpi.value}</div>
                      <div className="mt-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-emerald-400" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-[#050111] border border-white/10 px-3 py-3">
                  <div className="flex justify-between items-center text-xs text-white/70 mb-2">
                    <span>Massive Action Score</span>
                    <span className="text-emerald-300 font-semibold">92 / 100</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[92%] bg-gradient-to-r from-red-500 via-fuchsia-500 to-emerald-400" />
                  </div>
                  <p className="text-[11px] text-white/55 mt-2">
                    Reps above 80 consistently hit quota. MAT keeps them there.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RESULTS SECTION */}
        <section id="results" className="bg-[#07031a] border-y border-white/5">
          <div className="max-w-6xl mx-auto px-4 lg:px-0 py-16 lg:py-20">
            <div className="text-center mb-10">
              <div className="text-xs tracking-[0.3em] uppercase text-purple-300 mb-3">
                LIVE-STYLE RESULTS
              </div>
              <h2 className="text-3xl font-bold mb-2">
                Before MAT vs After MAT
              </h2>
              <p className="text-sm text-white/60 max-w-xl mx-auto">
                When reps see their numbers in real time, behavior changes fast.
                Teams using MAT typically see more activity within the first week.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="rounded-3xl bg-red-500/10 border border-red-400/40 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-red-300 mb-2">
                  Before MAT
                </div>
                <ul className="space-y-2 text-white/75">
                  <li>• Reps guessing at daily targets</li>
                  <li>• Managers buried in spreadsheets</li>
                  <li>• Inconsistent follow-up and missed deals</li>
                  <li>• Pipeline feels like a black box</li>
                </ul>
              </div>
              <div className="rounded-3xl bg-emerald-500/10 border border-emerald-400/40 p-5 md:col-span-2">
                <div className="text-xs uppercase tracking-[0.2em] text-emerald-300 mb-2">
                  After MAT
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-3xl font-black mb-1">+35%</div>
                    <div className="text-xs text-white/60">More daily outbound activity</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black mb-1">2×</div>
                    <div className="text-xs text-white/60">More appointments set per rep</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black mb-1">20–40%</div>
                    <div className="text-xs text-white/60">
                      Lift in monthly pipeline value
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-white/50 mt-3">
                  *Illustrative example based on coaching clients using consistent daily
                  tracking and coaching inside MAT.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* OLD WAY vs NEW WAY */}
        <section id="how-it-works" className="py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 lg:px-0">
            <h2 className="text-3xl font-bold text-center mb-10">
              Old way vs MAT&apos;s <span className="text-purple-300">Massive Action</span> method
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="rounded-3xl bg-red-500/5 border border-red-400/40 p-6">
                <h3 className="text-lg font-semibold mb-4">Old Way</h3>
                <ul className="space-y-3 text-white/70">
                  <li>✖ Spreadsheets and sticky notes everywhere</li>
                  <li>✖ Reps &quot;feel&quot; busy but can&apos;t prove it with numbers</li>
                  <li>✖ One-on-ones spent guessing where deals are stuck</li>
                  <li>✖ No consistent rhythm for outbound or follow-up</li>
                </ul>
              </div>
              <div className="rounded-3xl bg-emerald-500/5 border border-emerald-400/40 p-6">
                <h3 className="text-lg font-semibold mb-4">MAT Method</h3>
                <ul className="space-y-3 text-white/80">
                  <li>✔ One daily dashboard for all KPIs and revenue</li>
                  <li>✔ Reps get clear daily targets and Massive Action prompts</li>
                  <li>✔ Managers see who&apos;s winning and who needs coaching instantly</li>
                  <li>✔ Every day ends with an EOD report and real data-driven coaching</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 3 BENEFITS */}
        <section className="bg-[#07031a] border-y border-white/5 py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 lg:px-0">
            <h2 className="text-3xl font-bold text-center mb-10">
              3 ways MAT instantly upgrades your sales team
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              {[
                {
                  title: 'Total clarity',
                  body: 'Every rep knows exactly what winning looks like today — no more “I thought I was on pace.”',
                },
                {
                  title: 'Pipeline you can trust',
                  body: 'Appointments, follow-ups and deals are logged in the flow of work, not forgotten in someone’s notebook.',
                },
                {
                  title: 'Built-in coaching',
                  body: 'Leaders can coach from real activity and revenue numbers instead of vague feelings or &quot;How do you think it went?&quot;',
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col"
                >
                  <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 text-sm font-bold">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/70">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-18 lg:py-24">
          <div className="max-w-6xl mx-auto px-4 lg:px-0">
            <div className="text-center mb-10">
              <div className="text-xs tracking-[0.3em] uppercase text-purple-300 mb-3">
                Pricing
              </div>
              <h2 className="text-3xl font-bold mb-2">
                Choose your MAT plan and build a{' '}
                <span className="text-purple-300">Massive Action</span> culture
              </h2>
              <p className="text-sm text-white/60">
                All plans include the full Massive Action Tracker platform and a 7-day free trial.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Starter */}
              <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col">
                <h3 className="text-lg font-semibold mb-1">Starter</h3>
                <p className="text-xs text-white/50 mb-4">For solo closers and freelancers</p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black">$39</span>
                  <span className="text-xs text-white/60">/month</span>
                </div>
                <ul className="text-sm text-white/75 space-y-2 mb-6">
                  <li>• 1 user</li>
                  <li>• Full MAT dashboard & KPI tracking</li>
                  <li>• Daily EOD reports & pipeline tracking</li>
                  <li>• Access to MAT quick-start training</li>
                </ul>
                <a
                  href="/signup"
                  className="mt-auto inline-flex justify-center px-4 py-2.5 text-sm font-semibold rounded-xl bg-white text-[#050111] hover:bg-zinc-200 transition"
                >
                  Start Starter Plan
                </a>
              </div>

              {/* Team – most popular */}
              <div className="rounded-3xl bg-gradient-to-b from-purple-600/40 via-purple-600/30 to-[#050111] border border-purple-400/70 p-6 flex flex-col shadow-[0_0_50px_rgba(168,85,247,0.55)] scale-[1.02]">
                <div className="inline-flex items-center self-start px-3 py-1 rounded-full bg-white/15 text-[11px] font-semibold uppercase tracking-[0.18em] mb-4">
                  🔥 Most Popular
                </div>
                <h3 className="text-lg font-semibold mb-1">Team</h3>
                <p className="text-xs text-white/60 mb-4">
                  For growing sales teams who need real accountability
                </p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black">$149</span>
                  <span className="text-xs text-white/70">/month</span>
                </div>
                <ul className="text-sm text-white/85 space-y-2 mb-6">
                  <li>• Up to 10 users</li>
                  <li>• Full MAT dashboards for every rep</li>
                  <li>• Manager view with team KPIs & revenue</li>
                  <li>• Priority email support</li>
                </ul>
                <a
                  href="/signup"
                  className="mt-auto inline-flex justify-center px-4 py-2.5 text-sm font-semibold rounded-xl bg-white text-[#050111] hover:bg-zinc-200 transition"
                >
                  Start Team Plan
                </a>
              </div>

              {/* Elite */}
              <div className="rounded-3xl bg-white/5 border border-amber-400/70 p-6 flex flex-col">
                <h3 className="text-lg font-semibold mb-1">Elite</h3>
                <p className="text-xs text-white/60 mb-4">
                  For teams who want tools <em>and</em> coaching
                </p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black">$399</span>
                  <span className="text-xs text-white/70">/month</span>
                </div>
                <ul className="text-sm text-white/80 space-y-2 mb-6">
                  <li>• Up to 10 users</li>
                  <li>• Everything in Team plan</li>
                  <li>• 1 group coaching call per month</li>
                  <li>• Strategy help to build a 10X sales culture</li>
                </ul>
                <a
                  href="/signup"
                  className="mt-auto inline-flex justify-center px-4 py-2.5 text-sm font-semibold rounded-xl bg-amber-400 text-[#050111] hover:bg-amber-300 transition"
                >
                  Start Elite Plan
                </a>
              </div>
            </div>

            <p className="text-xs text-white/50 text-center mt-6">
              Need more than 10 users or custom onboarding?{' '}
              <a href="mailto:support@truexpanse.com" className="underline hover:text-white">
                Talk to us about a custom MAT rollout.
              </a>
            </p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-[#050111] py-14 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 lg:px-0 text-center">
            <div className="text-xs tracking-[0.3em] uppercase text-purple-300 mb-3">
              What are you waiting for?
            </div>
            <h2 className="text-3xl font-bold mb-3">Give your team a scoreboard they can’t ignore.</h2>
            <p className="text-sm text-white/60 max-w-xl mx-auto mb-6">
              The companies that win don’t “hope” their reps are taking action —
              they measure it. MAT makes that measurement automatic and motivating.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#pricing"
                className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-red-500 shadow-lg shadow-purple-500/40 hover:brightness-110 transition"
              >
                Start Your 7-Day Free Trial
              </a>
              <a
                href="/login"
                className="px-6 py-3 rounded-xl text-sm font-semibold border border-white/30 hover:bg-white/5 transition"
              >
                Already a customer? Login
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
