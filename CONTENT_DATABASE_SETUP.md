# Content Database Schemas & API Documentation

This document outlines the database schemas created from the JSON files in `/src/data` folder and their corresponding API endpoints.

## 📊 Database Schemas

### 1. **Events** (`events` table)
Based on: `src/data/events.json`

**Fields:**
- `id` - Auto-increment integer primary key
- `slug` - URL slug (unique)
- `title` - Event title
- `date` - Event date
- `time` - Event time
- `location` - Event location
- `address` - Full address (optional)
- `description` - Event description
- `enDescription` - English description (optional)
- `image` - Event image path
- `category` - Event category
- `isPaid` - Boolean for paid events
- `price` - Event price (if paid)
- `isRegistrationOpen` - Boolean for registration status
- `capacity` - Maximum attendees
- `registeredCount` - Current registered count
- `createdAt`, `updatedAt` - Timestamps

### 2. **Publications** (`publications` table)
Based on: `src/data/publikasi.json`

**Fields:**
- `id` - Auto-increment integer primary key
- `slug` - URL slug (unique)
- `title` - Publication title
- `date` - Publication date
- `count` - View count
- `image` - Publication image
- `type` - Type: 'riset', 'artikel', 'dampak'
- `pdfUrl` - PDF download link (optional)
- `author` - Author name
- `order` - Display order
- `content` - Full content
- `createdAt`, `updatedAt` - Timestamps

### 3. **Partners** (`partners` table)
Based on: `src/data/partners.json`

**Fields:**
- `id` - Auto-increment primary key
- `order` - Display order (unique)
- `name` - Partner name
- `logo` - Logo image path
- `url` - Partner website (optional)
- `createdAt`, `updatedAt` - Timestamps

### 4. **Careers** (`careers` table)
Based on: `src/data/karir.json`

**Fields:**
- `id` - Auto-increment integer primary key
- `slug` - URL slug (unique)
- `title` - Job title
- `type` - Job type: 'internship', 'full-time', 'part-time', 'contract', 'volunteer'
- `location` - Job location
- `duration` - Job duration
- `deadline` - Application deadline
- `postedDate` - Posted date
- `poster` - Job poster image
- `description` - Job description
- `responsibilities` - Job responsibilities
- `requirements` - Job requirements
- `benefits` - Job benefits
- `applyUrl` - Application URL
- `isActive` - Boolean for active status
- `createdAt`, `updatedAt` - Timestamps

### 5. **Testimonials** (`testimonials` table)
Based on: `src/data/testimoni.json`

**Fields:**
- `id` - Auto-increment primary key
- `name` - Person name
- `age` - Person age
- `school` - School/Institution
- `image` - Profile image
- `quote` - Testimonial quote
- `isActive` - Boolean for active status
- `createdAt`, `updatedAt` - Timestamps

### 6. **Discussions** (`discussions` table)
Based on: `src/data/diskusi.json`

**Fields:**
- `id` - Auto-increment primary key
- `title` - Discussion title
- `slug` - URL slug (unique)
- `image` - Discussion image
- `date` - Discussion date
- `description` - Short description
- `content` - Full content (optional)
- `isActive` - Boolean for active status
- `createdAt`, `updatedAt` - Timestamps

### 7. **Board Members** (`board_members` table)
Based on: `src/data/board.json`

**Fields:**
- `id` - Auto-increment primary key
- `photo` - Profile photo
- `name` - Member name
- `position` - Position/Title
- `bio` - Biography (optional)
- `order` - Display order
- `isActive` - Boolean for active status
- `createdAt`, `updatedAt` - Timestamps

### 8. **Organization Staff** (`organization_staff` table)
Based on: `src/data/pengurus-gmp.json`

**Fields:**
- `id` - Auto-increment primary key
- `photo` - Profile photo
- `name` - Staff name
- `position` - Position/Title
- `bio` - Biography (optional)
- `email` - Email address (optional)
- `socialMedia` - JSON string for social media links (optional)
- `order` - Display order
- `isActive` - Boolean for active status
- `createdAt`, `updatedAt` - Timestamps

### 9. **Event Registrations** (`event_registrations` table)
For tracking event registrations

**Fields:**
- `id` - Auto-increment primary key
- `eventId` - Foreign key to events table
- `name` - Registrant name
- `email` - Registrant email
- `phone` - Phone number (optional)
- `institution` - Institution (optional)
- `registrationDate` - Registration timestamp
- `status` - Status: 'registered', 'confirmed', 'attended', 'cancelled'
- `createdAt`, `updatedAt` - Timestamps

### 10. **Newsletter Subscriptions** (`newsletter_subscriptions` table)
For managing newsletter subscriptions

**Fields:**
- `id` - Auto-increment primary key
- `email` - Email address (unique)
- `name` - Subscriber name (optional)
- `isActive` - Boolean for active status
- `subscribedAt` - Subscription timestamp
- `unsubscribedAt` - Unsubscription timestamp (optional)

### 11. **Contact Messages** (`contact_messages` table)
For managing contact form submissions

**Fields:**
- `id` - Auto-increment primary key
- `name` - Sender name
- `email` - Sender email
- `subject` - Message subject (optional)
- `message` - Message content
- `status` - Status: 'new', 'read', 'replied', 'archived'
- `createdAt`, `updatedAt` - Timestamps

## 🚀 API Endpoints

Base URL: `/api/content`

### **Public Endpoints**

#### Events
- `GET /events` - Get all events
- `GET /events/:id` - Get specific event by ID
- `GET /events/slug/:slug` - Get specific event by slug
- `POST /events/:id/register` - Register for event

#### Publications
- `GET /publications` - Get all publications (ordered by order field)
- `GET /publications/:slug` - Get specific publication by slug

#### Partners
- `GET /partners` - Get all partners (ordered by order field)

#### Careers
- `GET /careers` - Get all active careers
- `GET /careers/:slug` - Get specific career by slug

#### Testimonials
- `GET /testimonials` - Get all active testimonials

#### Discussions
- `GET /discussions` - Get all active discussions
- `GET /discussions/:slug` - Get specific discussion by slug

#### Board & Staff
- `GET /board` - Get all active board members
- `GET /staff` - Get all active organization staff

#### Public Forms
- `POST /newsletter/subscribe` - Subscribe to newsletter
- `POST /contact` - Submit contact form

### **Admin Endpoints** (Authentication Required)

#### Event Management
- `GET /admin/events/:id/registrations` - Get event registrations

#### Communication Management
- `GET /admin/messages` - Get all contact messages
- `GET /admin/newsletter` - Get newsletter subscriptions

## 📝 Database Scripts

### Available Commands

```bash
# Generate new migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Initialize with admin user
npm run db:init

# Seed database with JSON data
npm run db:seed

# Open Drizzle Studio (Database GUI)
npm run db:studio
```

### Setup Process

1. **Generate and run migrations:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

2. **Initialize with admin user:**
   ```bash
   npm run db:init
   ```

3. **Seed with content data:**
   ```bash
   npm run db:seed
   ```

## 🔧 Usage Examples

### Frontend Integration

#### Fetch Events
```typescript
const response = await fetch('/api/content/events');
const { events } = await response.json();
```

#### Register for Event
```typescript
const response = await fetch('/api/content/events/1/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+62123456789',
    institution: 'University XYZ'
  })
});
```

#### Subscribe to Newsletter
```typescript
const response = await fetch('/api/content/newsletter/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'User Name'
  })
});
```

#### Submit Contact Form
```typescript
const response = await fetch('/api/content/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Question about events',
    message: 'I would like to know more about your events.'
  })
});
```

### Admin Operations

#### Get Event Registrations (Admin only)
```typescript
const response = await fetch('/api/content/admin/events/1/registrations', {
  credentials: 'include'
});
const { registrations } = await response.json();
```

#### Get Contact Messages (Admin only)
```typescript
const response = await fetch('/api/content/admin/messages', {
  credentials: 'include'
});
const { messages } = await response.json();
```

## 🗂️ File Structure

```
src/
├── lib/
│   └── db/
│       ├── schema.ts           # Main schema (auth + re-exports)
│       ├── content-schema.ts   # Content schemas
│       └── index.ts           # Database connection
├── app/
│   └── api/
│       └── content/
│           └── [[...route]]/
│               └── route.ts    # Content API endpoints
└── data/                      # Original JSON files
    ├── events.json
    ├── publikasi.json
    ├── partners.json
    ├── karir.json
    ├── testimoni.json
    ├── diskusi.json
    ├── board.json
    └── pengurus-gmp.json

scripts/
├── init-db.ts                 # Initialize with admin user
└── seed-data.ts              # Seed with JSON data
```

## 🔒 Security Features

- **Authentication Required**: Admin endpoints require valid session
- **Role-based Access**: Admin-only endpoints check user role
- **Input Validation**: All endpoints validate required fields
- **SQL Injection Protection**: Using Drizzle ORM with parameterized queries
- **Unique Constraints**: Email uniqueness for subscriptions, URL slugs for content

## 📈 Benefits

1. **Performance**: SQLite database is faster than reading JSON files
2. **Scalability**: Easy to add new fields and relationships
3. **Data Integrity**: Foreign keys and constraints ensure data consistency
4. **Admin Interface**: Built-in admin endpoints for content management
5. **Type Safety**: Full TypeScript support with inferred types
6. **Real-time Updates**: Dynamic content without code changes
7. **Analytics**: Track registrations, subscriptions, and engagement

The database now contains all the content from your JSON files and provides a robust API for managing and accessing this data! 