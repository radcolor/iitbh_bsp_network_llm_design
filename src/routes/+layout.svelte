<script>
	import '../app.pcss';
	import { onMount } from 'svelte';
	import { auth } from '$lib/backend/firebase';
	import { Toaster } from 'svelte-sonner';

	const nonAuthRoutes = ['/', 'chat'];

	onMount(() => {
		console.log('Mounting');
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			const currentPath = window.location.pathname;

			if (!user && !nonAuthRoutes.includes(currentPath)) {
				window.location.href = '/';
				return;
			}

			if (user && currentPath === '/') {
				window.location.href = '/chat';
				return;
			}

			if (!user) {
				return;
			}
		});
		return unsubscribe;
	});
</script>

<div class="mainContainer grid">
	<slot />
</div>
<Toaster richColors expand={true} />

<style>
	.grid {
		background-image: url('grid.svg');
	}
	.grid::before {
		background-image: linear-gradient(to top right, transparent 70%, black 100%);
		z-index: 1;
	}
</style>
