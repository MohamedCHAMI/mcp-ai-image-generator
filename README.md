# 🚀 MCP AI Image & Video Studio (Free Personal Gemini & DALL-E 3)

[![Stars](https://img.shields.io/github/stars/MohamedCHAMI/mcp-ai-image-generator?style=social)](https://github.com/MohamedCHAMI/mcp-ai-image-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**The Ultimate MCP Server for AI Media Generation - No Gemini API Key Required!**  
Seamlessly integrate the world's most powerful AI generators directly into your Model Context Protocol (MCP) clients (like Claude Desktop, Codex, etc.). 

Generate breathtaking images using **Google's Gemini (Imagen 3)** using your **free, personal Google account**! You don't need to pay for or configure a Google Cloud API key—this MCP server uses your browser session to generate images for free. You can also generate images using **OpenAI's DALL-E 3** right from your chat interface!

---

## ✨ Features

- 🆓 **Free Personal Account Mode**: Generate and edit images using your free, personal Google account (via `gemini.google.com`). No API key, credit card, or Google Cloud setup needed!
- 🎨 **Multi-Model Image Support**: Access Google Gemini for free, plus optional support for OpenAI's `dall-e-3`.
- 💾 **Auto-Save & History**: All generated masterpieces are automatically saved locally with full history tracking.
- 🛠️ **Dynamic Configuration**: Configure your cookies or API keys on the fly directly from the chat.

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

Add this to your MCP client configuration (e.g., `claude_desktop_config.json`). Notice there are **no API keys** required for Gemini!

```json
{
  "mcpServers": {
    "mcp-ai-image-generator": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-ai-image-generator/dist/index.js"]
    }
  }
}
```

---

## 🔐 How to Connect Your Free Personal Google Account

Because official Gemini APIs can be used with generic MCPs, the magic of this project is that it uses your **personal email and browser session**. Here is how to connect it in 3 easy steps:

1. Go to [gemini.google.com](https://gemini.google.com/) in your regular web browser (Chrome, Safari, etc.) and log in to your personal account.
2. Open your browser's Developer Tools (Press `F12` or `Cmd+Option+I`) -> **Application** tab -> **Cookies** section -> click on `https://gemini.google.com`.
3. Find the cookie named **`__Secure-1PSID`** and copy its value.
4. Inside your MCP client (like Claude), just tell the AI: 
   > *"Run the `configure_google_login` tool and use `YOUR_COOKIE_VALUE` as the secure1psid."*

That's it! You can now generate images for free.

*(Note: If you also want to use OpenAI DALL-E 3, you can dynamically provide your API key by asking the AI to run the `configure_openai_api_key` tool).*

---

## 🛠️ Available Tools

### 🖼️ Free Gemini Images (Personal Account Mode)
- **`generate_image`**: Generate a new image using Gemini AI (Imagen 3).
- **`edit_image`**: Edit an existing image based on text instructions and a local file path.
- **`continue_editing`**: Automatically continue editing the last generated or edited image.
- **`configure_google_login`**: Set your `__Secure-1PSID` cookie for free personal account access.

### 🖼️ OpenAI Images (Requires API Key)
- **`generate_openai_image`**: Generate an image using DALL-E models. Parameters: `prompt`, `model`, `size`.
- **`configure_openai_api_key`**: Dynamically set your OpenAI API key.

### ⚙️ Utilities & Configuration
- **`get_status`**: Check current configuration, auth mode, and recent generations.
- **`list_history`**: View recently generated/edited images.

---

## 📁 Storage

- Images are automatically saved to your home directory: `~/nano-banana-images/`

## ❤️ Contributing

Contributions, issues, and feature requests are welcome! If you like this project, please consider giving it a ⭐!
