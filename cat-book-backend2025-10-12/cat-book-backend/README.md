# 撸猫社团预约系统后端

## 项目简介

这是一个基于Spring Boot 3.x开发的学生社团撸猫预约系统后端，采用前后端分离架构，为学生社团提供完整的座位预约管理功能。支持真实位置预约，每个时间段有5个固定位置，显示预约学生的班级和姓名信息。

## 技术栈

- **框架**: Spring Boot 3.5.3
- **数据库**: MySQL 8.0 + JPA/Hibernate
- **缓存**: Redis
- **权限认证**: Sa-Token 1.37.0
- **API文档**: Swagger3 + Knife4j
- **工具库**: Hutool, Lombok
- **构建工具**: Maven 3.x
- **JDK版本**: 17+

## 项目特色

### 1. 现代化架构设计
- 采用DDD分层架构，代码结构清晰
- 使用Sa-Token实现轻量级权限管理
- 支持用户端和管理端权限分离
- 完整的异常处理和参数验证机制

### 2. 业务功能完整
- 猫咪信息管理（CRUD）
- 真实位置预约系统（5个固定座位）
- 学生信息管理（班级+姓名）
- 时间段详情查询（显示具体位置占用情况）
- 无需登录的开放式预约
- 多时段预约支持
- 统计数据分析

### 3. 开发体验优秀
- 完整的Swagger API文档
- 自动数据库表结构生成
- 开发环境数据自动初始化
- 统一的响应格式

## 快速开始

### 1. 环境准备

- JDK 17+
- MySQL 8.0+
- Redis 6.0+
- Maven 3.6+

### 2. 数据库配置

创建数据库：
```sql
CREATE DATABASE cat_book CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

修改 `application.yml` 中的数据库连接信息：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/cat_book?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: 你的密码
```

### 3. 启动项目

```bash
# 安装依赖
mvn clean install

# 启动项目
mvn spring-boot:run
```

### 4. 访问服务

- 应用地址: http://localhost:8080
- API文档: http://localhost:8080/doc.html
- 健康检查: http://localhost:8080/api/health

## API 接口说明

### 公开接口（无需认证）

- `GET /api/cats` - 获取所有猫咪信息
- `GET /api/cats/{id}` - 获取指定猫咪详情
- `POST /api/bookings` - 创建预约
- `GET /api/bookings/by-phone` - 根据手机号查询预约
- `DELETE /api/bookings/{id}` - 取消预约
- `GET /api/available-slots` - 查询可用时间段
- `GET /api/health` - 健康检查

### 管理员接口（需要管理员权限）

- `POST /api/admin/login` - 管理员登录
- `POST /api/admin/logout` - 管理员登出
- `GET /api/admin/profile` - 获取管理员信息
- `POST /api/cats` - 添加猫咪
- `PUT /api/cats/{id}` - 更新猫咪信息
- `DELETE /api/cats/{id}` - 删除猫咪
- `GET /api/bookings` - 获取预约列表（分页）
- `PUT /api/bookings/{id}` - 更新预约信息
- `GET /api/statistics` - 获取统计数据

## 默认账号

系统会自动创建默认管理员账号：
- 用户名: `admin`
- 密码: `123456`

## 业务规则

### 营业时间
- 营业时间：周二至周日 10:00-18:00
- 休息时间：周一全天休息
- 时间段间隔：30分钟

### 预约规则
- 每个时间段最多容纳5人
- 预约需要提前至少1小时才能取消
- 支持1-5人的团体预约
- 必须提供真实姓名和手机号

### 权限管理
- 普通用户：可查看猫咪、创建预约、查询自己的预约
- 管理员：拥有所有权限，可管理猫咪、查看所有预约、获取统计数据

## 项目结构

```
src/main/java/cc/mymc/catbookbackend/
├── config/          # 配置类
├── controller/      # 控制器层
├── dto/            # 数据传输对象
│   ├── request/    # 请求DTO
│   └── response/   # 响应DTO
├── entity/         # 实体类
├── exception/      # 异常处理
├── repository/     # 数据访问层
├── service/        # 业务逻辑层
└── util/           # 工具类
```

## 配置说明

### Sa-Token配置
```yaml
sa-token:
  token-name: satoken
  timeout: 7200
  is-concurrent: true
  is-share: false
  token-prefix: "Bearer"
```

### 业务配置
```yaml
app:
  business:
    start-hour: 10
    end-hour: 18
    max-visitors-per-slot: 5
    time-slot-duration: 30
    closed-days: 1  # 周一休息
```

## 开发指南

### 添加新的API接口

1. 在对应的Controller中添加方法
2. 使用 `@Operation` 注解添加接口文档
3. 使用 `@Valid` 进行参数验证
4. 使用统一的 `ApiResponse` 返回格式

### 添加新的业务规则

1. 在 `BusinessUtil` 工具类中添加通用方法
2. 在对应的Service中实现具体业务逻辑
3. 添加相应的异常处理

### 权限控制

使用 `@SaCheckRole("admin")` 注解控制管理员权限：
```java
@PostMapping
@SaCheckRole("admin")
public ApiResponse<Cat> createCat(@Valid @RequestBody CatCreateRequest request) {
    // 只有管理员可以访问
}
```

## 部署说明

### 生产环境配置

1. 修改数据库连接为生产环境
2. 修改Redis连接配置
3. 设置合适的日志级别
4. 配置文件上传路径

### Docker部署

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/cat-book-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## 常见问题

### Q: 如何修改营业时间？
A: 修改 `application.yml` 中的 `app.business` 配置，或者在 `BusinessUtil` 类中修改常量。

### Q: 如何添加新的权限角色？
A: 在 `Admin.Role` 枚举中添加新角色，并在 `StpInterfaceImpl` 中处理角色逻辑。

### Q: 如何自定义预约规则？
A: 在 `BookingService` 中修改相应的验证方法。

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License

## 联系方式

- 开发团队: dev@wlsa-purrpost.com
- 项目地址: [GitHub](https://github.com/your-repo/cat-book-backend)

---

**🐱 祝您撸猫愉快！**
