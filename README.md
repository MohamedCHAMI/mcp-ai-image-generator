# Nano Banana MCP

An MCP server for AI image generation powered by **Google Gemini** (e.g., `imagen-3.0-generate-002`) and **OpenAI** (e.g., `dall-e-3`). This allows you to generate images directly from your MCP-supported client (e.g., Claude Desktop).

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the project:
   ```bash
   npm run build
   ```

## Configuration

Set the `GEMINI_API_KEY` and/or `OPENAI_API_KEY` environment variables in your MCP client configuration file:

```json
{
  "mcpServers": {
    "nano-banana": {
      "command": "node",
      "args": ["/absolute/path/to/nano-banana-mcp/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your-gemini-api-key",
        "OPENAI_API_KEY": "your-openai-api-key"
      }
    }
  }
}
```

Or configure the API keys at runtime using the `configure_api_keys` tool.

## Tools Available

- `generate_gemini_image`: Generates an image using Google Gemini based on a text prompt and saves it locally.
- `generate_openai_image`: Generates an image using OpenAI (DALL-E) based on a text prompt and saves it locally.
- `configure_api_keys`: Sets the Gemini and/or OpenAI API keys during runtime.

Generated images are saved in `~/nano-banana-images/`.

## Publishing to GitHub

To push this to your GitHub:
1. Create a repository on GitHub.
2. Initialize and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
