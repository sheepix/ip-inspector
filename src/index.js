import { handleRoute } from './routes/index.js';

export default {
  async fetch(request, env, ctx) {
    return await handleRoute(request, env, ctx);
  }
};