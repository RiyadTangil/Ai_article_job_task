# 🧠 AI-Powered Knowledgebase

A modern, full-stack application for managing articles and documentation with AI-powered summarization capabilities, built with Next.js, PostgreSQL, and Prisma.

![AI Knowledgebase](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)

## ✨ Features

### 🔐 Professional Authentication
- Secure JWT-based authentication
- Password strength validation
- Session management
- Social login ready (Google, GitHub)
- Modern, responsive UI

### 📝 Content Management
- Create, edit, and delete articles
- Rich text support with tags
- Advanced search and filtering
- Reading time estimation

### 🤖 AI Integration
- OpenAI-powered article summarization
- Intelligent fallback system
- Copy and share summaries

### 🎨 Modern UI/UX
- Beautiful gradient designs
- Smooth animations and transitions
- Fully responsive layout
- Professional form validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Automated Setup
\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd ai-knowledgebase

# Run the setup script
chmod +x setup.sh
./setup.sh
\`\`\`

### Manual Setup

#### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

#### 2. Database Setup
\`\`\`bash
# Create PostgreSQL database
createdb ai_knowledgebase

# Copy environment file
cp .env.example .env.local

# Update .env.local with your database URL
DATABASE_URL="postgresql://username:password@localhost:5432/ai_knowledgebase?schema=public"
\`\`\`

#### 3. Database Migration & Seeding
\`\`\`bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed with sample data
npm run db:seed
\`\`\`

#### 4. Start Development
\`\`\`bash
npm run dev
\`\`\`

### Demo Account
- **Email:** demo@example.com
- **Password:** password123

## 🛠️ Development

### Available Scripts
\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run type-check   # TypeScript type checking

# Database commands
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Create new migration
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
\`\`\`

### Project Structure
\`\`\`
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── auth/         # Authentication endpoints
│   ├── auth/             # Auth pages
│   └── dashboard/        # Dashboard
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── features/             # Feature modules
│   └── auth/            # Authentication
├── lib/                  # Utilities
│   ├── auth.ts          # Auth utilities
│   ├── db.ts            # Database connection
│   └── validations/     # Zod schemas
├── prisma/              # Database
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seeding
└── __tests__/           # Test files
\`\`\`

## 🗄️ Database Schema

### Users Table
- **id**: Unique identifier (CUID)
- **email**: User email (unique)
- **password**: Hashed password
- **name**: Full name
- **avatar**: Profile picture URL
- **role**: User role (USER)
- **verified**: Email verification status
- **createdAt/updatedAt**: Timestamps

### Articles Table
- **id**: Unique identifier (CUID)
- **title**: Article title
- **body**: Article content
- **excerpt**: Short description
- **tags**: Array of tags
- **published**: Publication status
- **views/likes**: Engagement metrics
- **readingTime**: Estimated reading time
- **userId**: Author reference
- **createdAt/updatedAt**: Timestamps

### Sessions Table
- **id**: Unique identifier (CUID)
- **userId**: User reference
- **token**: JWT token
- **expiresAt**: Expiration timestamp
- **createdAt**: Creation timestamp

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

\`\`\`env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ai_knowledgebase?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# OpenAI (Optional)
OPENAI_API_KEY="sk-your-openai-api-key-here"

# App Configuration
NEXT_PUBLIC_APP_NAME="AI Knowledgebase"
\`\`\`

### Database Configuration
1. Install PostgreSQL on your system
2. Create a new database: `createdb ai_knowledgebase`
3. Update the `DATABASE_URL` in `.env.local`
4. Run migrations: `npx prisma db push`
5. Seed data: `npm run db:seed`

## 🔒 Authentication System

### Features
- **JWT-based authentication** with secure token management
- **Password hashing** using bcryptjs
- **Session management** with database storage
- **Form validation** using Zod schemas
- **Professional UI** with React Hook Form

### Security Features
- Password strength requirements
- Token expiration handling
- Secure session cleanup
- Input validation and sanitization
- HTTPS enforcement ready

## 🧪 Testing

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:ci
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Add PostgreSQL database (Vercel Postgres or external)
4. Deploy automatically on push to main

### Database Hosting Options
- **Vercel Postgres** (Recommended for Vercel deployment)
- **Railway** (Easy PostgreSQL hosting)
- **Supabase** (PostgreSQL with additional features)
- **AWS RDS** (Enterprise-grade)
- **DigitalOcean Managed Databases**

## 📱 Features Showcase

### Modern Authentication
- Beautiful gradient login/register forms
- Real-time password strength validation
- Social login integration ready
- Professional error handling
- Responsive design

### Professional Dashboard
- Clean, modern interface
- Advanced search and filtering
- Statistics and analytics
- Grid and list view modes

### AI-Powered Features
- Real OpenAI integration
- Intelligent fallback system
- Beautiful loading states
- Copy and share functionality

## 🔧 Database Management

### Prisma Studio
Access your database with a visual interface:
\`\`\`bash
npm run db:studio
\`\`\`

### Migrations
Create and apply database changes:
\`\`\`bash
# Create migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npx prisma migrate deploy
\`\`\`

### Backup & Restore
\`\`\`bash
# Backup
pg_dump ai_knowledgebase > backup.sql

# Restore
psql ai_knowledgebase < backup.sql
\`\`\`

## 🐛 Troubleshooting

### Common Issues

**Database connection failed:**
\`\`\`bash
# Check PostgreSQL is running
brew services start postgresql  # macOS
sudo service postgresql start   # Linux

# Verify connection
psql -U postgres -d ai_knowledgebase
\`\`\`

**Prisma client out of sync:**
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

**Authentication errors:**
- Check JWT_SECRET is set in .env.local
- Verify database schema is up to date
- Clear browser localStorage and cookies

## 📊 Performance

- **Database indexing** on frequently queried fields
- **Connection pooling** with Prisma
- **JWT token optimization** with proper expiration
- **Caching strategies** for static content
- **Image optimization** with Next.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Prisma](https://www.prisma.io/) for the excellent ORM
- [PostgreSQL](https://www.postgresql.org/) for the robust database
- [Tailwind CSS](https://tailwindcss.com/) for beautiful styling
- [Radix UI](https://www.radix-ui.com/) for accessible components

---

Made with ❤️ by the AI Knowledgebase Team
