import { fetch as undiciFetch, Agent, setGlobalDispatcher } from "undici";
setGlobalDispatcher(new Agent({ maxResponseHeadersSize: 1048576 } as any));
global.fetch = undiciFetch as any;

import express from 'express';
import { settingsManager } from './config/index.js';
import { geminiWebClient } from './services/gemini-web.js';
import { geminiService } from './services/gemini.js';
import {
  handleGenerateOpenAIImage,
  handleConfigureStorage,
  handleGenerateImage,
  handleEditImage,
  handleGenerateVideo,
  handleGetStatus,
  handleConfigureGoogleLogin,
  handleConfigureApiKey,
  handleConfigureOpenAIApiKey
} from './tools/index.js';

const app = express();
app.use(express.json());

// Initialize settings
await settingsManager.load();
const config = settingsManager.getConfig();
if (config && settingsManager.isReady()) {
  if (config.authMode === 'gemini-web' && config.cookies) {
    geminiWebClient.configure(config.cookies);
  } else if (config.geminiApiKey) {
    geminiService.configure(config.geminiApiKey);
  }
}

app.post('/generate_openai_image', async (req, res) => {
  try {
    const result = await handleGenerateOpenAIImage(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/generate_gemini_image', async (req, res) => {
  try {
    const result = await handleGenerateImage(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/edit_image', async (req, res) => {
  try {
    const result = await handleEditImage(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/generate_video', async (req, res) => {
  try {
    const result = await handleGenerateVideo(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/configure_storage', async (req, res) => {
  const result = await handleConfigureStorage(req.body);
  res.json(result);
});
app.get('/status', async (req, res) => {
  try {
    const result = await handleGetStatus();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/configure_google_login', async (req, res) => {
  try {
    const result = await handleConfigureGoogleLogin(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/configure_openai_key', async (req, res) => {
  try {
    const result = await handleConfigureOpenAIApiKey(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 ChatGPT REST Bridge is running on http://localhost:${PORT}`);
  console.log(`To expose to the internet, run: ngrok http ${PORT}`);
});
