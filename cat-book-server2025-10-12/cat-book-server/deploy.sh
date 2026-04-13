#!/bin/bash

# WLSA PurrPost 豆花喵语栈 - 一键部署脚本
# 支持多种部署方式

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目信息
PROJECT_NAME="WLSA PurrPost 豆花喵语栈"
VERSION=$(node -p "require('./package.json').version")

echo -e "${BLUE}🚀 $PROJECT_NAME 部署脚本${NC}"
echo -e "${BLUE}📦 版本: $VERSION${NC}"
echo ""

# 检查参数
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}用法: $0 [方式] [选项]${NC}"
    echo ""
    echo "部署方式:"
    echo "  build     - 仅构建生产版本"
    echo "  local     - 本地 Nginx 部署"
    echo "  docker    - Docker 容器部署"
    echo "  docker-compose - Docker Compose 部署"
    echo "  upload    - 上传到服务器"
    echo ""
    echo "示例:"
    echo "  $0 build                     # 构建生产版本"
    echo "  $0 docker                    # Docker 部署"
    echo "  $0 upload user@server:/path  # 上传到服务器"
    exit 1
fi

DEPLOY_METHOD=$1

# 公共函数
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ 错误: $1 未安装${NC}"
        exit 1
    fi
}

build_project() {
    echo -e "${BLUE}🔨 开始构建项目...${NC}"
    
    # 检查 Node.js
    check_command node
    check_command npm
    
    # 安装依赖（如果需要）
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 安装依赖...${NC}"
        npm install
    fi
    
    # 构建项目
    echo -e "${YELLOW}🏗️  构建生产版本...${NC}"
    npm run build
    
    # 验证构建
    echo -e "${YELLOW}🔍 验证构建结果...${NC}"
    npm run validate
    
    echo -e "${GREEN}✅ 构建完成${NC}"
}

# 部署方法实现
deploy_build() {
    build_project
    echo -e "${GREEN}🎉 构建完成！文件位于 dist/ 目录${NC}"
    echo ""
    echo -e "${BLUE}下一步:${NC}"
    echo "1. 检查 dist/js/config.js 中的 API_BASE_URL"
    echo "2. 将 dist/ 目录内容部署到 Web 服务器"
    echo "3. 配置 Web 服务器 (参考 nginx.conf)"
}

deploy_local() {
    echo -e "${BLUE}🏠 本地 Nginx 部署${NC}"
    
    # 检查 Nginx
    check_command nginx
    
    # 构建项目
    build_project
    
    # 定义路径
    NGINX_ROOT="/var/www/cat-booking"
    NGINX_CONF="/etc/nginx/sites-available/cat-booking"
    
    echo -e "${YELLOW}📁 配置 Nginx...${NC}"
    
    # 检查权限
    if [ "$EUID" -ne 0 ]; then
        echo -e "${RED}❌ 需要 sudo 权限进行本地部署${NC}"
        echo "请运行: sudo $0 $@"
        exit 1
    fi
    
    # 创建目录
    mkdir -p $NGINX_ROOT
    
    # 复制文件
    cp -r dist/* $NGINX_ROOT/
    chown -R www-data:www-data $NGINX_ROOT
    chmod -R 755 $NGINX_ROOT
    
    # 复制 Nginx 配置
    cp nginx.conf $NGINX_CONF
    
    # 启用站点
    ln -sf $NGINX_CONF /etc/nginx/sites-enabled/cat-booking
    
    # 测试配置
    nginx -t
    
    if [ $? -eq 0 ]; then
        systemctl reload nginx
        echo -e "${GREEN}✅ Nginx 部署成功${NC}"
        echo -e "${BLUE}🌐 请访问: http://localhost${NC}"
    else
        echo -e "${RED}❌ Nginx 配置错误${NC}"
        exit 1
    fi
}

deploy_docker() {
    echo -e "${BLUE}🐳 Docker 部署${NC}"
    
    # 检查 Docker
    check_command docker
    
    # 构建项目
    build_project
    
    # 构建 Docker 镜像
    echo -e "${YELLOW}🔨 构建 Docker 镜像...${NC}"
    docker build -f docker/Dockerfile -t cat-booking-frontend:$VERSION .
    docker tag cat-booking-frontend:$VERSION cat-booking-frontend:latest
    
    # 停止旧容器
    if [ "$(docker ps -q -f name=cat-booking-frontend)" ]; then
        echo -e "${YELLOW}🛑 停止旧容器...${NC}"
        docker stop cat-booking-frontend
        docker rm cat-booking-frontend
    fi
    
    # 启动新容器
    echo -e "${YELLOW}🚀 启动容器...${NC}"
    docker run -d \
        --name cat-booking-frontend \
        -p 8080:80 \
        --restart unless-stopped \
        cat-booking-frontend:latest
    
    # 检查状态
    sleep 3
    if [ "$(docker ps -q -f name=cat-booking-frontend)" ]; then
        echo -e "${GREEN}✅ Docker 部署成功${NC}"
        echo -e "${BLUE}🌐 请访问: http://localhost:8080${NC}"
        echo -e "${BLUE}📊 查看日志: docker logs cat-booking-frontend${NC}"
    else
        echo -e "${RED}❌ 容器启动失败${NC}"
        docker logs cat-booking-frontend
        exit 1
    fi
}

deploy_docker_compose() {
    echo -e "${BLUE}🐳 Docker Compose 部署${NC}"
    
    # 检查 Docker Compose
    check_command docker-compose
    
    # 构建项目
    build_project
    
    # 启动服务
    echo -e "${YELLOW}🚀 启动服务...${NC}"
    docker-compose up -d --build
    
    # 检查状态
    sleep 5
    echo -e "${YELLOW}📊 检查服务状态...${NC}"
    docker-compose ps
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Docker Compose 部署成功${NC}"
        echo -e "${BLUE}🌐 前端: http://localhost${NC}"
        echo -e "${BLUE}📊 查看日志: docker-compose logs -f${NC}"
        echo -e "${BLUE}🛑 停止服务: docker-compose down${NC}"
    else
        echo -e "${RED}❌ 服务启动失败${NC}"
        exit 1
    fi
}

deploy_upload() {
    if [ $# -lt 2 ]; then
        echo -e "${RED}❌ 请提供上传目标: $0 upload user@server:/path${NC}"
        exit 1
    fi
    
    TARGET=$2
    echo -e "${BLUE}📤 上传到服务器: $TARGET${NC}"
    
    # 检查 rsync
    check_command rsync
    
    # 构建项目
    build_project
    
    # 上传文件
    echo -e "${YELLOW}📤 上传文件...${NC}"
    rsync -avz --progress dist/ $TARGET/
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 上传成功${NC}"
        echo ""
        echo -e "${BLUE}接下来请在服务器上:${NC}"
        echo "1. 配置 Web 服务器"
        echo "2. 更新 API_BASE_URL"
        echo "3. 设置 SSL 证书"
    else
        echo -e "${RED}❌ 上传失败${NC}"
        exit 1
    fi
}

# 主逻辑
case $DEPLOY_METHOD in
    "build")
        deploy_build
        ;;
    "local")
        deploy_local
        ;;
    "docker")
        deploy_docker
        ;;
    "docker-compose")
        deploy_docker_compose
        ;;
    "upload")
        deploy_upload $@
        ;;
    *)
        echo -e "${RED}❌ 未知的部署方式: $DEPLOY_METHOD${NC}"
        echo "支持的方式: build, local, docker, docker-compose, upload"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo -e "${BLUE}📚 更多信息请参考: deployment-guide.md${NC}"
