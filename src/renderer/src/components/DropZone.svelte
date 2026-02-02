<script>
  /** @type {{ onDrop: (filePath: string) => void }} */
  let { onDrop } = $props();

  let isDragging = $state(false);
  let error = $state('');

  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let errorTimeout;

  /**
   * @param {DragEvent} e
   */
  function handleDragOver(e) {
    e.preventDefault();
    isDragging = true;
  }

  /**
   * @param {DragEvent} e
   */
  function handleDragLeave(e) {
    e.preventDefault();
    isDragging = false;
  }

  /**
   * @param {DragEvent} e
   */
  function handleDrop(e) {
    e.preventDefault();
    isDragging = false;
    error = '';

    const file = e.dataTransfer?.files[0];
    if (!file) return;

    // Electron exposes file.path on the File object
    const filePath = /** @type {any} */ (file).path;
    if (!filePath || !filePath.toLowerCase().endsWith('.vcf')) {
      error = 'Only .vcf files are accepted';
      clearTimeout(errorTimeout);
      errorTimeout = setTimeout(() => {
        error = '';
      }, 3000);
      return;
    }

    onDrop(filePath);
  }
</script>

<div
  class="dropzone"
  class:dragging={isDragging}
  class:has-error={!!error}
  role="button"
  tabindex="0"
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
>
  <svg
    class="icon"
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M12 16V8" />
    <path d="M8 12l4-4 4 4" />
    <path d="M20 16.7V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3.3" />
    <path d="M4 12a8 8 0 1 1 16 0" />
  </svg>

  {#if error}
    <p class="error-message">{error}</p>
  {:else}
    <p class="label">Drag and drop your .vcf file here</p>
  {/if}
</div>

<style>
  .dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 2.5rem 2rem;
    border: 2px dashed var(--separator-opaque);
    border-radius: var(--radius-lg, 16px);
    background: transparent;
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease;
  }

  .dropzone.dragging {
    border-color: var(--accent);
    background-color: var(--accent-light);
  }

  .dropzone.has-error {
    border-color: var(--danger);
  }

  .icon {
    color: var(--text-tertiary);
    transition: color 0.2s ease;
  }

  .dropzone.dragging .icon {
    color: var(--accent);
  }

  .label {
    margin: 0;
    color: var(--text-tertiary);
    font-size: 0.95rem;
    transition: color 0.2s ease;
  }

  .dropzone.dragging .label {
    color: var(--accent);
  }

  .error-message {
    margin: 0;
    color: var(--danger);
    font-size: 0.95rem;
    font-weight: 500;
  }
</style>
