# 开发环境测试指南

## ✅ 问题已修复

### 修复内容
1. ✅ **开发环境**: `public/js/config.js` 使用 `http://localhost:8081/api`
2. ✅ **生产环境**: `dist/js/config.js` 使用 `/api` (通过Nginx代理)
3. ✅ **构建脚本**: 修复了压缩导致URL破坏的bug

---

## 🧪 开发环境测试步骤

### 1. 确认后端运行在 8081 端口
```bash
# 检查后端是否在运行
curl http://localhost:8081/api/cats

# 应该返回猫咪数据JSON
```

### 2. 启动前端开发服务器
```bash
npm run dev
```

### 3. 清除浏览器缓存
**重要！** 旧的配置可能被缓存了

#### Chrome/Edge
- `Cmd + Shift + Delete` (Mac)
- `Ctrl + Shift + Delete` (Windows)
- 选择"缓存的图片和文件"
- 点击"清除数据"

#### 或使用硬刷新
- `Cmd + Shift + R` (Mac)
- `Ctrl + Shift + R` (Windows)

### 4. 打开浏览器控制台
- 按 `F12` 或 `Cmd/Ctrl + Option/Alt + I`
- 切换到 **Network** 标签页
- 勾选 **Disable cache**

### 5. 访问页面
```
http://localhost:8080
```

### 6. 检查API请求
在 Network 标签中，应该看到：
```
✅ http://localhost:8081/api/cats
✅ http://localhost:8081/api/available-slots?date=2025-09-29
```

**不应该看到**：
```
❌ http://localhost:8080/api/cats (错误端口)
```

---

## 🔍 调试技巧

### 检查当前配置
在浏览器控制台输入：
```javascript
console.log(AppConfig.API_BASE_URL);
```

**应该输出**：
- 开发环境: `http://localhost:8081/api`
- 生产环境: `/api`

### 检查Mock数据开关
```javascript
console.log(DevConfig.USE_MOCK_DATA);
```

**应该输出**: `false` (使用真实后端)

### 手动测试API
```javascript
// 测试获取猫咪列表
fetch('http://localhost:8081/api/cats')
  .then(r => r.json())
  .then(data => console.log(data));
```

---

## 📦 生产环境部署

### 1. 构建
```bash
npm run build
```

### 2. 验证构建结果
```bash
# 检查dist配置
grep "API_BASE_URL" dist/js/config.js
# 应该输出: API_BASE_URL: '/api',
```

### 3. 上传到ECS
```bash
scp -r dist/* root@8.153.88.15:/var/www/cat-book/
```

### 4. 重启Nginx
```bash
ssh root@8.153.88.15 "systemctl reload nginx"
```

### 5. 验证生产环境
访问 `http://8.153.88.15/`，检查Network：
```
✅ http://8.153.88.15/api/cats (通过Nginx代理到127.0.0.1:8081)
```

---

## ⚠️ 常见问题

### Q1: 还是请求8080端口怎么办？
**A**: 强制清除浏览器缓存
1. 关闭所有标签页
2. 清除浏览器缓存
3. 重启浏览器
4. 再次访问

### Q2: 看到 CORS 错误
**A**: 检查后端CORS配置
```bash
# 测试后端是否允许跨域
curl -i http://localhost:8081/api/cats
# 应该包含: Access-Control-Allow-Origin: *
```

### Q3: 404 Not Found
**A**: 检查后端是否真的在8081端口
```bash
# 检查端口监听
lsof -i :8081
# 或
netstat -an | grep 8081
```

### Q4: 生产环境API返回404
**A**: 检查Nginx配置
```bash
# 确认Nginx配置正确
ssh root@8.153.88.15 "cat /etc/nginx/sites-available/cat-book | grep proxy_pass"
# 应该是: proxy_pass http://127.0.0.1:8081;
```

---

## 📊 端口配置总览

| 环境 | 前端地址 | API配置 | 实际请求 | 后端地址 |
|------|----------|---------|----------|----------|
| **开发** | `localhost:8080` | `http://localhost:8081/api` | `localhost:8081/api` | `localhost:8081` |
| **生产** | `8.153.88.15` | `/api` | `8.153.88.15/api` | Nginx代理→`127.0.0.1:8081` |

---

## ✅ 测试清单

开发环境：
- [ ] 后端运行在 8081 端口
- [ ] 前端配置指向 8081
- [ ] 清除浏览器缓存
- [ ] 禁用浏览器缓存（Network标签）
- [ ] API请求正确到达 8081
- [ ] 猫咪页面显示4只猫
- [ ] 安全须知页面正常

生产环境：
- [ ] 构建配置使用 `/api`
- [ ] Nginx代理配置正确
- [ ] 上传文件到ECS
- [ ] 重启Nginx生效
- [ ] 清除浏览器缓存
- [ ] API请求通过Nginx代理
- [ ] 所有功能正常

---

## 🎯 快速测试命令

```bash
# 一键验证所有配置
echo "=== 开发环境配置 ===" && \
grep "API_BASE_URL" public/js/config.js && \
echo -e "\n=== 生产环境配置 ===" && \
grep "API_BASE_URL" dist/js/config.js && \
echo -e "\n=== 测试后端 ===" && \
curl -s http://localhost:8081/api/cats | head -5
```

如果所有输出都正确，说明配置没问题！

