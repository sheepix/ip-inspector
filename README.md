# MyIP Worker

一个简单的 Cloudflare Worker，用于返回用户的外网 IP 地址。

## 功能特性

- 返回客户端的真实外网 IP 地址
- 支持 JSON 和纯文本两种响应格式
- 包含地理位置信息（国家、城市、时区）
- 支持 CORS 跨域请求
- 提供多种 API 接口满足不同需求
- 模块化路由设计，易于扩展

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
# 部署到开发环境（默认）
npm run deploy
# 或者
npm run deploy:dev

# 部署到生产环境
npm run deploy:prod
```

## API 接口说明

### 1. 默认接口 `/`

获取完整的 IP 地址和地理位置信息。

```bash
# 获取 JSON 格式的详细信息（默认）
curl https://your-worker-name.your-subdomain.workers.dev

# 获取纯文本格式的 IP 地址
curl https://your-worker-name.your-subdomain.workers.dev?format=text

# 使用 Accept 头获取纯文本
curl -H "Accept: text/plain" https://your-worker-name.your-subdomain.workers.dev
```

**JSON 响应示例：**

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

### 2. 简洁 IP 接口 `/ip`

仅返回客户端 IP 地址，无其他信息。

```bash
# 获取纯文本格式的 IP 地址
curl https://your-worker-name.your-subdomain.workers.dev/ip
```

**响应示例：**
```
203.0.113.1
```

### 3. 详细信息接口 `/verbose`

获取不同来源 IP 的详细地理位置信息对比。

```bash
# 获取详细的多源 IP 信息
curl https://your-worker-name.your-subdomain.workers.dev/verbose
```

**响应示例：**

```json
{
  "CF-Connecting-IP": {
    "ip": "203.0.113.1",
    "country": "US",
    "city": "San Francisco",
    "timezone": "America/Los_Angeles"
  },
  "X-Forwarded-For": {
    "ip": "203.0.113.1",
    "country": "US",
    "city": "San Francisco",
    "timezone": "America/Los_Angeles"
  },
  "X-Real-IP": {
    "ip": "Unknown",
    "country": "Unknown",
    "city": "Unknown",
    "timezone": "Unknown"
  }
}
```

### 4. API 文档接口 `/readme`

获取完整的 API 使用文档。

```bash
# 获取 API 文档
curl https://your-worker-name.your-subdomain.workers.dev/readme
```

## 项目结构

```
myip/
├── src/
│   ├── index.js          # Worker 入口文件
│   └── routes/           # 路由模块目录
│       ├── index.js      # 路由管理器
│       ├── default.js    # 默认路由处理器
│       ├── ip.js         # 简洁 IP 路由处理器
│       ├── verbose.js    # 详细信息路由处理器
│       └── readme.js     # API 文档路由处理器
├── wrangler.jsonc        # Wrangler 配置文件
├── package.json          # 项目配置和依赖
├── README.md            # 项目说明
└── TROUBLESHOOTING.md   # 故障排除指南
```

## 配置说明

- `wrangler.jsonc`: Cloudflare Worker 的配置文件，包含自定义域名绑定和环境配置
- `src/index.js`: Worker 的入口文件，负责路由分发
- `src/routes/`: 模块化路由处理器目录
  - `index.js`: 路由管理器，统一管理所有路由映射
  - `default.js`: 默认路由，支持 JSON 和纯文本格式
  - `ip.js`: 简洁 IP 路由，仅返回 IP 地址
  - `verbose.js`: 详细信息路由，对比多种 IP 来源
  - `readme.js`: API 文档路由，提供使用说明
- Worker 会根据 URL 路径和请求头自动选择合适的响应格式

### 环境配置说明

项目支持多环境部署：

- **开发环境**：使用顶级配置，通过 `npm run deploy` 或 `npm run deploy:dev` 部署
- **生产环境**：使用 `env.production` 配置，通过 `npm run deploy:prod` 部署

两个环境都配置了相同的自定义域名 `myip.sheepx.fun`，你可以根据需要修改配置文件中的域名设置。

### 自定义域名配置

项目支持自定义域名配置，配置位于 `wrangler.jsonc`：

```jsonc
{
  // 自定义域名绑定 (Wrangler v3 语法)
  "routes": [
    {
      "pattern": "myip.example.com",
      "custom_domain": true
    }
  ],
  
  "env": {
    "production": {
      // 生产环境自定义域名绑定
      "routes": [
        {
          "pattern": "myip.example.com",
          "custom_domain": true
        }
      ]
    }
  }
}

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
curl http://localhost:8787          # 默认接口
curl http://localhost:8787/ip       # 简洁 IP 接口
curl http://localhost:8787/verbose  # 详细信息接口
curl http://localhost:8787/readme   # API 文档接口

# 测试生产环境
curl https://your-worker-name.your-subdomain.workers.dev
curl https://your-worker-name.your-subdomain.workers.dev/ip
curl https://your-worker-name.your-subdomain.workers.dev/verbose
curl https://your-worker-name.your-subdomain.workers.dev/readme
```

## 注意事项

- 确保已经有 Cloudflare 账户
- 部署前需要先登录 `wrangler login`
- Worker 域名格式为：`worker-name.your-subdomain.workers.dev`
- 自定义域名需要在 Cloudflare 中正确配置 DNS 记录
- 如果自定义域名无法访问，请使用 workers.dev 域名作为备选方案