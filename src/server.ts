import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";

export class NanoBananaMcpServer {
  private server: Server;
  private geminiApiKey: string | undefined;
  private openaiApiKey: string | undefined;

  constructor() {
    this.server = new Server(
      {
        name: "nano-banana-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.geminiApiKey = process.env.GEMINI_API_KEY;
    this.openaiApiKey = process.env.OPENAI_API_KEY;

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "generate_gemini_image",
            description: "Generate a new image from a text description using Google Gemini models.",
            inputSchema: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  description: "Text description of the image to generate",
                },
                model: {
                  type: "string",
                  description: "Optional model name to use (e.g., gemini-2.0-flash-preview-image-generation, imagen-3.0-generate-002)",
                },
                aspectRatio: {
                  type: "string",
                  description: "Aspect ratio (e.g. '1:1', '16:9', '9:16', '4:3', '3:4')",
                }
              },
              required: ["prompt"],
            },
          },
          {
            name: "generate_openai_image",
            description: "Generate a new image from a text description using OpenAI DALL-E models.",
            inputSchema: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  description: "Text description of the image to generate",
                },
                model: {
                  type: "string",
                  description: "Model to use (e.g. dall-e-3 or dall-e-2)",
                },
                size: {
                  type: "string",
                  description: "Image size (e.g. '1024x1024', '1024x1792' for dall-e-3)",
                }
              },
              required: ["prompt"],
            },
          },
          {
            name: "configure_api_keys",
            description: "Set the Google Gemini and/or OpenAI API keys.",
            inputSchema: {
              type: "object",
              properties: {
                geminiApiKey: {
                  type: "string",
                  description: "Google Gemini API key",
                },
                openaiApiKey: {
                  type: "string",
                  description: "OpenAI API key",
                }
              },
            },
          }
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case "configure_api_keys": {
          const schema = z.object({ 
            geminiApiKey: z.string().optional(),
            openaiApiKey: z.string().optional()
          });
          const args = schema.parse(request.params.arguments);
          if (args.geminiApiKey) this.geminiApiKey = args.geminiApiKey;
          if (args.openaiApiKey) this.openaiApiKey = args.openaiApiKey;
          return {
            content: [{ type: "text", text: "API keys configured successfully for this session." }],
          };
        }

        case "generate_gemini_image": {
          if (!this.geminiApiKey) {
            throw new McpError(ErrorCode.InvalidRequest, "Gemini API key not configured. Use configure_api_keys or set GEMINI_API_KEY env var.");
          }

          const schema = z.object({
            prompt: z.string(),
            model: z.string().optional().default("imagen-3.0-generate-002"),
            aspectRatio: z.string().optional().default("1:1")
          });

          const args = schema.parse(request.params.arguments);

          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${args.model}:predict?key=${this.geminiApiKey}`;
            const body = {
              instances: [
                {
                  prompt: args.prompt
                }
              ],
              parameters: {
                sampleCount: 1,
                aspectRatio: args.aspectRatio,
                outputOptions: {
                  mimeType: "image/jpeg"
                }
              }
            };

            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(body)
            });

            if (!response.ok) {
               const errorText = await response.text();
               throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json() as any;
            let base64Image = "";
            if (data.predictions && data.predictions.length > 0) {
                base64Image = data.predictions[0].bytesBase64Encoded;
            } else if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.inlineData?.data) {
                base64Image = data.candidates[0].content.parts[0].inlineData.data;
            } else {
                throw new Error("Could not find image bytes in response");
            }

            const imageBuffer = Buffer.from(base64Image, 'base64');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const dirPath = path.join(os.homedir(), "nano-banana-images");
            await fs.mkdir(dirPath, { recursive: true });
            const filePath = path.join(dirPath, `gemini_gen_${timestamp}.jpg`);
            await fs.writeFile(filePath, imageBuffer);

            return {
              content: [
                {
                  type: "text",
                  text: `Successfully generated Gemini image and saved to: ${filePath}\n\nModel used: ${args.model}\nPrompt: ${args.prompt}`,
                },
              ],
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            throw new McpError(ErrorCode.InternalError, `Failed to generate Gemini image: ${errorMessage}`);
          }
        }

        case "generate_openai_image": {
          if (!this.openaiApiKey) {
            throw new McpError(ErrorCode.InvalidRequest, "OpenAI API key not configured. Use configure_api_keys or set OPENAI_API_KEY env var.");
          }

          const schema = z.object({
            prompt: z.string(),
            model: z.string().optional().default("dall-e-3"),
            size: z.string().optional().default("1024x1024")
          });

          const args = schema.parse(request.params.arguments);

          try {
            const url = `https://api.openai.com/v1/images/generations`;
            const body = {
              model: args.model,
              prompt: args.prompt,
              n: 1,
              size: args.size,
              response_format: "b64_json"
            };

            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.openaiApiKey}`
              },
              body: JSON.stringify(body)
            });

            if (!response.ok) {
               const errorText = await response.text();
               throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json() as any;
            if (!data.data || data.data.length === 0 || !data.data[0].b64_json) {
                throw new Error("Could not find image bytes in OpenAI response");
            }

            const base64Image = data.data[0].b64_json;
            const imageBuffer = Buffer.from(base64Image, 'base64');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const dirPath = path.join(os.homedir(), "nano-banana-images");
            await fs.mkdir(dirPath, { recursive: true });
            const filePath = path.join(dirPath, `openai_gen_${timestamp}.png`);
            await fs.writeFile(filePath, imageBuffer);

            return {
              content: [
                {
                  type: "text",
                  text: `Successfully generated OpenAI image and saved to: ${filePath}\n\nModel used: ${args.model}\nPrompt: ${args.prompt}`,
                },
              ],
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            throw new McpError(ErrorCode.InternalError, `Failed to generate OpenAI image: ${errorMessage}`);
          }
        }

        default:
          throw new McpError(ErrorCode.MethodNotFound, `Tool not found: ${request.params.name}`);
      }
    });
  }

  public async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Nano Banana MCP server running on stdio");
  }
}
