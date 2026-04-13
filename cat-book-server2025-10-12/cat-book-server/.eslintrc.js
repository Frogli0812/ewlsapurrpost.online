module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'script'
    },
    globals: {
        // 前端全局变量
        AppConfig: 'readonly',
        DevConfig: 'readonly',
        apiService: 'readonly',
        Utils: 'readonly',
        UIManager: 'readonly',
        Models: 'readonly',
        catBookingApp: 'readonly',
        
        // 浏览器全局变量
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        fetch: 'readonly',
        Promise: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        Date: 'readonly',
        JSON: 'readonly',
        Math: 'readonly',
        parseInt: 'readonly',
        parseFloat: 'readonly',
        Object: 'readonly',
        Array: 'readonly'
    },
    rules: {
        // 代码质量规则
        'no-unused-vars': ['warn', { 
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_' 
        }],
        'no-console': 'off', // 允许 console，前端调试需要
        'no-debugger': 'warn',
        'no-alert': 'warn',
        'no-var': 'error', // 禁用 var，使用 let/const
        'prefer-const': 'warn',
        'no-undef': 'error',
        'no-undefined': 'off',
        
        // 代码风格规则
        'indent': ['error', 4], // 4空格缩进
        'quotes': ['warn', 'single', { allowTemplateLiterals: true }],
        'semi': ['error', 'always'],
        'comma-dangle': ['warn', 'never'],
        'no-trailing-spaces': 'warn',
        'eol-last': 'warn',
        
        // 最佳实践
        'eqeqeq': ['error', 'always'],
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',
        'no-script-url': 'error',
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-throw-literal': 'error',
        'no-useless-concat': 'warn',
        'no-void': 'error',
        'radix': 'warn',
        'wrap-iife': 'error',
        
        // 变量相关
        'no-delete-var': 'error',
        'no-label-var': 'error',
        'no-shadow': 'warn',
        'no-shadow-restricted-names': 'error',
        'no-undef-init': 'warn',
        'no-use-before-define': ['error', { functions: false }],
        
        // 代码复杂度
        'complexity': ['warn', 10],
        'max-depth': ['warn', 4],
        'max-len': ['warn', { 
            code: 120, 
            ignoreUrls: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true 
        }],
        'max-params': ['warn', 5],
        
        // ES6+ 相关
        'arrow-spacing': 'warn',
        'no-duplicate-imports': 'error',
        'no-useless-constructor': 'warn',
        'object-shorthand': 'warn',
        'prefer-arrow-callback': 'warn',
        'prefer-template': 'warn',
        
        // 安全相关
        'no-new-wrappers': 'error',
        'no-proto': 'error'
    },
    overrides: [
        {
            // Node.js 脚本特殊配置
            files: ['scripts/**/*.js'],
            env: {
                node: true,
                browser: false
            },
            globals: {
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                process: 'readonly'
            },
            rules: {
                'no-console': 'off' // 构建脚本允许 console
            }
        },
        {
            // API 模型文件特殊配置
            files: ['src/api/**/*.js'],
            globals: {
                module: 'readonly',
                exports: 'readonly'
            }
        }
    ]
};
