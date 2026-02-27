import { defineLiveCollection } from 'astro:content'
import { alertLoader } from './content/alert.ts'
import { reminderLoader } from './content/reminder.ts'
import { userLoader } from './content/user.ts'

const reminders = defineLiveCollection({
  loader: reminderLoader()
})

const alerts = defineLiveCollection({
  loader: alertLoader()
})

const users = defineLiveCollection({
  loader: userLoader()
})

export const collections = {
  reminders,
  alerts,
  users
}
