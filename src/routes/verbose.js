// Verbose 路由 - 返回不同来源 IP 的详细信息
export async function handleVerbose(request) {
  // 获取不同来源的 IP 地址
  const cfConnectingIP = request.headers.get("CF-Connecting-IP");
  const xForwardedFor = request.headers.get("X-Forwarded-For");
  const xRealIP = request.headers.get("X-Real-IP");

  // 处理 X-Forwarded-For 可能包含多个 IP 的情况
  const xForwardedForFirst = xForwardedFor
    ? xForwardedFor.split(",")[0].trim()
    : null;

  // 获取最终检测到的 IP（按优先级）
  const clientIP = cfConnectingIP || xForwardedForFirst || xRealIP || "Unknown";

  // 为每个 IP 创建地理位置信息的函数
  const createGeoInfo = (ip) => {
    if (!ip || ip === "Unknown") {
      return {
        ip: ip || "未获取到",
        status: "无效",
        location: null,
        network: null,
      };
    }

    // 注意：在本地开发环境中，request.cf 对象可能不包含真实的地理位置信息
    // 这里我们使用当前请求的 cf 对象作为示例，实际部署后会根据真实 IP 获取对应信息
    return {
      ip: ip,
      status: "有效",
      location: {
        country: request.cf?.country || "Unknown",
        countryCode: request.cf?.countryCode || "Unknown",
        region: request.cf?.region || "Unknown",
        regionCode: request.cf?.regionCode || "Unknown",
        city: request.cf?.city || "Unknown",
        continent: request.cf?.continent || "Unknown",
        latitude: request.cf?.latitude || "Unknown",
        longitude: request.cf?.longitude || "Unknown",
        postalCode: request.cf?.postalCode || "Unknown",
        metroCode: request.cf?.metroCode || "Unknown",
        timezone: request.cf?.timezone || "Unknown",
      },
      network: {
        asn: request.cf?.asn || "Unknown",
        asOrganization: request.cf?.asOrganization || "Unknown",
        colo: request.cf?.colo || "Unknown",
      },
    };
  };

  const verboseResponse = {
    timestamp: new Date().toISOString(),
    detectionPriority: "CF-Connecting-IP > X-Forwarded-For > X-Real-IP",
    finalDetectedIP: clientIP,
    ipSources: {
      "CF-Connecting-IP": createGeoInfo(cfConnectingIP),
      "X-Forwarded-For": createGeoInfo(xForwardedForFirst),
      "X-Real-IP": createGeoInfo(xRealIP),
    },
  };

  return new Response(JSON.stringify(verboseResponse, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
