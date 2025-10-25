# API Integration with Astro - LLM Chat Providers

Comprehensive guide for integrating Claude, Gemini, and ChatGPT APIs in Astro for Spanish Academic 2026.

---

## Architecture Overview

### Server-Side API Pattern

**Why Server-Side:**
- ✅ Protects API keys from client exposure
- ✅ Prevents CORS issues
- ✅ Enables request validation and rate limiting
- ✅ Reduces client bundle size
- ✅ Provides centralized error handling

**Spanish Academic Pattern:**
```
Client (React Island)
    ↓ POST /api/chat
Server (Astro Endpoint)
    ↓ API Call
Claude / Gemini / ChatGPT
    ↓ Response
Server (Astro Endpoint)
    ↓ JSON Response
Client (React Island)
```

---

## Environment Variables

### Setup

**Create `.env` file (DO NOT COMMIT):**
```bash
# Claude API
ANTHROPIC_API_KEY=sk-ant-...

# Gemini API
GEMINI_API_KEY=AIza...

# OpenAI API
OPENAI_API_KEY=sk-proj-...

# App Config
PUBLIC_API_BASE_URL=http://localhost:4321
```

**Add to `.gitignore`:**
```gitignore
.env
.env.local
.env.production
```

### Access in Astro

```typescript
// Server-side only (endpoints)
const apiKey = import.meta.env.ANTHROPIC_API_KEY;

// Client-side accessible (must prefix with PUBLIC_)
const baseUrl = import.meta.env.PUBLIC_API_BASE_URL;
```

**TypeScript types:**
```typescript
// src/env.d.ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly ANTHROPIC_API_KEY: string;
  readonly GEMINI_API_KEY: string;
  readonly OPENAI_API_KEY: string;
  readonly PUBLIC_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## Claude API Integration

### Installation

```bash
npm install @anthropic-ai/sdk
```

### Server Endpoint

**File:** `src/pages/api/chat/claude.ts`

```typescript
import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';

// Disable prerendering for dynamic API
export const prerender = false;

const client = new Anthropic({
  apiKey: import.meta.env.ANTHROPIC_API_KEY,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse request body
    const { messages, model = 'claude-sonnet-4-5', maxTokens = 1024 } = await request.json();

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call Claude API
    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      messages,
    });

    // Return response
    return new Response(
      JSON.stringify({
        content: response.content[0].text,
        usage: response.usage,
        model: response.model,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Claude API error:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
```

### Streaming Support

**File:** `src/pages/api/chat/claude-stream.ts`

```typescript
import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';

export const prerender = false;

const client = new Anthropic({
  apiKey: import.meta.env.ANTHROPIC_API_KEY,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages, model = 'claude-sonnet-4-5' } = await request.json();

    // Create streaming response
    const stream = await client.messages.create({
      model,
      max_tokens: 1024,
      messages,
      stream: true,
    });

    // Convert to ReadableStream
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta') {
              const text = chunk.delta.text;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Claude stream error:', error);
    return new Response(
      JSON.stringify({ error: 'Streaming failed' }),
      { status: 500 }
    );
  }
};
```

---

## Gemini API Integration

### Installation

```bash
npm install @google/genai
```

### Server Endpoint

**File:** `src/pages/api/chat/gemini.ts`

```typescript
import type { APIRoute } from 'astro';
import { GoogleGenAI } from '@google/genai';

export const prerender = false;

const client = new GoogleGenAI({
  apiKey: import.meta.env.GEMINI_API_KEY,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { prompt, model = 'gemini-2.5-flash' } = await request.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt required' }),
        { status: 400 }
      );
    }

    // Generate content
    const response = await client.models.generateContent({
      model,
      contents: prompt,
    });

    return new Response(
      JSON.stringify({
        content: response.text,
        model,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Gemini API error:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to generate content',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500 }
    );
  }
};
```

### Streaming Support

```typescript
import type { APIRoute } from 'astro';
import { GoogleGenAI } from '@google/genai';

export const prerender = false;

const client = new GoogleGenAI({
  apiKey: import.meta.env.GEMINI_API_KEY,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { prompt, model = 'gemini-2.5-flash' } = await request.json();

    // Generate streaming content
    const stream = await client.models.generateContentStream({
      model,
      contents: prompt,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text();
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Gemini stream error:', error);
    return new Response(JSON.stringify({ error: 'Streaming failed' }), { status: 500 });
  }
};
```

---

## ChatGPT (OpenAI) API Integration

### Installation

```bash
npm install openai
```

### Server Endpoint

**File:** `src/pages/api/chat/openai.ts`

```typescript
import type { APIRoute } from 'astro';
import OpenAI from 'openai';

export const prerender = false;

const client = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages, model = 'gpt-4o', maxTokens = 1024 } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array required' }),
        { status: 400 }
      );
    }

    // Create chat completion
    const response = await client.chat.completions.create({
      model,
      messages,
      max_tokens: maxTokens,
    });

    return new Response(
      JSON.stringify({
        content: response.choices[0].message.content,
        usage: response.usage,
        model: response.model,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('OpenAI API error:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to generate completion',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500 }
    );
  }
};
```

### Streaming Support

```typescript
import type { APIRoute } from 'astro';
import OpenAI from 'openai';

export const prerender = false;

const client = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages, model = 'gpt-4o' } = await request.json();

    // Create streaming completion
    const stream = await client.chat.completions.create({
      model,
      messages,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('OpenAI stream error:', error);
    return new Response(JSON.stringify({ error: 'Streaming failed' }), { status: 500 });
  }
};
```

---

## Unified Chat Endpoint

### Multi-Provider Router

**File:** `src/pages/api/chat.ts`

```typescript
import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';

export const prerender = false;

type Provider = 'claude' | 'gemini' | 'openai';

interface ChatRequest {
  provider: Provider;
  messages: Array<{ role: string; content: string }>;
  model?: string;
  maxTokens?: number;
  stream?: boolean;
}

// Initialize clients
const anthropic = new Anthropic({ apiKey: import.meta.env.ANTHROPIC_API_KEY });
const gemini = new GoogleGenAI({ apiKey: import.meta.env.GEMINI_API_KEY });
const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: ChatRequest = await request.json();
    const { provider, messages, model, maxTokens = 1024, stream = false } = body;

    // Validate
    if (!provider || !messages) {
      return new Response(
        JSON.stringify({ error: 'Provider and messages required' }),
        { status: 400 }
      );
    }

    // Route to provider
    switch (provider) {
      case 'claude':
        return await handleClaude(messages, model || 'claude-sonnet-4-5', maxTokens, stream);

      case 'gemini':
        // Convert messages to Gemini format (single prompt)
        const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
        return await handleGemini(prompt, model || 'gemini-2.5-flash', stream);

      case 'openai':
        return await handleOpenAI(messages, model || 'gpt-4o', maxTokens, stream);

      default:
        return new Response(
          JSON.stringify({ error: `Unknown provider: ${provider}` }),
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500 }
    );
  }
};

async function handleClaude(messages: any[], model: string, maxTokens: number, stream: boolean) {
  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    messages,
  });

  return new Response(
    JSON.stringify({ content: response.content[0].text, usage: response.usage }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

async function handleGemini(prompt: string, model: string, stream: boolean) {
  const response = await gemini.models.generateContent({ model, contents: prompt });

  return new Response(
    JSON.stringify({ content: response.text }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

async function handleOpenAI(messages: any[], model: string, maxTokens: number, stream: boolean) {
  const response = await openai.chat.completions.create({
    model,
    messages,
    max_tokens: maxTokens,
  });

  return new Response(
    JSON.stringify({ content: response.choices[0].message.content, usage: response.usage }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
```

---

## React Client Integration

### Chat Hook

**File:** `src/hooks/useChat.ts`

```typescript
import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UseChatOptions {
  provider: 'claude' | 'gemini' | 'openai';
  model?: string;
  onError?: (error: Error) => void;
}

export function useChat({ provider, model, onError }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          model,
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      onError?.(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => setMessages([]);

  return { messages, loading, sendMessage, reset };
}
```

### Chat Component

**File:** `src/components/islands/Chat.tsx`

```typescript
import React, { useState } from 'react';
import { useChat } from '@/hooks/useChat';

export default function Chat() {
  const [input, setInput] = useState('');
  const [provider, setProvider] = useState<'claude' | 'gemini' | 'openai'>('claude');

  const { messages, loading, sendMessage } = useChat({
    provider,
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    await sendMessage(input);
    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="provider-selector">
        <label>Provider:</label>
        <select value={provider} onChange={e => setProvider(e.target.value as any)}>
          <option value="claude">Claude</option>
          <option value="gemini">Gemini</option>
          <option value="openai">ChatGPT</option>
        </select>
      </div>

      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="loading">Thinking...</div>}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
```

### Usage in Astro Page

```astro
---
import Base from '@/layouts/Base.astro';
import Chat from '@/components/islands/Chat.tsx';
---

<Base title="AI Chat" description="Chat with AI assistants">
  <h1>Chat with AI</h1>

  <!-- Chat island loads when idle -->
  <Chat client:idle />
</Base>
```

---

## Best Practices

### 1. Error Handling

```typescript
export const POST: APIRoute = async ({ request }) => {
  try {
    // API call
  } catch (error) {
    // Log for debugging
    console.error('API error:', error);

    // Determine error type
    if (error.status === 401) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }),
        { status: 401 }
      );
    }

    if (error.status === 429) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { status: 429 }
      );
    }

    // Generic error
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
};
```

### 2. Rate Limiting

```typescript
// Simple in-memory rate limiter
const rateLimits = new Map<string, number[]>();

function checkRateLimit(ip: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const requests = rateLimits.get(ip) || [];

  // Remove old requests
  const validRequests = requests.filter(time => now - time < windowMs);

  if (validRequests.length >= maxRequests) {
    return false;
  }

  validRequests.push(now);
  rateLimits.set(ip, validRequests);
  return true;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!checkRateLimit(clientAddress)) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded' }),
      { status: 429 }
    );
  }

  // Continue with API call
};
```

### 3. Input Validation

```typescript
import { z } from 'zod';

const ChatRequestSchema = z.object({
  provider: z.enum(['claude', 'gemini', 'openai']),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(10000),
  })),
  model: z.string().optional(),
  maxTokens: z.number().min(1).max(4096).optional(),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Validate with Zod
    const validated = ChatRequestSchema.parse(body);

    // Use validated data
    // ...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Invalid request', details: error.errors }),
        { status: 400 }
      );
    }
    // Handle other errors
  }
};
```

### 4. Caching Responses

```typescript
// Simple cache for identical requests
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 300000; // 5 minutes

function getCacheKey(provider: string, messages: any[]): string {
  return `${provider}:${JSON.stringify(messages)}`;
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const cacheKey = getCacheKey(body.provider, body.messages);

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return new Response(JSON.stringify(cached.data), { status: 200 });
  }

  // Make API call
  const response = await callAPI(body);

  // Cache result
  cache.set(cacheKey, { data: response, timestamp: Date.now() });

  return new Response(JSON.stringify(response), { status: 200 });
};
```

### 5. Logging & Monitoring

```typescript
interface APILog {
  timestamp: string;
  provider: string;
  model: string;
  tokensUsed: number;
  latencyMs: number;
  success: boolean;
}

function logAPICall(log: APILog) {
  // Production: Send to monitoring service
  // Development: Console log
  if (import.meta.env.DEV) {
    console.log('[API Call]', log);
  } else {
    // Send to monitoring service (Datadog, Sentry, etc.)
  }
}

export const POST: APIRoute = async ({ request }) => {
  const startTime = Date.now();
  const body = await request.json();

  try {
    const response = await callAPI(body);
    const latency = Date.now() - startTime;

    logAPICall({
      timestamp: new Date().toISOString(),
      provider: body.provider,
      model: body.model,
      tokensUsed: response.usage?.total_tokens || 0,
      latencyMs: latency,
      success: true,
    });

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    logAPICall({
      timestamp: new Date().toISOString(),
      provider: body.provider,
      model: body.model,
      tokensUsed: 0,
      latencyMs: Date.now() - startTime,
      success: false,
    });

    throw error;
  }
};
```

---

## Production Deployment

### Environment Variables

**Netlify/Vercel:**
```bash
# Set via web UI or CLI
netlify env:set ANTHROPIC_API_KEY sk-ant-...
vercel env add ANTHROPIC_API_KEY
```

**SiteGround (Apache):**
```apache
# .htaccess
SetEnv ANTHROPIC_API_KEY sk-ant-...
SetEnv GEMINI_API_KEY AIza...
SetEnv OPENAI_API_KEY sk-proj-...
```

### Security Checklist

- [ ] API keys stored in environment variables (never in code)
- [ ] `.env` files in `.gitignore`
- [ ] Rate limiting implemented
- [ ] Input validation with schemas
- [ ] Error messages don't expose sensitive data
- [ ] CORS configured if needed
- [ ] HTTPS enforced in production

---

## Testing

### Unit Tests (Vitest)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { POST } from './api/chat/claude';

describe('Claude API endpoint', () => {
  it('returns chat completion', async () => {
    const request = new Request('http://localhost/api/chat/claude', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    });

    const response = await POST({ request, params: {}, url: new URL(request.url) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('content');
  });

  it('validates input', async () => {
    const request = new Request('http://localhost/api/chat/claude', {
      method: 'POST',
      body: JSON.stringify({ invalid: 'data' }),
    });

    const response = await POST({ request, params: {}, url: new URL(request.url) });

    expect(response.status).toBe(400);
  });
});
```

---

## Resources

- **Claude API:** https://docs.claude.com/en/api/getting-started
- **Gemini API:** https://ai.google.dev/gemini-api/docs/quickstart
- **OpenAI API:** https://platform.openai.com/docs/api-reference
- **Astro Endpoints:** https://docs.astro.build/en/guides/endpoints/

---

**Last Updated:** 2025-10-25
**Spanish Academic 2026**
