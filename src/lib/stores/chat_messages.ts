import { get, writable } from 'svelte/store';
import { type CreateChatCompletionRequest, type ChatCompletionRequestMessage, OpenAIApi } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from "@langchain/pinecone";
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { RetrievalQAChain } from 'langchain/chains';

export interface ChatTranscript {
  messages: ChatCompletionRequestMessage[];
  chatState: 'idle' | 'loading' | 'error' | 'message';
}

const { subscribe, update, ...store } = writable<ChatTranscript>({
  messages: [
    { role: 'assistant', content: 'Hey, I am your network troubleshooter, How can I help you?' }
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
  (window as any).global = window;

  const pinecone = new Pinecone({
    apiKey: "f783feb8-405e-4580-9970-749ea3b96185",
  });

  const index_name = 'langchain-rag-multiple-docs';

  const model = new OpenAIEmbeddings({
    openAIApiKey: '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',
    modelName: 'text-embedding-ada-002'
  });
  const pineconeIndex = pinecone.Index(index_name);

  const vectorstore = await PineconeStore.fromExistingIndex(
    model, { pineconeIndex }
  )

  const llm = new ChatOpenAI({
    openAIApiKey: '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',
    temperature: 1.0,
    modelName: 'gpt-3.5-turbo',
  });

  const chain = RetrievalQAChain.fromLLM(llm, vectorstore.asRetriever());
  // console.log(await chain.run("What are the procedure and execution steps to Verify that the NAS signalling messages are replay protected by AMF over N1 interface between UE and AMF?"))

  const result = await chain.run(query);
  if (get(answer) === '...') answer.set('');

  answer.update((_a) => _a + result);

  // const messages: ChatCompletionRequestMessage[] = [{ role: 'system', content: query }];

  // const chatRequestOpts: CreateChatCompletionRequest = {
  //   model: 'gpt-3.5-turbo',
  //   messages,
  //   temperature: 1.0,
  //   // stream: true
  // };

  // const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
  //   headers: {
  //     Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
  //     'Content-Type': 'application/json'
  //   },
  //   method: 'POST',
  //   body: JSON.stringify(chatRequestOpts),
  // });

  // if (!chatResponse.ok) {
  //   const err = await chatResponse.json();
  //   throw new Error(err);
  // }

  // const jsonResponse = await chatResponse.json();
  // // console.log(jsonResponse);
  // // console.log(jsonResponse["choices"][0]["message"]["content"]);

  // if (get(answer) === '...') answer.set('');

  // answer.update((_a) => _a + jsonResponse["choices"][0]["message"]["content"]);
  // // eventSource.addEventListener('error', handleError);
  // // eventSource.addEventListener('message', streamMessage);
  // // eventSource.stream();
};

const replace = (messages: ChatTranscript) => {
  store.set(messages);
};

const reset = () =>
  store.set({
    messages: [
      { role: 'assistant', content: 'Hey, I am your network troubleshooter, How can I help you?' }
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