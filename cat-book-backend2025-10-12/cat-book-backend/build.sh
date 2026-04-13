#!/bin/bash

# 撸猫社团预约系统构建脚本
# Cat Book Backend Build Script

APP_NAME="cat-book-backend"

echo "========================================"
echo "构建 $APP_NAME"
echo "========================================"

# 检查Maven是否可用
if ! command -v mvn &> /dev/null; then
    echo "错误: Maven未安装或不在PATH中"
    exit 1
fi

# 清理并编译
echo "1. 清理项目..."
mvn clean

if [ $? -ne 0 ]; then
    echo "清理失败!"
    exit 1
fi

echo "2. 编译并打包..."
mvn package -DskipTests

if [ $? -ne 0 ]; then
    echo "打包失败!"
    exit 1
fi

echo "3. 检查JAR文件..."
JAR_FILE="target/cat-book-backend-0.0.1-SNAPSHOT.jar"

if [ -f "$JAR_FILE" ]; then
    echo "✅ JAR文件构建成功: $JAR_FILE"
    echo "   文件大小: $(du -h $JAR_FILE | cut -f1)"
    echo ""
    echo "========================================"
    echo "构建完成!"
    echo "========================================"
    echo "使用以下命令启动应用:"
    echo "  ./start.sh"
    echo ""
    echo "或者直接运行JAR:"
    echo "  java -jar $JAR_FILE"
    echo ""
    echo "或者指定生产环境配置:"
    echo "  java -jar $JAR_FILE --spring.profiles.active=prod"
else
    echo "❌ JAR文件未找到"
    exit 1
fi
