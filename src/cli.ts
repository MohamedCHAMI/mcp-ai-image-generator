#!/usr/bin/env node
import { fetch as undiciFetch, Agent, setGlobalDispatcher } from "undici";
setGlobalDispatcher(new Agent({ maxResponseHeadersSize: 1048576 } as any));
global.fetch = undiciFetch as any;

import { Command } from 'commander';
import { settingsManager } from './config/settings.js';
import { geminiWebClient } from './services/gemini-web.js';
import { spawn } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const program = new Command();

program
  .name('prompt2pic')
  .description('Universal AI Image Generator CLI & MCP Server')
  .version('1.3.0');

program
  .command('mcp')
  .description('Start the MCP server (Stdio)')
  .action(() => {
    // We just run index.js which starts the stdio server
    import('./index.js');
  });

program
  .command('serve')
  .description('Start the Express REST Bridge')
  .option('-p, --port <number>', 'Port to listen on', '3333')
  .action((options) => {
    process.env.PORT = options.port;
    import('./express.js');
  });

program
  .command('generate')
  .description('Generate an image directly from the command line')
  .argument('<prompt>', 'The prompt for the image')
  .action(async (prompt) => {
    await settingsManager.load();
    
    if (settingsManager.getAuthMode() !== 'gemini-web') {
      console.error('CLI direct generation currently only supports gemini-web auth mode.');
      console.error('Run: prompt2pic config --auth-mode gemini-web');
      process.exit(1);
    }
    
    if (!settingsManager.isReady()) {
      console.error(settingsManager.getStatusMessage());
      process.exit(1);
    }
    
    geminiWebClient.configure(settingsManager.getConfig()!.cookies!);
    console.log(`🎨 Generating image for: "${prompt}"...`);
    
    try {
      const result = await geminiWebClient.generateImage(prompt);
      if (result.savedPath) {
        console.log(`✅ Success! Image saved to: ${result.savedPath}`);
      } else {
        console.log('⚠️ Generated, but no image was saved.');
        console.log(result.contents);
      }
      process.exit(0);
    } catch (error) {
      console.error('❌ Error generating image:');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('config')
  .description('Show or update configuration')
  .action(async () => {
    await settingsManager.load();
    console.log(settingsManager.getStatusMessage());
    console.log('');
    console.log('To change settings, you can edit: ~/.nano-banana/config.json');
    console.log('Or use the MCP tools in your chat client.');
  });

program.parse(process.argv);
