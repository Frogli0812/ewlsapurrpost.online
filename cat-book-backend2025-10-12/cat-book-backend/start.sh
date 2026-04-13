#!/bin/bash

# 撸猫社团预约系统启动脚本
# Cat Book Backend Startup Script

APP_NAME="cat-book-backend"
JAR_FILE="target/cat-book-backend-0.0.1-SNAPSHOT.jar"
PID_FILE="$APP_NAME.pid"
LOG_FILE="logs/application.log"

# 创建日志目录
mkdir -p logs

# 检查JAR文件是否存在
if [ ! -f "$JAR_FILE" ]; then
    echo "错误: JAR文件 $JAR_FILE 不存在"
    echo "请先运行: mvn clean package"
    exit 1
fi

# 检查是否已经运行
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
        echo "应用已经在运行中 (PID: $PID)"
        exit 1
    else
        echo "删除过期的PID文件"
        rm -f "$PID_FILE"
    fi
fi

# 设置JVM参数
JVM_OPTS="-Xms512m -Xmx1024m"
JVM_OPTS="$JVM_OPTS -Dfile.encoding=UTF-8"
JVM_OPTS="$JVM_OPTS -Duser.timezone=Asia/Shanghai"

# 设置应用参数
APP_OPTS="--spring.profiles.active=prod"

# 启动应用
echo "启动 $APP_NAME..."
nohup java $JVM_OPTS -jar "$JAR_FILE" $APP_OPTS > "$LOG_FILE" 2>&1 &

# 保存PID
echo $! > "$PID_FILE"

echo "应用启动成功!"
echo "PID: $(cat $PID_FILE)"
echo "日志文件: $LOG_FILE"
echo "使用以下命令查看日志: tail -f $LOG_FILE"
echo "使用以下命令停止应用: ./stop.sh"
