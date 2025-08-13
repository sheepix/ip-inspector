// IP 路由 - 只返回客户端 IP 地址，无其他信息
export async function handleIP(request) {
  // 获取客户端 IP 地址
  const clientIP = request.headers.get('CF-Connecting-IP') || 
                   request.headers.get('X-Forwarded-For') || 
                   request.headers.get('X-Real-IP') || 
                   'Unknown';

  // 处理 X-Forwarded-For 可能包含多个 IP 的情况
  const finalIP = clientIP.includes(',') ? clientIP.split(',')[0].trim() : clientIP;

  return new Response(finalIP, {
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}