# StadiumAI: GenAI-Powered Operations for FIFA World Cup 2026



## Problem Statement & Solution Mapping

Managing stadium operations during a massive global event like the FIFA World Cup 2026 presents unprecedented logistical challenges. StadiumAI maps its features directly to the 8 core problem statement pillars:

1. **Navigation**: 
   - **Feature**: Accessible Pathfinding & GenAI Directions.
   - **GenAI Role**: Translates raw Dijkstra's algorithm node outputs into human-friendly, contextual, step-by-step walking directions.
2. **Crowd Management**: 
   - **Feature**: Real-Time Crowd Simulator & Alert Feed.
   - **GenAI Role**: Analyzes live gate capacity data to identify queue surges and bottlenecks dynamically.
3. **Accessibility**: 
   - **Feature**: High-Contrast Mode & Simplified Language Toggle.
   - **GenAI Role**: Dynamically alters the system prompt to restrict vocabulary to a B1 level, ensuring cognitive accessibility for users with disabilities or limited language proficiency.
4. **Transportation**: 
   - **Feature**: Match-Day Transit Hub.
   - **GenAI Role**: Processes live transit schedules and user preferences to generate personalized departure plans indicating exactly when fans should leave their seats.
5. **Sustainability**: 
   - **Feature**: Eco-Rewards Tracker.
   - **GenAI Role**: Evaluates user-logged sustainable actions (like taking public transit or recycling) to generate personalized impact insights and encouragement.
6. **Multilingual Assistance**: 
   - **Feature**: Multilingual Fan Assistant.
   - **GenAI Role**: Uses the LLM's native language capabilities to respond seamlessly in English, Spanish, Portuguese, and Hindi based on the fan's profile.
7. **Operational Intelligence**: 
   - **Feature**: GenAI Operational Dashboard.
   - **GenAI Role**: Ingests raw stadium metrics and synthesizes them into actionable, plain-language insights for stadium staff.
8. **Real-time Decision Support**: 
   - **Feature**: Automated Redirect Recommendations.
   - **GenAI Role**: Determines the severity of gate congestion and formulates logical recommendations to redirect fans to less crowded gates in real-time.

## Where and How GenAI Does the Heavy Lifting

This solution doesn't just use an LLM as a generic chatbot; it relies on GenAI for complex reasoning tasks:

1. **Contextual Route Translation**: Raw pathfinding algorithms output arrays of node IDs (e.g., `['g1', 's2', 'f1']`). Our GenAI takes this array, factors in the user's selected language, calculates the total walking time, and reasons out human-friendly directions (e.g., *"Head through Gate 1, take the stairs to Floor 2, and you'll find the Food Court on your right"*).
2. **Predictive Crowd Analysis**: Instead of hardcoding simple `if (occupancy > 90%) { alert() }` logic, we feed the live snapshot of all gates to the LLM. The model correlates queue lengths, entry rates, and capacities to determine the *severity* of the situation and generates a logical *recommendation* (e.g., *"Redirect incoming fans from Gate 3 to Gate 2 to balance entry rates"*).
3. **Adaptive Communication**: By utilizing system prompts, the LLM dynamically scales its vocabulary. When a user enables "Simplified Language," the LLM restricts itself to B1-level vocabulary to assist fans with cognitive disabilities or limited language proficiency.

## Architecture Diagram

```mermaid
graph TD
    subgraph Client [Next.js Frontend]
        UI[Fan App / Ops Dashboard]
        Map[Interactive Map]
        A11y[Accessibility Context]
    end

    subgraph API [Next.js API Routes]
        ChatAPI[/api/chat]
        NavAPI[/api/navigate]
        AlertAPI[/api/alerts]
        SimAPI[/api/simulate-tick]
    end

    subgraph Logic [Core Logic Layer]
        Graph[Dijkstra Pathfinding]
        Sim[Crowd Simulator]
    end

    subgraph AI [Groq LLM / LLaMA 3.3]
        Translator[Language / Simplicity Engine]
        PathDesc[Direction Generator]
        Analyzer[Crowd Data Analyzer]
    end

    subgraph Data [Supabase]
        Auth[Authentication]
        DB[(Knowledge / FAQ DB)]
    end

    UI <--> ChatAPI
    UI <--> NavAPI
    UI <--> AlertAPI
    
    ChatAPI <--> Translator
    ChatAPI <--> DB
    
    NavAPI <--> Graph
    NavAPI <--> PathDesc
    
    AlertAPI <--> Sim
    AlertAPI <--> Analyzer
    
    SimAPI --> Sim
```

## Tech Stack
- **Framework**: Next.js 15 (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **AI Integration**: Vercel AI SDK, Groq API (LLaMA 3.3 70B Versatile)
- **Database & Auth**: Supabase
- **Testing**: Vitest

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory and add the following keys (do not use quotes):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GROQ_API_KEY=your_groq_api_key
CRON_SECRET=your_cron_secret
```

### 2. Installation
Install the necessary dependencies using npm:
```bash
npm install
```

### 3. Run Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

> **Note on Auth**: If testing locally, Supabase Free Tier limits email signups (3 per hour). If you hit a rate limit, sign in with an already created account or disable email confirmations in your Supabase dashboard.
