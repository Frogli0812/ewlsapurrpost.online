/**
 * 工具函数模块
 * 提供通用的辅助功能
 */
class Utils {
    /**
     * 格式化日期
     * @param {Date|string} date 日期对象或字符串
     * @param {string} format 格式化模式
     * @returns {string} 格式化后的日期字符串
     */
    static formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        
        const formatMap = {
            'YYYY': year,
            'MM': month,
            'DD': day,
            'YYYY-MM-DD': `${year}-${month}-${day}`,
            'MM-DD': `${month}-${day}`,
            'MM/DD': `${month}/${day}`
        };
        
        return formatMap[format] || `${year}-${month}-${day}`;
    }

    /**
     * 格式化时间段显示
     * @param {string} startTime 开始时间 (HH:mm)
     * @returns {string} 格式化的时间段
     */
    static formatTimeSlot(startTime) {
        const [hour, minute] = startTime.split(':').map(Number);
        let endHour = hour;
        let endMinute = minute + 30;
        
        if (endMinute >= 60) {
            endHour += 1;
            endMinute = 0;
        }
        
        const formatTime = (h, m) => `${h}:${m.toString().padStart(2, '0')}`;
        
        return `${formatTime(hour, minute)}-${formatTime(endHour, endMinute)}`;
    }

    /**
     * 验证手机号码
     * @param {string} phone 手机号码
     * @returns {boolean} 验证结果
     */
    static validatePhone(phone) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phone);
    }

    /**
     * 验证姓名
     * @param {string} name 姓名
     * @returns {boolean} 验证结果
     */
    static validateName(name) {
        return name && name.trim().length >= 2 && name.trim().length <= 20;
    }

    /**
     * 验证日期是否为今天或未来日期
     * @param {string} dateString 日期字符串 (YYYY-MM-DD)
     * @returns {boolean} 验证结果
     */
    static validateFutureDate(dateString) {
        const selectedDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return selectedDate >= today;
    }

    /**
     * 检查日期是否为营业日
     * @param {string} dateString 日期字符串 (YYYY-MM-DD)
     * @returns {boolean} 是否为营业日
     */
    static isBusinessDay(dateString) {
        const date = new Date(dateString);
        const dayOfWeek = date.getDay();
        
        return !AppConfig.BUSINESS_HOURS.CLOSED_DAYS.includes(dayOfWeek);
    }

    /**
     * 获取今天的日期字符串
     * @returns {string} 今天的日期 (YYYY-MM-DD)
     */
    static getTodayString() {
        return this.formatDate(new Date());
    }

    /**
     * 显示成功消息
     * @param {string} message 消息内容
     */
    static showSuccess(message) {
        this.showNotification(message, 'success');
    }

    /**
     * 显示错误消息
     * @param {string} message 消息内容
     */
    static showError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * 显示通知消息
     * @param {string} message 消息内容
     * @param {string} type 消息类型 (success|error|warning|info)
     */
    static showNotification(message, type = 'info') {
        // 简单的alert实现，可以后续改为更美观的通知组件
        if (type === 'error') {
            alert(`❌ ${message}`);
        } else if (type === 'success') {
            alert(`✅ ${message}`);
        } else {
            alert(message);
        }
    }

    /**
     * 确认对话框
     * @param {string} message 确认消息
     * @returns {boolean} 用户确认结果
     */
    static confirm(message) {
        return confirm(message);
    }

    /**
     * 防抖函数
     * @param {Function} func 要防抖的函数
     * @param {number} delay 延迟时间(毫秒)
     * @returns {Function} 防抖后的函数
     */
    static debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * 深拷贝对象
     * @param {any} obj 要拷贝的对象
     * @returns {any} 拷贝后的对象
     */
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        
        if (Array.isArray(obj)) {
            return obj.map(item => this.deepClone(item));
        }
        
        const cloned = {};
        Object.keys(obj).forEach(key => {
            cloned[key] = this.deepClone(obj[key]);
        });
        
        return cloned;
    }

    /**
     * 生成唯一ID
     * @returns {string} 唯一ID
     */
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * 本地存储操作
     */
    static storage = {
        /**
         * 保存数据到本地存储
         * @param {string} key 存储键
         * @param {any} data 要存储的数据
         */
        set(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
            } catch (error) {
                console.error('保存到本地存储失败:', error);
            }
        },

        /**
         * 从本地存储获取数据
         * @param {string} key 存储键
         * @param {any} defaultValue 默认值
         * @returns {any} 存储的数据
         */
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('从本地存储读取失败:', error);
                return defaultValue;
            }
        },

        /**
         * 删除本地存储中的数据
         * @param {string} key 存储键
         */
        remove(key) {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.error('删除本地存储失败:', error);
            }
        },

        /**
         * 清空所有本地存储
         */
        clear() {
            try {
                localStorage.clear();
            } catch (error) {
                console.error('清空本地存储失败:', error);
            }
        }
    };

    /**
     * 日志记录
     */
    static logger = {
        log(message, data = null) {
            if (DevConfig.ENABLE_CONSOLE_LOG) {
                console.log(`[CatBooking] ${message}`, data || '');
            }
        },

        error(message, error = null) {
            if (DevConfig.ENABLE_CONSOLE_LOG) {
                console.error(`[CatBooking Error] ${message}`, error || '');
            }
        },

        warn(message, data = null) {
            if (DevConfig.ENABLE_CONSOLE_LOG) {
                console.warn(`[CatBooking Warning] ${message}`, data || '');
            }
        }
    };
}

// 导出到全局
window.Utils = Utils;
