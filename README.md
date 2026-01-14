# cloutAI - MVP

A production-ready SaaS MVP for B2B founders and coaches that demonstrates how AI can turn short-form educational content into leads.

## Features

### ✅ Built
- **Authentication**: Email/password signup and login with protected routes
- **User Onboarding**: Multi-step form collecting niche, target audience, offer, and primary goal
- **AI Content Generator**: Generates 10 educational content ideas (hook, key teaching, CTA) using OpenAI API
- **Lead Flow Simulation**: Mock DM pipeline with lead states (New, Engaged, Qualified)
- **Dashboard**: Metrics display showing content ideas, conversations, and qualified leads

### ❌ Explicitly NOT Built
- Real Instagram API integration
- Real DM automation
- Avatar video generation
- Payment system
- Advanced analytics

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes, Server Actions
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js v5 (beta) with credentials provider
- **AI**: OpenAI API (gpt-4o-mini) with fallback to mock data
- **Validation**: Zod

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="your-openai-api-key"
```

3. Initialize the database:
```bash
npx prisma migrate dev --name init
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── [...nextauth]/route.ts    # NextAuth handler
│   │   └── signup/route.ts          # User registration
│   ├── content/generate/route.ts      # AI content generation
│   ├── dashboard/stats/route.ts       # Dashboard metrics
│   ├── leads/route.ts                # Lead data
│   └── onboarding/route.ts          # Onboarding data
├── auth/
│   ├── signin/page.tsx               # Sign in page
│   └── signup/page.tsx              # Sign up page
├── dashboard/page.tsx                # Main dashboard
├── onboarding/page.tsx              # Multi-step onboarding
└── page.tsx                        # Landing page

lib/
├── auth.ts                          # NextAuth configuration
├── ai.ts                           # AI content generation
├── leads.ts                         # Lead simulation logic
└── prisma.ts                       # Prisma client singleton

prisma/
├── schema.prisma                    # Database schema
└── migrations/                      # Database migrations
```

## Database Schema

- **User**: Auth + onboarding data (niche, targetAudience, offer, primaryGoal)
- **ContentIdea**: Generated content (hook, keyTeaching, cta)
- **Lead**: Simulated leads with state (NEW, ENGAGED, QUALIFIED)
- **Conversation**: Mock DM conversations (sender: "lead" or "ai")

## User Flow

1. **Landing Page** → User sees features and value proposition
2. **Sign Up** → Create account with email/password
3. **Onboarding** → Complete 4-step form:
   - Niche (e.g., "Fitness coaching")
   - Target audience (e.g., "Busy professionals aged 30-45")
   - Offer (e.g., "12-week coaching program")
   - Primary goal (leads or calls)
4. **Dashboard** → View metrics and generate content
5. **Generate Content** → AI creates 10 content ideas
6. **Simulated Leads** → Mock leads appear automatically tied to content
7. **View Conversations** → See mock DM threads with leads

## API Endpoints

- `POST /api/auth/signup` - Create user account
- `GET /api/onboarding` - Get user onboarding data
- `POST /api/onboarding` - Save onboarding data
- `POST /api/content/generate` - Generate content ideas + leads
- `GET /api/content/generate` - Get existing content ideas
- `GET /api/leads` - Get all leads with conversations
- `GET /api/dashboard/stats` - Get dashboard metrics

## AI Content Generation

Uses OpenAI's gpt-4o-mini model to generate 10 educational content ideas customized to the user's:
- Niche
- Target audience  
- Offer
- Primary goal

Each content idea includes:
- **Hook**: Scroll-stopping opening line (<15 words)
- **Key Teaching**: 1-2 actionable educational points
- **CTA**: Call-to-action driving the user's primary goal

**Fallback**: If OpenAI API fails, returns mock content ideas.

## Lead Simulation

The system generates realistic mock leads (3-10) for each content generation:
- Random names
- Realistic lead states (40% NEW, 40% ENGAGED, 20% QUALIFIED)
- Simulated DM conversations between lead and AI

Lead state progression:
- **NEW**: Initial DM from lead, AI response
- **ENGAGED**: Additional message exchange
- **QUALIFIED**: Lead expresses interest, AI provides next steps

## Dashboard Features

Three tabs:
1. **Overview**: Stats cards, generate CTA, recent leads preview
2. **Content Ideas**: All generated ideas with hooks, teachings, CTAs
3. **Leads**: Full list of leads with conversation threads

## Success Criteria ✅

Within 5 minutes, a new user can:
- Generate content ideas (via AI or mock data)
- See simulated conversations
- See leads appear in the dashboard

User should believe: "This system could realistically generate leads for my business."

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | SQLite database connection string |
| `NEXTAUTH_SECRET` | Yes | Secret for JWT signing |
| `NEXTAUTH_URL` | Yes | Base URL for NextAuth |
| `OPENAI_API_KEY` | Optional | OpenAI API key (fallback to mock data) |

## Production Considerations

Before deploying to production:
1. Change `NEXTAUTH_SECRET` to a secure random string
2. Set a real `OPENAI_API_KEY`
3. Update `NEXTAUTH_URL` to production domain
4. Consider migrating from SQLite to PostgreSQL
5. Add rate limiting to API routes
6. Implement proper error logging
7. Add analytics tracking

## License

MIT
