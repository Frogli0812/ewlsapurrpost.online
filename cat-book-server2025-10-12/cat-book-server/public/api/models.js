/**
 * 数据模型定义
 * 定义系统中使用的所有数据结构
 */

/**
 * 猫咪信息模型
 */
class Cat {
    constructor(data) {
        this.id = data.id || null;                    // 猫咪唯一标识
        this.name = data.name || '';                  // 猫咪名字
        this.breed = data.breed || '';               // 品种
        this.age = data.age || 0;                    // 年龄(岁)
        this.personality = data.personality || '';    // 性格描述
        this.favoriteToy = data.favoriteToy || '';   // 最喜欢的玩具
        this.imageUrl = data.imageUrl || null;       // 照片URL
        this.isActive = data.isActive !== false;     // 是否活跃(可预约)
        this.healthStatus = data.healthStatus || 'healthy'; // 健康状态
        this.specialNotes = data.specialNotes || '';  // 特殊说明
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    /**
     * 验证猫咪数据
     */
    validate() {
        const errors = [];
        
        if (!this.name || this.name.trim().length === 0) {
            errors.push('猫咪名字不能为空');
        }
        
        if (!this.breed || this.breed.trim().length === 0) {
            errors.push('品种不能为空');
        }
        
        if (this.age < 0 || this.age > 30) {
            errors.push('年龄必须在0-30岁之间');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * 转换为API响应格式
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            breed: this.breed,
            age: this.age,
            personality: this.personality,
            favoriteToy: this.favoriteToy,
            imageUrl: this.imageUrl,
            isActive: this.isActive,
            healthStatus: this.healthStatus,
            specialNotes: this.specialNotes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

/**
 * 预约信息模型
 */
class Booking {
    constructor(data) {
        this.id = data.id || null;                    // 预约唯一标识
        this.date = data.date || '';                  // 预约日期 (YYYY-MM-DD)
        this.time = data.time || '';                  // 预约时间 (HH:mm)
        this.name = data.name || '';                  // 预约人姓名
        this.phone = data.phone || '';                // 联系电话
        this.note = data.note || '';                  // 备注信息
        this.status = data.status || 'confirmed';     // 预约状态
        this.numberOfPeople = data.numberOfPeople || 1; // 预约人数
        this.email = data.email || '';                // 邮箱(可选)
        this.emergencyContact = data.emergencyContact || ''; // 紧急联系人(可选)
        this.isFirstTime = data.isFirstTime !== false; // 是否首次预约
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
        this.cancelledAt = data.cancelledAt || null;   // 取消时间
        this.cancelReason = data.cancelReason || '';   // 取消原因
    }

    /**
     * 预约状态枚举
     */
    static STATUS = {
        CONFIRMED: 'confirmed',    // 已确认
        CANCELLED: 'cancelled',    // 已取消
        COMPLETED: 'completed',    // 已完成
        NO_SHOW: 'no_show'        // 未到场
    };

    /**
     * 验证预约数据
     */
    validate() {
        const errors = [];
        
        // 验证日期
        if (!this.date) {
            errors.push('预约日期不能为空');
        } else {
            const bookingDate = new Date(this.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (bookingDate < today) {
                errors.push('预约日期不能是过去的日期');
            }
        }
        
        // 验证时间
        if (!this.time) {
            errors.push('预约时间不能为空');
        } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(this.time)) {
            errors.push('预约时间格式无效');
        }
        
        // 验证姓名
        if (!this.name || this.name.trim().length < 2) {
            errors.push('姓名至少需要2个字符');
        } else if (this.name.trim().length > 20) {
            errors.push('姓名不能超过20个字符');
        }
        
        // 验证手机号
        if (!this.phone) {
            errors.push('联系电话不能为空');
        } else if (!/^1[3-9]\d{9}$/.test(this.phone)) {
            errors.push('手机号格式无效');
        }
        
        // 验证预约人数
        if (this.numberOfPeople < 1 || this.numberOfPeople > 5) {
            errors.push('预约人数必须在1-5人之间');
        }
        
        // 验证状态
        if (!Object.values(Booking.STATUS).includes(this.status)) {
            errors.push('预约状态无效');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * 获取完整的时间段描述
     */
    getTimeSlotDescription() {
        if (!this.time) return '';
        
        const [hour, minute] = this.time.split(':').map(Number);
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
     * 检查是否可以取消
     */
    canCancel() {
        if (this.status !== Booking.STATUS.CONFIRMED) {
            return false;
        }
        
        // 检查是否在预约时间前至少1小时
        const bookingDateTime = new Date(`${this.date}T${this.time}:00`);
        const now = new Date();
        const timeDiff = bookingDateTime.getTime() - now.getTime();
        
        return timeDiff > 60 * 60 * 1000; // 1小时 = 60 * 60 * 1000 毫秒
    }

    /**
     * 转换为API响应格式
     */
    toJSON() {
        return {
            id: this.id,
            date: this.date,
            time: this.time,
            name: this.name,
            phone: this.phone,
            note: this.note,
            status: this.status,
            numberOfPeople: this.numberOfPeople,
            email: this.email,
            emergencyContact: this.emergencyContact,
            isFirstTime: this.isFirstTime,
            timeSlotDescription: this.getTimeSlotDescription(),
            canCancel: this.canCancel(),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            cancelledAt: this.cancelledAt,
            cancelReason: this.cancelReason
        };
    }
}

/**
 * 时间段可用性模型
 */
class TimeSlot {
    constructor(data) {
        this.time = data.time || '';                  // 时间 (HH:mm)
        this.date = data.date || '';                  // 日期 (YYYY-MM-DD)
        this.totalCapacity = data.totalCapacity || AppConfig.BUSINESS_HOURS.MAX_VISITORS_PER_SLOT;
        this.bookedCount = data.bookedCount || 0;     // 已预约人数
        this.isAvailable = data.isAvailable !== false; // 是否可预约
        this.notes = data.notes || '';                // 特殊说明
    }

    /**
     * 获取剩余容量
     */
    get availableCapacity() {
        return Math.max(0, this.totalCapacity - this.bookedCount);
    }

    /**
     * 检查是否已满
     */
    get isFull() {
        return this.bookedCount >= this.totalCapacity;
    }

    /**
     * 获取时间段描述
     */
    getTimeSlotDescription() {
        const [hour, minute] = this.time.split(':').map(Number);
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
     * 转换为API响应格式
     */
    toJSON() {
        return {
            time: this.time,
            date: this.date,
            timeSlotDescription: this.getTimeSlotDescription(),
            totalCapacity: this.totalCapacity,
            bookedCount: this.bookedCount,
            availableCapacity: this.availableCapacity,
            isAvailable: this.isAvailable && !this.isFull,
            isFull: this.isFull,
            notes: this.notes
        };
    }
}

/**
 * 统计数据模型
 */
class Statistics {
    constructor(data) {
        this.totalCats = data.totalCats || 0;         // 猫咪总数
        this.totalBookings = data.totalBookings || 0; // 总预约数
        this.totalVisitors = data.totalVisitors || 0; // 总访客数
        this.activeBookings = data.activeBookings || 0; // 活跃预约数
        this.completedBookings = data.completedBookings || 0; // 已完成预约数
        this.cancelledBookings = data.cancelledBookings || 0; // 已取消预约数
        this.averageRating = data.averageRating || 0;  // 平均评分
        this.monthlyBookings = data.monthlyBookings || []; // 月度预约统计
        this.popularTimeSlots = data.popularTimeSlots || []; // 热门时间段
        this.generatedAt = data.generatedAt || new Date().toISOString();
    }

    /**
     * 计算取消率
     */
    get cancellationRate() {
        if (this.totalBookings === 0) return 0;
        return (this.cancelledBookings / this.totalBookings * 100).toFixed(2);
    }

    /**
     * 计算完成率
     */
    get completionRate() {
        if (this.totalBookings === 0) return 0;
        return (this.completedBookings / this.totalBookings * 100).toFixed(2);
    }

    /**
     * 转换为API响应格式
     */
    toJSON() {
        return {
            totalCats: this.totalCats,
            totalBookings: this.totalBookings,
            totalVisitors: this.totalVisitors,
            activeBookings: this.activeBookings,
            completedBookings: this.completedBookings,
            cancelledBookings: this.cancelledBookings,
            cancellationRate: this.cancellationRate,
            completionRate: this.completionRate,
            averageRating: this.averageRating,
            monthlyBookings: this.monthlyBookings,
            popularTimeSlots: this.popularTimeSlots,
            generatedAt: this.generatedAt
        };
    }
}

/**
 * API响应模型
 */
class ApiResponse {
    constructor(success = true, data = null, message = '', errors = []) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.errors = errors;
        this.timestamp = new Date().toISOString();
    }

    /**
     * 创建成功响应
     */
    static success(data, message = '') {
        return new ApiResponse(true, data, message);
    }

    /**
     * 创建错误响应
     */
    static error(message, errors = []) {
        return new ApiResponse(false, null, message, errors);
    }

    /**
     * 创建验证错误响应
     */
    static validationError(errors) {
        return new ApiResponse(false, null, '数据验证失败', errors);
    }
}

// 导出模型类
if (typeof module !== 'undefined' && module.exports) {
    // Node.js环境
    module.exports = {
        Cat,
        Booking,
        TimeSlot,
        Statistics,
        ApiResponse
    };
} else {
    // 浏览器环境
    window.Models = {
        Cat,
        Booking,
        TimeSlot,
        Statistics,
        ApiResponse
    };
}
