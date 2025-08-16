# Development Guide

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Quick Setup

1. **Clone and setup:**
   ```bash
   ./setup.sh
   ```

2. **Configure database:**
   ```bash
   # Create PostgreSQL database
   createdb bloomberg_startups
   
   # Configure backend/.env with your database URL
   DATABASE_URL="postgresql://username:password@localhost:5432/bloomberg_startups"
   ```

3. **Initialize database:**
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start development:**
   ```bash
   npm run dev
   ```

## Project Structure

```
bloomberg-for-startups/
├── frontend/               # Next.js React application
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities and API clients
│   └── types/            # TypeScript definitions
├── backend/               # Express.js API server
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   └── middleware/   # Express middleware
│   └── prisma/           # Database schema
└── package.json          # Monorepo configuration
```

## Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development
- `npm run install:all` - Install dependencies for all packages

### Frontend (Next.js)
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server

### Backend (Express)
- `npm run dev` - Start development server on http://localhost:5000
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server

## Environment Configuration

### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/bloomberg_startups"
JWT_SECRET="your-secret-key"
PORT=5000

# Optional API integrations
GITHUB_TOKEN=""
TWITTER_BEARER_TOKEN=""
AIRTABLE_API_KEY=""
NOTION_API_KEY=""
HUBSPOT_API_KEY=""
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
NEXT_PUBLIC_WS_URL="http://localhost:5000"
```

## Key Features Implementation

### 1. Kanban Pipeline Board
- **Location:** `frontend/components/kanban/`
- **Technology:** @dnd-kit for drag-and-drop
- **Features:** 
  - Drag and drop deals between stages
  - Real-time updates via WebSocket
  - Deal value visualization
  - Automation triggers

### 2. Sentiment Analysis
- **Location:** `backend/src/services/sentiment.service.ts`
- **Technology:** Natural NLP library
- **Data Sources:**
  - GitHub activity (commits, issues, PRs)
  - Twitter/X posts (requires API access)
  - LinkedIn posts (requires OAuth)

### 3. Real-time Dashboard
- **Location:** `frontend/components/dashboard/`
- **Technology:** Recharts for visualizations
- **Metrics:**
  - Pipeline value and conversion rates
  - Sentiment trends over time
  - Deal stage distribution
  - Recent activity feed

### 4. CRM Integrations
- **Location:** `backend/src/services/crm/`
- **Supported CRMs:**
  - Airtable (REST API)
  - Notion (Database API)
  - HubSpot (CRM API)

## Database Schema

The application uses Prisma ORM with PostgreSQL. Key models:

- **User** - Authentication and user management
- **Deal** - Core deal/opportunity data
- **Sentiment** - Sentiment analysis results
- **Activity** - Deal activity tracking
- **DealAutomation** - Automation rules
- **CRMIntegration** - CRM sync configuration

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Deals
- `GET /api/deals` - List all deals
- `POST /api/deals` - Create new deal
- `PUT /api/deals/:id` - Update deal
- `PUT /api/deals/:id/move` - Move deal to different stage

### Sentiment
- `GET /api/sentiment/:dealId` - Get sentiment data
- `POST /api/sentiment/analyze` - Trigger analysis
- `GET /api/sentiment/trends/:dealId` - Get trends

### CRM
- `POST /api/crm/import/:type` - Import from CRM
- `POST /api/crm/export/:type` - Export to CRM

## WebSocket Events

Real-time updates are handled via Socket.IO:

- `deal-created` - New deal added
- `deal-updated` - Deal modified
- `deal-moved` - Deal stage changed
- `sentiment-alert` - Negative sentiment detected
- `automation-notification` - Automation triggered

## Adding New Features

### 1. New Social Media Integration

1. Create service in `backend/src/services/social/`
2. Implement data fetching and normalization
3. Add to sentiment analysis service
4. Update environment configuration

### 2. New CRM Integration

1. Create service in `backend/src/services/crm/`
2. Implement import/export methods
3. Add API route handler
4. Update frontend CRM configuration

### 3. New Dashboard Widget

1. Create component in `frontend/components/dashboard/`
2. Add to main dashboard layout
3. Implement data fetching
4. Add real-time updates

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Ensure all production environment variables are set:
- Database connection
- JWT secret (strong random string)
- API keys for integrations
- CORS origins

### Docker Deployment
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d
```

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check PostgreSQL is running
   - Verify DATABASE_URL format
   - Ensure database exists

2. **CORS errors**
   - Check FRONTEND_URL in backend .env
   - Verify API URLs in frontend .env

3. **WebSocket connection issues**
   - Ensure WS_URL matches backend address
   - Check firewall settings

4. **Sentiment analysis not working**
   - Verify API keys are configured
   - Check rate limiting on external APIs
   - Review logs for errors

### Debug Mode

Enable debug logging:
```bash
LOG_LEVEL=debug npm run dev
```

### Logs Location
- Backend: Console output and error.log (production)
- Frontend: Browser console and Next.js logs