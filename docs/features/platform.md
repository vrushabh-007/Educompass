# Platform Features

Beyond AI guidance, Educompass provides robust platform tooling to manage your educational journey.

## College Search

The core discovery engine lives at `/college-search`. 
It allows users to search the global Supabase `University` database using multiple filters.

**Features:**
- Quick text search (e.g., "Stanford", "Medical").
- Filters for destination country, subject, and study levels.
- Clicking on a university card routes you to a detail page (`/college-search/[id]`) that pulls extended metrics (acceptance rate, application deadlines, known alumni).

## User Profiles & Dashboard

The application maintains a stateful experience for logged-in students.

### My Profile (`/my-profile`)
Allows students to define their exact parameters:
- **Academic Scores:** CGPA, percentage.
- **Exam Scores:** GRE, TOEFL, IELTS, SAT, etc.
- **Preferences:** Desired countries, financial constraints, matching fields of study.
These data points are safely saved to the `profiles` table in Supabase and actively utilized by the AI recommendation engines.

### Dashboard (`/dashboard`)
Provides an at-a-glance view of the student's journey.
- Displays live statistics (e.g., total universities available in the DB).
- Offers quick shortcuts to AI analysis, the College Search tool, and the SOP Assistant.

## Admin Panel

Administrative users have access to a dedicated suite.

- **Manage Colleges (`/admin/manage-colleges`):** An interface capable of searching, viewing, and permanently deleting stale or incorrect university entries from the live database. Supports CSV exporting.
- **Manage Users (`/admin/manage-users`):** A platform placeholder aimed at managing roles and permissions for system users.

## Alumni Network

The `/alumni-network` page constructs a visual directory of notable graduates. While currently fueled by static mock aggregation, it is designed to seamlessly integrate with a future `alumni` relational table, offering students networking opportunities and direct LinkedIn connection links.
