/**
 * 主应用程序入口文件
 * 初始化应用程序和全局事件监听
 */
class CatBookingApp {
    constructor() {
        this.uiManager = null;
        this.init();
    }

    /**
     * 应用程序初始化
     */
    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.onDOMReady();
            });
        } else {
            this.onDOMReady();
        }
    }

    /**
     * DOM准备就绪后执行
     */
    onDOMReady() {
        Utils.logger.log('应用程序开始初始化');
        
        try {
            // 显示请假通知弹窗
            const noticeModal = document.getElementById('notice-modal');
            const noticeClose = document.getElementById('notice-modal-close');
            if (noticeModal && noticeClose) {
                noticeClose.addEventListener('click', () => {
                    noticeModal.style.display = 'none';
                });
            }

            // 初始化UI管理器
            this.uiManager = new UIManager();
            
            // 设置全局错误处理
            this.setupGlobalErrorHandling();
            
            // 检查浏览器兼容性
            this.checkBrowserCompatibility();
            
            Utils.logger.log('应用程序初始化完成');
        } catch (error) {
            Utils.logger.error('应用程序初始化失败', error);
            Utils.showError('应用程序初始化失败，请刷新页面重试');
        }
    }

    /**
     * 设置全局错误处理
     */
    setupGlobalErrorHandling() {
        // 捕获JavaScript运行时错误
        window.addEventListener('error', (event) => {
            Utils.logger.error('JavaScript运行时错误', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });

        // 捕获Promise rejection错误
        window.addEventListener('unhandledrejection', (event) => {
            Utils.logger.error('未处理的Promise rejection', event.reason);
            event.preventDefault(); // 阻止在控制台打印错误
        });
    }

    /**
     * 检查浏览器兼容性
     */
    checkBrowserCompatibility() {
        const requiredFeatures = [
            'fetch',
            'localStorage',
            'JSON',
            'Promise'
        ];

        const missingFeatures = requiredFeatures.filter(feature => {
            return typeof window[feature] === 'undefined';
        });

        if (missingFeatures.length > 0) {
            const message = `您的浏览器不支持以下功能: ${missingFeatures.join(', ')}。请升级浏览器或使用现代浏览器。`;
            Utils.showError(message);
            Utils.logger.error('浏览器兼容性检查失败', missingFeatures);
        }
    }

    /**
     * 获取应用程序状态
     */
    getAppState() {
        return {
            currentPage: this.uiManager?.currentPage || 'home',
            selectedTimeSlot: this.uiManager?.selectedTimeSlot || null,
            isInitialized: !!this.uiManager
        };
    }
}

// 导出主应用类
window.CatBookingApp = CatBookingApp;

// 创建全局应用程序实例
window.catBookingApp = new CatBookingApp();

// 开发模式下的调试工具
if (DevConfig.ENABLE_CONSOLE_LOG) {
    window.debug = {
        app: window.catBookingApp,
        ui: () => window.catBookingApp.uiManager,
        api: window.apiService,
        utils: Utils,
        config: AppConfig,
        devConfig: DevConfig,
        
        // 快速切换页面
        goToPage: (pageId) => {
            if (window.catBookingApp.uiManager) {
                window.catBookingApp.uiManager.navigateToPage(pageId);
            }
        },
        
        // 清空本地存储
        clearStorage: () => {
            Utils.storage.clear();
            console.log('本地存储已清空');
        },
        
        // 生成测试预约数据
        createTestBooking: () => {
            const testBooking = {
                date: Utils.getTodayString(),
                time: '14:00',
                name: '测试用户',
                phone: '13800138000',
                note: '这是一个测试预约'
            };
            
            return window.apiService.createBooking(testBooking);
        }
    };
    
    console.log('🐱 撸猫预约系统已启动');
    console.log('💡 使用 window.debug 访问调试工具');
    console.log('📋 当前配置:', { AppConfig, DevConfig });
}
