<script lang="ts">
	import ChatHistory from '$lib/components/ui/ChatHistory.svelte';
	import ChatMessage from '$lib/components/ui/ChatMessage.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { chatMessages, answer } from '$lib/stores/chat_messages';

	let query = '';

	const handleSubmit = async () => {
		answer.set('...');
		await chatMessages.set(query);
		query = '';
	};
</script>

<div class="gridd flex flex-col items-center py-14">
	<section class="flex w-full max-w-6xl justify-center pt-4">
		<div class="flex flex-col gap-2">
			<ChatHistory />
		</div>

		<div class="flex w-full flex-col items-center gap-2 px-8">
			<div
				class="flex h-[700px] w-full flex-col gap-4 overflow-y-auto rounded-md bg-black bg-opacity-20 p-4"
			>
				<div class="flex flex-col gap-2">
					{#each $chatMessages.messages as message}
						<ChatMessage type={message.role} message={message.content} />
					{/each}

					{#if $answer}
						<ChatMessage type="assistant" message={$answer} />
					{/if}
				</div>
			</div>
			<form
				class="flex w-full gap-4 rounded-md bg-black bg-opacity-20 p-2"
				on:submit|preventDefault={handleSubmit}
			>
				<Input type="text" bind:value={query} class="w-full" />
				<button
					type="submit"
					class="ml-[-0.5rem] rounded-md border border-black/40 bg-black bg-opacity-40 px-8 py-1.5 text-teal-300 hover:bg-white/5"
				>
					Send
				</button>
			</form>
		</div>
	</section>
</div>

<style>
	:root {
		font-family: 'Lexend', 'Noto Sans';
		overflow: hidden;
		font-weight: 400;
	}
	html,
	body {
		height: 100%;
	}
	.gridd {
		background-color: #26282d;
	}

	pre {
		display: inline-flex;
		padding: 0.5rem;
		width: 100%;
		border-radius: 0.25rem;
	}

	code {
		background-color: rgba(44, 43, 43, 0.6);
		color: rgb(190 18 60 / var(--tw-text-opacity));
		border-radius: 0.25rem;
		padding: 0 0.5rem;
	}

	body {
		color: white;
		background-color: #131416;
	}

	ol {
		list-style: number;
		padding: 1rem;
	}

	ol > li {
		margin: 1rem 0;
	}
</style>
