import { AiImageGeneratorMcpServer } from './server.js';
import * as dotenv from 'dotenv';

dotenv.config();

const server = new AiImageGeneratorMcpServer();
server.start().catch(console.error);
