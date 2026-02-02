<script lang="ts">
  import { currentView, transferDirection } from './lib/contacts.svelte.ts'
  import Welcome from './components/Welcome.svelte'
  import ContactList from './components/ContactList.svelte'
  import ExportView from './components/ExportView.svelte'

  let maximized = $state(false)

  let directionLabel = $derived.by(() => {
    const dir = transferDirection.value
    if (dir === 'android-to-iphone') return 'Android \u2192 iPhone'
    if (dir === 'iphone-to-android') return 'iPhone \u2192 Android'
    return null
  })

  function navigate(view: 'welcome' | 'contacts' | 'export') {
    currentView.value = view
  }

  async function handleMinimize() {
    await window.electronAPI.minimizeWindow()
  }

  async function handleMaximize() {
    maximized = await window.electronAPI.maximizeWindow()
  }

  async function handleClose() {
    await window.electronAPI.closeWindow()
  }

  async function handleTitlebarDblClick() {
    maximized = await window.electronAPI.maximizeWindow()
  }

  $effect(() => {
    const v = currentView.value
    const d = transferDirection.value

    if (v === 'contacts') {
      window.electronAPI.setWindowSize(1000, 720)
    } else if (v === 'welcome' && d) {
      window.electronAPI.setWindowSize(960, 900)
    } else if (v === 'welcome') {
      window.electronAPI.setWindowSize(960, 560)
    } else if (v === 'export') {
      window.electronAPI.setWindowSize(960, 750)
    }
  })
</script>

<div class="app-shell">
  <nav class="titlebar" ondblclick={handleTitlebarDblClick}>
    <div class="titlebar-left">
      <div class="traffic-lights">
        <button class="tl-btn tl-close" onclick={handleClose} aria-label="Close">
          <svg class="tl-icon" width="6" height="6" viewBox="0 0 6 6">
            <line x1="0.5" y1="0.5" x2="5.5" y2="5.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
            <line x1="5.5" y1="0.5" x2="0.5" y2="5.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
          </svg>
        </button>
        <button class="tl-btn tl-minimize" onclick={handleMinimize} aria-label="Minimize">
          <svg class="tl-icon" width="6" height="2" viewBox="0 0 6 2">
            <line x1="0.5" y1="1" x2="5.5" y2="1" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
          </svg>
        </button>
        <button class="tl-btn tl-maximize" onclick={handleMaximize} aria-label={maximized ? 'Restore' : 'Maximize'}>
          {#if maximized}
            <svg class="tl-icon" width="6" height="6" viewBox="0 0 8 8">
              <path d="M1 4.5V1.5C1 1.22 1.22 1 1.5 1H4.5M3.5 7H6.5C6.78 7 7 6.78 7 6.5V3.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" fill="none" />
            </svg>
          {:else}
            <svg class="tl-icon" width="6" height="6" viewBox="0 0 6 6">
              <polyline points="1,3.5 1,1 3.5,1" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              <polyline points="5,2.5 5,5 2.5,5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </svg>
          {/if}
        </button>
      </div>
    </div>

    <div class="titlebar-center">
      <span class="app-title">Contact Transfer</span>
      {#if directionLabel && currentView.value !== 'welcome'}
        <span class="direction-pill">{directionLabel}</span>
      {/if}
    </div>

    <div class="titlebar-right">
      {#if currentView.value !== 'welcome'}
        <div class="nav-pills">
          <button
            class="pill"
            class:active={currentView.value === 'contacts'}
            onclick={() => navigate('contacts')}
          >
            Contacts
          </button>
          <button
            class="pill"
            class:active={currentView.value === 'export'}
            onclick={() => navigate('export')}
          >
            Export
          </button>
        </div>
      {/if}
    </div>
  </nav>

  <main class="content">
    {#if currentView.value === 'welcome'}
      <Welcome />
    {:else if currentView.value === 'contacts'}
      <ContactList />
    {:else if currentView.value === 'export'}
      <ExportView />
    {/if}
  </main>
</div>

<style>
  .app-shell {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg);
    color: var(--text-primary);
    font-family: var(--font-sans);
  }

  .titlebar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    height: 48px;
    flex-shrink: 0;
    background: var(--nav-bg);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    border-bottom: 1px solid var(--separator);
    -webkit-app-region: drag;
    user-select: none;
    z-index: 10;
  }

  .titlebar-left {
    justify-self: start;
    padding-left: 14px;
    -webkit-app-region: no-drag;
  }

  .titlebar-center {
    justify-self: center;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .titlebar-right {
    justify-self: end;
    padding-right: 14px;
    -webkit-app-region: no-drag;
  }

  /* ---- Traffic lights ---- */

  .traffic-lights {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tl-btn {
    position: relative;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: filter 0.15s ease;
  }

  .tl-close { background: #ff5f57; }
  .tl-minimize { background: #ffbd2e; }
  .tl-maximize { background: #28c840; }

  .tl-icon {
    opacity: 0;
    color: rgba(0, 0, 0, 0.55);
    transition: opacity 0.1s ease;
    pointer-events: none;
  }

  .traffic-lights:hover .tl-icon {
    opacity: 1;
  }

  .tl-btn:active {
    filter: brightness(0.85);
  }

  /* ---- Title ---- */

  .app-title {
    font-weight: 600;
    font-size: 0.8125rem;
    color: var(--text-primary);
    white-space: nowrap;
    letter-spacing: -0.01em;
  }

  .direction-pill {
    font-size: 0.6875rem;
    color: var(--text-tertiary);
    white-space: nowrap;
    padding: 1px 8px;
    background: var(--bg-secondary);
    border-radius: 980px;
    letter-spacing: -0.01em;
  }

  /* ---- Nav pills ---- */

  .nav-pills {
    display: flex;
    gap: 2px;
    background: var(--bg-secondary);
    border-radius: var(--radius-sm);
    padding: 2px;
  }

  .pill {
    appearance: none;
    border: none;
    background: transparent;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-family: var(--font-sans);
    color: var(--text-secondary);
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
    user-select: none;
    line-height: 1.4;
  }

  .pill:hover {
    color: var(--text-primary);
  }

  .pill.active {
    background: var(--accent-light);
    color: var(--accent);
    font-weight: 500;
  }

  /* ---- Content ---- */

  .content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }
</style>
