import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { initializeDatabase, db } from '@/lib/db';
import { 
  events, publications, partners, careers, testimonials, 
  discussions, boardMembers, organizationStaff, eventRegistrations,
  newsletterSubscriptions, contactMessages
} from '@/lib/db/content-schema';
import { getSessionUser } from '@/lib/auth-utils';
import { eq, desc, asc } from 'drizzle-orm';
import { Context } from 'hono';

// Initialize database on startup
initializeDatabase();

type Variables = {
  user?: any;
};

const app = new Hono<{ Variables: Variables }>().basePath('/api/content');

// Middleware to check authentication for protected routes
const authMiddleware = async (c: Context<{ Variables: Variables }>, next: () => Promise<void>) => {
  const sessionId = c.req.header('Cookie')?.split('session=')[1]?.split(';')[0];
  
  if (!sessionId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const user = await getSessionUser(sessionId);
  
  if (!user) {
    return c.json({ error: 'Invalid session' }, 401);
  }

  c.set('user', user);
  await next();
};

// PUBLIC ROUTES

// Events
app.get('/events', async (c) => {
  const allEvents = await db.select().from(events).orderBy(desc(events.createdAt));
  return c.json({ success: true, events: allEvents });
});

app.get('/events/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const [event] = await db.select().from(events).where(eq(events.id, id));
  
  if (!event) {
    return c.json({ error: 'Event not found' }, 404);
  }
  
  return c.json({ success: true, event });
});

// Events by slug
app.get('/events/slug/:slug', async (c) => {
  const slug = c.req.param('slug');
  const [event] = await db.select().from(events).where(eq(events.slug, slug));
  
  if (!event) {
    return c.json({ error: 'Event not found' }, 404);
  }
  
  return c.json({ success: true, event });
});

// Publications
app.get('/publications', async (c) => {
  const allPublications = await db.select().from(publications).orderBy(asc(publications.order));
  return c.json({ success: true, publications: allPublications });
});

app.get('/publications/:slug', async (c) => {
  const slug = c.req.param('slug');
  const [publication] = await db.select().from(publications).where(eq(publications.slug, slug));
  
  if (!publication) {
    return c.json({ error: 'Publication not found' }, 404);
  }
  
  return c.json({ success: true, publication });
});

// Partners
app.get('/partners', async (c) => {
  const allPartners = await db.select().from(partners).orderBy(asc(partners.order));
  return c.json({ success: true, partners: allPartners });
});

// Careers
app.get('/careers', async (c) => {
  const allCareers = await db.select().from(careers).where(eq(careers.isActive, true)).orderBy(desc(careers.postedDate));
  return c.json({ success: true, careers: allCareers });
});

app.get('/careers/:slug', async (c) => {
  const slug = c.req.param('slug');
  const [career] = await db.select().from(careers).where(eq(careers.slug, slug));
  
  if (!career) {
    return c.json({ error: 'Career not found' }, 404);
  }
  
  return c.json({ success: true, career });
});

// Testimonials
app.get('/testimonials', async (c) => {
  const allTestimonials = await db.select().from(testimonials).where(eq(testimonials.isActive, true)).orderBy(desc(testimonials.createdAt));
  return c.json({ success: true, testimonials: allTestimonials });
});

// Discussions
app.get('/discussions', async (c) => {
  const allDiscussions = await db.select().from(discussions).where(eq(discussions.isActive, true)).orderBy(desc(discussions.createdAt));
  return c.json({ success: true, discussions: allDiscussions });
});

app.get('/discussions/:slug', async (c) => {
  const slug = c.req.param('slug');
  const [discussion] = await db.select().from(discussions).where(eq(discussions.slug, slug));
  
  if (!discussion) {
    return c.json({ error: 'Discussion not found' }, 404);
  }
  
  return c.json({ success: true, discussion });
});

// Board Members
app.get('/board', async (c) => {
  const board = await db.select().from(boardMembers).where(eq(boardMembers.isActive, true)).orderBy(asc(boardMembers.order));
  return c.json({ success: true, board });
});

// Organization Staff
app.get('/staff', async (c) => {
  const staff = await db.select().from(organizationStaff).where(eq(organizationStaff.isActive, true)).orderBy(asc(organizationStaff.order));
  return c.json({ success: true, staff });
});

// Newsletter subscription (public)
app.post('/newsletter/subscribe', async (c) => {
  const { email, name } = await c.req.json();
  
  if (!email) {
    return c.json({ error: 'Email is required' }, 400);
  }
  
  try {
    await db.insert(newsletterSubscriptions).values({
      email,
      name,
    });
    
    return c.json({ success: true, message: 'Successfully subscribed to newsletter' });
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return c.json({ error: 'Email already subscribed' }, 409);
    }
    return c.json({ error: 'Failed to subscribe' }, 500);
  }
});

// Contact form (public)
app.post('/contact', async (c) => {
  const { name, email, subject, message } = await c.req.json();
  
  if (!name || !email || !message) {
    return c.json({ error: 'Name, email, and message are required' }, 400);
  }
  
  try {
    await db.insert(contactMessages).values({
      name,
      email,
      subject,
      message,
    });
    
    return c.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

// Event registration (public)
app.post('/events/:id/register', async (c) => {
  const eventId = parseInt(c.req.param('id'));
  const { name, email, phone, institution } = await c.req.json();
  
  if (!name || !email) {
    return c.json({ error: 'Name and email are required' }, 400);
  }
  
  // Check if event exists and has capacity
  const [event] = await db.select().from(events).where(eq(events.id, eventId));
  
  if (!event) {
    return c.json({ error: 'Event not found' }, 404);
  }
  
  if (!event.isRegistrationOpen) {
    return c.json({ error: 'Registration is closed for this event' }, 400);
  }
  
  if (event.registeredCount >= event.capacity) {
    return c.json({ error: 'Event is full' }, 400);
  }
  
  try {
    // Insert registration
    await db.insert(eventRegistrations).values({
      eventId,
      name,
      email,
      phone,
      institution,
    });
    
    // Update registered count
    await db.update(events)
      .set({ registeredCount: event.registeredCount + 1 })
      .where(eq(events.id, eventId));
    
    return c.json({ success: true, message: 'Successfully registered for event' });
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return c.json({ error: 'Already registered for this event' }, 409);
    }
    return c.json({ error: 'Failed to register' }, 500);
  }
});

// PROTECTED ROUTES (Admin only)
app.use('/admin/*', authMiddleware);

// Admin: Get all event registrations
app.get('/admin/events/:id/registrations', async (c) => {
  const user = c.get('user');
  if (user.role !== 'admin') {
    return c.json({ error: 'Forbidden' }, 403);
  }
  
  const eventId = parseInt(c.req.param('id'));
  const registrations = await db.select().from(eventRegistrations).where(eq(eventRegistrations.eventId, eventId));
  
  return c.json({ success: true, registrations });
});

// Admin: Get all contact messages
app.get('/admin/messages', async (c) => {
  const user = c.get('user');
  if (user.role !== 'admin') {
    return c.json({ error: 'Forbidden' }, 403);
  }
  
  const messages = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  return c.json({ success: true, messages });
});

// Admin: Get newsletter subscriptions
app.get('/admin/newsletter', async (c) => {
  const user = c.get('user');
  if (user.role !== 'admin') {
    return c.json({ error: 'Forbidden' }, 403);
  }
  
  const subscriptions = await db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.isActive, true));
  return c.json({ success: true, subscriptions });
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app); 