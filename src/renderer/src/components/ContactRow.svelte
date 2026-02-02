<script lang="ts">
	import type { Contact } from '../lib/types'

	let {
		contact,
		onToggle,
		onEdit,
		onRemove
	}: {
		contact: Contact
		onToggle: () => void
		onEdit: () => void
		onRemove: () => void
	} = $props()
</script>

<tr class="contact-row">
	<td class="cell cell-checkbox">
		<input
			type="checkbox"
			class="checkbox"
			checked={contact.selected}
			onchange={onToggle}
		/>
	</td>

	<td class="cell cell-name">
		<span class="full-name">{contact.fullName}</span>
		{#if contact.organization}
			<span class="organization">{contact.organization}</span>
		{/if}
	</td>

	<td class="cell cell-phone">
		{#if contact.phones.length > 0}
			<span class="phone-number">{contact.phones[0].number}</span>
			<span class="type-pill">{contact.phones[0].type}</span>
		{:else}
			<span class="empty-value">&mdash;</span>
		{/if}
	</td>

	<td class="cell cell-email">
		{#if contact.emails.length > 0}
			<span class="email-address">{contact.emails[0].address}</span>
		{:else}
			<span class="empty-value">&mdash;</span>
		{/if}
	</td>

	<td class="cell cell-actions">
		<button class="btn-edit" onclick={onEdit}>Edit</button>
		<button class="btn-remove" onclick={onRemove}>Remove</button>
	</td>
</tr>

<style>
	.contact-row {
		border-bottom: 1px solid var(--separator);
		transition: background-color 0.15s ease;
	}

	.contact-row:hover {
		background-color: var(--bg-hover);
	}

	.cell {
		padding: 0.625rem 0.75rem;
		font-size: 0.8125rem;
		vertical-align: middle;
	}

	.cell-checkbox {
		width: 2rem;
		text-align: center;
	}

	.checkbox {
		accent-color: var(--accent);
		cursor: pointer;
		width: 1rem;
		height: 1rem;
	}

	.cell-name {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.full-name {
		font-weight: 600;
		color: var(--text-primary);
	}

	.organization {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.cell-phone {
		white-space: nowrap;
	}

	.phone-number {
		margin-right: 0.375rem;
		color: var(--text-primary);
	}

	.type-pill {
		display: inline-block;
		font-size: 0.6875rem;
		padding: 0.0625rem 0.4375rem;
		border-radius: 9999px;
		background: var(--bg-tertiary);
		color: var(--text-secondary);
		text-transform: capitalize;
	}

	.cell-email {
		color: var(--text-secondary);
	}

	.email-address {
		color: var(--text-secondary);
	}

	.empty-value {
		color: var(--text-tertiary);
	}

	.cell-actions {
		white-space: nowrap;
		text-align: right;
	}

	.btn-edit,
	.btn-remove {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius-sm);
		font-size: 0.8125rem;
		transition: background-color 0.15s ease;
	}

	.btn-edit {
		color: var(--accent);
	}

	.btn-edit:hover {
		background-color: var(--accent-light);
	}

	.btn-remove {
		color: var(--danger);
	}

	.btn-remove:hover {
		background-color: var(--danger-light);
	}
</style>
