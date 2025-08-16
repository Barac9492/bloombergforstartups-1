# Deployment Guide

## Frontend Deployment (Vercel)

The frontend Next.js application can be deployed to Vercel.

### Configuration

1. **Environment Variables**: Update the backend URLs in `vercel.json` and `frontend/.env.production`:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.herokuapp.com
   NEXT_PUBLIC_WS_URL=https://your-backend-url.herokuapp.com
   ```

2. **Build Process**: The root `package.json` includes a build script that:
   - Installs frontend dependencies
   - Builds the Next.js application
   - Outputs to `frontend/.next`

### Vercel Settings

- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/.next`
- **Install Command**: `cd frontend && npm install`
- **Framework**: Next.js

### Alternative: Manual Vercel Configuration

If the vercel.json doesn't work properly, configure manually in Vercel dashboard:

1. **Root Directory**: Leave empty (deploy from root)
2. **Build Command**: `cd frontend && npm install && npm run build`
3. **Output Directory**: `frontend/.next`
4. **Install Command**: `cd frontend && npm install`

## Backend Deployment (Heroku/Railway/etc.)

The backend Express.js application can be deployed to various platforms:

### Preparation

1. **Environment Variables**:
   ```
   DATABASE_URL=your-postgres-connection-string
   JWT_SECRET=your-jwt-secret
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

2. **Database**: 
   - For production, use PostgreSQL instead of SQLite
   - Update `backend/prisma/schema.prisma` provider to `postgresql`
   - Run migrations: `npx prisma migrate deploy`

3. **Build**:
   ```bash
   cd backend
   npm install
   npm run build
   npm start
   ```

## Local Development

1. **Setup**:
   ```bash
   npm run install:all
   ```

2. **Development**:
   ```bash
   npm run dev
   ```

3. **Access**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5001

## Notes

- The application is configured for personal use (auto-login enabled)
- API authentication uses a hardcoded token for simplicity
- For production use, implement proper authentication flow
- Backend should be deployed before frontend to get the correct API URLs