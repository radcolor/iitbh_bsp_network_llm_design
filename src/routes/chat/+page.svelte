<script lang="ts">
	import type { CreateChatCompletionRequest, ChatCompletionRequestMessage } from 'openai';
	import ChatHistory from '$lib/components/ui/ChatHistory.svelte';
	import ChatMessage from '$lib/components/ui/ChatMessage.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { chatMessages, answer } from '$lib/stores/chat_messages';
	import { getTokens } from '$lib/utils';

	let query = '';

	async function doPost() {
		const prompt = 'Who is Radwimps';

		const messages: ChatCompletionRequestMessage[] = [{ role: 'system', content: prompt }];

		const chatRequestOpts: CreateChatCompletionRequest = {
			model: 'gpt-3.5-turbo',
			messages,
			temperature: 1.0,
			stream: false
		};

		const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
			headers: {
				Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(chatRequestOpts)
		});

		if (!chatResponse.ok) {
			const err = await chatResponse.json();
			throw new Error(err);
		}

		console.log(await chatResponse.json());
	}

	const handleSubmit = async () => {
		answer.set('...');
		await chatMessages.set(query);
		// doPost();
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
	.gridd {
		background-color: #26282d;
	}
</style>
