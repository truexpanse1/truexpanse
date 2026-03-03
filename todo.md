# ASCEND — Build the Life You Actually Want

## Phase 1: Design System & Branding
- [ ] Update index.html with ASCEND title and premium fonts (Playfair Display + Inter)
- [ ] Build ASCEND color palette in index.css (deep navy, gold, warm cream)
- [ ] Build landing page (Home.tsx) with ASCEND hero, value prop, and login CTA

## Phase 2: Database Schema
- [ ] Add ascendProfiles table (userId, pillars, whyStatement, ninetyDayGoal, onboardingCompleted)
- [ ] Add ascendCheckIns table (daily morning + evening data per pillar)
- [ ] Add ascendScores table (daily Momentum/Trajectory/Alignment scores)
- [ ] Run db:push to migrate schema

## Phase 3: Backend Routers
- [ ] ascend.getProfile — get or create user's ASCEND profile
- [ ] ascend.saveProfile — save pillar selections, why statement, 90-day goal
- [ ] ascend.getTodayCheckIn — get today's check-in record
- [ ] ascend.saveMorningRitual — save morning priorities, financial action, spiritual check-in
- [ ] ascend.saveEveningCheckIn — save evening completions, win, improvement
- [ ] ascend.getScoreHistory — get last 30 days of scores
- [ ] ascend.computeScore — calculate and save today's score

## Phase 4: Onboarding Flow
- [ ] Build Onboarding page (why statement, 90-day goal, pillar selection)
- [ ] Wire to ascend.saveProfile mutation
- [ ] Redirect to dashboard after completion

## Phase 5: Morning Ritual Screen
- [ ] Build MorningRitual.tsx page
- [ ] Today's date, greeting, and motivational quote
- [ ] Three priority input fields
- [ ] Financial action of the day (earn/invest/track/learn)
- [ ] Spiritual check-in (grounded/neutral/need support)
- [ ] Submit → save and redirect to dashboard

## Phase 6: ASCEND Score Dashboard
- [ ] Build Dashboard.tsx with the ASCEND Score as hero element
- [ ] Three dimension rings: Momentum / Trajectory / Alignment (0-100 each)
- [ ] Overall composite score with animated number
- [ ] 30-day trend sparkline
- [ ] Today's priorities display (from morning ritual)
- [ ] Quick-action buttons: Morning Ritual / Evening Check-in / Weekly Report
- [ ] Pillar status cards (Prosperity / Promote / Purpose / People)

## Phase 7: Evening Check-in Screen
- [ ] Build EveningCheckIn.tsx page
- [ ] Show today's 3 priorities with yes/partial/no toggles
- [ ] Win of the day text field
- [ ] One thing to improve tomorrow
- [ ] Submit → compute and save score

## Phase 8: Weekly Report
- [ ] Build WeeklyReport.tsx page
- [ ] 7-day score trend chart (Momentum/Trajectory/Alignment lines)
- [ ] Pillar breakdown for the week
- [ ] 90-day projection: "At this pace, here's where you'll be"
- [ ] AI-generated weekly insight (one paragraph)
- [ ] Streak display

## Phase 9: Polish & Deploy
- [ ] Add navigation between all screens
- [ ] Mobile responsive check
- [ ] Git commit and push to GitHub
- [ ] Verify Netlify deployment
