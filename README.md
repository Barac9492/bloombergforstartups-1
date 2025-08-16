# Bloomberg for Startups

A web-based platform serving as a "Bloomberg terminal for early-stage investing" with deal pipeline management, real-time sentiment analysis, and CRM integrations.

## Features

- **Kanban Pipeline Board**: Drag-and-drop deal management with automation rules
- **Sentiment Analysis**: Real-time monitoring of founders' public posts
- **CRM Integration**: Import/export capabilities with Airtable, Notion, and HubSpot
- **Real-time Dashboard**: Charts, alerts, and notifications for pipeline changes
- **Security**: Environment-based configuration, JWT authentication, rate limiting

## Tech Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- React DnD for drag-and-drop
- Recharts for data visualization
- Socket.io client for real-time updates

### Backend
- Node.js/Express
- TypeScript
- Prisma ORM with PostgreSQL
- Socket.io for WebSocket connections
- Sentiment analysis with Natural NLP
- JWT authentication

## Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- API keys for social media platforms (optional)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd bloomberg-for-startups
```

2. Install dependencies:
```bash
npm run install:all
```

3. Configure environment variables:

Create `.env` files in both frontend and backend directories:

**backend/.env:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/bloomberg_startups"
JWT_SECRET="your-secret-key-here"
PORT=5000

# Social Media APIs (optional)
GITHUB_TOKEN=""
TWITTER_BEARER_TOKEN=""
LINKEDIN_CLIENT_ID=""
LINKEDIN_CLIENT_SECRET=""

# CRM APIs (optional)
AIRTABLE_API_KEY=""
AIRTABLE_BASE_ID=""
NOTION_API_KEY=""
HUBSPOT_API_KEY=""
```

**frontend/.env.local:**
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
NEXT_PUBLIC_WS_URL="http://localhost:5000"
```

4. Set up the database:
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
bloomberg-for-startups/
├── frontend/               # Next.js frontend application
│   ├── app/               # App router pages and layouts
│   ├── components/        # React components
│   ├── lib/              # Utilities and API clients
│   └── types/            # TypeScript type definitions
├── backend/               # Express backend API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── models/       # Data models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   └── utils/        # Utility functions
│   └── prisma/           # Database schema and migrations
└── package.json          # Root package.json for monorepo

```

## API Documentation

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/refresh` - Refresh JWT token

### Deals
- GET `/api/deals` - List all deals
- POST `/api/deals` - Create new deal
- PUT `/api/deals/:id` - Update deal
- DELETE `/api/deals/:id` - Delete deal
- PUT `/api/deals/:id/move` - Move deal to different stage

### Sentiment Analysis
- GET `/api/sentiment/:dealId` - Get sentiment data for a deal
- POST `/api/sentiment/analyze` - Trigger sentiment analysis
- GET `/api/sentiment/trends` - Get sentiment trends

### CRM Integration
- POST `/api/crm/import` - Import deals from CRM
- POST `/api/crm/export` - Export deals to CRM
- GET `/api/crm/sync-status` - Check sync status

## Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Railway/Render (Backend)
1. Create a new project
2. Connect GitHub repository
3. Set environment variables
4. Deploy backend service

## Security Considerations

- All API keys and secrets are stored in environment variables
- JWT tokens for authentication with refresh token rotation
- Rate limiting on API endpoints
- Input validation with Zod schemas
- CORS configuration for production
- Helmet.js for security headers
- SQL injection prevention with Prisma ORM

## License

MIT