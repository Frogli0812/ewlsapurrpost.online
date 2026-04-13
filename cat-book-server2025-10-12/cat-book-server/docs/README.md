# 撸猫社团预约系统 API 文档

## 项目概述

WLSA PurrPost 豆花喵语栈是一个猫咪互动体验预约系统，允许用户在线预约与可爱猫咪的互动时间。

## 功能特性

- 🐱 **猫咪信息展示**: 查看所有可爱猫咪的详细信息
- 📅 **时间段预约**: 选择合适的时间段进行预约
- 👥 **用户管理**: 管理个人预约记录
- 📊 **统计分析**: 管理员可查看系统统计数据
- 📱 **响应式设计**: 支持移动端和桌面端访问

## 业务规则

### 营业时间
- **营业日**: 周二至周日
- **营业时间**: 10:00 - 18:00
- **休息日**: 周一

### 预约规则
- 每个时间段最多容纳 **5人**
- 时间段间隔为 **30分钟**
- 预约需要提前至少 **1小时** 取消
- 支持1-5人的团体预约

### 预约须知
1. 每个时间段最多5人，请提前预约
2. 请勿强行抱猫或追逐猫咪
3. 请勿自带食物投喂猫咪
4. 12岁以下儿童需由家长陪同
5. 如无法按时前来，请提前取消预约

## API 文档

### 文档格式
API 文档采用 **OpenAPI 3.0.3** 标准格式编写，文件位置: `docs/api-spec.yaml`

### 在线查看
您可以使用以下工具查看API文档：

1. **Swagger UI**: 
   ```bash
   # 安装swagger-ui-express
   npm install swagger-ui-serve
   swagger-ui-serve docs/api-spec.yaml
   ```

2. **在线编辑器**: 
   - 访问 [Swagger Editor](https://editor.swagger.io/)
   - 复制 `docs/api-spec.yaml` 内容到编辑器中

3. **VS Code 插件**: 
   - 安装 "OpenAPI (Swagger) Editor" 插件
   - 直接在 VS Code 中预览文档

## 主要接口概览

### 猫咪信息 (`/cats`)
- `GET /cats` - 获取所有猫咪信息
- `GET /cats/{catId}` - 获取指定猫咪信息
- `POST /cats` - 添加新猫咪 (管理员)
- `PUT /cats/{catId}` - 更新猫咪信息 (管理员)
- `DELETE /cats/{catId}` - 删除猫咪信息 (管理员)

### 预约管理 (`/bookings`)
- `GET /bookings` - 获取预约列表
- `POST /bookings` - 创建新预约
- `GET /bookings/{bookingId}` - 获取预约详情
- `PUT /bookings/{bookingId}` - 更新预约信息
- `DELETE /bookings/{bookingId}` - 取消预约

### 时间段查询 (`/available-slots`)
- `GET /available-slots?date=YYYY-MM-DD` - 获取指定日期的可用时间段

### 统计数据 (`/statistics`)
- `GET /statistics` - 获取系统统计数据 (管理员)

## 数据模型

### 猫咪信息 (Cat)
```json
{
  "id": 1,
  "name": "橘子",
  "breed": "橘猫",
  "age": 2,
  "personality": "温顺、贪吃、喜欢被摸肚子",
  "favoriteToy": "毛线球",
  "imageUrl": null,
  "isActive": true,
  "healthStatus": "healthy"
}
```

### 预约信息 (Booking)
```json
{
  "id": 123,
  "date": "2023-12-15",
  "time": "14:00",
  "name": "张三",
  "phone": "13800138000",
  "note": "第一次来，很期待",
  "status": "confirmed",
  "numberOfPeople": 2,
  "timeSlotDescription": "14:00-14:30",
  "canCancel": true
}
```

### 时间段信息 (TimeSlot)
```json
{
  "time": "14:00",
  "date": "2023-12-15",
  "timeSlotDescription": "14:00-14:30",
  "totalCapacity": 5,
  "bookedCount": 2,
  "availableCapacity": 3,
  "isAvailable": true,
  "isFull": false
}
```

## 响应格式

所有API响应都采用统一格式：

### 成功响应
```json
{
  "success": true,
  "data": { /* 实际数据 */ },
  "message": "操作成功消息",
  "errors": [],
  "timestamp": "2023-12-01T10:00:00Z"
}
```

### 错误响应
```json
{
  "success": false,
  "data": null,
  "message": "错误描述",
  "errors": ["详细错误信息1", "详细错误信息2"],
  "timestamp": "2023-12-01T10:00:00Z"
}
```

## 状态码说明

| 状态码 | 说明 | 示例 |
|--------|------|------|
| 200 | 成功 | 获取数据成功 |
| 201 | 创建成功 | 预约创建成功 |
| 400 | 请求错误 | 数据验证失败 |
| 401 | 未授权 | 需要管理员权限 |
| 404 | 资源未找到 | 预约不存在 |
| 409 | 资源冲突 | 时间段已满 |
| 500 | 服务器错误 | 内部服务器错误 |

## 错误处理

### 验证错误 (400)
当请求数据不符合要求时返回：
```json
{
  "success": false,
  "message": "数据验证失败",
  "errors": [
    "姓名不能为空",
    "手机号格式无效"
  ]
}
```

### 业务逻辑错误 (409)
当业务规则不满足时返回：
```json
{
  "success": false,
  "message": "该时间段已满，请选择其他时间段",
  "errors": ["时间段容量不足"]
}
```

## 认证机制

### 管理员认证
管理员接口需要在请求头中包含认证令牌：
```
X-Admin-Token: your-admin-token-here
```

需要管理员权限的接口：
- 猫咪信息的增删改操作
- 系统统计数据查询

## 使用示例

### 1. 获取猫咪列表
```bash
curl -X GET "http://localhost:3000/api/cats" \
  -H "Content-Type: application/json"
```

### 2. 查询可用时间段
```bash
curl -X GET "http://localhost:3000/api/available-slots?date=2023-12-15" \
  -H "Content-Type: application/json"
```

### 3. 创建预约
```bash
curl -X POST "http://localhost:3000/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2023-12-15",
    "time": "14:00",
    "name": "张三",
    "phone": "13800138000",
    "note": "第一次来，很期待",
    "numberOfPeople": 2
  }'
```

### 4. 取消预约
```bash
curl -X DELETE "http://localhost:3000/api/bookings/123" \
  -H "Content-Type: application/json" \
  -d '{
    "cancelReason": "临时有事无法前来"
  }'
```

## 开发建议

### 1. 数据库设计
- 使用关系型数据库 (MySQL/PostgreSQL)
- 建议创建索引: `date`, `time`, `phone`, `status`
- 考虑软删除策略

### 2. 缓存策略
- 猫咪信息可以缓存较长时间
- 时间段可用性需要实时查询
- 统计数据可以定期更新缓存

### 3. 并发处理
- 预约创建时需要加锁防止超预约
- 使用数据库事务确保数据一致性

### 4. 监控和日志
- 记录所有预约操作的审计日志
- 监控API响应时间和错误率
- 设置预约量和取消率的告警

## 测试建议

### 单元测试
- 数据模型的验证逻辑
- 业务规则的实现
- API 端点的基本功能

### 集成测试
- 完整的预约流程
- 并发预约场景
- 边界条件测试

### 压力测试
- 高并发预约请求
- 大量时间段查询
- 数据库性能测试

## 部署说明

### 环境要求
- Node.js 16+ 或其他后端技术栈
- 数据库 (MySQL 8.0+ / PostgreSQL 12+)
- Redis (可选，用于缓存)

### 配置项
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cat_booking
DB_USER=username
DB_PASS=password

# Redis配置 (可选)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT密钥 (如果使用JWT认证)
JWT_SECRET=your-secret-key

# 管理员令牌
ADMIN_TOKEN=your-admin-token
```

### Docker 部署
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 联系信息

- **项目仓库**: [GitHub链接]
- **技术支持**: dev@wlsa-purrpost.com
- **问题反馈**: [Issue链接]

## 版本历史

- **v1.0.0** (2023-12-01): 初始版本发布
  - 基础预约功能
  - 猫咪信息管理
  - 时间段查询
  - 统计数据功能
