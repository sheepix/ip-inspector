# MyIP Worker

一个简单的 Cloudflare Worker，用于返回用户的外网 IP 地址。

## 功能特性

- 返回客户端的真实外网 IP 地址
- 支持 JSON 和纯文本两种响应格式
- 包含地理位置信息（国家、城市、时区）
- 支持 CORS 跨域请求

## 安装和部署

### 1. 安装依赖

```bash
npm install
```

### 2. 登录 Cloudflare

```bash
npx wrangler login
```

### 3. 本地开发

```bash
npm run dev
```

### 4. 部署到 Cloudflare

```bash
npm run deploy
```

## 使用方法

### 获取纯文本格式的 IP

```bash
# 使用 workers.dev 域名
curl https://your-worker-name.your-subdomain.workers.dev

# 使用自定义域名
curl https://myip.example.com
```

### 获取 JSON 格式的详细信息

```bash
# 使用 workers.dev 域名
curl -H "Accept: application/json" https://your-worker-name.your-subdomain.workers.dev

# 使用自定义域名
curl -H "Accept: application/json" https://myip.example.com
```

响应示例：

```json
{
  "ip": "203.0.113.1",
  "country": "US",
  "city": "San Francisco",
  "timezone": "America/Los_Angeles",
  "userAgent": "curl/7.68.0",
  "timestamp": "2023-12-01T12:00:00.000Z"
}
```

## 项目结构

```
myip/
├── src/
│   └── index.js          # Worker 主要代码
├── wrangler.toml         # Wrangler 配置文件
├── package.json          # 项目配置和依赖
└── README.md            # 项目说明
```

## 配置说明

- `wrangler.toml`: Cloudflare Worker 的配置文件，包含自定义域名绑定
- `src/index.js`: Worker 的主要逻辑代码
- Worker 会自动检测请求头中的 `Accept` 字段来决定返回格式

### 自定义域名配置

项目支持自定义域名配置，配置位于 `wrangler.toml`：

```toml
# 自定义域名绑定
[[routes]]
pattern = "myip.example.com/*"
zone_name = "example.com"

# 生产环境自定义域名绑定
[[env.production.routes]]
pattern = "myip.example.com/*"
zone_name = "example.com"
```

**域名配置要求：**
1. 域名 `example.com` 必须已添加到 Cloudflare 账户
2. DNS 记录需要正确配置
3. 部署后自定义域名会自动生效

## 故障排除

如果遇到自定义域名访问问题（如 SSL 错误），请查看 [故障排除指南](TROUBLESHOOTING.md)。

### 常见问题

1. **SSL 错误**：确保域名已正确添加到 Cloudflare 并配置了正确的 DNS 记录
2. **404 错误**：检查 DNS 解析是否指向 Cloudflare 服务器
3. **连接超时**：等待 DNS 传播完成（可能需要几分钟到几小时）

### DNS 配置检查

```bash
# 检查域名解析
nslookup myip.example.com

# 测试本地开发服务器
curl http://localhost:8787

# 测试生产环境
curl https://your-worker-name.your-subdomain.workers.dev
```

## 注意事项

- 确保已经有 Cloudflare 账户
- 部署前需要先登录 `wrangler login`
- Worker 域名格式为：`worker-name.your-subdomain.workers.dev`
- 自定义域名需要在 Cloudflare 中正确配置 DNS 记录
- 如果自定义域名无法访问，请使用 workers.dev 域名作为备选方案