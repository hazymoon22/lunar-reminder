import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import {
  deleteReminder,
  insertReminder,
  updateReminder,
  updateReminderAlert
} from '../db/reminder.ts'
import { ZUpdateAlert, ZUpdateReminder } from '../db/schema.ts'
import { auth } from '../lib/auth.ts'
import { ZApiCreateReminder } from '../models/index.ts'
import { getNextAlertDate } from './reminder.ts'

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user
    session: typeof auth.$Infer.Session.session
  }
}>()
  .basePath('/api')
  .use('*', async (c, next) => {
    if (c.req.path.startsWith('/api/auth')) return next()

    const session = await auth.api.getSession({ headers: c.req.raw.headers })

    if (!session) return c.json({ error: 'Unauthorized' }, 401)

    c.set('user', session.user)
    c.set('session', session.session)
    await next()
  })

const routes = app
  .on(['POST', 'GET'], '/auth/*', (c) => {
    return auth.handler(c.req.raw)
  })
  .post('/reminders', zValidator('json', ZApiCreateReminder), async (c) => {
    try {
      const reminder = c.req.valid('json')
      const nextAlertDate = getNextAlertDate(reminder)

      const insertReminderData = {
        ...reminder,
        nextAlertDate,
        userId: c.get('user').id
      }
      const id = await insertReminder(insertReminderData)

      return c.json({ id })
    } catch (error) {
      console.error(error)
      return c.json({ error: 'Internal server error' }, 500)
    }
  })
  .patch('/reminders/:id', zValidator('json', ZUpdateReminder), async (c) => {
    const id = c.req.param('id')

    try {
      const reminder = c.req.valid('json')
      let updateReminderData = reminder
      if (reminder.reminderDate) {
        const nextAlertDate = getNextAlertDate(reminder)
        updateReminderData = { ...reminder, nextAlertDate }
      }
      await updateReminder(id, updateReminderData)

      return c.json({ message: 'Reminder updated' })
    } catch (error) {
      console.error(error)
      return c.json({ error: 'Internal server error' }, 500)
    }
  })
  .delete('/reminders/:id', async (c) => {
    const id = c.req.param('id')

    try {
      await deleteReminder(id)

      return c.json({ message: 'Reminder deleted' })
    } catch (error) {
      console.error(error)
      return c.json({ error: 'Internal server error' }, 500)
    }
  })
  .patch('/alerts/:id', zValidator('json', ZUpdateAlert), async (c) => {
    const id = c.req.param('id')

    try {
      const alert = c.req.valid('json')
      await updateReminderAlert(id, alert)

      return c.json({ message: 'Alert updated' })
    } catch (error) {
      console.error(error)
      return c.json({ error: 'Internal server error' }, 500)
    }
  })

export default app
export type AppType = typeof routes
