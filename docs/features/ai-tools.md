# AI Features

Educompass integrates artificial intelligence tightly into its workflow to provide a personal counselor experience.

## AI Counselor

The AI Counselor (found at `/ai-counselor`) acts as an interactive chat interface. 
It uses a conversational model to handle varying types of student queries.

**How It Works:**
- Uses the `college-advisor` Genkit flow to process user chat inputs alongside message history.
- Has awareness of admission policies, standardized test requirements, and general collegiate advice.
- Can process vague questions ("I want to study engineering in the US but have a low budget") and respond with structured, actionable advice.

## Recommendations Engine

The Recommendations module evaluates a user's `profiles` object against the `University` database.

- Accessed at `/recommendations`.
- The system builds a unified prompt incorporating the student's preferences, financial status, and test scores.
- The AI responds with a matched selection of universities and a summarized justification for *why* they fit the profile.

## SOP & Essay Assistant

Writing a Statement of Purpose (SOP) is often a bottleneck for applicants. The Assistant tackles this from two angles:

1. **Generation:** Users input their goals, key projects, and academic background via an intuitive form. Genkit merges this structured data to generate a viable first draft of an SOP.
2. **Review & Feedback:** Users can paste their own drafts. The AI acts as a critic, returning a JSON response that is parsed into the UI to show a high-level summary, extracted keywords, and actionable critiques to improve the essay's impact.
