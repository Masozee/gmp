# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for Yayasan Partisipasi Muda (YPM), a non-profit focused on political education for Indonesian youth aged 17-25. The application serves as both a public website and an admin-managed content platform.

## Essential Commands

### Development
```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server (uses custom server.js)
npm run start

# Lint code
npm run lint
```

### Database Operations
```bash
# Generate database migrations
npm run db:generate

# Run database migrations  
npm run db:migrate

# Initialize database with migrations and seed data
npm run db:init

# Seed database with sample data
npm run db:seed

# Open Drizzle database studio
npm run db:studio
```

## Architecture Overview

### Database Architecture
- **SQLite** database using **Drizzle ORM** with LibSQL client
- **Dual schema system**: 
  - `src/lib/db/schema.ts` - User authentication and basic models
  - `src/lib/db/content-schema.ts` - Content management (events, publications, research data, etc.)
- **Migration system**: Uses `scripts/migrate.ts` and Drizzle Kit
- **Data seeding**: Comprehensive seeding system with multiple scripts in `/scripts/`

### Application Structure
- **Bilingual support**: Full Indonesian (root `/`) and English (`/en`) routes
- **Admin panel**: Protected routes under `/admin` with session-based authentication
- **API architecture**: RESTful APIs under `/api` with separate admin endpoints
- **Component architecture**: Shared components in `/src/components`, page-specific in `/src/app/components`

### Key Technologies
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Drizzle ORM** with SQLite/LibSQL
- **Tailwind CSS** with custom design system
- **Framer Motion** for animations
- **React Leaflet** for interactive maps
- **Chart.js/Recharts** for data visualization

## Critical Implementation Details

### Authentication & Middleware
- Uses custom session-based authentication (not Supabase despite old docs)
- Middleware at `src/middleware.ts` protects `/admin` routes
- Session validation through cookie-based system
- Authentication APIs in `/api/auth/`

### Database Connection
- Supports both local SQLite (`file:./database.sqlite`) and cloud LibSQL/Turso
- Connection configured via `DATABASE_URL` and `DATABASE_AUTH_TOKEN` environment variables
- Database client in `src/lib/db/index.ts` combines both schemas

### Content Management System
The application has a sophisticated CMS with these key entities:
- **Publications**: Articles, research, reports with bilingual support
- **Events**: With registration system and capacity management  
- **Programs**: Educational programs and initiatives
- **Research Data**: Survey responses and analytics
- **Homepage Slides**: Dynamic slideshow content
- **Partners**: Organization partnerships
- **Board Members**: Team management

### Map Integration
- **Interactive Indonesia map** using React Leaflet
- **Province-level data visualization** with timezone-based groupings
- **Survey data integration** from research database tables
- **Real-time API endpoints** (`/api/map-data`) serving dynamic statistics
- Map component at `src/app/components/InteractiveMap.tsx` fetches live database data

### Bilingual Implementation
- **Route structure**: Root level (Indonesian) and `/en` (English)
- **Component duplication**: English components in `src/app/en/components/`
- **Database support**: English fields in content tables (e.g., `title_en`, `content_en`)
- **Language switching**: Implemented throughout the application

## Development Patterns

### API Development
- **Admin APIs**: Protected routes under `/api/admin/` requiring authentication
- **Public APIs**: Open endpoints for content delivery
- **Error handling**: Consistent error responses with proper HTTP status codes
- **Type safety**: TypeScript interfaces generated from Drizzle schemas

### Component Development
- **Responsive design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: WCAG compliance with dedicated accessibility context
- **Animation**: Framer Motion for page transitions and interactive elements
- **Dynamic imports**: Used for client-side only components (maps, charts)

### Data Flow
- **Static data**: JSON files in `src/data/` for initial content
- **Dynamic data**: Database-driven content through API routes
- **Client-side state**: React hooks and context for UI state
- **Server-side rendering**: SSR for SEO-critical pages, CSR for interactive components

### Custom Server
- Uses custom `server.js` for production deployment
- Handles Next.js application with custom hostname/port configuration
- Required for deployment environments that need custom server logic

## Important File Locations

### Core Configuration
- `drizzle.config.ts` - Database configuration
- `src/lib/db/content-schema.ts` - Main database schema
- `src/middleware.ts` - Authentication and route protection
- `tailwind.config.js` - Design system configuration

### Key Components
- `src/app/components/InteractiveMap.tsx` - Indonesia map with live data
- `src/components/ui/` - Reusable UI component library
- `src/app/admin/` - Complete admin panel implementation

### Data Management
- `scripts/` - Database migration and seeding utilities
- `src/data/` - Static JSON data files
- `public/data/` - GeoJSON and public data files

This codebase emphasizes accessibility, bilingual support, and comprehensive content management for a youth political education organization.