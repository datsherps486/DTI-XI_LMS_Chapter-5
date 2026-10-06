import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI on server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API endpoint for multi-turn Gemini Chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemInstruction, model } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Model selection based on user requirements:
    // 'gemini-3.1-pro-preview' for complex tasks,
    // 'gemini-3.5-flash' for general tasks,
    // 'gemini-3.1-flash-lite' for fast tasks.
    let selectedModel = model || 'gemini-3.5-flash';
    const allowedModels = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.1-pro-preview'];
    if (!allowedModels.includes(selectedModel)) {
      selectedModel = 'gemini-3.5-flash';
    }

    // Format conversation history for @google/genai
    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: formattedContents,
      config: {
        systemInstruction:
          systemInstruction ||
          'You are an expert interactive tutor specializing in Data Structures and Algorithms, specifically Chapter 5 of the Class XI curriculum (Linked Lists, Stacks, Queues, Traversal, Insertion, Deletion, Search, and Sorting). Explain concepts clearly with diagrams, analogies (like playlists, pile of books, ticket counters), and step-by-step reasoning.',
      },
    });

    const reply = response.text || 'I could not generate a response. Please try again.';
    res.json({ reply, model: selectedModel });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: error?.message || 'Failed to communicate with Gemini API',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Mount Vite middlewares in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LinkedList Lab server running at http://localhost:${PORT}`);
  });
}

startServer();
