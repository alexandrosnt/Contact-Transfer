<script lang="ts">
  import { contacts, currentView, stats, clearContacts, transferDirection } from '../lib/contacts.svelte.ts'
  import { generateVCF } from '../lib/vcf-generator'
  import Instructions from './Instructions.svelte'

  let exported = $state(false)
  let exportPath = $state('')
  let error = $state('')

  async function handleExport(): Promise<void> {
    error = ''
    try {
      const selected = contacts.value.filter((c) => c.selected)

      if (selected.length === 0) {
        error = 'No contacts selected. Go back and select contacts first.'
        return
      }

      const vcfData = generateVCF(selected)
      const savePath = await window.electronAPI.saveFile()

      if (!savePath) return

      await window.electronAPI.writeFile(savePath, vcfData)
      exportPath = savePath
      exported = true
    } catch (e) {
      error = `Export failed: ${e instanceof Error ? e.message : 'Unknown error'}`
    }
  }

  function handleBack(): void {
    currentView.value = 'contacts'
  }

  function handleExportMore(): void {
    exported = false
    exportPath = ''
    error = ''
  }

  function handleStartOver(): void {
    clearContacts()
  }
</script>

<div class="export-view">
  <header class="header">
    <button class="back-btn" onclick={handleBack}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Back
    </button>
    <h1 class="title">
      {#if transferDirection.value === 'iphone-to-android'}
        Export for Android
      {:else}
        Export for iPhone
      {/if}
    </h1>
  </header>

  <div class="export-card">
    {#if exported}
      <div class="success-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="var(--success-light)"/>
          <path d="M15 24L21 30L33 18" stroke="var(--success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 class="success-title">Export Complete</h2>
      <div class="file-path">{exportPath}</div>
      <div class="success-actions">
        <button class="btn-primary" onclick={handleExportMore}>Export More</button>
        <button class="btn-ghost" onclick={handleStartOver}>Start Over</button>
      </div>
    {:else}
      <div class="summary">
        <span class="summary-count">{stats.value.selected}</span>
        <span class="summary-label">of {stats.value.total} contacts selected</span>
      </div>

      {#if error}
        <div class="error-banner">
          <span>{error}</span>
        </div>
      {/if}

      <button
        class="btn-primary export-btn"
        onclick={handleExport}
        disabled={stats.value.selected === 0}
      >
        Export as VCF
      </button>

      {#if stats.value.selected === 0}
        <p class="hint">Go back and select contacts</p>
      {/if}
    {/if}
  </div>

  <div class="instructions-wrapper">
    <Instructions />
  </div>
</div>

<style>
  .export-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.25rem;
    gap: 1rem;
    height: 100%;
    overflow-y: auto;
  }

  .header {
    width: 100%;
    max-width: 480px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: var(--radius-sm);
    transition: opacity 0.15s ease;
    flex-shrink: 0;
  }

  .back-btn:hover {
    opacity: 0.7;
  }

  .title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.025em;
    margin: 0;
  }

  .export-card {
    width: 100%;
    max-width: 480px;
    background: var(--bg-elevated);
    border: 1px solid var(--separator);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
  }

  .summary {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .summary-count {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent);
    line-height: 1;
  }

  .summary-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .error-banner {
    width: 100%;
    background: var(--accent-light);
    border-radius: var(--radius-sm);
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
    color: var(--danger);
    text-align: left;
  }

  .btn-primary {
    background: var(--accent);
    color: #fff;
    border: none;
    cursor: pointer;
    border-radius: 999px;
    font-weight: 600;
    font-size: 1rem;
    padding: 0.75rem 2rem;
    transition: background-color 0.15s ease;
  }

  .btn-primary:hover {
    background: var(--accent-hover);
  }

  .btn-primary:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .export-btn {
    width: 100%;
    max-width: 280px;
  }

  .btn-ghost {
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 999px;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.15s ease;
  }

  .btn-ghost:hover {
    background-color: var(--accent-light);
  }

  .hint {
    font-size: 0.8125rem;
    color: var(--text-tertiary);
    margin: 0;
  }

  .success-icon {
    margin-bottom: 0.25rem;
  }

  .success-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .file-path {
    font-size: 0.75rem;
    font-family: ui-monospace, 'SF Mono', 'Cascadia Code', 'Segoe UI Mono', monospace;
    color: var(--text-secondary);
    background: var(--bg-secondary);
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-sm);
    word-break: break-all;
    width: 100%;
    text-align: left;
  }

  .success-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.25rem;
  }

  .instructions-wrapper {
    width: 100%;
    max-width: 480px;
  }
</style>
