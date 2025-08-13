// README 路由 - 说明所有路由和用法
export async function handleReadme(request) {
  const readmeContent = {
    title: "IP 查询服务 API 文档",
    description: "一个基于 Cloudflare Workers 的 IP 地址和地理位置查询服务",
    routes: {
      "/": {
        description: "获取完整的 IP 地址和地理位置信息",
        method: "GET",
        parameters: {
          "format": "可选参数，值为 'text' 时返回纯文本格式的 IP 地址"
        },
        examples: [
          "GET / - 返回 JSON 格式的完整信息",
          "GET /?format=text - 返回纯文本格式的 IP 地址"
        ]
      },
      "/ip": {
        description: "仅返回客户端 IP 地址，无其他信息",
        method: "GET",
        parameters: "无",
        examples: [
          "GET /ip - 返回纯文本格式的 IP 地址"
        ]
      },
      "/verbose": {
        description: "获取不同来源 IP 的详细地理位置信息",
        method: "GET",
        parameters: "无",
        examples: [
          "GET /verbose - 返回 CF-Connecting-IP、X-Forwarded-For、X-Real-IP 的详细信息"
        ]
      },
      "/readme": {
        description: "显示此 API 文档",
        method: "GET",
        parameters: "无",
        examples: [
          "GET /readme - 返回 API 使用说明"
        ]
      }
    },
    headers: {
      "CF-Connecting-IP": "Cloudflare 提供的真实客户端 IP（最可靠）",
      "X-Forwarded-For": "代理服务器转发的原始客户端 IP（可能包含多个 IP）",
      "X-Real-IP": "反向代理设置的真实客户端 IP"
    },
    notes: [
      "在本地开发环境中，地理位置信息可能显示为 'Unknown'",
      "准确的地理位置数据只有在部署到 Cloudflare Workers 后才能获取",
      "所有接口都支持 CORS，可以在浏览器中直接调用"
    ]
  };

  return new Response(JSON.stringify(readmeContent, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}