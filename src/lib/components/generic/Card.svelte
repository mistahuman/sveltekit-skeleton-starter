<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title = '',
		content = '',
		children
	}: {
		title?: string;
		content?: string;
		children?: Snippet;
	} = $props();
</script>

<div class="card p-4 preset-outlined-primary-500">
	<header class="text-center h3">
		{title}
	</header>
	<hr class="divider" />
	<article class="p-4">
		<!-- {@render children?.()} -->
		{content}
	</article>
	<footer class="flex items-center justify-between gap-4 p-4">
		<small class="opacity-60">On {new Date().toLocaleDateString()}</small>
	</footer>
</div>
