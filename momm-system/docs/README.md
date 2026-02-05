# MOMS System Documentation

Welcome to the Minutes of Meeting System (MOMS) documentation.

## 📚 Documentation Index

### 🎯 Implementation Overview
- **[Implementation Summary](./IMPLEMENTATION_SUMMARY.md)** - **START HERE** - Complete project status, features, and achievements

### 🚀 Getting Started
- [README](../README.md) - Project overview and setup instructions
- [Environment Setup](./ENVIRONMENT_SETUP.md) - Environment variables configuration guide

### 📊 Dashboard System
- [Dashboard Guide](./DASHBOARD_GUIDE.md) - Role-based dashboard features and usage
- [Dashboard API](./DASHBOARD_API.md) - Dashboard endpoint reference
- [Dashboard Components](./DASHBOARD_COMPONENTS.md) - Component API and props
- [Dashboard Services](./DASHBOARD_SERVICES.md) - Frontend service layer

### 🔐 Authentication & Security
- [Authentication Guide](./AUTHENTICATION_GUIDE.md) - JWT + bcrypt implementation guide
- Includes: Login/Register, Token management, Role-based access

### 🎨 UI Components
- [Lucide Icons Guide](./LUCIDE_ICONS_GUIDE.md) - Icon usage patterns and migration guide

### 📁 Project Structure
- [Folder Structure](./FOLDER_STRUCTURE.md) - Project organization and conventions

### 🔌 API Documentation
- [API Testing Guide](./API_TESTING_GUIDE.md) - Complete API endpoint testing documentation
- [API Base URL Guide](./API_BASE_URL_GUIDE.md) - Understanding API URLs and client-side fetching

### Project Structure
```
momm-system/
├── app/              # Next.js app directory
│   ├── api/          # API routes
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/       # React components
├── services/         # Business logic layer
├── lib/              # Utility functions
├── types/            # TypeScript type definitions
├── prisma/           # Database schema and migrations
└── docs/             # Documentation (you are here)
```

## 🚀 Quick Links

- **API Endpoints:** 39 endpoints across 8 resource categories
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** bcrypt password hashing + JWT (planned)
- **Frontend:** Next.js 16 with React 19

## 📖 Documentation Files

### [API Testing Guide](./API_TESTING_GUIDE.md)
Comprehensive guide for testing all API endpoints with:
- cURL examples
- PowerShell examples
- Request/response samples
- Testing checklist

### [API Base URL Guide](./API_BASE_URL_GUIDE.md)
Explains the difference between:
- Server-side services (direct database access)
- Client-side fetching (HTTP requests)
- API configuration and best practices

### [Environment Setup](./ENVIRONMENT_SETUP.md)
Complete guide for:
- Local development setup
- Production configuration
- Environment variable management
- Security best practices

## 🛠️ Development Resources

### Commands
```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
npx prisma migrate dev  # Run migrations
```

### Environment Files
- `.env.local` - Local development (active)
- `.env.production` - Production deployment
- `.env.example` - Template for team members

## 🔗 External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Last Updated:** January 2, 2026
