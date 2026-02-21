import { defineLiveCollection } from 'astro:content'
import { alertLoader } from './content/alert.ts'
import { reminderLoader } from './content/reminder.ts'

const reminders = defineLiveCollection({
  loader: reminderLoader()
})

const alerts = defineLiveCollection({
  loader: alertLoader()
})

export const collections = {
  reminders,
  alerts
}
