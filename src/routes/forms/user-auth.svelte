<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import '@fontsource/noto-sans/400.css';
	import '@fontsource/noto-sans/500.css';
	import '@fontsource/noto-sans/600.css';
	import '@fontsource/noto-sans/700.css';
	import '@fontsource/noto-sans/800.css';
	import '@fontsource/source-code-pro/600.css';
	import { cn } from '$lib/utils';
	import Google from '../icons/google.svelte';

	let className: string | undefined | null = undefined;
	export { className as class };

	let isLoading = false;
	async function onSubmit() {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 3000);
	}
</script>

<div class={cn('grid gap-6', className)} {...$$restProps}>
	<form on:submit|preventDefault={onSubmit}>
		<div class="grid gap-2">
			<div class="grid gap-2">
				<Label class="sr-only" for="email">Email</Label>
				<Input
					id="email"
					placeholder="yourname@yourdomain.in"
					type="email"
					autocapitalize="none"
					autocomplete="email"
					autocorrect="off"
					disabled={isLoading}
				/>
				<Input
					id="password"
					placeholder="type password here..."
					type="password"
					autocapitalize="none"
					autocomplete="password"
					autocorrect="off"
					disabled={isLoading}
				/>
				<br />
			</div>
			<Button disabled={isLoading}>
				{#if isLoading}
					<!-- <Icons.spinner class="mr-2 h-4 w-4 animate-spin" /> -->
				{/if}
				Sign In with Email
			</Button>
		</div>
	</form>
	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<span class="w-full border-t" />
		</div>
		<div class="relative flex justify-center text-xs uppercase">
			<span class="bg-background px-2 text-muted-foreground"> Or continue with </span>
		</div>
	</div>
	<Button variant="outline" type="button" disabled={isLoading}>
		{#if isLoading}
			<Google class="mr-2 h-4 w-4 animate-spin" />
		{:else}
			<Google class="mr-2 h-4 w-4" />
		{/if}
		{' '}
		Google
	</Button>
	<!-- <AlertDialog.Root>
		<AlertDialog.Trigger asChild let:builder>
			<Button builders={[builder]} variant="outline">Show Dialog</Button>
		</AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
				<AlertDialog.Description>
					This action cannot be undone. This will permanently delete your account and remove your
					data from our servers.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action>Continue</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root> -->
</div>

<style>
	:root {
		font-family: 'Lexend', 'Noto Sans';
		overflow: hidden;
		font-weight: 400;
	}
	:global(button) {
		font-size: 12px !important;
	}
	div {
		user-select: none;
		cursor: default;
	}
	/* :global(.logcat) {
	-ms-overflow-style: none;
	scrollbar-width: none;
	overflow-y: scroll;
}
:global(.logcat::-webkit-scrollbar) {
	display: none;
} */
</style>
