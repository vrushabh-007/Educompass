# Setup & Installation

Follow these steps to get Educompass running on your local machine.

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- A **Supabase** account and project
- A **Google Gemini API Key** (for Genkit)

## 1. Clone the Repository

```bash
git clone https://github.com/vrushabh-007/Educompass.git
cd Educompass
```

## 2. Install Dependencies

Install the required Node packages:

```bash
npm install
```

## 3. Environment Configuration

Create a `.env` file at the root of your project. This file must contain your secrets for Supabase and the AI models.

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Configuration
GOOGLE_GENAI_API_KEY=your_gemini_api_key

# Hosting Context
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note**: Never commit your `.env` file to version control. The repository already includes it in `.gitignore`.

## 4. Supabase Setup

To use the live data, ensure your Supabase database has the correct schemas:
1. `profiles`
2. `University`

You can use the Supabase SQL editor to create these tables if you are provisioning a fresh instance. *Mock data will be used as fallbacks structurally, but real database functionality is expected.*

## 5. Run the Local Development Server

Start the Next.js dev server:

```bash
npm run dev
```

Your application should now be running at [http://localhost:3000](http://localhost:3000).

## 6. Building for Production

To test the optimized production build locally:

```bash
npm run build
npm start
```
