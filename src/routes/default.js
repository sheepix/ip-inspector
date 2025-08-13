// 默认路由 - 返回 IP 和地理位置信息
export async function handleDefault(request) {
  // 获取客户端 IP 地址
  const clientIP = request.headers.get('CF-Connecting-IP') || 
                   request.headers.get('X-Forwarded-For') || 
                   request.headers.get('X-Real-IP') || 
                   'Unknown';

  // 获取其他有用的信息
  const userAgent = request.headers.get('User-Agent') || 'Unknown';
  
  // 使用 Cloudflare 提供的详细地理位置信息
  const geoData = {
    country: request.cf?.country || 'Unknown',
    countryCode: request.cf?.countryCode || 'Unknown',
    region: request.cf?.region || 'Unknown',
    regionCode: request.cf?.regionCode || 'Unknown',
    city: request.cf?.city || 'Unknown',
    continent: request.cf?.continent || 'Unknown',
    latitude: request.cf?.latitude || 'Unknown',
    longitude: request.cf?.longitude || 'Unknown',
    postalCode: request.cf?.postalCode || 'Unknown',
    metroCode: request.cf?.metroCode || 'Unknown',
    timezone: request.cf?.timezone || 'Unknown',
    colo: request.cf?.colo || 'Unknown', // Cloudflare 数据中心
    asn: request.cf?.asn || 'Unknown', // 自治系统号（运营商信息）
    asOrganization: request.cf?.asOrganization || 'Unknown' // 运营商名称
  };

  // 检查请求的 Accept 头，决定返回格式
  const acceptHeader = request.headers.get('Accept') || '';
  const url = new URL(request.url);
  const format = url.searchParams.get('format');
  
  // 如果明确要求文本格式，或者 Accept 头明确要求文本且不要求 JSON
  if (format === 'text' || (acceptHeader.includes('text/plain') && !acceptHeader.includes('application/json') && !acceptHeader.includes('text/html'))) {
    // 返回纯文本格式
    return new Response(clientIP, {
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } else {
    // 默认返回 JSON 格式（包括浏览器访问）
    const response = {
      ip: clientIP,
      // Cloudflare 提供的详细地理位置信息
      location: {
        country: geoData.country,
        countryCode: geoData.countryCode,
        region: geoData.region,
        regionCode: geoData.regionCode,
        city: geoData.city,
        continent: geoData.continent,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        postalCode: geoData.postalCode,
        metroCode: geoData.metroCode,
        timezone: geoData.timezone
      },
      // 网络和运营商信息
      network: {
        asn: geoData.asn,
        asOrganization: geoData.asOrganization,
        colo: geoData.colo
      },
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
  }
}