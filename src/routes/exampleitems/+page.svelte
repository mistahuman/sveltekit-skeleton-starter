<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '$lib/components/generic/Card.svelte';
	import { uiStore } from '$lib/stores/ui.svelte';
	import { exampleItemsApi, type ExampleItem } from '$lib/api/client';

	let items = $state<ExampleItem[]>([]);
	let loading = $state(true);
	let error = $state('');

	let form = $state({ title: '', value: 0, code: '', description: '' });
	let submitting = $state(false);

	onMount(async () => {
		await loadItems();
	});

	async function loadItems() {
		loading = true;
		error = '';
		try {
			items = await exampleItemsApi.list();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load items';
		} finally {
			loading = false;
		}
	}

	async function create() {
		submitting = true;
		try {
			await exampleItemsApi.create(form);
			form = { title: '', value: 0, code: '', description: '' };
			await loadItems();
			uiStore.toast('Item created', 'success');
		} catch (e) {
			uiStore.toast(e instanceof Error ? e.message : 'Failed to create item', 'error');
		} finally {
			submitting = false;
		}
	}

	async function remove(id: string) {
		try {
			await exampleItemsApi.delete(id);
			await loadItems();
			uiStore.toast('Item deleted', 'success');
		} catch (e) {
			uiStore.toast(e instanceof Error ? e.message : 'Failed to delete item', 'error');
		}
	}
</script>

<svelte:head>
	<title>ExampleItems — sveltekit-skeleton-starter</title>
</svelte:head>

<div class="container mx-auto max-w-3xl space-y-12 px-4 py-16">
	<!-- Create form -->
	<section class="space-y-4">
		<h2 class="h3 font-semibold">New item</h2>
		<form onsubmit={(e) => { e.preventDefault(); create(); }} class="card preset-filled-surface-100-900 border-[1px] border-surface-200-800 space-y-4 p-6">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<label class="space-y-1">
					<span class="text-sm font-medium">Title *</span>
					<input bind:value={form.title} required class="input" placeholder="Lorem ipsum" />
				</label>
				<label class="space-y-1">
					<span class="text-sm font-medium">Code *</span>
					<input bind:value={form.code} required class="input" placeholder="LIPS01" />
				</label>
				<label class="space-y-1">
					<span class="text-sm font-medium">Value *</span>
					<input bind:value={form.value} required type="number" class="input" placeholder="100" />
				</label>
				<label class="space-y-1">
					<span class="text-sm font-medium">Description</span>
					<input bind:value={form.description} class="input" placeholder="Optional description" />
				</label>
			</div>
			<button type="submit" disabled={submitting} class="btn preset-filled-primary-500">
				{submitting ? 'Creating…' : 'Create'}
			</button>
		</form>
	</section>

	<!-- List -->
	<section class="space-y-4">
		<h2 class="h3 font-semibold">Items</h2>

		{#if loading}
			<p class="text-surface-500">Loading…</p>
		{:else if error}
			<p class="text-error-500">{error}</p>
		{:else if items.length === 0}
			<p class="text-surface-500">No items yet. Create one above.</p>
		{:else}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{#each items as item (item.id)}
					<Card title={item.title}>
						<div class="space-y-2 text-sm">
							<p><span class="font-medium">Code:</span> {item.code}</p>
							<p><span class="font-medium">Value:</span> {item.value}</p>
							{#if item.description}
								<p class="text-surface-500">{item.description}</p>
							{/if}
							<button
								onclick={() => remove(item.id)}
								class="btn btn-sm preset-tonal-error mt-2 w-full"
							>
								Delete
							</button>
						</div>
					</Card>
				{/each}
			</div>
		{/if}
	</section>
</div>
