# 🚀 WLSA PurrPost 豆花喵语栈 - 部署指南

本指南将帮助您将撸猫社团预约系统部署到生产环境。

## 📋 部署前准备

### 1. 环境要求
- **Web服务器**: Nginx 1.18+ 或 Apache 2.4+
- **Node.js**: 16.0+ (仅用于构建，生产环境不需要)
- **后端API**: 确保后端服务已部署并可访问
- **域名**: 已备案的域名 (可选但推荐)
- **SSL证书**: HTTPS证书 (推荐使用)

### 2. 构建生产版本

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build

# 验证构建结果
npm run validate
```

构建完成后，所有生产文件将位于 `dist/` 目录中。

## 🌐 部署方案

### 方案一：Nginx 部署 (推荐)

#### 1. 准备服务器环境

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

#### 2. 复制文件

```bash
# 创建网站目录
sudo mkdir -p /var/www/cat-booking

# 复制构建文件
sudo cp -r dist/* /var/www/cat-booking/

# 设置权限
sudo chown -R www-data:www-data /var/www/cat-booking
sudo chmod -R 755 /var/www/cat-booking
```

#### 3. 配置 Nginx

```bash
# 复制配置文件
sudo cp nginx.conf /etc/nginx/sites-available/cat-booking

# 启用站点
sudo ln -s /etc/nginx/sites-available/cat-booking /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

#### 4. 配置SSL (推荐)

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 设置自动续期
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 方案二：Apache 部署

#### 1. 安装 Apache

```bash
# Ubuntu/Debian
sudo apt install apache2

# 启用必要模块
sudo a2enmod rewrite ssl headers
```

#### 2. 配置虚拟主机

创建 `/etc/apache2/sites-available/cat-booking.conf`:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/cat-booking
    
    # 重定向到 HTTPS
    Redirect permanent / https://your-domain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /var/www/cat-booking
    
    # SSL 配置
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
    
    # 安全头部
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-XSS-Protection "1; mode=block"
    
    # 缓存配置
    <FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </FilesMatch>
    
    # SPA 路由支持
    <Directory "/var/www/cat-booking">
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # API 代理
    ProxyPreserveHost On
    ProxyPass /api/ http://localhost:8081/api/
    ProxyPassReverse /api/ http://localhost:8081/api/
</VirtualHost>
```

#### 3. 启用站点

```bash
sudo a2ensite cat-booking
sudo systemctl restart apache2
```

### 方案三：CDN 部署

#### 1. 阿里云 OSS + CDN

```bash
# 使用阿里云 OSS CLI 上传
ossutil cp -r dist/ oss://your-bucket/

# 配置CDN域名指向OSS
# 在阿里云控制台配置CDN加速
```

#### 2. 腾讯云 COS + CDN

```bash
# 使用腾讯云 COSCLI 上传
coscli cp -r dist/ cos://your-bucket/

# 配置CDN域名
# 在腾讯云控制台配置CDN
```

## ⚙️ 生产环境配置

### 1. API 地址配置

编辑 `dist/js/config.js`，修改 API 地址：

```javascript
const AppConfig = {
    // 修改为实际的生产API地址
    API_BASE_URL: 'https://api.your-domain.com/api',
    // ... 其他配置
};
```

### 2. 安全配置

#### 2.1 更新 CSP 策略

在 Nginx 配置中更新内容安全策略：

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' api.your-domain.com;" always;
```

#### 2.2 配置防火墙

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# iptables
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

### 3. 监控配置

#### 3.1 Nginx 日志分析

```bash
# 安装日志分析工具
sudo apt install goaccess

# 分析访问日志
goaccess /var/log/nginx/cat-booking-access.log -o /var/www/cat-booking/stats.html --log-format=COMBINED
```

#### 3.2 性能监控

添加前端性能监控：

```javascript
// 在 main.js 中添加
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = {
            dns: performance.timing.domainLookupEnd - performance.timing.domainLookupStart,
            connect: performance.timing.connectEnd - performance.timing.connectStart,
            request: performance.timing.responseStart - performance.timing.requestStart,
            response: performance.timing.responseEnd - performance.timing.responseStart,
            dom: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
            load: performance.timing.loadEventEnd - performance.timing.navigationStart
        };
        
        // 发送性能数据到分析服务
        console.log('性能数据:', perfData);
    });
}
```

## 🔧 维护和更新

### 1. 版本更新流程

```bash
# 1. 构建新版本
npm run build

# 2. 备份当前版本
sudo cp -r /var/www/cat-booking /var/www/cat-booking-backup-$(date +%Y%m%d)

# 3. 部署新版本
sudo cp -r dist/* /var/www/cat-booking/

# 4. 验证部署
curl -I https://your-domain.com
```

### 2. 日志管理

```bash
# 日志轮转配置
sudo nano /etc/logrotate.d/cat-booking

# 内容：
/var/log/nginx/cat-booking-*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
```

### 3. 备份策略

```bash
#!/bin/bash
# 自动备份脚本 (backup.sh)

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/cat-booking"
SITE_DIR="/var/www/cat-booking"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份网站文件
tar -czf $BACKUP_DIR/site_$DATE.tar.gz -C $SITE_DIR .

# 清理旧备份 (保留30天)
find $BACKUP_DIR -name "site_*.tar.gz" -mtime +30 -delete

echo "备份完成: site_$DATE.tar.gz"
```

## 🚨 故障排除

### 1. 常见问题

#### 问题：页面显示 404 错误
**解决方案**：
```bash
# 检查文件权限
ls -la /var/www/cat-booking/

# 检查 Nginx 配置
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/cat-booking-error.log
```

#### 问题：API 请求失败
**解决方案**：
1. 检查 `config.js` 中的 API_BASE_URL
2. 确认后端服务状态
3. 检查防火墙和网络连接
4. 查看浏览器开发者工具的网络面板

#### 问题：静态资源加载失败
**解决方案**：
```bash
# 检查文件是否存在
ls -la /var/www/cat-booking/js/
ls -la /var/www/cat-booking/css/

# 检查 MIME 类型配置
sudo nano /etc/nginx/mime.types
```

### 2. 性能优化

#### 2.1 启用 HTTP/2

在 Nginx 配置中：
```nginx
listen 443 ssl http2;
```

#### 2.2 优化缓存策略

```nginx
# 强缓存静态资源
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# 协商缓存 HTML
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache";
    etag on;
}
```

## 📞 技术支持

如果在部署过程中遇到问题，请：

1. 查看相关日志文件
2. 检查配置文件语法
3. 确认网络连接和端口开放
4. 参考官方文档

---

**祝您部署顺利！** 🎉

> 本部署指南适用于 WLSA PurrPost 豆花喵语栈 v1.0.0
> 最后更新：2025年9月
