# 撸猫社团预约系统 - 部署指南

## 📦 构建JAR包

### 1. 快速构建
```bash
./build.sh
```

### 2. 手动构建
```bash
# 清理并打包
mvn clean package -DskipTests

# 打包成功后，JAR文件位于：
# target/cat-book-backend-0.0.1-SNAPSHOT.jar
```

## 🚀 运行应用

### 1. 使用启动脚本（推荐）
```bash
# 启动应用
./start.sh

# 停止应用
./stop.sh

# 查看日志
tail -f logs/application.log
```

### 2. 直接运行JAR
```bash
# 开发环境
java -jar target/cat-book-backend-0.0.1-SNAPSHOT.jar

# 生产环境
java -jar target/cat-book-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod

# 指定内存参数
java -Xms512m -Xmx1024m -jar target/cat-book-backend-0.0.1-SNAPSHOT.jar
```

## 🌐 环境配置

### 开发环境
- 配置文件：`application.yml`
- 端口：8081
- 数据库：使用你配置的MySQL
- 日志级别：DEBUG

### 生产环境
- 配置文件：`application-prod.yml`
- 端口：8080
- 环境变量支持：

```bash
# 数据库配置
export DB_URL="jdbc:mysql://your-db-host:3306/cat_book?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai"
export DB_USERNAME="your-username"
export DB_PASSWORD="your-password"

# Redis配置
export REDIS_HOST="your-redis-host"
export REDIS_PORT="6379"
export REDIS_PASSWORD="your-redis-password"

# JWT密钥
export JWT_SECRET="your-production-jwt-secret-key"

# 文件上传路径
export UPLOAD_PATH="/app/uploads/"
```

## 🐳 Docker部署（可选）

### 1. 创建Dockerfile
```dockerfile
FROM openjdk:17-jre-slim

WORKDIR /app

COPY target/cat-book-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
```

### 2. 构建镜像
```bash
docker build -t cat-book-backend .
```

### 3. 运行容器
```bash
docker run -d \
  --name cat-book-backend \
  -p 8080:8080 \
  -e DB_URL="jdbc:mysql://host.docker.internal:3306/cat_book?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai" \
  -e DB_USERNAME="your-username" \
  -e DB_PASSWORD="your-password" \
  -v /app/logs:/app/logs \
  cat-book-backend
```

## 📋 部署检查清单

### 部署前
- [ ] 数据库已创建并可连接
- [ ] Redis服务正常运行（如果使用）
- [ ] 防火墙开放8080端口
- [ ] 上传目录有写权限
- [ ] 环境变量正确设置

### 部署后
- [ ] 应用正常启动
- [ ] 健康检查通过：`curl http://localhost:8080/api/health`
- [ ] 猫咪列表接口正常：`curl http://localhost:8080/api/cats`
- [ ] 时间段接口正常：`curl "http://localhost:8080/api/available-slots?date=2025-09-27"`
- [ ] 日志正常输出

## 🔧 常见问题

### 1. 端口被占用
```bash
# 查看端口占用
lsof -ti:8080

# 停止占用端口的进程
lsof -ti:8080 | xargs kill -9
```

### 2. 数据库连接失败
- 检查数据库服务是否运行
- 验证连接字符串、用户名、密码
- 确认防火墙允许数据库连接

### 3. 内存不足
```bash
# 增加JVM内存参数
java -Xms1g -Xmx2g -jar target/cat-book-backend-0.0.1-SNAPSHOT.jar
```

### 4. 查看应用状态
```bash
# 查看进程
ps aux | grep cat-book-backend

# 查看日志
tail -f logs/application.log

# 查看系统资源
top
```

## 📊 监控和维护

### 日志位置
- 应用日志：`logs/application.log`
- 启动日志：`logs/cat-book-backend.log`

### 健康检查端点
- 应用健康：`http://localhost:8080/api/health`
- 应用信息：`http://localhost:8081/actuator/info`（管理端口）
- 应用指标：`http://localhost:8081/actuator/metrics`

### 日志轮转（生产环境建议）
```bash
# 使用logrotate管理日志
sudo vim /etc/logrotate.d/cat-book-backend

# 配置内容：
/app/logs/*.log {
    daily
    rotate 30
    compress
    missingok
    notifempty
    copytruncate
}
```

## 🔄 更新部署

```bash
# 1. 停止应用
./stop.sh

# 2. 备份数据（如需要）
mysqldump -u username -p cat_book > backup_$(date +%Y%m%d_%H%M%S).sql

# 3. 更新代码并重新打包
git pull
./build.sh

# 4. 启动新版本
./start.sh

# 5. 验证部署
curl http://localhost:8080/api/health
```

---

🎉 **部署完成！** 你的撸猫社团预约系统现在可以正常运行了！
