<script lang="ts">
  import { onMount } from 'svelte'
  import { authClient } from '../lib/auth-client.ts'
  import MailIcon from './MailIcon.svelte'
  import SaveIcon from './SaveIcon.svelte'

  let email = $state('')
  let isSaving = $state(false)

  async function createUser() {
    if (!email) return

    try {
      isSaving = true
      const { error } = await authClient.admin.createUser({
          name: email,
          email
        })
      if (error) throw error

      location.reload()
    } catch (error) {
      console.error(error)
      isSaving = false
    }
  }

  function openModal() {
    const modal = document.getElementById("modal-user") as HTMLDialogElement
    modal.showModal()
  }

  onMount(() => {
    document.addEventListener("modal-user:open", openModal as EventListener)

    return () => document.removeEventListener("modal-user:open", openModal as EventListener)
  })
</script>


<dialog id="modal-user" class="modal modal-bottom sm:modal-middle">
  <div class="modal-box">
    <h3 class="text-xl font-bold mb-4">New User</h3>

    <label class="input validator min-w-full">
      <MailIcon width="20" height="20" />
      <input
        bind:value={email}
        class="user-email"
        type="email"
        placeholder="mail@site.com"
        required
      />
    </label>
    <div class="validator-hint hidden">Enter valid email address</div>

    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-secondary mr-1">Cancel</button>
        <button class="btn btn-success" onclick={createUser} disabled={isSaving}>
          <SaveIcon width="20" height="20" />
          Save
        </button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
