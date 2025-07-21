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
  // English fields
  title_en: text('title_en'),
  slug_en: text('slug_en'),
  author_en: text('author_en'),
  description_en: text('description_en'),
  content_en: text('content_en'),
  // Existing fields
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

// Homepage slides schema
export const homepageSlides = sqliteTable('homepage_slides', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type', { enum: ['map', 'image'] }).notNull(),
  order: integer('order').notNull(),
  title: text('title'),
  subtitle: text('subtitle'),
  description: text('description'),
  image: text('image'),
  buttonText: text('button_text'),
  buttonLink: text('button_link'),
  // English fields
  title_en: text('title_en'),
  subtitle_en: text('subtitle_en'),
  description_en: text('description_en'),
  buttonText_en: text('button_text_en'),
  buttonLink_en: text('button_link_en'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Visitor tracking schema
export const visitorTracking = sqliteTable('visitor_tracking', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  contentType: text('content_type').notNull(),
  contentId: text('content_id').notNull(), // slug or ID of the content
  contentTitle: text('content_title').notNull(),
  actionType: text('action_type').notNull(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  referrer: text('referrer'),
  sessionId: text('session_id'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Social media settings schema
export const socialMediaSettings = sqliteTable('social_media_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  platform: text('platform').notNull().unique(), // facebook, instagram, twitter, linkedin, youtube, tiktok, etc.
  url: text('url').notNull(),
  displayName: text('display_name').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  order: integer('order').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Programs schema
export const programs = sqliteTable('programs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  titleEn: text('title_en'),
  subtitle: text('subtitle'),
  subtitleEn: text('subtitle_en'),
  description: text('description').notNull(),
  descriptionEn: text('description_en'),
  heroImage: text('hero_image'),
  content: text('content').notNull(), // JSON string containing sections
  contentEn: text('content_en'), // JSON string containing English sections
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  order: integer('order').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Page content schema for managing editable static page content
export const pageContent = sqliteTable('page_content', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pageKey: text('page_key').notNull().unique(), // e.g., 'tentang-kami-tujuan'
  pageName: text('page_name').notNull(), // e.g., 'Tentang Kami - Tujuan'
  pageUrl: text('page_url').notNull(), // e.g., '/tentang-kami/tujuan'
  heroTitle: text('hero_title'),
  heroSubtitle: text('hero_subtitle'),
  heroBackgroundColor: text('hero_background_color').default('#f06d98'),
  heroBackgroundImage: text('hero_background_image'),
  sections: text('sections').notNull(), // JSON string containing page sections
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
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
export type HomepageSlide = typeof homepageSlides.$inferSelect;
export type NewHomepageSlide = typeof homepageSlides.$inferInsert;
export type VisitorTracking = typeof visitorTracking.$inferSelect;
export type NewVisitorTracking = typeof visitorTracking.$inferInsert;
export type Program = typeof programs.$inferSelect;
export type NewProgram = typeof programs.$inferInsert;
export type PageContent = typeof pageContent.$inferSelect;
export type NewPageContent = typeof pageContent.$inferInsert;
export type SocialMediaSetting = typeof socialMediaSettings.$inferSelect;
export type NewSocialMediaSetting = typeof socialMediaSettings.$inferInsert;

// Research data attributes schema (metadata for columns)
export const researchAttributes = sqliteTable('research_attributes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  columnName: text('column_name').notNull().unique(),
  label: text('label').notNull(),
  class: text('class').notNull(),
  isOrdered: integer('is_ordered', { mode: 'boolean' }).notNull(),
  isFactor: integer('is_factor', { mode: 'boolean' }).notNull(),
  nUnique: integer('n_unique').notNull(),
  exampleValues: text('example_values'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Research survey data schema
export const researchData = sqliteTable('research_data', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  // Demographic data
  regionLive: text('region_live'),
  age: integer('age'),
  gender: text('gender'),
  activism: text('activism'),
  politicalExposure: text('political_exposure'),
  
  // Political exposure sources
  polexpTiktok: text('polexp_tiktok'),
  polexpX: text('polexp_x'),
  polexpIg: text('polexp_ig'),
  polexpYt: text('polexp_yt'),
  polexpNewsapp: text('polexp_newsapp'),
  polexpNewsconv: text('polexp_newsconv'),
  polexpPeers: text('polexp_peers'),
  polexpPeersIntensity: text('polexp_peers_intensity'),
  
  // Civic space understanding
  civspaceExpression: text('civspace_expression'),
  civspaceRights: text('civspace_rights'),
  civspaceGather: text('civspace_gather'),
  civspaceDiscuss: text('civspace_discuss'),
  civspaceCritics: text('civspace_critics'),
  civspaceAllabove: text('civspace_allabove'),
  civspaceHeard: text('civspace_heard'),
  civspaceUnderstanding: text('civspace_understanding'),
  
  // Civic space change perception
  civicspaceChange: text('civicspace_change'),
  civicspaceLeadCensoring: text('civicspace_lead_censoring'),
  civicspaceLeadViolence: text('civicspace_lead_violence'),
  civicspaceLeadPresslimit: text('civicspace_lead_presslimit'),
  civicspaceLeadBanning: text('civicspace_lead_banning'),
  civicspaceLeadRepression: text('civicspace_lead_repression'),
  civicspaceLeadMonopoly: text('civicspace_lead_monopoly'),
  civicspaceLeadAccountability: text('civicspace_lead_accountability'),
  civicspaceLeadAllgood: text('civicspace_lead_allgood'),
  
  // Youth civic space
  civicspaceYouthUnion: text('civicspace_youth_union'),
  civicspaceYouthGather: text('civicspace_youth_gather'),
  civicspaceYouthExpress: text('civicspace_youth_express'),
  civicspaceYouthProtect: text('civicspace_youth_protect'),
  civicspaceYouthResource: text('civicspace_youth_resource'),
  civicspaceYouthRepresentation: text('civicspace_youth_representation'),
  
  // Youth challenges
  civicspaceYouthChalIntimidation: text('civicspace_youth_chal_intimidation'),
  civicspaceYouthChalBan: text('civicspace_youth_chal_ban'),
  civicspaceYouthChalCensoring: text('civicspace_youth_chal_censoring'),
  civicspaceYouthChalUnprotection: text('civicspace_youth_chal_unprotection'),
  civicspaceYouthChalSafespace: text('civicspace_youth_chal_safespace'),
  civicspaceYouthChalDiscrimination: text('civicspace_youth_chal_discrimination'),
  civicspaceYouthChalResource: text('civicspace_youth_chal_resource'),
  
  // Government responsiveness (0-10 scale)
  govResponseHumanrights: integer('gov_response_humanrights'),
  govResponseEnvironment: integer('gov_response_environment'),
  govResponseFoodresource: integer('gov_response_foodresource'),
  govResponseVulnerablepop: integer('gov_response_vulnerablepop'),
  govResponseHealthaccess: integer('gov_response_healthaccess'),
  govResponseEduaccess: integer('gov_response_eduaccess'),
  govResponsePoverty: integer('gov_response_poverty'),
  govResponseInequality: integer('gov_response_inequality'),
  govResponseEconomicopp: integer('gov_response_economicopp'),
  
  // Political elite perception
  elitPercepNational: text('elit_percep_national'),
  elitPercepLocal: text('elit_percep_local'),
  
  // Issue commitment
  issueCommitedVoicing: text('issue_commited_voicing'),
  issueMotivEnvironment: text('issue_motiv_environment'),
  issueMotivFoodresources: text('issue_motiv_foodresources'),
  issueMotivVulnerablepop: text('issue_motiv_vulnerablepop'),
  issueMotivHumanrights: text('issue_motiv_humanrights'),
  issueMotivHealthaccess: text('issue_motiv_healthaccess'),
  issueMotivEducaccess: text('issue_motiv_educaccess'),
  issueMotivPoverty: text('issue_motiv_poverty'),
  issueMotivInequality: text('issue_motiv_inequality'),
  issueMotivEconomicopp: text('issue_motiv_economicopp'),
  issueMotivOther: text('issue_motiv_other'),
  issueMotivText: text('issue_motiv_text'),
  issueCommitedResources: integer('issue_commited_resources'),
  
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type ResearchAttribute = typeof researchAttributes.$inferSelect;
export type NewResearchAttribute = typeof researchAttributes.$inferInsert;
export type ResearchDataRecord = typeof researchData.$inferSelect;
export type NewResearchDataRecord = typeof researchData.$inferInsert; 