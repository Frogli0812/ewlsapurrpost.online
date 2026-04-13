# 撸猫社团预约系统 - 部署指南

## 📦 部署准备

### 1. 构建生产版本
```bash
# 构建优化后的生产版本
npm run build

# 验证构建结果
npm run validate
```

### 2. 文件结构检查
构建完成后，`dist/` 目录应包含：
```
dist/
├── index.html          # 主页面（已优化）
├── css/
│   └── main.css       # 压缩后的样式文件
├── js/
│   ├── config.js      # 配置文件
│   ├── api.js         # API服务
│   ├── utils.js       # 工具函数
│   ├── ui.js          # UI管理器
│   └── main.js        # 主应用
├── assets/            # 静态资源（如有）
└── build-info.json    # 构建信息
```

## 🌐 Nginx 部署

### 1. Nginx 配置文件
创建 `/etc/nginx/sites-available/cat-booking` 文件：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # 网站根目录
    root /var/www/cat-booking/dist;
    index index.html;
    
    # 安全头设置
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    
    # 主要路由
    location / {
        try_files $uri $uri/ /index.html;
        
        # 缓存静态资源
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API 代理（如果后端部署在同一服务器）
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/js
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
}

# HTTPS 重定向（推荐）
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL 证书配置
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # 其他配置同上...
}
```

### 2. 启用站点
```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/cat-booking /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载配置
sudo systemctl reload nginx
```

## 🐳 Docker 部署

### 1. 创建 Dockerfile
```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2. 创建 nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # 静态资源缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. Docker Compose 部署
创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - cat-booking-network
  
  backend:
    image: your-backend-image:latest
    environment:
      - NODE_ENV=production
      - DB_HOST=database
      - DB_PORT=5432
      - DB_NAME=cat_booking
      - DB_USER=postgres
      - DB_PASS=password
    ports:
      - "3000:3000"
    depends_on:
      - database
    networks:
      - cat-booking-network
  
  database:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=cat_booking
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - cat-booking-network

volumes:
  postgres_data:

networks:
  cat-booking-network:
    driver: bridge
```

### 4. 部署命令
```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f frontend

# 停止服务
docker-compose down
```

## ☁️ 云服务部署

### 1. Vercel 部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

创建 `vercel.json` 配置：
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-backend-api.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 2. Netlify 部署
创建 `netlify.toml`：
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-api.com/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. 阿里云 OSS + CDN 部署
```bash
# 安装阿里云 CLI
pip install oss2

# 同步文件到 OSS
ossutil cp -r dist/ oss://your-bucket-name/ --update
```

## ⚙️ 环境配置

### 1. 生产环境配置
修改 `src/js/config.js`：
```javascript
const AppConfig = {
    API_BASE_URL: 'https://api.your-domain.com/api', // 生产环境API地址
    // ... 其他配置
};

const DevConfig = {
    USE_MOCK_DATA: false,      // 生产环境使用真实API
    ENABLE_CONSOLE_LOG: false, // 生产环境关闭日志
    MOCK_DELAY: 0
};
```

### 2. 环境变量支持
如果需要支持环境变量，可以创建构建时替换脚本：

```javascript
// scripts/env-replace.js
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../dist/js/config.js');
let configContent = fs.readFileSync(configPath, 'utf8');

// 替换环境变量
configContent = configContent.replace(
    'http://localhost:3000/api',
    process.env.API_BASE_URL || 'http://localhost:3000/api'
);

fs.writeFileSync(configPath, configContent);
console.log('环境变量配置完成');
```

## 🔒 安全考虑

### 1. HTTPS 配置
- 强制使用 HTTPS
- 配置 HSTS 头
- 使用有效的 SSL 证书

### 2. CSP 头设置
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; font-src 'self' https://cdnjs.cloudflare.com; img-src 'self' data:; connect-src 'self' https://api.your-domain.com;";
```

### 3. 防止目录遍历
```nginx
location ~ /\. {
    deny all;
    access_log off;
    log_not_found off;
}
```

## 📊 监控和维护

### 1. 日志监控
```nginx
# 访问日志
access_log /var/log/nginx/cat-booking-access.log;

# 错误日志
error_log /var/log/nginx/cat-booking-error.log;
```

### 2. 性能监控
- 使用 Google Analytics 或百度统计
- 配置 CDN 加速
- 监控页面加载时间

### 3. 自动化部署
创建 GitHub Actions 工作流：

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to server
      run: |
        rsync -avz --delete dist/ user@your-server:/var/www/cat-booking/
```

## 🚀 性能优化

### 1. 资源优化
- 启用 Gzip 压缩
- 配置浏览器缓存
- 使用 CDN 加速静态资源

### 2. 图片优化
- 使用 WebP 格式
- 配置适当的图片尺寸
- 实现懒加载

### 3. 代码分割
虽然当前是 Vanilla JS 项目，但可以考虑：
- 按需加载非关键 JavaScript
- 分离第三方库
- 使用 Service Worker 缓存

## ❗ 常见问题

### 1. API 跨域问题
如果遇到 CORS 错误，请确保：
- 后端正确配置 CORS
- Nginx 正确代理 API 请求
- 检查 API 地址配置

### 2. 静态资源 404
检查：
- 文件路径是否正确
- Nginx 配置是否正确
- 构建是否成功

### 3. 页面刷新 404
确保配置了正确的 fallback 路由：
```nginx
try_files $uri $uri/ /index.html;
```

## 📞 技术支持

如果在部署过程中遇到问题，请：
1. 检查日志文件
2. 验证配置文件
3. 运行项目验证脚本
4. 联系技术支持团队

---

**祝您部署顺利！🎉**
