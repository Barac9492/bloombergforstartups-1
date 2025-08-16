#!/bin/bash

echo "🚀 Setting up Bloomberg for Startups platform..."

# Check for required dependencies
check_dependency() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        exit 1
    fi
}

echo "📋 Checking dependencies..."
check_dependency "node"
check_dependency "npm"
check_dependency "psql"

echo "✅ All dependencies found!"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Set up environment files
echo "🔧 Setting up environment files..."
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "⚠️  Please configure backend/.env with your database and API keys"
fi

if [ ! -f "frontend/.env.local" ]; then
    cp frontend/.env.example frontend/.env.local
    echo "⚠️  Please configure frontend/.env.local if needed"
fi

# Database setup
echo "🗄️  Setting up database..."
echo "Please make sure PostgreSQL is running and create a database named 'bloomberg_startups'"
echo "Then run the following commands:"
echo "  cd backend"
echo "  npx prisma generate"
echo "  npx prisma migrate dev"
echo ""

echo "🎉 Setup completed!"
echo ""
echo "📚 Next steps:"
echo "  1. Configure your database in backend/.env"
echo "  2. Set up API keys for social media and CRM integrations"
echo "  3. Run 'npm run dev' to start the development server"
echo ""
echo "📖 For more information, see README.md"