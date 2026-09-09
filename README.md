# 🚀 MCP AI Image & Video Studio (DALL-E 3, Gemini, Veo)

[![Stars](https://img.shields.io/github/stars/MohamedCHAMI/mcp-ai-image-generator?style=social)](https://github.com/MohamedCHAMI/mcp-ai-image-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**The Ultimate MCP Server for AI Media Generation**  
Seamlessly integrate the world's most powerful AI generators directly into your Model Context Protocol (MCP) clients (like Claude Desktop, Codex, etc.). 

Generate breathtaking images using **OpenAI's DALL-E 3** or **Google's Gemini (Imagen 3)**. Edit your images on the fly, or even create stunning videos with **Google's Veo** models—all right from your chat interface!

---

## ✨ Features

- 🎨 **Multi-Model Image Support**: Access both OpenAI (`dall-e-3`) and Google Gemini (`imagen-3.0-generate-002`, `gemini-3.1-flash-image-preview`).
- 🎬 **Veo Video Generation**: Generate text-to-video or image-to-video using Google's latest `veo-3.1-generate-preview` model.
- 🆓 **Free Personal Account Mode**: Use your free, personal Google account (via `gemini.google.com`) for unlimited image generation and editing using browser cookies—no API key or credit card needed!
- 💾 **Auto-Save & History**: All generated masterpieces are automatically saved locally with full history tracking.
- 🛠️ **Dynamic Configuration**: Configure API keys, models, or cookies on the fly directly from the chat.

---

## 🚀 Quick Start

### 1. Install

```bash
git clone https://github.com/MohamedCHAMI/mcp-ai-image-generator.git
cd mcp-ai-image-generator
npm install
npm run build
```

### 2. Configure your MCP Client

Add this to your MCP client configuration (e.g., `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "mcp-ai-image-generator": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-ai-image-generator/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your-gemini-key",
        "OPENAI_API_KEY": "your-openai-key"
      }
    }
  }
}
```

*(You can also skip the `env` section and set your API keys or cookies dynamically inside the chat using the configuration tools!)*

---

## 🔐 Authentication Modes

### Option A: Official Developer APIs (Full Features)
Set your `OPENAI_API_KEY` and `GEMINI_API_KEY`. This unlocks everything including OpenAI generation and Gemini Video (Veo) generation.

### Option B: Free Personal Google Account (Images & Edits only)
Don't have a Gemini API key? Use your regular consumer account!
1. Go to [gemini.google.com](https://gemini.google.com/) and log in.
2. Open your browser Developer Tools (F12) -> **Application** -> **Cookies**.
3. Copy the value of the `__Secure-1PSID` cookie.
4. Tell your AI assistant: *"Run configure_google_login with secure1psid [YOUR_COOKIE]"*

*(Note: Video generation is not supported in the free personal mode).*

---

## 🛠️ Available Tools

### 🖼️ OpenAI Images
- **`generate_openai_image`**: Generate an image using DALL-E models. Parameters: `prompt`, `model`, `size`.
- **`configure_openai_api_key`**: Dynamically set your OpenAI API key.

### 🖼️ Gemini Images (API or Free Mode)
- **`generate_image`**: Generate a new image using Gemini AI.
- **`edit_image`**: Edit an existing image based on text instructions and a local file path.
- **`continue_editing`**: Automatically continue editing the last generated or edited image.

### 🎬 Gemini Video (Veo) (API only)
- **`generate_video`**: Generate a video from a text prompt. Supports text-to-video, image-to-video, and frame interpolation.

### ⚙️ Utilities & Configuration
- **`configure_api_key`**: Dynamically set your Gemini API key.
- **`configure_google_login`**: Set your `__Secure-1PSID` cookie for free personal account access.
- **`configure_model`**: Set the default Gemini model and quality (`high` or `fast`).
- **`get_status`**: Check current configuration, auth mode, and recent generations.
- **`list_history`**: View recently generated/edited images.
- **`list_video_history`**: View recently generated videos.

---

## 📁 Storage

- Images are saved to your home directory: `~/nano-banana-images/`
- Videos are saved to: `~/nano-banana-videos/`

## ❤️ Contributing

Contributions, issues, and feature requests are welcome! If you like this project, please consider giving it a ⭐!
