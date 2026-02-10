import { defineLiveCollection } from 'astro:content'
import { reminderLoader } from './content/loader'

const reminders = defineLiveCollection({
  loader: reminderLoader()
})

export const collections = {
  reminders
}
