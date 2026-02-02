<script>
  import { stats } from '../lib/contacts.svelte.ts'
</script>

<div class="stats-bar">
  <span class="badge badge-accent">{stats.value.total} Contacts</span>
  <span class="badge badge-success">{stats.value.selected} Selected</span>
  {#if stats.value.duplicateCount > 0}
    <span class="badge badge-warning">{stats.value.duplicateCount} Duplicates</span>
  {/if}
</div>

<style>
  .stats-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-sm);
  }
</style>
