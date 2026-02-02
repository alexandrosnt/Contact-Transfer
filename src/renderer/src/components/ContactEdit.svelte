<script lang="ts">
	import type { Contact } from '../lib/types'

	let {
		contact,
		onSave,
		onClose
	}: {
		contact: Contact
		onSave: (updated: Contact) => void
		onClose: () => void
	} = $props()

	// svelte-ignore state_referenced_locally
	const initial: Contact = JSON.parse(JSON.stringify(contact))
	let edited: Contact = $state(initial)

	function addPhone() {
		edited.phones = [...edited.phones, { type: 'CELL', number: '' }]
	}

	function removePhone(index: number) {
		edited.phones = edited.phones.filter((_, i) => i !== index)
	}

	function addEmail() {
		edited.emails = [...edited.emails, { type: 'HOME', address: '' }]
	}

	function removeEmail(index: number) {
		edited.emails = edited.emails.filter((_, i) => i !== index)
	}

	function handleSave() {
		edited.fullName = [edited.firstName, edited.lastName].filter(Boolean).join(' ')
		onSave(JSON.parse(JSON.stringify(edited)))
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose()
		}
	}
</script>

<div
	class="modal-overlay"
	role="dialog"
	aria-modal="true"
	aria-label="Edit contact"
	tabindex="-1"
	onclick={handleOverlayClick}
	onkeydown={handleKeydown}
>
	<div class="modal-content">
		<h2 class="modal-title">Edit Contact</h2>

		<form class="edit-form" onsubmit={(e) => { e.preventDefault(); handleSave(); }}>
			<div class="field-row two-col">
				<div class="field-group">
					<label for="edit-first-name">First Name</label>
					<input id="edit-first-name" type="text" bind:value={edited.firstName} />
				</div>
				<div class="field-group">
					<label for="edit-last-name">Last Name</label>
					<input id="edit-last-name" type="text" bind:value={edited.lastName} />
				</div>
			</div>

			<div class="field-row two-col">
				<div class="field-group">
					<label for="edit-organization">Organization</label>
					<input id="edit-organization" type="text" bind:value={edited.organization} />
				</div>
				<div class="field-group">
					<label for="edit-title">Title</label>
					<input id="edit-title" type="text" bind:value={edited.title} />
				</div>
			</div>

			<!-- Phones section -->
			<div class="section">
				<span class="section-label">Phones</span>

				{#each edited.phones as phone, i (i)}
					<div class="array-row">
						<select bind:value={phone.type} aria-label="Phone type">
							<option value="CELL">Cell</option>
							<option value="HOME">Home</option>
							<option value="WORK">Work</option>
							<option value="OTHER">Other</option>
						</select>
						<input
							type="tel"
							placeholder="Phone number"
							bind:value={phone.number}
							aria-label="Phone number"
						/>
						<button
							type="button"
							class="btn-remove"
							onclick={() => removePhone(i)}
							aria-label="Remove phone"
						>&times;</button>
					</div>
				{/each}

				<button type="button" class="btn-add" onclick={addPhone}>+ Add Phone</button>
			</div>

			<!-- Emails section -->
			<div class="section">
				<span class="section-label">Emails</span>

				{#each edited.emails as email, i (i)}
					<div class="array-row">
						<select bind:value={email.type} aria-label="Email type">
							<option value="HOME">Home</option>
							<option value="WORK">Work</option>
							<option value="OTHER">Other</option>
						</select>
						<input
							type="email"
							placeholder="Email address"
							bind:value={email.address}
							aria-label="Email address"
						/>
						<button
							type="button"
							class="btn-remove"
							onclick={() => removeEmail(i)}
							aria-label="Remove email"
						>&times;</button>
					</div>
				{/each}

				<button type="button" class="btn-add" onclick={addEmail}>+ Add Email</button>
			</div>

			<div class="modal-footer">
				<button type="button" class="btn-ghost" onclick={onClose}>Cancel</button>
				<button type="submit" class="btn-primary">Save</button>
			</div>
		</form>
	</div>
</div>

<style>
	.modal-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 1.25rem 0;
		color: var(--text-primary);
	}

	.edit-form {
		display: grid;
		gap: 0.75rem;
	}

	.field-row.two-col {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
	}

	.field-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.field-group label {
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-secondary);
	}

	.field-group input {
		width: 100%;
		box-sizing: border-box;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-top: 0.75rem;
	}

	.section-label {
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-secondary);
	}

	.array-row {
		display: grid;
		grid-template-columns: 7rem 1fr auto;
		gap: 0.5rem;
		align-items: center;
	}

	.array-row select {
		width: 100%;
		box-sizing: border-box;
	}

	.array-row input {
		width: 100%;
		box-sizing: border-box;
	}

	.btn-remove {
		width: 24px;
		height: 24px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		border: none;
		border-radius: 50%;
		background: var(--bg-tertiary);
		color: var(--text-secondary);
		font-size: 0.875rem;
		line-height: 1;
		cursor: pointer;
		transition: background-color 0.15s, color 0.15s;
	}

	.btn-remove:hover {
		background: var(--danger-light);
		color: var(--danger);
	}

	.btn-add {
		align-self: flex-start;
		background: none;
		border: none;
		color: var(--accent);
		font-size: 0.8125rem;
		padding: 0.25rem 0;
		cursor: pointer;
		font-weight: 500;
	}

	.btn-add:hover {
		text-decoration: underline;
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 0.5rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--separator);
	}
</style>
