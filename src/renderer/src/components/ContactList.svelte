<script lang="ts">
	import type { Contact } from '../lib/types'
	import {
		contacts,
		filteredContacts,
		searchQuery,
		currentView,
		selectAll,
		deselectAll,
		removeContact,
		toggleSelect,
		removeDuplicates,
		updateContact,
		stats
	} from '../lib/contacts.svelte.ts'
	import ContactRow from './ContactRow.svelte'
	import ContactEdit from './ContactEdit.svelte'
	import StatsBar from './StatsBar.svelte'

	let editingContact: Contact | null = $state(null)

	function handleEdit(contact: Contact) {
		editingContact = contact
	}

	function handleSave(updated: Contact) {
		updateContact(updated)
		editingContact = null
	}

	function handleCloseEdit() {
		editingContact = null
	}

	function handleExport() {
		currentView.value = 'export'
	}
</script>

<div class="contact-list">
	<div class="toolbar">
		<div class="search-wrapper">
			<svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="11" cy="11" r="8" />
				<line x1="21" y1="21" x2="16.65" y2="16.65" />
			</svg>
			<input
				class="search-input"
				type="text"
				placeholder="Search contacts..."
				bind:value={searchQuery.value}
			/>
		</div>
		<div class="toolbar-actions">
			<button class="btn-ghost" onclick={selectAll}>Select All</button>
			<button class="btn-ghost" onclick={deselectAll}>Deselect All</button>
			{#if stats.value.duplicateCount > 0}
				<button class="btn-ghost" onclick={removeDuplicates}>Remove Duplicates</button>
			{/if}
			<button class="btn-primary" onclick={handleExport}>Export Selected</button>
		</div>
	</div>

	<StatsBar />

	<div class="table-container">
		{#if filteredContacts.value.length > 0}
			<table class="contacts-table">
				<thead>
					<tr>
						<th class="col-checkbox"></th>
						<th>Name</th>
						<th>Phone</th>
						<th>Email</th>
						<th class="col-actions">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredContacts.value as contact (contact.id)}
						<ContactRow
							{contact}
							onToggle={() => toggleSelect(contact.id)}
							onEdit={() => handleEdit(contact)}
							onRemove={() => removeContact(contact.id)}
						/>
					{/each}
				</tbody>
			</table>
		{:else}
			<div class="empty-state">
				{#if contacts.value.length === 0}
					<p class="empty-title">No contacts yet</p>
					<p class="empty-subtitle">Import a file to get started.</p>
				{:else}
					<p class="empty-title">No results found</p>
					<p class="empty-subtitle">Try a different search</p>
				{/if}
			</div>
		{/if}
	</div>
</div>

{#if editingContact}
	<ContactEdit
		contact={editingContact}
		onSave={handleSave}
		onClose={handleCloseEdit}
	/>
{/if}

<style>
	.contact-list {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.toolbar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: var(--bg-elevated);
		border-bottom: 1px solid var(--separator);
	}

	.search-wrapper {
		position: relative;
		width: 280px;
	}

	.search-icon {
		position: absolute;
		left: 0.625rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-tertiary);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.4375rem 0.75rem 0.4375rem 2rem;
		border-radius: var(--radius-sm);
		background: var(--bg-secondary);
		border: none;
		font-size: 0.8125rem;
		color: var(--text-primary);
		outline: none;
		transition: box-shadow 0.15s ease;
	}

	.search-input:focus {
		box-shadow: 0 0 0 2px var(--accent-light);
	}

	.search-input::placeholder {
		color: var(--text-tertiary);
	}

	.toolbar-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-left: auto;
		flex-wrap: wrap;
	}

	.btn-ghost {
		background: none;
		border: none;
		color: var(--accent);
		cursor: pointer;
		padding: 0.375rem 0.75rem;
		border-radius: var(--radius-sm);
		font-size: 0.8125rem;
		font-weight: 500;
		transition: background-color 0.15s ease;
	}

	.btn-ghost:hover {
		background-color: var(--bg-hover);
	}

	.btn-primary {
		background: var(--accent);
		color: #fff;
		border: none;
		cursor: pointer;
		padding: 0.375rem 0.875rem;
		border-radius: var(--radius-sm);
		font-size: 0.8125rem;
		font-weight: 600;
		transition: background-color 0.15s ease;
	}

	.btn-primary:hover {
		background: var(--accent-hover);
	}

	.table-container {
		flex: 1;
		overflow-y: auto;
		min-height: 0;
	}

	.contacts-table {
		width: 100%;
		border-collapse: collapse;
	}

	thead {
		position: sticky;
		top: 0;
		z-index: 1;
	}

	th {
		padding: 0.625rem 0.75rem;
		text-align: left;
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-tertiary);
		background: var(--bg-elevated);
		border-bottom: 2px solid var(--separator);
	}

	.col-checkbox {
		width: 2.5rem;
		text-align: center;
	}

	.col-actions {
		text-align: right;
		width: 10rem;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 1rem;
		text-align: center;
	}

	.empty-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 0.375rem;
	}

	.empty-subtitle {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin: 0;
	}
</style>
