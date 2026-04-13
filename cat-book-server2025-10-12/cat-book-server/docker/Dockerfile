# WLSA PurrPost 豆花喵语栈 - 前端 Docker 镜像
FROM nginx:alpine

# 设置维护者信息
LABEL maintainer="WLSA PurrPost Team" \
      description="撸猫社团预约系统前端" \
      version="1.0.0"

# 安装必要工具
RUN apk add --no-cache \
    curl \
    tzdata

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 复制构建文件
COPY dist/ /usr/share/nginx/html/

# 复制 Nginx 配置
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# 创建日志目录
RUN mkdir -p /var/log/nginx

# 设置权限
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# 暴露端口
EXPOSE 80

# 启动命令
CMD ["nginx", "-g", "daemon off;"]
