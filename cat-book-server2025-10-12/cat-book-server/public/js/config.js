/**
 * 应用程序配置
 */
const AppConfig = {
    // API基础URL
    API_BASE_URL: 'http://localhost:8081/api', // 根据实际后端地址修改
    
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
        STUDENT_INFO: 'studentInfo' // 学生信息本地缓存
    },
    
    // 学生社团配置
    STUDENT_CONFIG: {
        ENABLE_CLASS_CACHE: true, // 启用班级缓存
        MAX_BOOKINGS_PER_STUDENT: 10 // 每个学生最多预约数
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

// 开发模式配置
const DevConfig = {
    USE_MOCK_DATA: false, // 是否使用模拟数据 - 改为false使用真实后端
    ENABLE_CONSOLE_LOG: true, // 是否启用控制台日志
    MOCK_DELAY: 500 // 模拟API延迟 (毫秒)
};

// 导出配置对象
window.AppConfig = AppConfig;
window.DevConfig = DevConfig;
