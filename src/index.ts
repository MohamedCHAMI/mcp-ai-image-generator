import { NanoBananaMcpServer } from './server.js';
import * as dotenv from 'dotenv';

dotenv.config();

const server = new NanoBananaMcpServer();
server.start().catch(console.error);
