# Claude Code Instructions

This file contains instructions for Claude Code to help with development tasks.

## Project Overview

Bloomberg for Startups is a web-based platform that serves as a "Bloomberg terminal for early-stage investing" with:
- Kanban-style deal pipeline management
- Real-time sentiment analysis from social media
- CRM integrations (Airtable, Notion, HubSpot)
- Automated deal movement rules
- Real-time dashboard with charts and alerts

## Development Commands

### Setup and Installation
```bash
# Full setup
./setup.sh

# Install dependencies
npm run install:all

# Start development
npm run dev
```

### Database Operations
```bash
# Generate Prisma client
cd backend && npx prisma generate

# Create migration
cd backend && npx prisma migrate dev

# Reset database
cd backend && npx prisma migrate reset

# View database
cd backend && npx prisma studio
```

### Testing
```bash
# Run backend tests
cd backend && npm test

# Run frontend tests  
cd frontend && npm test

# Type checking
cd frontend && npx tsc --noEmit
cd backend && npx tsc --noEmit
```

### Linting and Formatting
```bash
# Frontend linting
cd frontend && npm run lint

# Backend linting  
cd backend && npm run lint

# Fix linting issues
cd frontend && npm run lint -- --fix
```

## Technology Stack

### Frontend
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand
- **Drag & Drop:** @dnd-kit
- **Charts:** Recharts
- **Icons:** Lucide React
- **Real-time:** Socket.IO Client

### Backend  
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT
- **Real-time:** Socket.IO
- **Sentiment Analysis:** Natural NLP
- **Social APIs:** GitHub, Twitter, LinkedIn
- **CRM APIs:** Airtable, Notion, HubSpot

## Common Tasks

### Adding a New Deal Stage
1. Update `DEFAULT_STAGES` in `frontend/components/kanban/kanban-board.tsx`
2. Update stage validation in backend deal routes
3. Test drag and drop functionality

### Adding New Sentiment Source
1. Create service in `backend/src/services/social/`
2. Add to `SentimentAnalysisService.fetchContent()`
3. Update frontend to display new source data

### Adding Dashboard Widget
1. Create component in `frontend/components/dashboard/`
2. Add to `Dashboard` component
3. Implement data fetching and real-time updates

### Database Schema Changes
1. Modify `backend/prisma/schema.prisma`
2. Run `npx prisma migrate dev`
3. Update TypeScript types if needed
4. Update frontend components using the data

## Environment Variables

Critical environment variables to set:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Strong random string for token signing
- `GITHUB_TOKEN` - GitHub personal access token
- API keys for CRM integrations (optional but recommended)

## File Structure Guide

```
frontend/
├── app/                    # Next.js app router pages
├── components/
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard widgets and charts  
│   ├── kanban/           # Kanban board components
│   ├── layout/           # App layout components
│   └── ui/               # Reusable UI components
├── lib/
│   ├── stores/           # Zustand state stores
│   ├── api.ts            # API client functions
│   └── utils.ts          # Utility functions
└── types/                # TypeScript type definitions

backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   │   ├── social/       # Social media integrations
│   │   └── crm/          # CRM integrations  
│   ├── routes/           # API route definitions
│   ├── middleware/       # Express middleware
│   └── utils/            # Utility functions
└── prisma/               # Database schema and migrations
```

## Security Considerations

- JWT tokens are signed with `JWT_SECRET`
- All API keys stored in environment variables
- Rate limiting on API endpoints
- Input validation with Zod schemas
- CORS configured for specific origins
- SQL injection prevention via Prisma ORM

## Performance Notes

- Sentiment analysis runs in background cron jobs
- WebSocket connections for real-time updates
- Database indexes on frequently queried fields
- API response caching where appropriate
- Image optimization via Next.js

## Debugging Tips

- Use `LOG_LEVEL=debug` for verbose backend logging
- Check browser network tab for API call issues
- Use Prisma Studio to inspect database state
- WebSocket events visible in browser dev tools
- Backend logs show cron job execution

When working on this project, prioritize:
1. Maintaining real-time functionality
2. Data consistency between frontend and backend
3. Error handling and user feedback
4. Performance optimization
5. Security best practices