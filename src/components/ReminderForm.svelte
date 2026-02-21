<script lang="ts">
  import { Datepicker } from "flowbite-svelte"
  import type { InsertReminder } from "../db/schema.ts"
  import { ZRepeatOption } from "../models"

  const ALERT_BEFORE_OPTIONS = Object.freeze([
    { value: null, label: "On event time" },
    { value: 2, label: "2 days before" },
    { value: 7, label: "7 days before" },
    { value: 14, label: "14 days before" }
  ])

  const REPEAT_OPTIONS = Object.freeze([
    { value: null, label: "None" },
    { value: ZRepeatOption.enum.yearly, label: "Yearly" },
    { value: ZRepeatOption.enum.monthly, label: "Monthly" }
  ])

  let { 
    reminder = $bindable()
  }: {
    reminder: InsertReminder
  } = $props();

</script>

<div class="flex flex-col gap-4">
  <div class="flex gap-4">
    <!-- Title -->
    <div class="w-full">
      <label for="title" class="label mb-1">Title</label>
      <input id="title" type="text" class="input input-accent" placeholder="Enter a title" bind:value={reminder.title} />
    </div>

    <!-- Repeat -->
    <div class="w-full">
      <label for="repeat" class="label mb-1">Repeat</label>
      <select id="repeat" class="select select-accent" bind:value={reminder.repeat}>
        {#each REPEAT_OPTIONS as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="flex gap-4">
    <!-- Lunar Date -->
    <div class="w-full">
      <label for="reminder-date" class="label mb-1">Reminder Date</label>
      <input 
        id="reminder-date" 
        type="text" 
        class="input input-accent" 
        placeholder="DD/MM/YYYY" 
        value={reminder.reminderDate ? reminder.reminderDate.toLocaleDateString('en-GB') : ''} 
        readonly 
      />
    </div>

    <!-- Remind From -->
    <div class="w-full">
      <label for="alert-from" class="label mb-1">Alert From</label>
      <select id="alert-from" class="select select-accent" bind:value={reminder.alertBefore}>
        {#each ALERT_BEFORE_OPTIONS as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <div>
    <Datepicker bind:value={reminder.reminderDate} inline class="bg-base-100! border border-accent! shadow-none text-base-content!" />
  </div>

  <div class="flex flex-col w-full">
    <label for="mail-subject" class="label mb-1">Mail Subject</label>
    <input id="mail-subject" type="text" class="input input-accent w-full" placeholder="Enter a mail subject" bind:value={reminder.mailSubject} />
  </div>

  <div class="flex flex-col w-full">
    <label for="mail-body" class="label mb-1">Mail Body</label>
    <textarea id="mail-body" class="textarea textarea-accent w-full" placeholder="Enter a mail body" bind:value={reminder.mailBody}></textarea>
  </div>
</div>
