import { fetch as undiciFetch, Agent, setGlobalDispatcher } from "undici";
setGlobalDispatcher(new Agent({ maxResponseHeadersSize: 1048576 } as any));
global.fetch = undiciFetch as any;

import { NanoBananaServer } from './server.js';
new NanoBananaServer().start().catch(console.error);
