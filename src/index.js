export default {
  async fetch(request, env, ctx) {
    // 获取客户端 IP 地址
    const clientIP = request.headers.get('CF-Connecting-IP') || 
                     request.headers.get('X-Forwarded-For') || 
                     request.headers.get('X-Real-IP') || 
                     'Unknown';

    // 获取其他有用的信息
    const userAgent = request.headers.get('User-Agent') || 'Unknown';
    const country = request.cf?.country || 'Unknown';
    const city = request.cf?.city || 'Unknown';
    const timezone = request.cf?.timezone || 'Unknown';

    // 检查请求的 Accept 头，决定返回格式
    const acceptHeader = request.headers.get('Accept') || '';
    
    if (acceptHeader.includes('application/json')) {
      // 返回 JSON 格式
      const response = {
        ip: clientIP,
        country: country,
        city: city,
        timezone: timezone,
        userAgent: userAgent,
        timestamp: new Date().toISOString()
      };
      
      return new Response(JSON.stringify(response, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    } else {
      // 返回纯文本格式
      return new Response(clientIP, {
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }
  }
};