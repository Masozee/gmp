import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Events schema
export const events = sqliteTable('events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  location: text('location').notNull(),
  address: text('address'),
  description: text('description').notNull(),
  enDescription: text('en_description'),
  image: text('image'),
  category: text('category').notNull(),
  isPaid: integer('is_paid', { mode: 'boolean' }).notNull().default(false),
  price: integer('price'),
  isRegistrationOpen: integer('is_registration_open', { mode: 'boolean' }).notNull().default(true),
  capacity: integer('capacity').notNull(),
  registeredCount: integer('registered_count').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Publications schema
export const publications = sqliteTable('publications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  date: text('date').notNull(),
  count: text('count').notNull().default('0'),
  image_url: text('image_url'), // Renamed from image
  type: text('type', { enum: ['riset', 'artikel', 'dampak'] }).notNull(),
  pdf_url: text('pdf_url'), // Renamed from pdfUrl
  author: text('author').notNull(),
  description: text('description'), // Added description field
  order: integer('order').notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Partners schema
export const partners = sqliteTable('partners', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  order: integer('order').notNull().unique(),
  name: text('name').notNull(),
  logo: text('logo').notNull(),
  url: text('url'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Career/Job opportunities schema
export const careers = sqliteTable('careers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  type: text('type', { enum: ['internship', 'full-time', 'part-time', 'contract', 'volunteer'] }).notNull(),
  location: text('location'),
  duration: text('duration'),
  deadline: text('deadline'),
  postedDate: text('posted_date').notNull(),
  poster: text('poster'),
  description: text('description').notNull(),
  responsibilities: text('responsibilities'),
  requirements: text('requirements'),
  benefits: text('benefits'),
  applyUrl: text('apply_url'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Testimonials schema
export const testimonials = sqliteTable('testimonials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  school: text('school').notNull(),
  image: text('image'),
  quote: text('quote').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Discussions schema
export const discussions = sqliteTable('discussions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  image: text('image'),
  date: text('date').notNull(),
  description: text('description'),
  content: text('content'), // For full content if needed
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Board members schema
export const boardMembers = sqliteTable('board_members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  photo: text('photo'),
  name: text('name').notNull(),
  position: text('position').notNull(),
  bio: text('bio'), // Additional field for biography
  order: integer('order'), // For ordering display
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Organization staff/management schema (pengurus-gmp)
export const organizationStaff = sqliteTable('organization_staff', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  photo: text('photo'),
  name: text('name').notNull(),
  position: text('position').notNull(),
  bio: text('bio'), // Additional field for biography
  email: text('email'),
  socialMedia: text('social_media'), // JSON string for social media links
  order: integer('order'), // For ordering display
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Event registrations schema (for tracking who registers for events)
export const eventRegistrations = sqliteTable('event_registrations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventId: integer('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  institution: text('institution'),
  registrationDate: text('registration_date').notNull().default(sql`CURRENT_TIMESTAMP`),
  status: text('status', { enum: ['registered', 'confirmed', 'attended', 'cancelled'] }).notNull().default('registered'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Newsletter subscriptions schema
export const newsletterSubscriptions = sqliteTable('newsletter_subscriptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  subscribedAt: text('subscribed_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  unsubscribedAt: text('unsubscribed_at'),
});

// Contact messages schema
export const contactMessages = sqliteTable('contact_messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'),
  message: text('message').notNull(),
  status: text('status', { enum: ['new', 'read', 'replied', 'archived'] }).notNull().default('new'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Export types for TypeScript
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Publication = typeof publications.$inferSelect;
export type NewPublication = typeof publications.$inferInsert;
export type Partner = typeof partners.$inferSelect;
export type NewPartner = typeof partners.$inferInsert;
export type Career = typeof careers.$inferSelect;
export type NewCareer = typeof careers.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
export type Discussion = typeof discussions.$inferSelect;
export type NewDiscussion = typeof discussions.$inferInsert;
export type BoardMember = typeof boardMembers.$inferSelect;
export type NewBoardMember = typeof boardMembers.$inferInsert;
export type OrganizationStaff = typeof organizationStaff.$inferSelect;
export type NewOrganizationStaff = typeof organizationStaff.$inferInsert;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type NewEventRegistration = typeof eventRegistrations.$inferInsert;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type NewNewsletterSubscription = typeof newsletterSubscriptions.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert; 