/**
 * 用户身份验证管理器
 * 处理用户登录、会话管理等功能
 */
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionValid = false;
        this.init();
    }

    /**
     * 初始化认证管理器
     */
    async init() {
        // 自动验证现有会话
        if (AppConfig.AUTH.AUTO_LOGIN) {
            await this.autoLogin();
        }
    }

    /**
     * 自动登录（验证现有会话）
     */
    async autoLogin() {
        try {
            const result = await apiService.verifySession();
            
            if (result.success) {
                this.currentUser = Utils.storage.get(AppConfig.STORAGE_KEYS.USER_INFO);
                this.sessionValid = true;
                Utils.logger.log('自动登录成功', this.currentUser);
            } else {
                Utils.logger.log('无有效会话，需要重新登录');
                this.clearSession();
            }
        } catch (error) {
            Utils.logger.error('自动登录失败', error);
            this.clearSession();
        }
    }

    /**
     * 用户登录
     * @param {string} phone 手机号
     * @param {string} name 姓名
     * @returns {Promise<Object>} 登录结果
     */
    async login(phone, name) {
        try {
            // 验证输入
            if (!Utils.validatePhone(phone)) {
                return { success: false, error: '手机号格式不正确' };
            }

            if (!Utils.validateName(name)) {
                return { success: false, error: '姓名格式不正确' };
            }

            // 调用登录API
            const result = await apiService.userLogin(phone, name);
            
            if (result.success) {
                this.currentUser = { phone, name };
                this.sessionValid = true;
                Utils.logger.log('登录成功', this.currentUser);
                
                return { 
                    success: true, 
                    data: { 
                        message: '登录成功',
                        user: this.currentUser 
                    }
                };
            } else {
                return result;
            }
        } catch (error) {
            Utils.logger.error('登录失败', error);
            return { success: false, error: '登录失败，请稍后重试' };
        }
    }

    /**
     * 用户登出
     */
    async logout() {
        try {
            await apiService.userLogout();
            this.clearSession();
            Utils.logger.log('登出成功');
            return { success: true, message: '登出成功' };
        } catch (error) {
            Utils.logger.error('登出失败', error);
            // 即使API调用失败，也清除本地会话
            this.clearSession();
            return { success: true, message: '登出成功' };
        }
    }

    /**
     * 清除会话信息
     */
    clearSession() {
        this.currentUser = null;
        this.sessionValid = false;
        Utils.storage.remove(AppConfig.STORAGE_KEYS.USER_SESSION);
        Utils.storage.remove(AppConfig.STORAGE_KEYS.USER_INFO);
    }

    /**
     * 检查是否已登录
     * @returns {boolean} 是否已登录
     */
    isLoggedIn() {
        return this.sessionValid && this.currentUser !== null;
    }

    /**
     * 获取当前用户信息
     * @returns {Object|null} 用户信息
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * 获取用户预约列表
     */
    async getMyBookings() {
        if (!this.isLoggedIn()) {
            return { success: false, error: '请先登录' };
        }

        try {
            return await apiService.getMyBookings();
        } catch (error) {
            Utils.logger.error('获取预约列表失败', error);
            return { success: false, error: '获取预约列表失败' };
        }
    }

    /**
     * 取消预约
     * @param {number} bookingId 预约ID
     */
    async cancelBooking(bookingId) {
        if (!this.isLoggedIn()) {
            return { success: false, error: '请先登录' };
        }

        try {
            return await apiService.cancelMyBooking(bookingId);
        } catch (error) {
            Utils.logger.error('取消预约失败', error);
            return { success: false, error: '取消预约失败' };
        }
    }

    /**
     * 验证预约权限（检查预约是否属于当前用户）
     * @param {Object} booking 预约对象
     * @returns {boolean} 是否有权限
     */
    canManageBooking(booking) {
        if (!this.isLoggedIn() || !this.currentUser) {
            return false;
        }

        return booking.phone === this.currentUser.phone && 
               booking.name === this.currentUser.name;
    }

    /**
     * 创建预约时自动设置用户信息
     * @param {Object} bookingData 预约数据
     * @returns {Object} 包含用户信息的预约数据
     */
    enrichBookingData(bookingData) {
        if (this.isLoggedIn() && this.currentUser) {
            return {
                ...bookingData,
                phone: this.currentUser.phone,
                name: this.currentUser.name
            };
        }
        return bookingData;
    }

    /**
     * 检查是否需要显示登录提示
     * @param {string} action 要执行的操作
     * @returns {boolean} 是否需要登录
     */
    requiresLogin(action) {
        const loginRequiredActions = ['viewBookings', 'cancelBooking'];
        return loginRequiredActions.includes(action) && !this.isLoggedIn();
    }
}

// 导出认证管理器
window.AuthManager = AuthManager;
