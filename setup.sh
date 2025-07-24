#!/bin/bash

echo "🚀 Setting up AI Knowledgebase with PostgreSQL..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL first."
    echo "   macOS: brew install postgresql"
    echo "   Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    echo "   Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

echo "✅ PostgreSQL is available"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ Created .env.local - please update with your database configuration"
else
    echo "✅ .env.local already exists"
fi

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Create database (optional - user might want to do this manually)
read -p "🗄️  Do you want to create the database? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter database name (default: ai_knowledgebase): " DB_NAME
    DB_NAME=${DB_NAME:-ai_knowledgebase}
    
    read -p "Enter PostgreSQL username (default: postgres): " DB_USER
    DB_USER=${DB_USER:-postgres}
    
    echo "Creating database $DB_NAME..."
    createdb -U $DB_USER $DB_NAME 2>/dev/null || echo "Database might already exist"
    
    # Update .env.local with database URL
    sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://$DB_USER:password@localhost:5432/$DB_NAME?schema=public\"|" .env.local
    echo "✅ Updated DATABASE_URL in .env.local"
fi

# Push database schema
echo "📊 Setting up database schema..."
npx prisma db push

# Seed database
echo "🌱 Seeding database with sample data..."
npm run db:seed

echo ""
echo "🎉 Setup complete! Here's how to get started:"
echo ""
echo "1. Update your .env.local file with your database credentials"
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Demo credentials:"
echo "Email: demo@example.com"
echo "Password: password123"
echo ""
echo "📚 Additional commands:"
echo "- npm run db:studio    # Open Prisma Studio"
echo "- npm run db:migrate   # Create new migration"
echo "- npm test             # Run tests"
echo "- npm run lint         # Run linter"
echo "- npm run build        # Build for production"
echo "- npm run docker:run   # Run with Docker"
echo ""
echo "Happy coding! 🚀"
