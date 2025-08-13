# 故障排除指南

## SSL 证书错误

### 问题描述

**1. 命令行 SSL 错误**
当使用 curl 访问时出现：
```
curl: (35) error:0A000438:SSL routines::tlsv1 alert internal error
curl: (35) LibreSSL SSL_connect: SSL_ERROR_SYSCALL
```

**2. 浏览器证书错误**
在 Chrome 浏览器中访问 `https://myip-worker.sheepix.workers.dev` 时显示：
```
Your connection is not private
Attackers might be trying to steal your information from myip-worker.sheepix.workers.dev
net::ERR_CERT_COMMON_NAME_INVALID
```

### 原因分析

**对于自定义域名 `myip.sheepx.fun`：**
1. **DNS 配置问题**：域名当前解析到 `198.21.3.155`（nginx 服务器），而不是 Cloudflare 服务器
2. **域名未添加到 Cloudflare**：域名 `sheepx.fun` 可能未正确添加到 Cloudflare 账户
3. **DNS 记录未配置**：即使域名在 Cloudflare 中，DNS 记录也需要正确配置

**对于 workers.dev 域名：**
1. **代理干扰**：系统配置的 HTTP 代理 (`http_proxy=http://127.0.0.1:7897`) 可能影响 HTTPS 连接
2. **网络环境**：某些网络环境或防火墙可能阻止访问 Cloudflare Workers
3. **证书验证问题**：本地环境的证书验证设置可能存在问题

### 解决步骤

#### A. 针对浏览器证书错误的解决方案

**方法 1：使用本地开发服务器（推荐）**
```bash
# 启动本地开发服务器
npm run dev

# 在浏览器中访问
http://localhost:8787
```

**方法 2：临时绕过证书验证（仅用于测试）**
- 在 Chrome 中点击 "Advanced" → "Proceed to myip-worker.sheepix.workers.dev (unsafe)"
- 或使用无痕模式访问

**方法 3：禁用代理（如果使用了代理）**
```bash
# 临时禁用代理
unset http_proxy
unset https_proxy

# 然后重试访问
curl https://myip-worker.sheepix.workers.dev
```

#### B. 针对自定义域名的解决方案

**1. 确认域名在 Cloudflare 中**
- 登录 Cloudflare Dashboard
- 确认 `sheepx.fun` 域名已添加到你的账户
- 确认域名状态为 "Active"

**2. 配置 DNS 记录**
在 Cloudflare DNS 设置中添加以下记录：

**方法 A：CNAME 记录（推荐）**
```
类型: CNAME
名称: myip
目标: myip-worker.sheepix.workers.dev
代理状态: 已代理（橙色云朵）
```

**方法 B：A 记录**
```
类型: A
名称: myip
目标: 192.0.2.1 (占位符 IP)
代理状态: 已代理（橙色云朵）
```

**3. 等待 DNS 传播**
- DNS 更改可能需要几分钟到几小时才能生效
- 使用 `nslookup myip.sheepx.fun` 检查 DNS 解析

#### C. 验证和测试

**1. 测试本地开发服务器**
```bash
# 确保开发服务器正在运行
npm run dev

# 测试纯文本响应
curl http://localhost:8787

# 测试 JSON 响应
curl -H "Accept: application/json" http://localhost:8787
```

**2. 测试生产环境（如果代理已禁用）**
```bash
# 检查 DNS 解析
nslookup myip.sheepx.fun

# 测试 workers.dev 域名
curl https://myip-worker.sheepix.workers.dev

# 测试自定义域名（DNS 配置完成后）
curl https://myip.sheepx.fun
```

**3. 浏览器测试**
- 本地：`http://localhost:8787`
- 生产：`https://myip-worker.sheepix.workers.dev`（可能需要绕过证书警告）
- 自定义域名：`https://myip.sheepx.fun`（DNS 配置完成后）

### 临时解决方案

**推荐方案：使用本地开发服务器**
```bash
# 启动本地服务器
npm run dev

# 在浏览器中访问
http://localhost:8787

# 或使用 curl 测试
curl http://localhost:8787
curl -H "Accept: application/json" http://localhost:8787
```

**备选方案：绕过证书验证访问生产环境**
```bash
# 禁用代理后测试
unset http_proxy https_proxy
curl https://myip-worker.sheepix.workers.dev

# 或在浏览器中点击 "Advanced" → "Proceed to ... (unsafe)"
```

### 常见问题

**Q: 为什么 Worker 部署成功但域名无法访问？**
A: Cloudflare Worker 的路由配置只有在域名正确添加到 Cloudflare 并配置了正确的 DNS 记录后才会生效。

**Q: 如何确认域名是否正确配置？**
A: 使用 `nslookup` 或 `dig` 命令检查域名是否解析到 Cloudflare 的 IP 地址。

**Q: DNS 更改需要多长时间生效？**
A: 通常几分钟到几小时，取决于 TTL 设置和 DNS 缓存。

### 联系支持
如果问题持续存在，请检查：
1. Cloudflare 账户中的域名状态
2. DNS 记录配置
3. Worker 路由配置
4. SSL/TLS 设置