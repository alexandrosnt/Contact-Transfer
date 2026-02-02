<script lang="ts">
  import { currentView, transferDirection, addContacts } from '../lib/contacts.svelte.ts'
  import { parseVCF } from '../lib/vcf-parser'
  import DropZone from './DropZone.svelte'

  let loading = $state(false)
  let error = $state('')

  async function handleFile(filePath: string): Promise<void> {
    loading = true
    error = ''
    try {
      const content = await window.electronAPI.readFile(filePath)
      const contacts = parseVCF(content)
      if (contacts.length === 0) {
        error = 'No contacts found in the selected file. Please choose a valid VCF file.'
        return
      }
      addContacts(contacts)
    } catch (e) {
      error = `Failed to read file: ${e instanceof Error ? e.message : 'Unknown error'}`
    } finally {
      loading = false
    }
  }

  async function selectFile(): Promise<void> {
    try {
      const paths = await window.electronAPI.openFile()
      if (paths && paths.length > 0) {
        await handleFile(paths[0])
      }
    } catch (e) {
      error = `Failed to open file: ${e instanceof Error ? e.message : 'Unknown error'}`
    }
  }

  function handleDrop(filePath: string): void {
    handleFile(filePath)
  }
</script>

<div class="welcome">
  <!-- Hero -->
  <section class="hero">
    <div class="hero-icon">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="8" width="14" height="32" rx="3" />
        <rect x="30" y="8" width="14" height="32" rx="3" />
        <line x1="9" y1="34" x2="13" y2="34" />
        <line x1="35" y1="34" x2="39" y2="34" />
        <path d="M18 20 L26 20" />
        <polyline points="23,17 26,20 23,23" />
        <path d="M30 28 L22 28" />
        <polyline points="25,25 22,28 25,31" />
      </svg>
    </div>
    <h1 class="hero-title">Contact Transfer</h1>
    <p class="hero-subtitle">Seamlessly move contacts between devices</p>
  </section>

  <!-- Direction picker -->
  <section class="direction-picker">
    <button
      class="direction-card"
      class:selected={transferDirection.value === 'android-to-iphone'}
      onclick={() => (transferDirection.value = 'android-to-iphone')}
    >
      <div class="card-icons">
        <!-- Android icon -->
        <svg class="platform-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="8" y="14" width="16" height="12" rx="2" />
          <path d="M12 14 L12 10 A4 4 0 0 1 20 10 L20 14" />
          <circle cx="13" cy="11" r="1" fill="currentColor" stroke="none" />
          <circle cx="19" cy="11" r="1" fill="currentColor" stroke="none" />
          <line x1="6" y1="18" x2="6" y2="24" />
          <line x1="26" y1="18" x2="26" y2="24" />
          <line x1="13" y1="26" x2="13" y2="30" />
          <line x1="19" y1="26" x2="19" y2="30" />
        </svg>
        <!-- Arrow -->
        <svg class="arrow-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" y1="12" x2="20" y2="12" />
          <polyline points="14,6 20,12 14,18" />
        </svg>
        <!-- Apple icon -->
        <svg class="platform-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 8 C16 4 20 2 20 2 C20 2 21 5 19 8" />
          <path d="M10 12 C6 12 4 16 4 20 C4 26 8 30 12 30 C13 30 14 29.5 16 29.5 C18 29.5 19 30 20 30 C24 30 28 26 28 20 C28 16 26 12 22 12 C20 12 18.5 13 16 13 C13.5 13 12 12 10 12Z" />
        </svg>
      </div>
      <span class="card-label">Android to iPhone</span>
    </button>

    <button
      class="direction-card"
      class:selected={transferDirection.value === 'iphone-to-android'}
      onclick={() => (transferDirection.value = 'iphone-to-android')}
    >
      <div class="card-icons">
        <!-- Apple icon -->
        <svg class="platform-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 8 C16 4 20 2 20 2 C20 2 21 5 19 8" />
          <path d="M10 12 C6 12 4 16 4 20 C4 26 8 30 12 30 C13 30 14 29.5 16 29.5 C18 29.5 19 30 20 30 C24 30 28 26 28 20 C28 16 26 12 22 12 C20 12 18.5 13 16 13 C13.5 13 12 12 10 12Z" />
        </svg>
        <!-- Arrow -->
        <svg class="arrow-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" y1="12" x2="20" y2="12" />
          <polyline points="14,6 20,12 14,18" />
        </svg>
        <!-- Android icon -->
        <svg class="platform-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="8" y="14" width="16" height="12" rx="2" />
          <path d="M12 14 L12 10 A4 4 0 0 1 20 10 L20 14" />
          <circle cx="13" cy="11" r="1" fill="currentColor" stroke="none" />
          <circle cx="19" cy="11" r="1" fill="currentColor" stroke="none" />
          <line x1="6" y1="18" x2="6" y2="24" />
          <line x1="26" y1="18" x2="26" y2="24" />
          <line x1="13" y1="26" x2="13" y2="30" />
          <line x1="19" y1="26" x2="19" y2="30" />
        </svg>
      </div>
      <span class="card-label">iPhone to Android</span>
    </button>
  </section>

  <!-- Import section (visible after direction is chosen) -->
  {#if transferDirection.value !== null}
    <section class="import-section">
      <h2 class="import-heading">Import your contacts</h2>

      {#if error}
        <div class="error-banner">
          <svg class="error-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="8" cy="8" r="6.5" />
            <line x1="8" y1="5" x2="8" y2="8.5" />
            <circle cx="8" cy="11" r="0.5" fill="currentColor" />
          </svg>
          <span class="error-text">{error}</span>
          <button class="error-dismiss" onclick={() => (error = '')} aria-label="Dismiss error">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <line x1="3" y1="3" x2="11" y2="11" />
              <line x1="11" y1="3" x2="3" y2="11" />
            </svg>
          </button>
        </div>
      {/if}

      <div class="import-actions">
        <button class="btn-primary" onclick={selectFile} disabled={loading}>
          {#if loading}
            Processing...
          {:else}
            Select VCF File
          {/if}
        </button>

        <div class="divider">
          <span class="divider-text">or</span>
        </div>

        <DropZone onDrop={handleDrop} />
      </div>
    </section>
  {/if}
</div>

<style>
  .welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 2rem;
    gap: 2.5rem;
    overflow-y: auto;
    height: 100%;
  }

  /* ---- Hero ---- */
  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
    padding-bottom: 0.5rem;
  }

  .hero-icon {
    color: var(--accent);
    margin-bottom: 0.25rem;
  }

  .hero-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.03em;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  /* ---- Direction picker ---- */
  .direction-picker {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    width: 100%;
    max-width: 520px;
  }

  .direction-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.75rem 1.25rem;
    background: var(--bg-elevated);
    border: 1.5px solid var(--separator);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.2s ease;
    box-shadow: var(--shadow-sm);
    color: var(--text-primary);
    font-family: inherit;
    font-size: inherit;
  }

  .direction-card:hover {
    box-shadow: var(--shadow);
    transform: translateY(-2px);
    background: var(--bg-hover);
  }

  .direction-card:active {
    transform: translateY(0);
    background: var(--bg-active);
  }

  .direction-card.selected {
    border-color: var(--accent);
    background: var(--accent-light);
    box-shadow: var(--shadow);
  }

  .card-icons {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .platform-icon {
    color: var(--text-secondary);
    transition: color 0.2s ease;
  }

  .direction-card.selected .platform-icon {
    color: var(--accent);
  }

  .arrow-icon {
    color: var(--text-tertiary);
    transition: color 0.2s ease;
  }

  .direction-card.selected .arrow-icon {
    color: var(--accent);
  }

  .card-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }

  /* ---- Import section ---- */
  .import-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
    max-width: 480px;
    animation: fadeInUp 0.35s ease both;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .import-heading {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.015em;
    margin-bottom: 1.25rem;
  }

  /* ---- Error banner ---- */
  .error-banner {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    width: 100%;
    background: color-mix(in srgb, #ff3b30 8%, var(--bg-elevated));
    border: 1px solid color-mix(in srgb, #ff3b30 25%, transparent);
    border-radius: var(--radius-sm);
    padding: 0.75rem 1rem;
    margin-bottom: 1.25rem;
    text-align: left;
  }

  .error-icon {
    flex-shrink: 0;
    color: #ff3b30;
  }

  .error-text {
    flex: 1;
    font-size: 0.8125rem;
    color: var(--text-primary);
    line-height: 1.4;
  }

  .error-dismiss {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    border: none;
    background: transparent;
    color: var(--text-tertiary);
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;
    padding: 0;
  }

  .error-dismiss:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  /* ---- Import actions ---- */
  .import-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.6875rem 2rem;
    font-size: 0.9375rem;
    font-weight: 600;
    font-family: inherit;
    color: #fff;
    background: var(--accent);
    border: none;
    border-radius: var(--radius-xl);
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      box-shadow 0.15s ease,
      transform 0.15s ease;
    letter-spacing: -0.01em;
    box-shadow: var(--shadow-sm);
    min-width: 180px;
  }

  .btn-primary:hover {
    background: var(--accent-hover);
    box-shadow: var(--shadow);
  }

  .btn-primary:active {
    transform: scale(0.98);
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  /* ---- Divider ---- */
  .divider {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 1rem;
  }

  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--separator);
  }

  .divider-text {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
</style>
