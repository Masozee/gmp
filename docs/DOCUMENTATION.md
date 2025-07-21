# Partisipasi Muda Foundation - Application Documentation

## Table of Contents
1. [Overview](#overview)
2. [About the Organization](#about-the-organization)
3. [Application Architecture](#application-architecture)
4. [Features](#features)
5. [Technology Stack](#technology-stack)
6. [Project Structure](#project-structure)
7. [Installation & Setup](#installation--setup)
8. [Development Guide](#development-guide)
9. [API Documentation](#api-documentation)
10. [Admin Panel](#admin-panel)
11. [Deployment](#deployment)
12. [Contributing](#contributing)

## Overview

The Partisipasi Muda Foundation website is a comprehensive digital platform designed to empower Indonesian youth aged 17-25 through political education and civic engagement. The application serves as both an informational hub and an interactive platform for youth participation in democracy and public policy formulation.

### Key Objectives
- **Political Education**: Provide accessible political education resources for Indonesian youth
- **Civic Engagement**: Facilitate youth participation in democratic processes
- **Community Building**: Create a platform for young changemakers to connect and collaborate
- **Information Dissemination**: Share publications, events, and opportunities related to political participation

## About the Organization

**Yayasan Partisipasi Muda (YPM)**, widely known as "Generasi Melek Politik" (Politically Literate Generation), is a dynamic non-profit organization founded in 2017. The foundation is dedicated to transforming Indonesia's democratic culture by ensuring young voices are heard and impactful.

### Mission
Encouraging political participation of Indonesian youth through relevant and engaging education.

### Vision
Building a generation of changemakers by empowering Indonesian youth aged 17-25 to participate in democracy and public policy formulation.

### Core Values
- **Non-partisan**: Not affiliated with any political party or political figure
- **Youth-focused**: Specifically targeting Indonesian youth aged 17-25
- **Democratic**: Promoting democratic values and civic engagement
- **Inclusive**: Creating accessible opportunities for all young people

### Historical Timeline
- **2017**: Founded in response to the Jakarta Regional Election filled with divisive narratives
- **2018**: Officially legalized as Partisipasi Muda Foundation (Ministry of Law and Human Rights RI No: 5018071931100892)
- **2018-2019**: Launched Academia Politica and Millennial Congress programs
- **2020**: Conducted Indonesia's first digital townhall meeting on environmental policy

## Application Architecture

The application is built using **Next.js 15** with the App Router architecture, providing:

- **Server-Side Rendering (SSR)**: For optimal SEO and performance
- **Static Site Generation (SSG)**: For content pages
- **Client-Side Rendering (CSR)**: For interactive components
- **API Routes**: For backend functionality
- **Middleware**: For authentication and routing protection

### Key Architectural Decisions
- **Bilingual Support**: Full Indonesian and English language support
- **Component-Based Architecture**: Reusable React components
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Accessibility**: WCAG compliance with dedicated accessibility features
- **Authentication**: Supabase-based authentication system

## Features

### Public Features

#### 1. **Homepage**
- Hero section with organization introduction
- Latest publications showcase
- Upcoming events display
- Partner organizations grid
- Testimonials carousel
- Participation information

#### 2. **About Us Section** (`/tentang-kami`)
- **Mission & Goals** (`/tujuan`): Detailed organizational objectives
- **Journey** (`/perjalanan`): Historical timeline and milestones
- **Board & Management** (`/board-pengurus`): Team information

#### 3. **Programs** (`/program`)
- Educational programs and initiatives
- Workshop and training opportunities
- Community engagement activities

#### 4. **Publications** (`/publikasi`)
- Articles and research papers
- Policy briefs and analysis
- Educational materials
- Downloadable resources (PDF support)

#### 5. **Events** (`/acara`)
- Upcoming events calendar
- Event registration system
- Past events archive
- Interactive event details

#### 6. **Career Opportunities** (`/karir`)
- Internship positions
- Volunteer opportunities
- Job openings
- Application system

#### 7. **Strategic Partners** (`/mitra-strategis`)
- Partner organization showcase
- Collaboration highlights
- Partnership opportunities

#### 8. **Donations** (`/donasi`)
- Donation information
- Collaboration opportunities
- Support the organization

#### 9. **Data & Reports** (`/report`)
- Interactive data visualizations
- Indonesia map with provincial data
- Charts and statistics
- Research findings

### Administrative Features

#### 1. **Admin Dashboard** (`/admin`)
- Content management system
- User authentication
- Data analytics
- System monitoring

#### 2. **Content Management**
- Publication management
- Event management
- User management
- Media library

### Bilingual Support
- **Indonesian** (default): `/`
- **English**: `/en`
- Complete translation for all content
- Language-specific routing and components

### Accessibility Features
- **Screen reader support**
- **Keyboard navigation**
- **High contrast mode**
- **Font size adjustment**
- **Skip to content links**
- **ARIA labels and descriptions**

## Technology Stack

### Frontend
- **Next.js 15.3.1**: React framework with App Router
- **React 19.0.0**: UI library
- **TypeScript 5**: Type safety
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **Framer Motion 12.9.4**: Animation library
- **Radix UI**: Accessible component primitives

### Backend & Database
- **Supabase**: Backend-as-a-Service
  - Authentication
  - Database (PostgreSQL)
  - Real-time subscriptions
  - Storage

### Data Visualization
- **Chart.js 4.4.9**: Chart library
- **React Chart.js 2**: React wrapper for Chart.js
- **Recharts 2.15.3**: React charting library
- **D3.js**: Data visualization utilities
- **Leaflet**: Interactive maps
- **React Leaflet**: React wrapper for Leaflet

### UI Components & Styling
- **Lucide React**: Icon library
- **React Icons**: Additional icons
- **Geist Font**: Typography
- **Tailwind Animate**: CSS animations
- **Class Variance Authority**: Component variants

### Development Tools
- **ESLint**: Code linting
- **Autoprefixer**: CSS vendor prefixes
- **PostCSS**: CSS processing
- **Turbopack**: Fast bundler (development)

### Additional Libraries
- **React Markdown**: Markdown rendering
- **Zod**: Schema validation
- **Sonner**: Toast notifications
- **React DnD Kit**: Drag and drop functionality
- **Vaul**: Drawer component

## Project Structure

```
partisipasimuda/
├── public/                          # Static assets
│   ├── images/                      # Image assets
│   │   ├── logo/                    # Logo files
│   │   └── bg/                      # Background images
│   └── favicon.ico                  # Favicon
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (root)/                  # Indonesian routes
│   │   │   ├── components/          # Page-specific components
│   │   │   ├── tentang-kami/        # About us pages
│   │   │   ├── program/             # Programs pages
│   │   │   ├── publikasi/           # Publications pages
│   │   │   ├── acara/               # Events pages
│   │   │   ├── karir/               # Career pages
│   │   │   ├── mitra-strategis/     # Partners page
│   │   │   ├── donasi/              # Donation page
│   │   │   ├── report/              # Data reports
│   │   │   ├── admin/               # Admin panel
│   │   │   ├── api/                 # API routes
│   │   │   ├── login/               # Authentication
│   │   │   ├── layout.tsx           # Root layout
│   │   │   └── page.tsx             # Homepage
│   │   ├── en/                      # English routes
│   │   │   ├── components/          # English components
│   │   │   ├── about-us/            # About us (EN)
│   │   │   ├── programs/            # Programs (EN)
│   │   │   ├── publications/        # Publications (EN)
│   │   │   ├── events/              # Events (EN)
│   │   │   ├── careers/             # Careers (EN)
│   │   │   ├── strategic-partners/  # Partners (EN)
│   │   │   ├── donate/              # Donation (EN)
│   │   │   ├── layout.tsx           # English layout
│   │   │   └── page.tsx             # English homepage
│   │   └── globals.css              # Global styles
│   ├── components/                  # Shared components
│   │   ├── ui/                      # UI primitives
│   │   └── ...                      # Feature components
│   ├── data/                        # Static data files
│   │   ├── publikasi.json           # Publications data
│   │   ├── events.json              # Events data
│   │   ├── karir.json               # Career data
│   │   ├── testimoni.json           # Testimonials
│   │   ├── board.json               # Board members
│   │   └── ...                      # Other data files
│   ├── lib/                         # Utility libraries
│   │   ├── supabase.ts              # Supabase client
│   │   ├── utils.ts                 # Utility functions
│   │   └── accessibility-context.tsx # Accessibility context
│   ├── hooks/                       # Custom React hooks
│   └── middleware.ts                # Next.js middleware
├── package.json                     # Dependencies
├── tailwind.config.js               # Tailwind configuration
├── next.config.js                   # Next.js configuration
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # Basic project info
```

## Installation & Setup

### Prerequisites
- **Node.js** 18.0 or higher
- **npm**, **yarn**, **pnpm**, or **bun**
- **Git**

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Analytics and other services
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/partisipasimuda.git
   cd partisipasimuda
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Development Guide

### Available Scripts

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Code Style Guidelines

#### TypeScript
- Use TypeScript for all new files
- Define proper interfaces and types
- Avoid `any` type usage

#### React Components
- Use functional components with hooks
- Implement proper prop types
- Follow component naming conventions

#### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography

#### File Naming
- Use kebab-case for files and folders
- Use PascalCase for React components
- Use camelCase for functions and variables

### Component Development

#### Creating New Components
```typescript
// components/ExampleComponent.tsx
import React from 'react';

interface ExampleComponentProps {
  title: string;
  description?: string;
}

const ExampleComponent: React.FC<ExampleComponentProps> = ({ 
  title, 
  description 
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {description && (
        <p className="text-gray-600">{description}</p>
      )}
    </div>
  );
};

export default ExampleComponent;
```

#### Accessibility Guidelines
- Include proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios
- Provide alternative text for images

### Data Management

#### Static Data
- Store static data in `/src/data/` as JSON files
- Use TypeScript interfaces for data structure
- Implement data validation with Zod

#### Dynamic Data
- Use Supabase for dynamic content
- Implement proper error handling
- Cache data when appropriate

## API Documentation

### Public API Endpoints

#### Publications API
```
GET /api/publikasi
```
Returns list of publications with pagination support.

**Response:**
```json
{
  "data": [
    {
      "title": "Publication Title",
      "url": "publication-slug",
      "date": "2023-12-01",
      "type": "artikel",
      "author": "Author Name",
      "image": "image-url",
      "content": "Publication content..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

#### Events API
```
GET /api/events
```
Returns upcoming and past events.

**Response:**
```json
{
  "upcoming": [...],
  "past": [...]
}
```

### Admin API Endpoints

#### Authentication Required
All admin endpoints require authentication via Supabase.

#### Content Management
```
POST /api/admin/publikasi
PUT /api/admin/publikasi/[id]
DELETE /api/admin/publikasi/[id]
```

## Admin Panel

### Access Control
- **Authentication**: Supabase Auth
- **Authorization**: Role-based access control
- **Session Management**: Automatic session refresh

### Features
- **Content Management**: Create, edit, delete publications and events
- **User Management**: Manage user accounts and permissions
- **Analytics Dashboard**: View site statistics and engagement metrics
- **Media Library**: Upload and manage images and documents

### Admin Routes
- `/admin` - Dashboard
- `/admin/publikasi` - Publications management
- `/admin/events` - Events management
- `/admin/users` - User management

## Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   - Import project to Vercel
   - Connect GitHub repository

2. **Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure Supabase URLs are correctly configured

3. **Build Settings**
   ```bash
   # Build Command
   npm run build
   
   # Output Directory
   .next
   ```

4. **Domain Configuration**
   - Set up custom domain
   - Configure SSL certificates

### Alternative Deployment Options

#### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Traditional Hosting
1. Build the application: `npm run build`
2. Upload the `.next` folder and other necessary files
3. Configure server to serve the application

### Performance Optimization

#### Image Optimization
- Use Next.js Image component
- Implement proper image sizing
- Enable WebP format support

#### Code Splitting
- Implement dynamic imports
- Use React.lazy for component loading
- Optimize bundle sizes

#### Caching Strategy
- Configure proper cache headers
- Implement service worker for offline support
- Use CDN for static assets

## Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test your changes**
5. **Commit with descriptive messages**
   ```bash
   git commit -m "feat: add new publication management feature"
   ```
6. **Push to your fork**
7. **Create a Pull Request**

### Contribution Guidelines

#### Code Quality
- Follow existing code style
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

#### Pull Request Process
- Provide clear description of changes
- Include screenshots for UI changes
- Ensure all tests pass
- Request review from maintainers

#### Issue Reporting
- Use issue templates
- Provide detailed reproduction steps
- Include environment information
- Add relevant labels

### Community Guidelines
- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and best practices
- Contribute to discussions constructively

## Support & Contact

### Technical Support
- **GitHub Issues**: For bug reports and feature requests
- **Documentation**: Refer to this documentation for guidance
- **Community**: Join discussions in GitHub Discussions

### Organization Contact
- **Website**: [partisipasimuda.org](https://partisipasimuda.org)
- **Email**: Contact through official website
- **Social Media**: @partisipasimuda

### License
This project is licensed under the terms specified in the LICENSE file.

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Maintainers**: Partisipasi Muda Foundation Development Team 