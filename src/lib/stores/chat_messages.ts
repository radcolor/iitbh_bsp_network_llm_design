import { get, writable } from 'svelte/store';
import type { CreateChatCompletionRequest, ChatCompletionRequestMessage } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

export interface ChatTranscript {
  messages: ChatCompletionRequestMessage[];
  chatState: 'idle' | 'loading' | 'error' | 'message';
}

const { subscribe, update, ...store } = writable<ChatTranscript>({
  messages: [
    { role: 'assistant', content: 'Hey, I am GPT3.5, How can I help you?' }
  ],
  chatState: 'idle'
});

const set = async (query: string) => {
  updateMessages(query, 'user', 'loading');

  // const eventSource = new SSE('/api/chat', {
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   payload: JSON.stringify({ messages: get(chatMessages).messages })
  // });

  // const prompt = "I want you, Bless my soul! <3";

  const messages: ChatCompletionRequestMessage[] = [{ role: 'system', content: query }];

  const chatRequestOpts: CreateChatCompletionRequest = {
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 1.0,
    // stream: true
  };

  const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(chatRequestOpts),
  });

  if (!chatResponse.ok) {
    const err = await chatResponse.json();
    throw new Error(err);
  }

  const jsonResponse = await chatResponse.json();
  // console.log(jsonResponse);
  // console.log(jsonResponse["choices"][0]["message"]["content"]);
  
  if (get(answer) === '...') answer.set('');

  answer.update((_a) => _a + jsonResponse["choices"][0]["message"]["content"]);
  // eventSource.addEventListener('error', handleError);
  // eventSource.addEventListener('message', streamMessage);
  // eventSource.stream();
};

const replace = (messages: ChatTranscript) => {
  store.set(messages);
};

const reset = () =>
  store.set({
    messages: [
      { role: 'assistant', content: 'Hey, I am GPT3.5, How can I help you?' }
    ],
    chatState: 'idle'
  });

const updateMessages = (content: any, role: any, state: any) => {
  chatMessages.update((messages: ChatTranscript) => {
    return { messages: [...messages.messages, { role: role, content: content }], chatState: state };
  });
};

const handleError = <T>(err: T) => {
  updateMessages(err, 'system', 'error');
  console.error(err);
};

const streamMessage = (e: MessageEvent) => {
  try {
    if (e.data === '[DONE]') {
      updateMessages(get(answer), 'assistant', 'idle');
      return answer.set('');
    }

    if (get(answer) === '...') answer.set('');

    const completionResponse = JSON.parse(e.data);
    const [{ delta }] = completionResponse.choices;

    if (delta.content) {
      answer.update((_a) => _a + delta.content);
    }
  } catch (err) {
    handleError(err);
  }
};

export const chatMessages = { subscribe, set, update, reset, replace };
export const answer = writable<string>('');