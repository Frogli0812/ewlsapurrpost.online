# 🚀 ECS 部署修复指南

## 问题分析

根据您反馈的问题："页面能看到了，但是无法跳转，浏览器也无法看到他的请求"，主要原因如下：

### 1. **API配置问题** 
- 构建时压缩破坏了 `config.js` 中的 `API_BASE_URL`
- 导致前端无法正确发送请求到后端

### 2. **CORS跨域问题**
- 前端和后端可能在不同端口或域名
- 缺少必要的CORS头部配置

### 3. **Nginx配置问题**
- 缺少API代理配置
- SPA路由配置不完整

## 🔧 解决方案

### 步骤1: 修改API配置

编辑 `dist/js/config.js` 文件，将 `API_BASE_URL` 修改为正确地址：

```javascript
const AppConfig = {
    // 根据您的后端部署情况选择：
    
    // 选项1: 后端在同一ECS服务器
    API_BASE_URL: 'http://your-ecs-ip:8081/api',
    
    // 选项2: 后端在不同服务器
    // API_BASE_URL: 'https://your-backend-domain.com/api',
    
    // 选项3: 使用Nginx代理（推荐）
    // API_BASE_URL: '/api',
    
    // ... 其他配置保持不变
};
```

### 步骤2: 配置Nginx

#### 2.1 上传文件到ECS
```bash
# 将修复后的文件上传到ECS
scp -r dist/* root@your-ecs-ip:/var/www/cat-booking/
scp nginx-ecs.conf root@your-ecs-ip:/tmp/
```

#### 2.2 配置Nginx
```bash
# 在ECS服务器上执行：

# 1. 复制Nginx配置
sudo cp /tmp/nginx-ecs.conf /etc/nginx/sites-available/cat-booking

# 2. 修改配置文件中的域名/IP
sudo nano /etc/nginx/sites-available/cat-booking
# 将 your-domain.com your-ecs-ip 修改为实际值

# 3. 启用站点
sudo ln -sf /etc/nginx/sites-available/cat-booking /etc/nginx/sites-enabled/

# 4. 测试配置
sudo nginx -t

# 5. 重启Nginx
sudo systemctl reload nginx
```

### 步骤3: 检查后端服务

确保您的后端服务正在运行：

```bash
# 检查后端服务状态
sudo systemctl status your-backend-service
# 或
ps aux | grep java  # 如果是Java应用

# 检查端口监听
sudo netstat -tlnp | grep :8081

# 测试后端API
curl http://localhost:8081/api/health
```

### 步骤4: 验证部署

#### 4.1 测试前端访问
```bash
# 测试主页
curl -I http://your-ecs-ip/

# 测试静态资源
curl -I http://your-ecs-ip/js/config.js
```

#### 4.2 测试API代理
```bash
# 测试API代理
curl -I http://your-ecs-ip/api/health
```

#### 4.3 浏览器测试
1. 访问 `http://your-ecs-ip`
2. 按F12打开开发者工具
3. 查看 Console 面板是否有错误
4. 查看 Network 面板是否有API请求

## 🐛 常见问题和解决方案

### 问题1: 浏览器看不到请求

**原因**: API_BASE_URL配置错误

**解决**: 
```bash
# 检查配置文件
cat /var/www/cat-booking/js/config.js | grep API_BASE_URL

# 如果显示异常，重新修改
sudo nano /var/www/cat-booking/js/config.js
```

### 问题2: CORS跨域错误

**现象**: 浏览器控制台显示跨域错误

**解决**: 确保Nginx配置包含CORS头部：
```nginx
add_header Access-Control-Allow-Origin * always;
```

### 问题3: 404错误

**原因**: 
- 文件路径不正确
- Nginx配置问题

**解决**:
```bash
# 检查文件权限
ls -la /var/www/cat-booking/

# 设置正确权限
sudo chown -R www-data:www-data /var/www/cat-booking
sudo chmod -R 755 /var/www/cat-booking
```

### 问题4: 502 Bad Gateway

**原因**: 后端服务未运行或端口不正确

**解决**:
```bash
# 检查后端服务
curl http://localhost:8081/api/health

# 如果失败，检查后端服务状态
sudo systemctl status your-backend-service
```

## 🔍 调试方法

### 浏览器调试
1. **打开开发者工具** (F12)
2. **Console面板**: 查看JavaScript错误
3. **Network面板**: 查看请求状态
4. **Application面板**: 检查LocalStorage

### 服务器端调试
```bash
# 查看Nginx访问日志
sudo tail -f /var/log/nginx/access.log

# 查看Nginx错误日志
sudo tail -f /var/log/nginx/error.log

# 检查系统资源
htop
df -h
```

### 快速测试脚本
```bash
#!/bin/bash
echo "=== 前端服务测试 ==="
curl -I http://localhost/

echo -e "\n=== API代理测试 ==="
curl -I http://localhost/api/health

echo -e "\n=== 后端服务测试 ==="
curl -I http://localhost:8081/api/health

echo -e "\n=== 文件权限检查 ==="
ls -la /var/www/cat-booking/ | head -5
```

## 📝 最佳实践

### 1. 推荐的API配置
```javascript
// 使用相对路径，通过Nginx代理
API_BASE_URL: '/api'
```

### 2. 完整的Nginx配置示例
参考 `nginx-ecs.conf` 文件

### 3. 部署检查清单
- [ ] 后端服务正常运行
- [ ] 前端文件上传完整
- [ ] API_BASE_URL配置正确
- [ ] Nginx配置正确
- [ ] 防火墙端口开放
- [ ] 文件权限设置正确

## 🆘 如果问题依然存在

请提供以下信息：

1. **浏览器控制台的完整错误信息**
2. **Nginx错误日志** (`/var/log/nginx/error.log`)
3. **后端服务状态** (`systemctl status your-backend`)
4. **网络请求详情** (Network面板截图)

这将帮助我们更好地诊断和解决问题。
