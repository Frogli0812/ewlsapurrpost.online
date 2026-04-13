# 🚀 撸猫社团预约系统 - 快速使用指南

## 📋 系统概况

**WLSA PurrPost 豆花喵语栈** 已成功完成现代化重构，并完美集成了后端API的用户认证系统。

### ✨ 核心特性
- 🐱 **猫咪展示**: 3只可爱猫咪的详细信息
- 📅 **智能预约**: 实时时间段查询和预约管理
- 🔐 **零成本认证**: 手机号+姓名登录，24小时会话
- 📱 **响应式设计**: 完美支持手机和电脑访问
- 🔄 **API集成**: 与后端API完全对接

## 🎯 立即开始

### 1. 🌐 访问系统
- **开发环境**: http://localhost:8080 (需要启动开发服务器)
- **测试页面**: 直接打开 `test-demo.html` 文件

### 2. 🧪 功能测试
打开 `test-demo.html` 进行完整功能测试：
```bash
# 在浏览器中打开
open test-demo.html
```

## 📱 用户使用流程

### 游客模式 (无需登录)
1. **浏览猫咪** → 点击 "猫咪介绍" 查看可爱猫咪
2. **查看时间** → 点击 "预约时间段" 查看可用时间
3. **创建预约** → 填写表单完成预约

### 会员模式 (登录后)
1. **用户登录** → 点击 "登录" 使用手机号+姓名登录
2. **自动填充** → 预约时自动填充个人信息
3. **管理预约** → 点击 "我的预约" 查看和管理预约
4. **查看统计** → 点击用户名查看个人统计

## 🔐 用户认证说明

### 登录方式
- **零成本验证**: 无需短信验证码
- **双重验证**: 手机号 + 姓名
- **24小时会话**: 登录一次，全天免登录
- **自动登录**: 下次访问自动恢复登录状态

### 登录步骤
1. 点击导航栏的 "登录"
2. 输入您预约时使用的手机号和姓名
3. 点击 "登录" 按钮
4. 登录成功后可查看和管理预约

## 🕐 营业时间和规则

### 营业时间
- **营业日**: 周二至周日
- **营业时间**: 10:00 - 18:00
- **休息日**: 周一

### 预约规则
- 每个时间段最多 **5人**
- 时间段间隔 **30分钟**
- 提前至少 **1小时** 可取消预约
- 支持 **1-5人** 团体预约

## 🛠️ 开发者指南

### 启动开发服务器
```bash
# 方式1: 使用Python (推荐)
python3 -m http.server 8080 -d public

# 方式2: 使用Node.js (需要安装依赖)
npm install
npm run dev
```

### 验证系统状态
```bash
# 运行完整验证
npm run validate

# 构建生产版本
npm run build
```

### 配置后端API
编辑 `src/js/config.js`:
```javascript
const AppConfig = {
    API_BASE_URL: 'https://your-domain.com/api', // 修改为实际后端地址
    // ... 其他配置
};
```

## 📊 API接口文档

### 查看文档
- **OpenAPI文档**: `docs/api-spec.yaml`
- **详细说明**: `docs/README.md`
- **在线查看**: 使用 Swagger UI 或 Postman 导入YAML文件

### 主要接口
```bash
# 用户认证
POST /api/simple-user/login           # 用户登录
GET  /api/simple-user/verify-session  # 验证会话
GET  /api/simple-user/my-bookings     # 我的预约
DELETE /api/simple-user/cancel-booking/{id} # 取消预约

# 核心功能
GET  /api/cats                        # 获取猫咪列表
POST /api/bookings                    # 创建预约
GET  /api/available-slots?date=YYYY-MM-DD # 查询可用时间段
GET  /api/statistics                  # 获取统计数据
```

## 🧪 测试指南

### 功能测试
1. **打开测试页面**: `test-demo.html`
2. **系统状态检查**: 验证所有模块加载
3. **猫咪信息测试**: 测试猫咪数据获取
4. **预约功能测试**: 完整预约流程测试
5. **认证功能测试**: 登录、会话、登出测试

### 测试数据
```javascript
// 测试用户信息
手机号: 13800138000
姓名: 测试用户

// 测试预约
日期: 明天
时间: 14:00
人数: 2人
备注: 这是一个测试预约
```

## 🚀 部署指南

### 生产环境部署
1. **构建项目**: `npm run build`
2. **配置API**: 修改 `config.js` 中的API地址
3. **部署文件**: 将 `dist/` 目录部署到Web服务器
4. **配置Nginx**: 参考 `docs/deployment-guide.md`

### Nginx配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/cat-booking/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://your-backend-server:8081;
    }
}
```

## 🆘 常见问题

### Q: 为什么看不到样式？
A: 确保CSS文件路径正确，检查 `public/css/main.css` 是否存在。

### Q: API请求失败怎么办？
A: 检查 `config.js` 中的 `API_BASE_URL` 是否配置正确。

### Q: 如何切换模拟数据模式？
A: 修改 `config.js` 中的 `USE_MOCK_DATA` 为 `true`。

### Q: 忘记登录信息怎么办？
A: 使用预约时填写的手机号和姓名即可登录。

## 📞 技术支持

### 文档资源
- 📖 **项目总结**: `PROJECT-SUMMARY.md`
- 🔗 **集成说明**: `INTEGRATION-SUMMARY.md`
- 🚀 **部署指南**: `docs/deployment-guide.md`
- 📋 **API文档**: `docs/README.md`

### 调试工具
```javascript
// 浏览器控制台调试
console.log('当前用户:', window.catBookingApp.uiManager.authManager.getCurrentUser());
console.log('应用状态:', window.catBookingApp.getAppState());

// 使用debug工具 (开发模式)
window.debug.goToPage('login');        // 快速切换页面
window.debug.clearStorage();           // 清空本地数据
window.debug.createTestBooking();      // 创建测试预约
```

## 🎉 成功案例

### 完整预约流程
1. **访问首页** → 了解预约须知
2. **查看猫咪** → 认识可爱的橘子、小白、灰灰
3. **选择时间** → 查看可用时间段
4. **填写信息** → 创建预约
5. **用户登录** → 使用手机号+姓名登录
6. **管理预约** → 查看、取消预约
7. **查看统计** → 个人预约数据统计

### 系统特色
- 🎨 **温馨界面**: 温暖的橘色主题设计
- ⚡ **快速响应**: 优化的加载和交互体验
- 🔒 **安全可靠**: 完善的数据验证和错误处理
- 📱 **移动友好**: 完美适配各种设备
- 🔄 **平滑过渡**: 渐进式功能升级

---

**🐾 祝您在WLSA PurrPost 豆花喵语栈度过美好的撸猫时光！**

**需要帮助？**
- 💬 查看项目文档
- 🧪 使用测试页面
- 🔧 运行验证脚本  
- 📧 联系技术支持
