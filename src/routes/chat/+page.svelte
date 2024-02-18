<script lang="ts">
	import { authHandlers } from '$lib/backend/authenticate';
	import { Button } from '$lib/components/ui/button';
	import Sidebar from '../../components/sidebar.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		console.log('Logged in');
	});
</script>

<div class="hidden md:block">
	<div class="border-t">
		<div class="bg-background">
			<div class="grid lg:grid-cols-5">
				<Sidebar />
				<div class="col-span-3 lg:col-span-4 lg:border-l">
					<div class="h-full px-4 py-6 lg:px-8">
						<Button on:click={authHandlers.logout}>Logout</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
