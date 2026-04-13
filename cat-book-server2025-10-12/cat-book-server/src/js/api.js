/**
 * API接口模块
 * 处理所有与后端的数据交互
 */
class ApiService {
    constructor() {
        this.baseURL = AppConfig.API_BASE_URL;
        this.useMockData = DevConfig.USE_MOCK_DATA;
    }

    /**
     * 通用HTTP请求方法
     */
    async request(endpoint, options = {}) {
        if (this.useMockData) {
            return this.mockRequest(endpoint, options);
        }

        // 处理查询参数
        let url = `${this.baseURL}${endpoint}`;
        if (options.params) {
            const queryString = new URLSearchParams(options.params).toString();
            url += `?${queryString}`;
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            method: options.method || 'GET',
            ...options
        };

        // 移除params，避免传递给fetch
        delete config.params;

        // 如果有body数据，转换为JSON
        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            // 处理后端标准响应格式
            if (!response.ok || !data.success) {
                return { 
                    success: false, 
                    error: data.message || data.error || `HTTP error! status: ${response.status}`,
                    message: data.message,
                    errors: data.errors || []
                };
            }
            
            return { 
                success: true, 
                data: data.data, 
                message: data.message,
                timestamp: data.timestamp 
            };
        } catch (error) {
            console.error('API请求失败:', error);
            return { 
                success: false, 
                error: error.message || AppConfig.ERROR_MESSAGES.NETWORK_ERROR,
                message: error.message
            };
        }
    }

    /**
     * 模拟API请求 (开发模式)
     */
    async mockRequest(endpoint, options = {}) {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, DevConfig.MOCK_DELAY));

        const method = options.method || 'GET';
        
        try {
            switch (endpoint) {
                case '/cats':
                    return this.mockGetCats();
                case '/bookings':
                    if (method === 'GET') return this.mockGetBookings();
                    if (method === 'POST') return this.mockCreateBooking(options.body);
                    break;
                case '/available-slots':
                    return this.mockGetAvailableSlots(options.params);
                case '/statistics':
                    return this.mockGetStats();
                case '/available-slots/detail':
                    return this.mockGetTimeSlotDetail(options.params);
                case '/bookings/by-student':
                    return this.mockGetBookingsByStudent(options.params);
                case '/bookings/by-class':
                    return this.mockGetBookingsByClass(options.params);
                default:
                    if (endpoint.startsWith('/bookings/') && method === 'DELETE') {
                        const bookingId = endpoint.split('/')[2];
                        return this.mockCancelBooking(bookingId);
                    }
                    if (endpoint.startsWith('/bookings/by-phone')) {
                        return this.mockGetBookingsByPhone(options.params || {});
                    }
                    break;
            }
            
            throw new Error('未知的API端点');
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * 模拟数据方法
     */
    mockGetCats() {
        const cats = [
            {
                id: 1,
                name: '小花',
                breed: '布偶猫',
                description: '猫舍最资深的员工，心理咨询室的交际花（不过暑假过后已经胖成煤气罐了）',
                traits: '[{"name":"颜值","stars":5},{"name":"体重","stars":13}]',
                imageUrl: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&h=400&fit=crop',
                isActive: true
            },
            {
                id: 2,
                name: '豆豆',
                breed: '西伯利亚森林猫',
                description: '猫舍神秘嘉宾，很少露面（据说摸过豆豆的人都发大财了）',
                traits: '[{"name":"颜值","stars":5},{"name":"神秘指数","stars":4}]',
                imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
                isActive: true
            },
            {
                id: 3,
                name: '小wlsa',
                breed: '奶牛猫',
                description: '如今已经焕然一新的流浪猫，但是攻击性略强（畏）',
                traits: '[{"name":"颜值","stars":3},{"name":"攻击性","stars":4}]',
                imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
                isActive: true
            },
            {
                id: 4,
                name: '肉松',
                breed: '橘猫',
                description: '最新成员，胆子大，极其亲人，喜欢探索自己的"领地"',
                traits: '[{"name":"颜值","stars":4},{"name":"外向","stars":5}]',
                imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
                isActive: true
            }
        ];
        
        return { success: true, data: cats };
    }

    mockGetBookings() {
        const bookings = JSON.parse(localStorage.getItem(AppConfig.STORAGE_KEYS.BOOKINGS)) || [];
        return { success: true, data: bookings };
    }

    mockCreateBooking(bodyData) {
        // 处理不同格式的输入数据
        const bookingData = typeof bodyData === 'string' ? JSON.parse(bodyData) : bodyData;
        
        // 验证必填字段
        if (!bookingData.date || !bookingData.time || !bookingData.studentName || !bookingData.studentClass) {
            return { success: false, error: '缺少必填字段：日期、时间、学生姓名或班级' };
        }
        
        // 检查位置是否已被预约
        const existingBookings = JSON.parse(localStorage.getItem(AppConfig.STORAGE_KEYS.BOOKINGS)) || [];
        const conflictBooking = existingBookings.find(b => 
            b.date === bookingData.date && 
            b.time === bookingData.time && 
            b.position === bookingData.position &&
            b.status === 'CONFIRMED'
        );
        
        if (conflictBooking) {
            return { success: false, error: '该位置已被预约，请选择其他位置' };
        }
        
        const booking = {
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            date: bookingData.date,
            time: bookingData.time,
            studentName: bookingData.studentName,
            studentClass: bookingData.studentClass,
            position: bookingData.position || 1,
            note: bookingData.note || '',
            status: 'CONFIRMED',
            cancelledAt: null,
            cancelReason: null,
            studentIdentity: `${bookingData.studentClass} - ${bookingData.studentName}`,
            timeSlotDescription: this.generateTimeSlotDescription(bookingData.time)
        };
        
        // 保存到本地存储
        existingBookings.push(booking);
        localStorage.setItem(AppConfig.STORAGE_KEYS.BOOKINGS, JSON.stringify(existingBookings));
        
        Utils.logger.log('新预约已创建:', booking);
        return { success: true, data: booking, message: '预约成功' };
    }

    generateTimeSlotDescription(time) {
        if (!time) return '';
        const [hour, minute] = time.split(':').map(Number);
        const endHour = minute === 30 ? hour + 1 : hour;
        const endMinute = minute === 30 ? 0 : 30;
        return `${time}-${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
    }

    mockCancelBooking(bookingId) {
        const bookings = JSON.parse(localStorage.getItem(AppConfig.STORAGE_KEYS.BOOKINGS)) || [];
        const bookingIdNum = parseInt(bookingId, 10);
        
        // 查找要取消的预约
        const bookingIndex = bookings.findIndex(booking => booking.id === bookingIdNum);
        
        if (bookingIndex === -1) {
            return { success: false, error: '预约不存在或已被取消' };
        }
        
        // 删除预约
        const removedBooking = bookings.splice(bookingIndex, 1)[0];
        localStorage.setItem(AppConfig.STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
        
        Utils.logger.log('预约已取消:', removedBooking);
        return { success: true, data: { message: '预约已取消', booking: removedBooking } };
    }

    mockGetAvailableSlots(params) {
        const selectedDate = params?.date;
        if (!selectedDate) {
            return { success: false, error: '日期参数必填' };
        }

        const bookings = JSON.parse(localStorage.getItem(AppConfig.STORAGE_KEYS.BOOKINGS)) || [];
        
        // 筛选出指定日期的确认预约
        const dateBookings = bookings.filter(booking => 
            booking.date === selectedDate && booking.status === 'CONFIRMED'
        );
        
        // 生成时间段数据（基于后端API格式）
        const slots = AppConfig.TIME_SLOTS.map(slot => {
            const timeString = `${String(slot.hour).padStart(2, '0')}:${String(slot.minute).padStart(2, '0')}`;
            const slotBookings = dateBookings.filter(booking => booking.time === timeString);
            const bookedCount = slotBookings.length;
            const totalCapacity = AppConfig.BUSINESS_HOURS.MAX_VISITORS_PER_SLOT;
            const availableCapacity = totalCapacity - bookedCount;
            
            return {
                time: timeString,
                date: selectedDate,
                totalCapacity: totalCapacity,
                bookedCount: bookedCount,
                availableCapacity: availableCapacity,
                isAvailable: availableCapacity > 0,
                isFull: availableCapacity === 0,
                notes: '',
                timeSlotDescription: this.generateTimeSlotDescription(timeString)
            };
        });
        
        return { success: true, data: slots };
    }

    mockGetStats() {
        const bookings = JSON.parse(localStorage.getItem(AppConfig.STORAGE_KEYS.BOOKINGS)) || [];
        
        return { 
            success: true, 
            data: {
                totalCats: 3,
                totalBookings: bookings.length,
                totalVisitors: bookings.length,
                activeBookings: bookings.filter(b => b.status === 'confirmed').length,
                completedBookings: bookings.filter(b => b.status === 'completed').length,
                cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
                cancellationRate: bookings.length > 0 ? 
                    ((bookings.filter(b => b.status === 'cancelled').length / bookings.length) * 100).toFixed(2) : '0.00',
                completionRate: bookings.length > 0 ? 
                    ((bookings.filter(b => b.status === 'completed').length / bookings.length) * 100).toFixed(2) : '0.00',
                averageRating: 4.8,
                monthlyBookings: [],
                popularTimeSlots: [],
                generatedAt: new Date().toISOString()
            }
        };
    }

    mockUserLogin(bodyData) {
        const loginData = JSON.parse(bodyData);
        const { phone, name } = loginData;
        
        // 简单验证
        if (!phone || !name) {
            return { success: false, error: '手机号和姓名不能为空' };
        }
        
        if (!Utils.validatePhone(phone)) {
            return { success: false, error: '手机号格式不正确' };
        }
        
        if (!Utils.validateName(name)) {
            return { success: false, error: '姓名格式不正确' };
        }
        
        // 模拟会话信息
        const sessionData = {
            phone,
            name,
            loginTime: new Date().toISOString(),
            expiresAt: new Date(Date.now() + AppConfig.AUTH.SESSION_DURATION).toISOString()
        };
        
        // 保存会话信息
        Utils.storage.set(AppConfig.STORAGE_KEYS.USER_SESSION, sessionData);
        Utils.storage.set(AppConfig.STORAGE_KEYS.USER_INFO, { phone, name });
        
        return { 
            success: true, 
            data: { 
                message: '登录成功',
                session: sessionData
            }
        };
    }

    mockVerifySession() {
        const session = Utils.storage.get(AppConfig.STORAGE_KEYS.USER_SESSION);
        
        if (!session) {
            return { success: false, error: '未登录' };
        }
        
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);
        
        if (now > expiresAt) {
            Utils.storage.remove(AppConfig.STORAGE_KEYS.USER_SESSION);
            Utils.storage.remove(AppConfig.STORAGE_KEYS.USER_INFO);
            return { success: false, error: '会话已过期' };
        }
        
        return { success: true, data: { valid: true, session } };
    }

    mockGetMyBookings() {
        const userInfo = Utils.storage.get(AppConfig.STORAGE_KEYS.USER_INFO);
        
        if (!userInfo) {
            return { success: false, error: '未登录' };
        }
        
        const allBookings = JSON.parse(localStorage.getItem(AppConfig.STORAGE_KEYS.BOOKINGS)) || [];
        const myBookings = allBookings.filter(booking => 
            booking.phone === userInfo.phone && booking.name === userInfo.name
        );
        
        return { success: true, data: myBookings };
    }

    mockGetBookingsByPhone(params) {
        const phone = params.phone;
        
        if (!phone) {
            return { success: false, error: '手机号参数必填' };
        }
        
        const allBookings = JSON.parse(localStorage.getItem(AppConfig.STORAGE_KEYS.BOOKINGS)) || [];
        const phoneBookings = allBookings.filter(booking => booking.phone === phone);
        
        return { success: true, data: phoneBookings };
    }

    mockUserLogout() {
        Utils.storage.remove(AppConfig.STORAGE_KEYS.USER_SESSION);
        Utils.storage.remove(AppConfig.STORAGE_KEYS.USER_INFO);
        
        return { success: true, data: { message: '登出成功' } };
    }

    // 新增：获取时间段详情（5个位置的详细信息）
    mockGetTimeSlotDetail(params) {
        const { date, time } = params || {};
        
        if (!date || !time) {
            return { success: false, error: '日期和时间参数必填' };
        }

        const bookings = JSON.parse(localStorage.getItem(AppConfig.STORAGE_KEYS.BOOKINGS)) || [];
        const slotBookings = bookings.filter(booking => 
            booking.date === date && 
            booking.time === time && 
            booking.status === 'CONFIRMED'
        );

        // 创建5个位置的详细信息
        const totalPositions = 5;
        const positions = [];
        
        for (let i = 1; i <= totalPositions; i++) {
            const booking = slotBookings.find(b => b.position === i);
            
            if (booking) {
                positions.push({
                    position: i,
                    isBooked: true,
                    studentName: booking.studentName,
                    studentClass: booking.studentClass,
                    studentIdentity: booking.studentIdentity,
                    bookingId: booking.id,
                    note: booking.note || ''
                });
            } else {
                positions.push({
                    position: i,
                    isBooked: false,
                    studentName: '',
                    studentClass: '',
                    studentIdentity: '',
                    bookingId: null,
                    note: ''
                });
            }
        }

        const data = {
            date: date,
            time: time,
            timeSlotDescription: this.generateTimeSlotDescription(time),
            totalPositions: totalPositions,
            bookedPositions: slotBookings.length,
            availablePositions: totalPositions - slotBookings.length,
            isFull: slotBookings.length >= totalPositions,
            positions: positions
        };

        return { success: true, data: data };
    }

    // 新增：根据学生信息查询预约
    mockGetBookingsByStudent(params) {
        const { studentClass, studentName } = params || {};
        
        if (!studentClass || !studentName) {
            return { success: false, error: '班级和姓名参数必填' };
        }

        const allBookings = JSON.parse(localStorage.getItem(AppConfig.STORAGE_KEYS.BOOKINGS)) || [];
        const studentBookings = allBookings.filter(booking => 
            booking.studentClass === studentClass && 
            booking.studentName === studentName
        );

        return { success: true, data: studentBookings };
    }

    // 新增：根据班级查询预约
    mockGetBookingsByClass(params) {
        const { studentClass } = params || {};
        
        if (!studentClass) {
            return { success: false, error: '班级参数必填' };
        }

        const allBookings = JSON.parse(localStorage.getItem(AppConfig.STORAGE_KEYS.BOOKINGS)) || [];
        const classBookings = allBookings.filter(booking => 
            booking.studentClass === studentClass
        );

        return { success: true, data: classBookings };
    }

    /**
     * 实际API方法 (与后端对接时使用)
     */
    
    // 获取所有猫咪信息
    async getCats() {
        return this.request('/cats');
    }

    // 获取用户的预约列表（兼容旧接口）
    async getBookings(userId = null) {
        const endpoint = userId ? `/bookings?userId=${userId}` : '/bookings';
        return this.request(endpoint);
    }

    // 根据手机号查询预约（兼容接口）
    async getBookingsByPhone(phone) {
        return this.request(`/bookings/by-phone?phone=${phone}`);
    }

    // 创建新预约
    async createBooking(bookingData) {
        return this.request('/bookings', {
            method: 'POST',
            body: bookingData
        });
    }

    // 取消预约
    async cancelBooking(bookingId) {
        return this.request(`/bookings/${bookingId}`, {
            method: 'DELETE'
        });
    }

    // 获取指定日期的可用时间段
    async getAvailableSlots(date) {
        return this.request('/available-slots', {
            params: { date }
        });
    }

    // 获取统计数据
    async getStats() {
        return this.request('/statistics');
    }

    /**
     * 学生社团专用API
     */

    // 获取时间段详情（显示5个位置的预约情况）
    async getTimeSlotDetail(date, time) {
        return this.request('/available-slots/detail', {
            params: { date, time }
        });
    }

    // 根据学生信息查询预约
    async getBookingsByStudent(studentClass, studentName) {
        return this.request('/bookings/by-student', {
            params: { studentClass, studentName }
        });
    }

    // 根据班级查询预约  
    async getBookingsByClass(studentClass) {
        return this.request('/bookings/by-class', {
            params: { studentClass }
        });
    }
}

// 导出API服务类
window.ApiService = ApiService;

// 创建全局API服务实例
window.apiService = new ApiService();
