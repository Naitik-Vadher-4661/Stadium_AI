# Prompt War Playbook — FIFA World Cup 2026 Stadium GenAI Solution
 
Stack decided: **Next.js + Tailwind + Supabase + Groq API**, deployed on **Vercel**.
Pillars: **Multilingual navigation & assistance** + **Real-time crowd/queue operational intelligence**.
 

 
---
 
## PROMPT 1 — Master Context 
 
```
I'm building a GenAI-enabled stadium operations solution for a hackathon evaluation
by an AI judge, submitted as ONLY a deployed link + GitHub repo. Act as a senior
full-stack engineer who writes production-quality code, not hackathon-throwaway code.
 
PROBLEM STATEMENT (verbatim):
"Build a GenAI-enabled solution that enhances stadium operations and the overall
tournament experience for fans, organizers, volunteers, or venue staff. The solution
must leverage Generative AI to improve navigation, crowd management, accessibility,
transportation, sustainability, multilingual assistance, operational intelligence,
or real-time decision support during the FIFA World Cup 2026."
 
MY SCOPE (2 pillars, do not add scope beyond this without asking me):
1. Multilingual AI Navigation & Assistant — fans ask questions in their language
   (English, Spanish, Portuguese, Hindi) about gates, seating, restrooms, food,
   medical, transport; GenAI answers AND generates step-by-step directions using
   a simple stadium map graph (nodes = locations, edges = walkable paths).
2. Real-Time Crowd & Queue Operational Intelligence — organizers/volunteers see a
   dashboard fed by simulated live inputs (gate occupancy %, queue length, entry
   rate); GenAI analyzes this and generates plain-language alerts and redirect
   recommendations (e.g. "Gate 3 at 92% capacity, recommend redirecting fans to
   Gate 5, estimated wait reduction 12 min").
 
TECH STACK:
- Frontend: Next.js (App Router) + Tailwind CSS
- Backend/DB/Auth: Supabase (Postgres + Row Level Security)
- LLM: Groq API (llama-3.3-70b-versatile or similar fast model)
- Deployment: Vercel
 
EVALUATION CRITERIA (this is how the submission gets scored — optimize for this,
weight your effort accordingly):
1. Code quality [HIGH] — clean, readable, well-structured
2. Problem Statement Alignment [HIGH] — accurately targets the root challenge
3. Security [MEDIUM] — safe practices, avoids common vulnerabilities
4. Efficiency [MEDIUM] — resource/time/memory usage
5. Testing [LOW] — testable, validated, maintainable
6. Accessibility [LOW] — usable for diverse users and environments
 
HARD CONSTRAINTS — follow these on every file you write, no exceptions:
- NEVER hardcode API keys or secrets. All secrets go in environment variables.
  Create a .env.example with placeholder values and ensure .env.local is in
  .gitignore.
- Modular structure: separate routes/pages, UI components, service/API logic,
  and utility functions into clearly named folders. No god-files.
- Validate and sanitize all user input before it reaches the LLM or the database.
- Use TypeScript, not plain JS.
- Every LLM call must have error handling and a sensible fallback/timeout —
  never let a failed API call crash the UI.
- Stream LLM responses to the frontend where possible instead of blocking waits.
- Accessibility basics on every UI component: semantic HTML, ARIA labels where
  needed, alt text on images, visible focus states, sufficient color contrast.
- Write a short comment above any non-obvious logic explaining WHY, not what.
 
Do not start implementing yet. First, confirm you understand this context, then
wait for my next prompt where I'll ask you to propose the project structure.
```
 
---
 
## PROMPT 2 — Architecture First
 
```
Before writing feature code, propose:
1. A full folder/file structure for this Next.js + Supabase + Groq project.
2. The Supabase schema (tables, columns, types, relationships) needed for:
   - stadium locations/map graph (nodes + edges)
   - gate occupancy/queue simulated data
   - multilingual FAQ/content if any is static
3. The high-level data flow: how a fan's question travels from UI → API route →
   Groq → back to UI, and how the crowd dashboard's data flow works.
 
Show me this as a plan first. I will approve or correct it before you write any
implementation code.
```
 
*(Review what it proposes. If something looks off — e.g. too many tables, unclear separation — say so before approving. This is the highest-leverage correction point for code quality.)*
 
---
 
## PROMPT 3 — Feature Build Loop (repeat this pattern for each feature below)
 
Feature list to build, one at a time, in this order:
 
1. Stadium map graph + navigation directions generator
2. Multilingual chat assistant (fan-facing)
3. Gate occupancy/queue simulated data feed
4. Crowd intelligence dashboard (organizer/volunteer-facing) with GenAI alerts
5. Accessibility mode (simplified language toggle, high-contrast toggle, TTS-ready text)
6. Landing page tying it all together with a clear demo flow
For EACH feature, use this two-step prompt pattern:
 
**Build prompt:**
```
Implement [FEATURE NAME] according to the architecture we agreed on.
Requirements: [1-3 bullet points specific to that feature].
Follow all constraints from the master context — env vars, error handling,
input validation, accessibility, modular structure.
```
 
**Review prompt**
```
Review the code you just wrote for:
1. Any hardcoded secrets or API keys
2. Unhandled errors or missing loading/error states
3. Unclear naming or functions doing too much
4. Accessibility gaps (missing alt text, ARIA labels, keyboard nav, contrast)
Fix anything you find, then summarize what you changed.
```
 
---
 
## PROMPT 4 — Security + Efficiency Pass (after all features are built)
 
```
Do a dedicated security and efficiency pass across the whole codebase:
- Confirm every API route validates/sanitizes input before use
- Confirm no API keys or secrets exist anywhere in the codebase, only in env vars
- Add basic rate limiting to any public-facing API route that calls Groq
- Confirm LLM responses are streamed where the UI supports it, not blocking
- Remove any dead code, unused imports, or leftover console.log/debug statements
- Confirm .env.local is gitignored and .env.example exists with placeholder keys
Report what you found and fixed.
```
 
---
 
## PROMPT 5 — Testing + Accessibility Pass (keep this brief, low weight)
 
```
Add a small set of unit tests for the core non-UI logic (navigation path
generation, occupancy alert logic). Aim for meaningful coverage of the core
GenAI-adjacent logic, not 100% coverage.
 
Then do a focused accessibility pass: confirm alt text on all images, ARIA
labels on interactive elements, visible focus states, color contrast, and
that the multilingual toggle actually changes UI language, not just AI
response language.
```
 
---
 
## PROMPT 6 — Final Rubric Self-Audit 
 
```
Act as a strict judge for this hackathon. Review the ENTIRE codebase against
these exact criteria, in this priority order:
1. Code quality [HIGH] — clean, readable, well-structured
2. Problem Statement Alignment [HIGH] — does this solution genuinely leverage
   GenAI to solve navigation, crowd management, accessibility, or multilingual
   assistance for FIFA World Cup 2026 stadium operations?
3. Security [MEDIUM]
4. Efficiency [MEDIUM]
5. Testing [LOW]
6. Accessibility [LOW]
 
For each criterion, give yourself an honest score out of 10 and list specific
gaps. Then fix every gap you found, prioritizing the HIGH-impact criteria first.
Repeat this audit once more after fixing.
```
 
---
 
## PROMPT 7 — README (last prompt before deployment)
 
```
Write the README.md for this repo. Include:
1. One-paragraph problem statement → our solution mapping
2. A feature list, each explicitly tagged with which problem-statement pillar
   it addresses (navigation / multilingual assistance / crowd management /
   operational intelligence / real-time decision support / accessibility)
3. A clear explanation of WHERE and HOW GenAI is doing real work in this
   solution (not just "we use an LLM" — explain the actual reasoning task)
4. Architecture diagram (as a mermaid diagram or ASCII, whichever renders
   cleanly on GitHub)
5. Tech stack list
6. Setup instructions: env vars needed (names only, no real values), install
   steps, how to run locally
7. Deployed link placeholder (I'll fill this in after deploying)
Keep it scannable — an AI judge should understand our alignment within the
first 10 seconds of reading.
```
 
---
 
## Deployment checklist 
 
- [ ] All env vars set correctly in Vercel project settings (not committed anywhere)
- [ ] Test the deployed link end-to-end: multilingual assistant, navigation,
      crowd dashboard all working live
- [ ] Confirm no console errors in production build
- [ ] Confirm mobile responsiveness (many judges/testers will check on phone)
- [ ] Push final commit, confirm GitHub repo is public
- [ ] Fill in the deployed link in the README