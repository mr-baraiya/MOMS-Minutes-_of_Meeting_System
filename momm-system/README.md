# MOMS - Minutes of Meeting Management System

A full-stack web application for managing organizational meetings, attendance tracking, document management, and reporting with role-based access control.

## Features

- JWT-based authentication with role-based access (Admin, Convener, Staff)
- Meeting scheduling and management
- Digital attendance tracking
- Document management with file uploads
- Automated notification system
- Interactive dashboards and reporting
- Global search functionality

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT with bcrypt
- **File Storage**: Vercel Blob
- **Email**: Nodemailer

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon account)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mr-baraiya/MOMS-Minutes-_of_Meeting_System.git
cd MOMS-Minutes-_of_Meeting_System/momm-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create `.env.local` file:
```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# JWT
JWT_SECRET="your-secret-key-min-32-characters"

# Vercel Blob (for file uploads)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token"

# Email (optional)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
```

4. **Set up database**
```bash
npx prisma migrate dev
npx prisma generate
npm run db:seed
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

### Demo Credentials

After seeding, you can login with:
- **Admin**: admin@example.com / password123
- **Convener**: convener@example.com / password123  
- **Staff**: staff@example.com / password123

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with demo data
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database (caution)

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

## Project Structure

```
momm-system/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── convener/          # Convener dashboard
│   └── staff/             # Staff dashboard
├── components/            # React Components
├── services/              # Business Logic
├── types/                 # TypeScript Types
├── prisma/               # Database schema
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request


