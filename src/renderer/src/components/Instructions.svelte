<script>
  import { SvelteSet } from 'svelte/reactivity';
  import { transferDirection } from '../lib/contacts.svelte.ts';

  let openSections = new SvelteSet();

  /** @param {string} id */
  function toggle(id) {
    if (openSections.has(id)) {
      openSections.delete(id);
    } else {
      openSections.add(id);
    }
  }

  const androidToIphoneSections = [
    {
      id: 'export',
      title: 'How to Export from Android',
      steps: [
        'Open the Contacts app on your Android phone',
        'Tap the menu (three dots) \u2192 "Export" or "Share"',
        'Choose "Export to .vcf file" or "Share all contacts"',
        'Save the file or send it to your computer (email, Google Drive, USB)',
        'Import the .vcf file into this app'
      ]
    },
    {
      id: 'import',
      title: 'How to Import to iPhone',
      steps: [
        'Transfer the exported .vcf file to your iPhone',
        'Email it to yourself, use AirDrop, or upload to iCloud Drive',
        'Open the .vcf file on your iPhone \u2014 it opens in Contacts',
        'Tap "Add All Contacts" to import',
        'Alternative: Go to iCloud.com \u2192 Contacts \u2192 gear icon \u2192 "Import vCard"'
      ]
    }
  ];

  const iphoneToAndroidSections = [
    {
      id: 'export',
      title: 'How to Export from iPhone',
      steps: [
        'On your computer, go to iCloud.com and sign in',
        'Open Contacts, select all contacts (Ctrl+A / Cmd+A)',
        'Click the gear icon \u2192 "Export vCard"',
        'Save the .vcf file to your computer',
        'Import the .vcf file into this app'
      ]
    },
    {
      id: 'import',
      title: 'How to Import to Android',
      steps: [
        'Transfer the exported .vcf file to your Android phone',
        'Email it to yourself, use Google Drive, or transfer via USB',
        'Open the .vcf file on Android \u2014 it opens in Contacts',
        'Tap "Import" to add all contacts',
        'Alternative: Go to contacts.google.com \u2192 Import \u2192 select the .vcf file'
      ]
    }
  ];

  let sections = $derived(
    transferDirection.value === 'iphone-to-android'
      ? iphoneToAndroidSections
      : androidToIphoneSections
  );
</script>

<div class="instructions">
  {#each sections as section (section.id)}
    {@const isOpen = openSections.has(section.id)}
    <div class="accordion-item">
      <button
        class="accordion-header"
        onclick={() => toggle(section.id)}
        aria-expanded={isOpen}
      >
        <span class="accordion-title">{section.title}</span>
        <svg
          class="chevron"
          class:chevron-open={isOpen}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {#if isOpen}
        <div class="accordion-body">
          <ol class="steps-list">
            {#each section.steps as step, i (i)}
              <li class="step-item">{step}</li>
            {/each}
          </ol>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .instructions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .accordion-item {
    background: var(--bg-elevated);
    border: 1px solid var(--separator);
    border-radius: var(--radius, 12px);
    overflow: hidden;
  }

  .accordion-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.625rem 1rem;
    background: transparent;
    border: none;
    border-radius: 0;
    cursor: pointer;
    text-align: left;
    color: var(--text-primary);
    transition: background-color 0.15s ease;
  }

  .accordion-header:hover {
    background: var(--bg-hover);
  }

  .accordion-header:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: -2px;
  }

  .accordion-title {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.4;
  }

  .chevron {
    flex-shrink: 0;
    color: var(--text-tertiary);
    transition: transform 0.2s ease;
  }

  .chevron-open {
    transform: rotate(180deg);
  }

  .accordion-body {
    padding: 0 1rem 0.75rem;
    border-top: 1px solid var(--separator);
  }

  .steps-list {
    margin: 0.625rem 0 0;
    padding-left: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .step-item {
    font-size: 0.8125rem;
    color: var(--text-secondary);
    line-height: 1.5;
    padding-left: 0.25rem;
  }

  .step-item::marker {
    color: var(--accent);
    font-weight: 600;
  }
</style>
