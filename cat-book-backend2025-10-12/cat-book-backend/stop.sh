#!/bin/bash

# 撸猫社团预约系统停止脚本
# Cat Book Backend Stop Script

APP_NAME="cat-book-backend"
PID_FILE="$APP_NAME.pid"

if [ ! -f "$PID_FILE" ]; then
    echo "PID文件不存在，应用可能没有运行"
    exit 1
fi

PID=$(cat "$PID_FILE")

if ! ps -p $PID > /dev/null 2>&1; then
    echo "进程 $PID 不存在，删除PID文件"
    rm -f "$PID_FILE"
    exit 1
fi

echo "停止 $APP_NAME (PID: $PID)..."

# 优雅停止
kill $PID

# 等待最多30秒
for i in {1..30}; do
    if ! ps -p $PID > /dev/null 2>&1; then
        echo "应用已成功停止"
        rm -f "$PID_FILE"
        exit 0
    fi
    sleep 1
done

# 强制停止
echo "优雅停止失败，强制停止..."
kill -9 $PID

if ! ps -p $PID > /dev/null 2>&1; then
    echo "应用已强制停止"
    rm -f "$PID_FILE"
else
    echo "停止失败"
    exit 1
fi
