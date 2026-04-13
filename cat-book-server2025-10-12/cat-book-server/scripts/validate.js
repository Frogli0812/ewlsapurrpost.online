#!/usr/bin/env node

/**
 * 部署前验证脚本
 * 检查构建产物的完整性和正确性
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 开始验证部署包...');

let hasErrors = false;

// 1. 检查必需文件
console.log('📁 检查必需文件...');
checkRequiredFiles();

// 2. 检查配置
console.log('⚙️  检查配置文件...');
checkConfiguration();

// 3. 检查文件完整性
console.log('🔧 检查文件完整性...');
checkFileIntegrity();

// 4. 检查API配置
console.log('🌐 检查API配置...');
checkApiConfiguration();

if (hasErrors) {
    console.log('❌ 验证失败，请修复上述问题后重新构建');
    process.exit(1);
} else {
    console.log('✅ 验证通过，部署包准备就绪！');
}

function checkRequiredFiles() {
    const requiredFiles = [
        'dist/index.html',
        'dist/js/config.js',
        'dist/js/api.js',
        'dist/js/utils.js',
        'dist/js/ui.js',
        'dist/js/main.js',
        'dist/css/main.css',
        'dist/deploy-info.json'
    ];
    
    requiredFiles.forEach(file => {
        if (!fs.existsSync(file)) {
            console.error(`❌ 缺少必需文件: ${file}`);
            hasErrors = true;
        } else {
            console.log(`✅ ${file}`);
        }
    });
}

function checkConfiguration() {
    try {
        const configPath = 'dist/js/config.js';
        if (!fs.existsSync(configPath)) {
            console.error('❌ 配置文件不存在');
            hasErrors = true;
            return;
        }
        
        const configContent = fs.readFileSync(configPath, 'utf8');
        
        // 检查生产环境配置
        if (configContent.includes('USE_MOCK_DATA: true')) {
            console.error('❌ 生产环境不应使用模拟数据');
            hasErrors = true;
        }
        
        if (configContent.includes('localhost')) {
            console.warn('⚠️  配置中包含 localhost，请确认是否正确');
        }
        
        if (configContent.includes('your-domain.com')) {
            console.warn('⚠️  请修改 API_BASE_URL 为实际的生产环境地址');
        }
        
        console.log('✅ 配置文件格式正确');
    } catch (error) {
        console.error('❌ 配置文件检查失败:', error.message);
        hasErrors = true;
    }
}

function checkFileIntegrity() {
    try {
        // 检查HTML文件
        const htmlContent = fs.readFileSync('dist/index.html', 'utf8');
        if (!htmlContent.includes('<title>') || !htmlContent.includes('</body>')) {
            console.error('❌ HTML文件结构不完整');
            hasErrors = true;
        }
        
        // 检查JS文件语法（简单检查）
        const jsFiles = ['config.js', 'api.js', 'utils.js', 'ui.js', 'main.js'];
        jsFiles.forEach(file => {
            const jsContent = fs.readFileSync(`dist/js/${file}`, 'utf8');
            if (jsContent.length === 0) {
                console.error(`❌ JS文件为空: ${file}`);
                hasErrors = true;
            }
        });
        
        // 检查CSS文件
        const cssContent = fs.readFileSync('dist/css/main.css', 'utf8');
        if (cssContent.length === 0) {
            console.error('❌ CSS文件为空');
            hasErrors = true;
        }
        
        console.log('✅ 文件完整性检查通过');
    } catch (error) {
        console.error('❌ 文件完整性检查失败:', error.message);
        hasErrors = true;
    }
}

function checkApiConfiguration() {
    try {
        const deployInfo = JSON.parse(fs.readFileSync('dist/deploy-info.json', 'utf8'));
        
        console.log(`📦 构建版本: ${deployInfo.version}`);
        console.log(`🕐 构建时间: ${deployInfo.buildTime}`);
        console.log(`🏗️  构建环境: ${deployInfo.buildEnv}`);
        
        if (deployInfo.buildEnv !== 'production') {
            console.warn('⚠️  非生产环境构建');
        }
        
        console.log('✅ 部署信息检查完成');
    } catch (error) {
        console.error('❌ 部署信息检查失败:', error.message);
        hasErrors = true;
    }
}