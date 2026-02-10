import type { LiveLoader } from 'astro/loaders'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getReminders } from '../db/reminder'
import type { SelectReminder } from '../db/schema'

export function reminderLoader(): LiveLoader<SelectReminder> {
  return {
    name: 'reminder-loader',

    loadCollection: async () => {
      try {
        const reminders = await getReminders()
        const entries = reminders.map((reminder) => ({
          id: reminder.id,
          data: reminder
        }))

        return { entries }
      } catch (e) {
        return { error: e as Error }
      }
    },
    loadEntry: async ({ filter }: { filter: { id: string } }) => {
      try {
        const id = filter.id

        if (!id) return { error: new Error('ID is required') }

        const content = await readFile(
          join(process.cwd(), 'src/data', `${id}.json`),
          'utf-8'
        )
        const data = JSON.parse(content)
        return {
          id,
          data,
          rendered: { html: data.mail_body.replace(/\n/g, '<br/>') }
        }
      } catch (e) {
        return { error: new Error('Entry not found') }
      }
    }
  }
}

// export function allowedUsers(): LiveLoader<string[]> {
//   return {
//     name: 'allowed-users-loader',

//     loadCollection: async () => {
//       try {
//         return {
//           entries: [
//             {
//               id: uuidv4(),
//               data: [ADMIN]
//             }
//           ]
//         }
//       } catch (e) {
//         return { error: e as Error }
//       }
//     },
//     loadEntry: async ({ filter }: { filter: string }) => {
//       try {
//         const content = await readFile(
//           join(process.cwd(), 'src/data/allowed_users.txt'),
//           'utf-8'
//         )
//         const data = content.split('\n')
//         return {
//           id: filter,
//           data: data.includes(filter),
//           rendered: { html: data.includes(filter) ? 'Allowed' : 'Not Allowed' }
//         }
//       } catch (e) {
//         return { error: new Error('Entry not found') }
//       }
//     }
//   }
// }
