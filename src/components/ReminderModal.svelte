<script lang="ts">
  import { hc } from 'hono/client'
  import { onMount } from "svelte"
  import { ZInsertReminder, type InsertReminder } from "../db/schema.ts"
  import type { AppType } from "../server/index.ts"
  import ReminderForm from "./ReminderForm.svelte"
  import SaveIcon from "./SaveIcon.svelte"

  let reminder: InsertReminder = $state({
    title: "",
    reminderDate: new Date(),
    repeat: null,
    alertBefore: null,
    mailSubject: "",
    mailBody: "",
    userId: ""
  })

  let isSaving = $state(false)

  const client = hc<AppType>('/')

  function openModal(event: CustomEvent<InsertReminder | undefined>) {
    const modal = document.getElementById("modal-reminder-detail") as HTMLDialogElement
    modal.showModal()
    if (event.detail) {
      reminder = ZInsertReminder.parse({...reminder, ...event.detail})
    }
  }

  async function createReminder() {
    isSaving = true
    try {
      const res = await client.api.reminders.$post({
        json: reminder
      })

      if (!res.ok) throw new Error('Failed to create reminder')

      window.location.reload()
    } catch (error) {
      console.error(error)
      isSaving = false
    }
  }

  async function updateReminder() {
    isSaving = true
    try {
      if (!reminder.id) throw new Error('Reminder ID is required')

      const res = await client.api.reminders[':id'].$patch({
        param: { id: reminder.id },
        json: reminder
      })

      if (!res.ok) throw new Error('Failed to update reminder')

      window.location.reload()
    } catch (error) {
      console.error(error)
      isSaving = false
    }
  }

  function saveReminder() {
    if (isSaving) return

    if (reminder.id) {
      updateReminder()
      return 
    }

    createReminder()
  }

  onMount(() => {
    document.addEventListener("modal-reminder-detail:open", openModal as EventListener)

    return () => document.removeEventListener("modal-reminder-detail:open", openModal as EventListener)
  })
</script>

<dialog id="modal-reminder-detail" class="modal modal-bottom sm:modal-middle">
  <div class="modal-box max-w-2xl">
    <h3 class="text-xl font-bold mb-4">New Reminder</h3>

    <ReminderForm bind:reminder />

    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-secondary mr-1">Cancel</button>
        <button class="btn btn-success" onclick={saveReminder} disabled={isSaving}>
          {#if isSaving}
            <span class="loading loading-spinner loading-sm"></span>
          {:else}
            <SaveIcon width="20" height="20" />
          {/if}
          Save
        </button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>