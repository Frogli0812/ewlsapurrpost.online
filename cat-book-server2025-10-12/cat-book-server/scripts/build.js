#!/usr/bin/env node

/**
 * 生产环境构建脚本
 * 负责打包、压缩、优化前端资源
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 开始构建生产环境包...');

// 1. 清理目标目录
console.log('📁 清理 dist 目录...');
if (fs.existsSync('dist')) {
    execSync('rm -rf dist', { stdio: 'inherit' });
}
fs.mkdirSync('dist', { recursive: true });

// 2. 创建生产环境配置
console.log('⚙️  生成生产环境配置...');
createProductionConfig();

// 3. 复制和处理文件
console.log('📄 复制和处理文件...');
copyAndProcessFiles();

// 4. 压缩静态资源
console.log('🗜️  压缩静态资源...');
minifyAssets();

// 5. 生成部署信息
console.log('📋 生成部署信息...');
generateDeployInfo();

console.log('✅ 构建完成！部署包位于 dist/ 目录');
console.log('💡 使用 npm run deploy 进行完整部署流程');

function createProductionConfig() {
    // 创建目录
    fs.mkdirSync('dist/js', { recursive: true });
    
    // 创建生产环境的配置文件
    const prodConfig = `/**
 * 生产环境配置
 * 自动生成，请勿手动修改
 */
const AppConfig = {
    // API基础URL - ECS服务器通过Nginx代理
    API_BASE_URL: '/api',
    
    // 撸猫社团营业时间配置
    BUSINESS_HOURS: {
        START_HOUR: 10,
        END_HOUR: 18,
        CLOSED_DAYS: [1], // 0=周日, 1=周一, ... 6=周六 (周一休息)
        TIME_SLOT_DURATION: 30, // 分钟
        MAX_VISITORS_PER_SLOT: 5
    },
    
    // 时间段配置
    TIME_SLOTS: [
        { hour: 10, minute: 0 },
        { hour: 10, minute: 30 },
        { hour: 11, minute: 0 },
        { hour: 11, minute: 30 },
        { hour: 12, minute: 0 },
        { hour: 12, minute: 30 },
        { hour: 14, minute: 0 },
        { hour: 14, minute: 30 },
        { hour: 15, minute: 0 },
        { hour: 15, minute: 30 },
        { hour: 16, minute: 0 },
        { hour: 16, minute: 30 },
        { hour: 17, minute: 0 }
    ],
    
    // 本地存储键名
    STORAGE_KEYS: {
        BOOKINGS: 'catBookings',
        STUDENT_INFO: 'studentInfo'
    },
    
    // 学生社团配置
    STUDENT_CONFIG: {
        ENABLE_CLASS_CACHE: true,
        MAX_BOOKINGS_PER_STUDENT: 10
    },
    
    // 错误消息
    ERROR_MESSAGES: {
        NETWORK_ERROR: '网络连接失败，请检查您的网络连接',
        VALIDATION_ERROR: '请填写完整的预约信息',
        SLOT_FULL: '该时间段已满，请选择其他时间段',
        DATE_INVALID: '请选择有效的日期',
        TIME_INVALID: '请选择时间段',
        BOOKING_FAILED: '预约失败，请稍后重试',
        CANCEL_FAILED: '取消预约失败，请稍后重试'
    },
    
    // 成功消息
    SUCCESS_MESSAGES: {
        BOOKING_SUCCESS: '预约成功！',
        CANCEL_SUCCESS: '预约已取消'
    }
};

// 生产环境配置
const DevConfig = {
    USE_MOCK_DATA: false, // 生产环境使用真实API
    ENABLE_CONSOLE_LOG: false, // 生产环境关闭日志
    MOCK_DELAY: 0
};

// 导出配置对象
window.AppConfig = AppConfig;
window.DevConfig = DevConfig;
`;

    fs.writeFileSync('dist/js/config.js', prodConfig);
}

function copyAndProcessFiles() {
    // 创建目录结构
    ['js', 'css', 'assets'].forEach(dir => {
        fs.mkdirSync(path.join('dist', dir), { recursive: true });
    });
    
    // 复制 HTML 文件并处理
    let indexHtml = fs.readFileSync('public/index.html', 'utf8');
    
    // 添加生产环境的meta标签和优化
    indexHtml = indexHtml.replace(
        '<head>',
        `<head>
    <!-- 生产环境优化 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="robots" content="index, follow">
    <meta name="description" content="WLSA PurrPost 豆花喵语栈 - 专业的撸猫社团预约系统">
    <meta name="keywords" content="撸猫,预约,社团,猫咪,WLSA,PurrPost">
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">`
    );
    
    fs.writeFileSync('dist/index.html', indexHtml);
    
    // 复制 JS 文件（除了config.js，已经生成生产版本）
    const jsFiles = ['api.js', 'utils.js', 'ui.js', 'main.js'];
    jsFiles.forEach(file => {
        fs.copyFileSync(path.join('src/js', file), path.join('dist/js', file));
    });
    
    // 复制 CSS 文件
    fs.copyFileSync('src/css/main.css', 'dist/css/main.css');
}

function minifyAssets() {
    try {
        // 压缩 CSS
        const css = fs.readFileSync('dist/css/main.css', 'utf8');
        const minifiedCss = css
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
            .replace(/\s{2,}/g, ' ') // 压缩多个空白为单个空白
            .replace(/\n\s*/g, '') // 移除换行和前导空白
            .trim();
        fs.writeFileSync('dist/css/main.css', minifiedCss);
        
        // 对于JS文件，我们采用更安全的压缩方式，主要是移除注释和多余空白
        const jsFiles = fs.readdirSync('dist/js');
        jsFiles.forEach(file => {
            if (file.endsWith('.js')) {
                const js = fs.readFileSync(path.join('dist/js', file), 'utf8');
                // 更安全的JS压缩，不破坏字符串和重要语法
                const minifiedJs = js
                    .replace(/\/\*[\s\S]*?\*\//g, '') // 移除块注释
                    // 移除行注释，但保留URL中的 // （只删除空白后的//注释）
                    .replace(/(\s)\/\/[^\r\n]*/g, '$1') // 保留前面的空白，删除后面的注释
                    .replace(/^\s+/gm, '') // 移除行首空白
                    .replace(/\s*\n\s*/g, '\n') // 压缩换行
                    .trim();
                fs.writeFileSync(path.join('dist/js', file), minifiedJs);
            }
        });
        
        console.log('✅ 资源压缩完成（安全模式）');
    } catch (error) {
        console.warn('⚠️  资源压缩失败，跳过压缩步骤:', error.message);
        console.log('💡 生产环境建议使用专业的压缩工具如 terser 或 uglify-js');
    }
}

function generateDeployInfo() {
    const deployInfo = {
        version: require('../package.json').version,
        buildTime: new Date().toISOString(),
        buildEnv: 'production',
        nodeVersion: process.version,
        files: {
            html: ['index.html'],
            js: fs.readdirSync('dist/js').filter(f => f.endsWith('.js')),
            css: fs.readdirSync('dist/css').filter(f => f.endsWith('.css'))
        },
        deployInstructions: {
            nginx: "将 dist/ 目录内容复制到 Nginx 根目录",
            apache: "将 dist/ 目录内容复制到 Apache DocumentRoot",
            cdn: "将 dist/ 目录内容上传到 CDN"
        }
    };
    
    fs.writeFileSync('dist/deploy-info.json', JSON.stringify(deployInfo, null, 2));
    
    // 生成部署脚本
    const deployScript = `#!/bin/bash
# 自动生成的部署脚本

echo "🚀 开始部署 WLSA PurrPost 豆花喵语栈"
echo "版本: ${deployInfo.version}"
echo "构建时间: ${deployInfo.buildTime}"
echo ""

# 检查必需文件
if [ ! -f "index.html" ]; then
    echo "❌ 错误: 找不到 index.html"
    exit 1
fi

if [ ! -d "js" ] || [ ! -d "css" ]; then
    echo "❌ 错误: 找不到 js 或 css 目录"
    exit 1
fi

echo "✅ 所有必需文件检查通过"
echo ""
echo "📋 部署文件列表:"
echo "- HTML: ${deployInfo.files.html.join(', ')}"
echo "- JS: ${deployInfo.files.js.join(', ')}"
echo "- CSS: ${deployInfo.files.css.join(', ')}"
echo ""
echo "💡 请根据您的服务器环境执行以下步骤:"
echo "1. 将当前目录所有文件复制到 Web 服务器根目录"
echo "2. 配置 API_BASE_URL 指向您的后端服务"
echo "3. 确保服务器支持 SPA 路由 (可选)"
echo ""
echo "✅ 部署准备完成！"
`;
    
    fs.writeFileSync('dist/deploy.sh', deployScript);
    fs.chmodSync('dist/deploy.sh', '755');
}