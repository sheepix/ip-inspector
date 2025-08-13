// 路由管理器 - 统一管理所有路由
import { handleDefault } from './default.js';
import { handleVerbose } from './verbose.js';
import { handleIP } from './ip.js';
import { handleReadme } from './readme.js';

// 路由映射
const routes = {
  '/': handleDefault,
  '/ip': handleIP,
  '/verbose': handleVerbose,
  '/readme': handleReadme
};

// 路由处理函数
export async function handleRoute(request, env, ctx) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // 查找对应的路由处理函数
  const handler = routes[pathname];
  
  if (handler) {
    return await handler(request, env, ctx);
  }
  
  // 如果没有找到对应的路由，返回 404
  return new Response('Not Found', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

// 导出所有可用的路由路径
export const availableRoutes = Object.keys(routes);