# 🚀 MCP AI Image Generator (DALL-E 3 & Gemini)

[![Stars](https://img.shields.io/github/stars/YOUR_GITHUB_USERNAME/mcp-ai-image-generator?style=social)](https://github.com/YOUR_GITHUB_USERNAME/mcp-ai-image-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**The Ultimate MCP Server for AI Image Generation**  
Seamlessly integrate the world's most powerful AI image generators directly into your Model Context Protocol (MCP) clients (like Claude Desktop). Generate breathtaking images using **OpenAI's DALL-E 3** or **Google's Gemini (Imagen 3)** models right from your chat interface.

---

## ✨ Features

- 🎨 **Multi-Model Support**: Access both OpenAI (`dall-e-3`, `dall-e-2`) and Google Gemini (`imagen-3.0-generate-002`, `gemini-2.0-flash-preview-image-generation`).
- ⚡ **Instant Setup**: Run and integrate in less than 2 minutes.
- 💾 **Auto-Save**: All generated masterpieces are automatically saved to your `~/ai-generated-images/` directory.
- 🛠️ **Dynamic Configuration**: Configure API keys on the fly directly from the chat.

---

## 🚀 Quick Start

1. **Clone & Install:**
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/mcp-ai-image-generator.git
   cd mcp-ai-image-generator
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Configure your MCP Client:**
   Add this to your MCP configuration file (e.g., `claude_desktop_config.json`):

   ```json
   {
     "mcpServers": {
       "ai-image-generator": {
         "command": "node",
         "args": ["/absolute/path/to/mcp-ai-image-generator/dist/index.js"],
         "env": {
           "GEMINI_API_KEY": "your-gemini-api-key",
           "OPENAI_API_KEY": "your-openai-api-key"
         }
       }
     }
   }
   ```

*(Alternatively, you can skip the environment variables and use the `configure_api_keys` tool at runtime!)*

---

## 🛠️ Available Tools

### 1. `generate_openai_image`
Generates an image using OpenAI DALL-E models.
- **Parameters**: `prompt` (required), `model` (e.g., `dall-e-3`), `size` (e.g., `1024x1024`)

### 2. `generate_gemini_image`
Generates an image using Google Gemini (Imagen) models.
- **Parameters**: `prompt` (required), `model` (e.g., `imagen-3.0-generate-002`), `aspectRatio` (e.g., `16:9`)

### 3. `configure_api_keys`
Dynamically set or update your API keys without restarting the server.
- **Parameters**: `geminiApiKey`, `openaiApiKey`

---

## ❤️ Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/YOUR_GITHUB_USERNAME/mcp-ai-image-generator/issues). If you like this project, please consider giving it a ⭐!
