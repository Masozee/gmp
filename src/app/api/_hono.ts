import { Hono } from 'hono'
import { tasksRoute } from './tasks/hono'
import { taskIdRoute } from './tasks/[id]/hono'
import { publicationsRoute } from './publications/hono'
import { publicationIdRoute } from './publications/[id]/hono'
import { eventsRoute } from './events/hono'
import { eventIdRoute } from './events/[id]/hono'
import { authRoute } from './auth/hono'
import { tagsRoute } from './tags/hono'
import { tagIdRoute } from './tags/[id]/hono'
import { categoriesRoute } from './categories/hono'
import { categoryIdRoute } from './categories/[id]/hono'

const app = new Hono()

app.route('/api/tasks', tasksRoute)
app.route('/api/tasks/:id', taskIdRoute)
app.route('/api/publications', publicationsRoute)
app.route('/api/publications/:id', publicationIdRoute)
app.route('/api/events', eventsRoute)
app.route('/api/events/:id', eventIdRoute)
app.route('/api/auth', authRoute)
app.route('/api/tags', tagsRoute)
app.route('/api/tags/:id', tagIdRoute)
app.route('/api/categories', categoriesRoute)
app.route('/api/categories/:id', categoryIdRoute)

export default app
