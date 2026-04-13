# 🐱 WLSA PurrPost 豆花喵语栈

**撸猫社团预约系统** - 专为学生社团设计的撸猫预约前端系统

## 🚀 快速部署

### 方式一：一键部署脚本

```bash
# 1. 构建生产版本
./deploy.sh build

# 2. Docker 部署
./deploy.sh docker

# 3. 本地 Nginx 部署 (需要 sudo)
sudo ./deploy.sh local

# 4. 上传到服务器
./deploy.sh upload user@your-server.com:/var/www/html
```

### 方式二：手动构建部署

```bash
# 1. 安装依赖
npm install

# 2. 构建生产版本
npm run build

# 3. 验证构建结果
npm run validate

# 4. 部署 dist/ 目录到 Web 服务器
```

### 方式三：Docker 部署

```bash
# 单容器部署
npm run docker:build
npm run docker:run

# Docker Compose 部署 (推荐)
npm run docker:compose
```

## ⚙️ 生产环境配置

### 1. 修改 API 地址

编辑 `dist/js/config.js`：

```javascript
const AppConfig = {
    API_BASE_URL: 'https://your-api-domain.com/api', // 修改这里
    // ... 其他配置
};
```

### 2. Web 服务器配置

- **Nginx**: 使用 `nginx.conf`
- **Apache**: 参考 `deployment-guide.md`
- **CDN**: 直接上传 `dist/` 目录内容

## 📁 项目结构

```
cat-book-server/
├── src/                    # 源代码
│   ├── js/                # JavaScript 文件
│   ├── css/               # 样式文件
│   └── assets/            # 静态资源
├── public/                # 开发环境文件
├── dist/                  # 生产环境构建输出
├── docker/                # Docker 配置
├── scripts/               # 构建脚本
├── nginx.conf             # Nginx 配置示例
├── docker-compose.yml     # Docker Compose 配置
├── deploy.sh              # 一键部署脚本
└── deployment-guide.md    # 详细部署指南
```

## 🛠️ 开发模式

```bash
# 启动开发服务器
npm run dev

# 代码格式化
npm run format

# 代码检查
npm run lint
```

## 🌐 功能特性

- ✅ **智能日期选择**: 自动跳转到可用日期
- ✅ **实时余位显示**: 显示每个时间段的可用位置
- ✅ **位置级预约**: 精确到具体位置的预约管理
- ✅ **学生社团模式**: 班级+姓名的简单身份识别
- ✅ **响应式设计**: 支持桌面和移动设备
- ✅ **离线缓存**: 支持基本的离线功能

## 🔧 技术栈

- **前端框架**: 原生 JavaScript (ES6+)
- **样式**: CSS3 + CSS Variables
- **图标**: Font Awesome 6
- **构建工具**: 自定义构建脚本
- **部署**: Nginx / Apache / Docker

## 📱 浏览器支持

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 🆘 故障排除

### 常见问题

1. **API 请求失败**
   - 检查 `config.js` 中的 `API_BASE_URL`
   - 确认后端服务运行状态
   - 检查 CORS 配置

2. **静态资源 404**
   - 检查文件路径和权限
   - 确认 Web 服务器配置

3. **页面空白**
   - 查看浏览器开发者工具的错误信息
   - 检查 JavaScript 文件是否正确加载

### 获取帮助

- 📖 详细部署指南: `deployment-guide.md`
- 🐳 Docker 配置: `docker/`
- 🔧 构建脚本: `scripts/`

## 📄 许可证

MIT License

---

**Made with ❤️ by WLSA PurrPost Team**

> 让每一次撸猫都变得简单而美好 🐱