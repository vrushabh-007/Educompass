# Architecture Overview

Educompass is constructed using a modern, scalable web stack focusing on performance, developer experience, and AI integration.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & [shadcn/ui](https://ui.shadcn.com/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **AI Integration**: [Google Genkit](https://firebase.google.com/docs/genkit) powered by Gemini API

---

## Next.js Application Structure

The application heavily utilizes the Next.js App Router (`src/app/` directory).

- `(app)/`: Protected and primary application routes including dashboards, profile management, and college searches. Contains its own layout (`layout.tsx`) requiring authentication for most endpoints.
- `(auth)/`: Unauthenticated routes for `login` and `register`.
- `api/`: Backend API routes handling Supabase data fetching, server-side actions, and chat completions.

### Component Architecture

The `src/components/` directory is split visually and functionally:
- `ui/`: Standardized, raw UI components generated via `shadcn/ui` (buttons, cards, inputs).
- `shared/`: High-level UI elements shared across the site (e.g., ThemeProvider, Logo).
- `landing/`: Components specific to the unauthenticated marketing landing page.
- `ai/`: Reusable components specifically managing AI interactions (e.g. Chat Interfaces).

---

## Database Schema (Supabase)

The PostgreSQL database acts as both the user authentication provider and the primary data store.

### Core Tables

1. **`profiles`**
   - Stores user data extensions linked to an authenticated Supabase user.
   - Contains fields such as `full_name`, `education_level`, `academic_scores`, and specific `preferences`.

2. **`University`**
   - The central repository of college and university data worldwide.
   - Fields include name, country, global rankings, acceptance rates, available scholarships, and external webpage links.

*Note: In cases where database rows are missing during development or testing, specific endpoints in Educompass possess robust mock-data fallback logic. However, this repository recently phased out legacy mock data to prioritize live database fetching.*

---

## AI Implementation (Google Genkit)

The `src/ai/` directory manages the integration with Google's foundation models via Genkit.

### Flows

Genkit utilizes "flows", which are observable, strictly typed remote functions:
- `generate-sop`: Takes a structured prompt input covering academic background and goals, yielding an AI-drafted Statement of Purpose.
- `provide-essay-feedback`: Accepts a text essay and returns a structured JSON payload containing a summary, critical feedback, and identifying key themes.
- `summarize-college-profile`: Quickly evaluates a university's profile to summarize its pros and cons in relation to a given student.
- `college-advisor`: The primary chat logic that uses history and RAG (retrieval-augmented generation) mechanics to answer broad and specific counseling inquiries.
