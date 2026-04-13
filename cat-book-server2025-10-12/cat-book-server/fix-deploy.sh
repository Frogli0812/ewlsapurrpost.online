#!/bin/bash

# 🔧 修复ECS部署问题的脚本

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 修复ECS部署问题...${NC}"
echo ""

# 1. 重新构建不压缩版本
echo -e "${YELLOW}1. 重新构建生产版本（不压缩）...${NC}"
if [ -d "dist" ]; then
    rm -rf dist
fi

node -e "
const fs = require('fs');
const path = require('path');

console.log('🚀 开始构建修复版本...');

// 1. 创建目录结构
fs.mkdirSync('dist/js', { recursive: true });
fs.mkdirSync('dist/css', { recursive: true });

// 2. 生成正确的生产配置
const prodConfig = \`/**
 * 生产环境配置 - 修复版本
 */
const AppConfig = {
    // 请修改为您的实际API地址
    API_BASE_URL: 'https://your-domain.com/api',
    
    BUSINESS_HOURS: {
        START_HOUR: 10,
        END_HOUR: 18,
        CLOSED_DAYS: [1],
        TIME_SLOT_DURATION: 30,
        MAX_VISITORS_PER_SLOT: 5
    },
    
    TIME_SLOTS: [
        { hour: 10, minute: 0 },
        { hour: 10, minute: 30 },
        { hour: 11, minute: 0 },
        { hour: 11, minute: 30 },
        { hour: 12, minute: 0 },
        { hour: 12, minute: 30 },
        { hour: 14, minute: 0 },
        { hour: 14, minute: 30 },
        { hour: 15, minute: 0 },
        { hour: 15, minute: 30 },
        { hour: 16, minute: 0 },
        { hour: 16, minute: 30 },
        { hour: 17, minute: 0 }
    ],
    
    STORAGE_KEYS: {
        BOOKINGS: 'catBookings',
        STUDENT_INFO: 'studentInfo'
    },
    
    STUDENT_CONFIG: {
        ENABLE_CLASS_CACHE: true,
        MAX_BOOKINGS_PER_STUDENT: 10
    },
    
    ERROR_MESSAGES: {
        NETWORK_ERROR: '网络连接失败，请检查您的网络连接',
        VALIDATION_ERROR: '请填写完整的预约信息',
        SLOT_FULL: '该时间段已满，请选择其他时间段',
        DATE_INVALID: '请选择有效的日期',
        TIME_INVALID: '请选择时间段',
        BOOKING_FAILED: '预约失败，请稍后重试',
        CANCEL_FAILED: '取消预约失败，请稍后重试'
    },
    
    SUCCESS_MESSAGES: {
        BOOKING_SUCCESS: '预约成功！',
        CANCEL_SUCCESS: '预约已取消'
    }
};

// 生产环境配置
const DevConfig = {
    USE_MOCK_DATA: false, // 生产环境使用真实API
    ENABLE_CONSOLE_LOG: true, // 保留日志便于调试
    MOCK_DELAY: 0
};

// 导出配置
window.AppConfig = AppConfig;
window.DevConfig = DevConfig;
\`;

fs.writeFileSync('dist/js/config.js', prodConfig);

// 3. 复制其他JS文件（不压缩）
const jsFiles = ['api.js', 'utils.js', 'ui.js', 'main.js'];
jsFiles.forEach(file => {
    fs.copyFileSync(path.join('src/js', file), path.join('dist/js', file));
});

// 4. 复制CSS文件
fs.copyFileSync('src/css/main.css', 'dist/css/main.css');

// 5. 处理HTML文件
let indexHtml = fs.readFileSync('public/index.html', 'utf8');
indexHtml = indexHtml.replace(
    '<head>',
    \`<head>
    <!-- 生产环境优化 -->
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <meta name='robots' content='index, follow'>
    <meta name='description' content='WLSA PurrPost 豆花喵语栈 - 专业的撸猫社团预约系统'>
    <link rel='preconnect' href='https://cdnjs.cloudflare.com'>\`
);

fs.writeFileSync('dist/index.html', indexHtml);

console.log('✅ 修复版本构建完成');
"

# 2. 检查API配置
echo -e "${YELLOW}2. 检查配置文件...${NC}"
if grep -q "your-domain.com" dist/js/config.js; then
    echo -e "${RED}⚠️  请修改 dist/js/config.js 中的 API_BASE_URL${NC}"
    echo -e "${BLUE}当前配置: your-domain.com${NC}"
    echo -e "${BLUE}请修改为您的实际后端地址，例如:${NC}"
    echo -e "${GREEN}  - https://your-real-domain.com/api${NC}"
    echo -e "${GREEN}  - https://your-ecs-ip:8081/api${NC}"
    echo ""
    read -p "请输入您的API地址 (回车跳过): " api_url
    if [ ! -z "$api_url" ]; then
        sed -i.bak "s|https://your-domain.com/api|$api_url|g" dist/js/config.js
        echo -e "${GREEN}✅ API地址已更新为: $api_url${NC}"
    fi
fi

# 3. 生成Nginx配置
echo -e "${YELLOW}3. 生成ECS专用Nginx配置...${NC}"
cat > nginx-ecs.conf << 'EOF'
server {
    listen 80;
    server_name your-domain.com your-ecs-ip;  # 请修改为您的域名或ECS IP
    root /var/www/cat-booking;
    index index.html;

    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # CORS 配置 - 解决跨域问题
    location /api/ {
        # 如果后端在同一服务器
        proxy_pass http://localhost:8081/api/;
        
        # 如果后端在不同服务器，修改为实际地址
        # proxy_pass https://your-backend-server.com/api/;
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS 头部
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With" always;
        
        # 处理预检请求
        if ($request_method = OPTIONS) {
            return 204;
        }
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # HTML 文件不缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # 安全配置
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
EOF

# 4. 生成部署说明
echo -e "${YELLOW}4. 生成部署说明...${NC}"
cat > ECS-DEPLOY-GUIDE.md << 'EOF'
# 🚀 ECS 部署修复指南

## 问题分析
1. **API配置问题**: 构建时压缩破坏了配置文件
2. **CORS跨域问题**: 前端无法请求后端API
3. **路径问题**: SPA路由配置不正确

## 修复步骤

### 1. 上传文件到ECS
```bash
# 将 dist/ 目录上传到ECS
scp -r dist/* root@your-ecs-ip:/var/www/cat-booking/
```

### 2. 配置Nginx
```bash
# 在ECS上执行
sudo cp nginx-ecs.conf /etc/nginx/sites-available/cat-booking
sudo ln -s /etc/nginx/sites-available/cat-booking /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. 修改API配置
编辑 `/var/www/cat-booking/js/config.js`，将 `API_BASE_URL` 修改为：
- 如果后端在同一ECS: `http://localhost:8081/api`
- 如果后端在不同服务器: `https://your-backend-domain.com/api`

### 4. 检查后端服务
确保后端服务正在运行：
```bash
# 检查后端服务状态
curl http://localhost:8081/api/health
```

### 5. 测试前端
访问: `http://your-ecs-ip` 或 `https://your-domain.com`

## 调试方法

### 浏览器控制台调试
1. 按F12打开开发者工具
2. 查看Console面板的错误信息
3. 查看Network面板的请求状态

### 常见问题
1. **看不到请求**: 检查API_BASE_URL配置
2. **CORS错误**: 检查Nginx代理配置
3. **404错误**: 检查文件路径和权限

### 快速测试命令
```bash
# 测试API连接
curl -I http://your-ecs-ip/api/health

# 测试静态文件
curl -I http://your-ecs-ip/js/config.js

# 查看Nginx日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```
EOF

echo -e "${GREEN}✅ 修复完成！${NC}"
echo ""
echo -e "${BLUE}📋 接下来的步骤:${NC}"
echo -e "${YELLOW}1. 检查并修改 dist/js/config.js 中的 API_BASE_URL${NC}"
echo -e "${YELLOW}2. 将 dist/ 目录上传到 ECS: /var/www/cat-booking/${NC}"
echo -e "${YELLOW}3. 配置 Nginx (使用 nginx-ecs.conf)${NC}"
echo -e "${YELLOW}4. 重启 Nginx 服务${NC}"
echo ""
echo -e "${BLUE}📚 详细说明请查看: ECS-DEPLOY-GUIDE.md${NC}"
echo -e "${BLUE}🔧 Nginx配置文件: nginx-ecs.conf${NC}"
