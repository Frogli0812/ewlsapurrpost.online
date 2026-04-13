/**
 * UI组件和交互模块
 * 处理用户界面的显示和交互逻辑
 */
class UIManager {
    constructor() {
        this.currentPage = 'home';
        this.selectedTimeSlot = null;
        this.selectedDate = null;
        this.selectedPosition = null;
        this.currentTimeslotDetail = null;
        this.init();
    }

    /**
     * 初始化UI管理器
     */
    init() {
        this.bindNavigationEvents();
        this.bindFormEvents();
        this.bindModalEvents();
        this.setupDateInput();
        this.loadInitialData();
    }

    /**
     * 绑定导航事件
     */
    bindNavigationEvents() {
        // 导航链接点击事件
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const pageId = link.getAttribute('data-page');
                this.navigateToPage(pageId);
            });
        });

        // 立即预约按钮
        const bookNowBtn = document.getElementById('book-now-btn');
        if (bookNowBtn) {
            bookNowBtn.addEventListener('click', () => {
                this.navigateToPage('booking');
            });
        }
    }

    /**
     * 导航到指定页面
     * @param {string} pageId 页面ID
     */
    navigateToPage(pageId) {
        // 更新导航活动状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-page="${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // 显示对应页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }

        // 页面特殊处理
        if (pageId === 'manage') {
            this.displayBookings();
        } else if (pageId === 'cats') {
            this.loadCatsData();
        }
    }

    /**
     * 绑定表单事件
     */
    bindFormEvents() {
        // 学生预约表单提交
        const studentBookingForm = document.getElementById('student-booking-form');
        if (studentBookingForm) {
            studentBookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleStudentBookingSubmit();
            });
        }

        // 查询预约表单提交
        const queryForm = document.getElementById('query-form');
        if (queryForm) {
            queryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleQuerySubmit();
            });
        }

        // 日期选择变化
        const dateInput = document.getElementById('booking-date');
        if (dateInput) {
            dateInput.addEventListener('change', () => {
                this.generateTimeSlots();
            });
        }
    }

    /**
     * 绑定模态框事件
     */
    bindModalEvents() {
        const modalConfirmBtn = document.getElementById('modal-confirm-btn');
        if (modalConfirmBtn) {
            modalConfirmBtn.addEventListener('click', () => {
                this.closeModal();
                this.resetBookingForm();
                this.navigateToPage('manage');
            });
        }

        // 点击模态框背景关闭
        const modal = document.getElementById('confirmation-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    /**
     * 设置日期输入框
     */
    setupDateInput() {
        const dateInput = document.getElementById('booking-date');
        if (dateInput) {
            // 设置最小日期为今天
            dateInput.setAttribute('min', Utils.getTodayString());
            
            // 智能设置默认日期
            const defaultDate = this.getSmartDefaultDate();
            dateInput.value = defaultDate;
        }
    }

    /**
     * 获取智能默认日期
     * 如果当前时间已过营业时间，则返回明天，否则返回今天
     */
    getSmartDefaultDate() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        
        // 获取营业结束时间（18:00）
        const businessEndTime = AppConfig.BUSINESS_HOURS.END_HOUR * 60; // 18 * 60 = 1080分钟
        
        // 如果当前时间已经过了营业时间，或者接近营业结束时间（提前30分钟）
        const bufferTime = 30; // 提前30分钟
        if (currentTimeInMinutes >= (businessEndTime - bufferTime)) {
            // 返回明天的日期
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toISOString().split('T')[0];
        } else {
            // 返回今天的日期
            return Utils.getTodayString();
        }
    }

    /**
     * 加载初始数据
     */
    async loadInitialData() {
        this.loadCatsData();
        this.generateTimeSlots();
        this.updateVisitorStats();
    }

    /**
     * 加载猫咪数据
     */
    async loadCatsData() {
        try {
            const result = await apiService.getCats();
            
            if (result.success) {
                this.renderCats(result.data);
            } else {
                Utils.showError('加载猫咪信息失败');
            }
        } catch (error) {
            Utils.logger.error('加载猫咪数据失败', error);
            Utils.showError('加载猫咪信息失败');
        }
    }

    /**
     * 渲染猫咪信息
     * @param {Array} cats 猫咪数据数组
     */
    renderCats(cats) {
        const catsGrid = document.getElementById('cats-grid');
        if (!catsGrid) return;

        if (!cats || cats.length === 0) {
            catsGrid.innerHTML = '<div class="no-data"><i class="fas fa-cat"></i><p>暂无猫咪信息</p></div>';
            return;
        }

        catsGrid.innerHTML = '';

        cats.forEach(cat => {
            const catCard = document.createElement('div');
            catCard.className = 'cat-card';
            
            // 解析traits字段
            let traits = [];
            try {
                if (typeof cat.traits === 'string') {
                    traits = JSON.parse(cat.traits);
                } else if (Array.isArray(cat.traits)) {
                    traits = cat.traits;
                }
            } catch (e) {
                console.warn('解析traits失败:', e);
                traits = [];
            }
            
            // 生成特征星星HTML
            const traitsHTML = traits.map(trait => {
                const stars = '⭐️'.repeat(trait.stars);
                return `<p class="cat-trait"><strong>${trait.name}</strong> ${stars}</p>`;
            }).join('');
            
            // 处理图片显示逻辑
            const hasImage = cat.imageUrl && cat.imageUrl.trim() !== '';
            const imageContent = hasImage 
                ? `<img src="${cat.imageUrl}" alt="${cat.name}" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                   <div class="default-cat-icon" style="display: none;"><i class="fas fa-cat"></i></div>`
                : `<div class="default-cat-icon"><i class="fas fa-cat"></i></div>`;
            
            catCard.innerHTML = `
                <div class="cat-image">
                    ${imageContent}
                </div>
                <div class="cat-info">
                    <h3 class="cat-name"><i class="fas fa-cat"></i> ${cat.name}</h3>
                    <p class="cat-breed"><i class="fas fa-paw"></i> ${cat.breed}</p>
                    <p class="cat-description">${cat.description}</p>
                    <div class="cat-traits">
                        ${traitsHTML}
                    </div>
                </div>
            `;
            
            catsGrid.appendChild(catCard);
        });
    }


    /**
     * 渲染时间段
     * @param {Array} slots 时间段数据
     */
    renderTimeSlots(slots) {
        const slotsContainer = document.getElementById('time-slots');
        if (!slotsContainer) return;

        slotsContainer.innerHTML = '';

        slots.forEach(slot => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.setAttribute('data-time', slot.time);

            const timeText = Utils.formatTimeSlot(slot.time);
            timeSlot.innerHTML = `
                <div>${timeText}</div>
                <div class="slot-count">余位: ${slot.available}</div>
            `;

            if (slot.available <= 0) {
                timeSlot.classList.add('booked');
            } else {
                timeSlot.addEventListener('click', () => {
                    this.selectTimeSlot(timeSlot);
                });
            }

            slotsContainer.appendChild(timeSlot);
        });
    }

    /**
     * 选择时间段
     * @param {HTMLElement} slotElement 时间段元素
     */
    selectTimeSlot(slotElement) {
        // 清除其他选中状态
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });

        // 设置选中状态
        slotElement.classList.add('selected');
        this.selectedTimeSlot = slotElement.getAttribute('data-time');
    }

    /**
     * 处理预约表单提交
     */
    async handleBookingSubmit() {
        const formData = this.collectBookingFormData();
        
        // 验证表单数据
        const validationResult = this.validateBookingForm(formData);
        if (!validationResult.valid) {
            Utils.showError(validationResult.message);
            return;
        }

        try {
            // 提交预约
            const result = await apiService.createBooking(formData);
            
            if (result.success) {
                this.showBookingConfirmation(result.data);
                this.updateVisitorStats();
            } else {
                Utils.showError(result.error || AppConfig.ERROR_MESSAGES.BOOKING_FAILED);
            }
        } catch (error) {
            Utils.logger.error('预约提交失败', error);
            Utils.showError(AppConfig.ERROR_MESSAGES.BOOKING_FAILED);
        }
    }

    /**
     * 收集预约表单数据
     * @returns {Object} 表单数据
     */
    collectBookingFormData() {
        return {
            date: document.getElementById('booking-date')?.value || '',
            time: this.selectedTimeSlot || '',
            name: document.getElementById('visitor-name')?.value?.trim() || '',
            phone: document.getElementById('visitor-phone')?.value?.trim() || '',
            note: document.getElementById('visitor-note')?.value?.trim() || ''
        };
    }

    /**
     * 验证预约表单
     * @param {Object} formData 表单数据
     * @returns {Object} 验证结果
     */
    validateBookingForm(formData) {
        if (!formData.date) {
            return { valid: false, message: '请选择预约日期' };
        }

        if (!Utils.validateFutureDate(formData.date)) {
            return { valid: false, message: '请选择今天或未来的日期' };
        }

        if (!formData.time) {
            return { valid: false, message: '请选择时间段' };
        }

        if (!Utils.validateName(formData.name)) {
            return { valid: false, message: '请输入有效的姓名(2-20个字符)' };
        }

        if (!Utils.validatePhone(formData.phone)) {
            return { valid: false, message: '请输入有效的手机号码' };
        }

        return { valid: true };
    }

    /**
     * 显示预约确认信息
     * @param {Object} booking 预约数据
     */
    showBookingConfirmation(booking) {
        const detailsElement = document.getElementById('booking-details');
        if (detailsElement) {
            const timeText = Utils.formatTimeSlot(booking.time);
            detailsElement.innerHTML = `
                <p><strong>日期:</strong> ${booking.date}</p>
                <p><strong>时间:</strong> ${timeText}</p>
                <p><strong>预约人:</strong> ${booking.name}</p>
                <p><strong>联系电话:</strong> ${booking.phone}</p>
            `;
        }

        this.showModal();
    }

    /**
     * 显示模态框
     */
    showModal() {
        const modal = document.getElementById('confirmation-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    /**
     * 关闭模态框
     */
    closeModal() {
        const modal = document.getElementById('confirmation-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * 重置预约表单
     */
    resetBookingForm() {
        const form = document.getElementById('booking-form');
        if (form) {
            form.reset();
        }

        // 重置日期为今天
        const dateInput = document.getElementById('booking-date');
        if (dateInput) {
            dateInput.value = Utils.getTodayString();
        }

        // 清除选中的时间段
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        this.selectedTimeSlot = null;

        // 重新生成时间段
        this.generateTimeSlots();
    }

    /**
     * 显示预约列表
     */
    async displayBookings() {
        try {
            const result = await apiService.getBookings();
            
            if (result.success) {
                this.renderBookings(result.data);
            } else {
                Utils.showError('加载预约列表失败');
            }
        } catch (error) {
            Utils.logger.error('显示预约列表失败', error);
            Utils.showError('加载预约列表失败');
        }
    }

    /**
     * 渲染预约列表
     * @param {Array} bookings 预约数据数组
     */
    renderBookings(bookings) {
        const bookingsList = document.getElementById('bookings-list');
        if (!bookingsList) return;

        if (bookings.length === 0) {
            bookingsList.innerHTML = '<p class="no-bookings">暂无预约记录</p>';
            return;
        }

        bookingsList.innerHTML = '';

        bookings.forEach(booking => {
            const bookingCard = document.createElement('div');
            bookingCard.className = 'booking-card';
            
            const timeText = Utils.formatTimeSlot(booking.time);
            bookingCard.innerHTML = `
                <h3><i class="fas fa-calendar-day"></i> 预约详情</h3>
                <p><i class="fas fa-calendar-alt"></i> 日期: ${booking.date}</p>
                <p><i class="fas fa-clock"></i> 时间: ${timeText}</p>
                <p><i class="fas fa-user"></i> 预约人: ${booking.name}</p>
                <p><i class="fas fa-phone"></i> 联系电话: ${booking.phone}</p>
                ${booking.note ? `<p><i class="fas fa-sticky-note"></i> 备注: ${booking.note}</p>` : ''}
                <div class="booking-actions">
                    <button class="btn btn-danger btn-sm cancel-btn" data-id="${booking.id}">
                        <i class="fas fa-times"></i> 取消预约
                    </button>
                </div>
            `;

            // 添加取消预约事件
            const cancelBtn = bookingCard.querySelector('.cancel-btn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    this.handleCancelBooking(booking.id);
                });
            }

            bookingsList.appendChild(bookingCard);
        });
    }

    /**
     * 处理取消预约
     * @param {number} bookingId 预约ID
     */
    async handleCancelBooking(bookingId) {
        if (!Utils.confirm('确定要取消这个预约吗？')) {
            return;
        }

        try {
            const result = await apiService.cancelBooking(bookingId);
            
            if (result.success) {
                Utils.showSuccess('预约已取消');
                
                // 如果在时间段详情页面，刷新详情
                if (this.currentPage === 'timeslot-detail' && this.selectedDate && this.selectedTimeSlot) {
                    this.showTimeslotDetail(this.selectedDate, this.selectedTimeSlot);
                }
                
                // 如果在预约管理页面，刷新列表
                if (this.currentPage === 'manage') {
                    // 重新执行查询
                    const queryClass = document.getElementById('query-class')?.value;
                    const queryName = document.getElementById('query-name')?.value;
                    if (queryClass && queryName) {
                        this.handleQuerySubmit();
                    }
                }
                
                this.updateVisitorStats();
            } else {
                // 优先显示后端返回的具体消息
                const errorMessage = result.message || result.error || '取消预约失败';
                Utils.showError(errorMessage);
            }
        } catch (error) {
            Utils.logger.error('取消预约失败', error);
            Utils.showError('取消预约失败');
        }
    }

    /**
     * 更新访客统计
     */
    async updateVisitorStats() {
        try {
            const result = await apiService.getBookings();
            
            if (result.success) {
                const totalVisitors = result.data.length;
                const visitorElement = document.getElementById('total-visitors');
                if (visitorElement) {
                    visitorElement.textContent = totalVisitors;
                }
            }
        } catch (error) {
            Utils.logger.error('更新访客统计失败', error);
        }
    }

    /**
     * 认证相关UI方法
     */

    /**
     * 更新认证相关的UI状态
     */
    updateAuthUI() {
        const isLoggedIn = this.authManager.isLoggedIn();
        const loginNav = document.getElementById('login-nav');
        const profileNav = document.getElementById('profile-nav');
        const userName = document.getElementById('user-name');

        if (isLoggedIn) {
            const user = this.authManager.getCurrentUser();
            
            // 隐藏登录，显示用户信息
            if (loginNav) loginNav.style.display = 'none';
            if (profileNav) profileNav.style.display = 'block';
            if (userName) userName.textContent = user.name;
            
            // 更新用户信息页面
            this.updateUserProfile(user);
        } else {
            // 显示登录，隐藏用户信息
            if (loginNav) loginNav.style.display = 'block';
            if (profileNav) profileNav.style.display = 'none';
        }
    }

    /**
     * 处理登录表单提交
     */
    async handleLoginSubmit() {
        const phone = document.getElementById('login-phone')?.value?.trim();
        const name = document.getElementById('login-name')?.value?.trim();

        if (!phone || !name) {
            Utils.showError('请填写完整的登录信息');
            return;
        }

        try {
            const result = await this.authManager.login(phone, name);
            
            if (result.success) {
                Utils.showSuccess('登录成功！');
                this.updateAuthUI();
                
                // 登录成功后跳转到我的预约页面
                this.navigateToPage('manage');
                
                // 清空登录表单
                document.getElementById('login-form').reset();
            } else {
                Utils.showError(result.error || '登录失败');
            }
        } catch (error) {
            Utils.logger.error('登录处理失败', error);
            Utils.showError('登录失败，请稍后重试');
        }
    }

    /**
     * 更新用户资料页面
     * @param {Object} user 用户信息
     */
    updateUserProfile(user) {
        const userInfo = document.getElementById('user-info');
        if (userInfo && user) {
            userInfo.innerHTML = `
                <p><i class="fas fa-phone"></i> 手机号: ${user.phone}</p>
                <p><i class="fas fa-user"></i> 姓名: ${user.name}</p>
                <p><i class="fas fa-clock"></i> 登录时间: ${new Date().toLocaleString()}</p>
            `;
        }

        // 更新用户统计
        this.updateUserStats();
    }

    /**
     * 更新用户统计数据
     */
    async updateUserStats() {
        try {
            const result = await this.authManager.getMyBookings();
            
            if (result.success) {
                const bookings = result.data;
                const totalBookings = bookings.length;
                const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
                const completedBookings = bookings.filter(b => b.status === 'completed').length;

                // 更新统计显示
                const totalElement = document.getElementById('user-total-bookings');
                const activeElement = document.getElementById('user-active-bookings');
                const completedElement = document.getElementById('user-completed-bookings');

                if (totalElement) totalElement.textContent = totalBookings;
                if (activeElement) activeElement.textContent = activeBookings;
                if (completedElement) completedElement.textContent = completedBookings;
            }
        } catch (error) {
            Utils.logger.error('更新用户统计失败', error);
        }
    }

    /**
     * 显示预约列表（更新版本，支持用户认证）
     */
    async displayBookings() {
        const bookingsList = document.getElementById('bookings-list');
        const loginPrompt = document.getElementById('login-prompt');

        if (!this.authManager.isLoggedIn()) {
            // 未登录状态
            if (bookingsList) bookingsList.style.display = 'none';
            if (loginPrompt) loginPrompt.style.display = 'block';
            return;
        }

        // 已登录状态
        if (bookingsList) bookingsList.style.display = 'block';
        if (loginPrompt) loginPrompt.style.display = 'none';

        try {
            const result = await this.authManager.getMyBookings();
            
            if (result.success) {
                this.renderBookings(result.data);
            } else {
                Utils.showError('加载预约列表失败');
                if (bookingsList) {
                    bookingsList.innerHTML = '<p class="no-bookings">加载预约失败</p>';
                }
            }
        } catch (error) {
            Utils.logger.error('显示预约列表失败', error);
            Utils.showError('加载预约列表失败');
        }
    }


    /**
     * 预约表单提交时自动填充用户信息
     */
    collectBookingFormData() {
        const basicData = {
            date: document.getElementById('booking-date')?.value || '',
            time: this.selectedTimeSlot || '',
            name: document.getElementById('visitor-name')?.value?.trim() || '',
            phone: document.getElementById('visitor-phone')?.value?.trim() || '',
            note: document.getElementById('visitor-note')?.value?.trim() || ''
        };

        return basicData;
    }

    /**
     * 新增：时间段相关方法（学生社团模式）
     */

    /**
     * 生成时间段选项（显示真实预约数据）
     */
    async generateTimeSlots() {
        const slotsContainer = document.getElementById('time-slots');
        const dateInput = document.getElementById('booking-date');
        
        if (!slotsContainer || !dateInput) return;
        
        const selectedDate = dateInput.value;
        this.selectedDate = selectedDate;
        
        if (!selectedDate) {
            slotsContainer.innerHTML = '<p class="loading">请选择日期查看可用时间段</p>';
            return;
        }
        
        slotsContainer.innerHTML = '<p class="loading">加载中...</p>';
        
        try {
            const result = await apiService.getAvailableSlots(selectedDate);
            
            if (result.success) {
                this.renderTimeSlots(result.data, selectedDate);
            } else {
                slotsContainer.innerHTML = '<p class="error">加载时间段失败，请重试</p>';
            }
        } catch (error) {
            Utils.logger.error('生成时间段失败', error);
            slotsContainer.innerHTML = '<p class="error">加载时间段失败，请重试</p>';
        }
    }

    /**
     * 渲染时间段列表（新版本）
     */
    renderTimeSlots(slots, date) {
        const slotsContainer = document.getElementById('time-slots');
        if (!slotsContainer) return;

        if (!slots || slots.length === 0) {
            slotsContainer.innerHTML = '<p class="no-data">当日暂无可用时间段</p>';
            return;
        }

        let slotsHTML = '<div class="time-slots-grid">';
        
        slots.forEach(slot => {
            const isAvailable = slot.isAvailable;
            const availableText = isAvailable ? 
                `余位 ${slot.availableCapacity}` : 
                '已满';
            
            slotsHTML += `
                <div class="time-slot ${isAvailable ? 'available' : 'full'}" 
                     onclick="showTimeslotDetail('${date}', '${slot.time}')">
                    <div class="slot-time">
                        <i class="fas fa-clock"></i>
                        ${slot.timeSlotDescription}
                    </div>
                    <div class="slot-info">
                        <span class="capacity">${slot.bookedCount}/${slot.totalCapacity}</span>
                        <span class="status">${availableText}</span>
                    </div>
                    <div class="slot-action">
                        <i class="fas fa-eye"></i> 查看详情
                    </div>
                </div>
            `;
        });
        
        slotsHTML += '</div>';
        slotsContainer.innerHTML = slotsHTML;
    }

    /**
     * 显示时间段详情
     */
    async showTimeslotDetail(date, time) {
        try {
            const result = await apiService.getTimeSlotDetail(date, time);
            
            if (result.success) {
                this.currentTimeslotDetail = result.data;
                this.selectedDate = date;
                this.selectedTimeSlot = time;
                this.renderTimeslotDetail(result.data);
                this.navigateToPage('timeslot-detail');
            } else {
                Utils.showError('加载时间段详情失败');
            }
        } catch (error) {
            Utils.logger.error('显示时间段详情失败', error);
            Utils.showError('加载时间段详情失败');
        }
    }

    /**
     * 渲染时间段详情页面
     */
    renderTimeslotDetail(detail) {
        const timeslotInfo = document.getElementById('timeslot-info');
        const positionsContainer = document.getElementById('positions-container');
        
        if (timeslotInfo) {
            timeslotInfo.innerHTML = `
                <div class="timeslot-header">
                    <h3><i class="fas fa-calendar"></i> ${detail.date}</h3>
                    <h3><i class="fas fa-clock"></i> ${detail.timeSlotDescription}</h3>
                    <div class="capacity-info">
                        <span class="booked">${detail.bookedPositions}</span> / 
                        <span class="total">${detail.totalPositions}</span> 已预约
                    </div>
                </div>
            `;
        }

        if (positionsContainer) {
            let positionsHTML = '';
            
            detail.positions.forEach(position => {
                if (position.isBooked) {
                    positionsHTML += `
                        <div class="position-card booked">
                            <div class="position-number">${position.position}</div>
                            <div class="student-info">
                                <div class="student-name">${position.studentName}</div>
                                <div class="student-class">${position.studentClass}</div>
                                ${position.note ? `<div class="note">${position.note}</div>` : ''}
                            </div>
                            <div class="booking-actions">
                                <button class="btn btn-small btn-danger" 
                                        onclick="cancelBooking(${position.bookingId})">
                                    <i class="fas fa-times"></i> 取消
                                </button>
                            </div>
                        </div>
                    `;
                } else {
                    positionsHTML += `
                        <div class="position-card available" 
                             onclick="startNewBooking(${position.position})">
                            <div class="position-number">${position.position}</div>
                            <div class="add-booking">
                                <i class="fas fa-plus"></i>
                                <span>点击预约</span>
                            </div>
                        </div>
                    `;
                }
            });
            
            positionsContainer.innerHTML = positionsHTML;
        }
    }

    /**
     * 开始新预约
     */
    startNewBooking(position) {
        this.selectedPosition = position;
        
        // 显示预约信息
        const bookingInfo = document.getElementById('booking-info');
        if (bookingInfo && this.currentTimeslotDetail) {
            bookingInfo.innerHTML = `
                <div class="booking-summary">
                    <h3><i class="fas fa-info-circle"></i> 预约信息</h3>
                    <p><i class="fas fa-calendar"></i> 日期：${this.currentTimeslotDetail.date}</p>
                    <p><i class="fas fa-clock"></i> 时间：${this.currentTimeslotDetail.timeSlotDescription}</p>
                    <p><i class="fas fa-map-marker-alt"></i> 位置：第 ${position} 个位置</p>
                </div>
            `;
        }
        
        this.navigateToPage('new-booking');
    }

    /**
     * 处理学生预约表单提交
     */
    async handleStudentBookingSubmit() {
        const studentClass = document.getElementById('student-class')?.value?.trim();
        const studentName = document.getElementById('student-name')?.value?.trim();
        const studentNote = document.getElementById('student-note')?.value?.trim();

        if (!studentClass || !studentName) {
            Utils.showError('请填写完整的班级和姓名信息');
            return;
        }

        if (!this.selectedDate || !this.selectedTimeSlot || !this.selectedPosition) {
            Utils.showError('预约信息不完整，请重新选择');
            return;
        }

        const bookingData = {
            date: this.selectedDate,
            time: this.selectedTimeSlot,
            studentName: studentName,
            studentClass: studentClass,
            position: this.selectedPosition,
            note: studentNote
        };

        try {
            const result = await apiService.createBooking(bookingData);
            
            if (result.success) {
                Utils.showSuccess('预约成功！');
                
                // 保存学生信息到本地缓存
                if (AppConfig.STUDENT_CONFIG.ENABLE_CLASS_CACHE) {
                    Utils.storage.set(AppConfig.STORAGE_KEYS.STUDENT_INFO, {
                        studentClass,
                        studentName
                    });
                }
                
                // 清空表单
                document.getElementById('student-booking-form').reset();
                
                // 返回时间段详情页面并刷新
                this.showTimeslotDetail(this.selectedDate, this.selectedTimeSlot);
            } else {
                // 优先显示后端返回的具体消息
                const errorMessage = result.message || result.error || '预约失败';
                Utils.showError(errorMessage);
            }
        } catch (error) {
            Utils.logger.error('处理预约失败', error);
            Utils.showError('预约失败，请稍后重试');
        }
    }

    /**
     * 处理查询预约表单提交
     */
    async handleQuerySubmit() {
        const studentClass = document.getElementById('query-class')?.value?.trim();
        const studentName = document.getElementById('query-name')?.value?.trim();

        if (!studentClass || !studentName) {
            Utils.showError('请填写完整的班级和姓名信息');
            return;
        }

        try {
            const result = await apiService.getBookingsByStudent(studentClass, studentName);
            
            if (result.success) {
                this.renderQueryResults(result.data);
            } else {
                // 优先显示后端返回的具体消息
                const errorMessage = result.message || result.error || '查询失败，请稍后重试';
                Utils.showError(errorMessage);
            }
        } catch (error) {
            Utils.logger.error('查询预约失败', error);
            Utils.showError('查询失败，请稍后重试');
        }
    }

    /**
     * 渲染查询结果
     */
    renderQueryResults(bookings) {
        const resultsContainer = document.getElementById('bookings-result');
        if (!resultsContainer) return;

        if (!bookings || bookings.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-inbox"></i>
                    <p>未找到相关预约记录</p>
                </div>
            `;
            return;
        }

        let resultHTML = '<div class="bookings-list">';
        
        bookings.forEach(booking => {
            const statusClass = booking.status.toLowerCase();
            const statusText = this.getStatusText(booking.status);
            
            resultHTML += `
                <div class="booking-card ${statusClass}">
                    <div class="booking-header">
                        <span class="date">${booking.date}</span>
                        <span class="time">${booking.timeSlotDescription}</span>
                        <span class="status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="booking-details">
                        <p><i class="fas fa-user"></i> ${booking.studentIdentity}</p>
                        <p><i class="fas fa-map-marker-alt"></i> 位置：第 ${booking.position} 个</p>
                        ${booking.note ? `<p><i class="fas fa-sticky-note"></i> 备注：${booking.note}</p>` : ''}
                    </div>
                    ${booking.status === 'CONFIRMED' ? `
                        <div class="booking-actions">
                            <button class="btn btn-small btn-danger" 
                                    onclick="cancelBooking(${booking.id})">
                                <i class="fas fa-times"></i> 取消预约
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        resultHTML += '</div>';
        resultsContainer.innerHTML = resultHTML;
    }

    /**
     * 获取状态文本
     */
    getStatusText(status) {
        const statusMap = {
            'CONFIRMED': '已确认',
            'CANCELLED': '已取消', 
            'COMPLETED': '已完成',
            'NO_SHOW': '未到场'
        };
        return statusMap[status] || status;
    }
}

/**
 * 全局辅助函数（学生社团模式）
 */
function showTimeslotDetail(date, time) {
    if (window.catBookingApp && window.catBookingApp.uiManager) {
        window.catBookingApp.uiManager.showTimeslotDetail(date, time);
    }
}

function startNewBooking(position) {
    if (window.catBookingApp && window.catBookingApp.uiManager) {
        window.catBookingApp.uiManager.startNewBooking(position);
    }
}

function goBackToTimeslot() {
    if (window.catBookingApp && window.catBookingApp.uiManager) {
        window.catBookingApp.uiManager.navigateToPage('timeslot-detail');
    }
}

function cancelBooking(bookingId) {
    if (window.catBookingApp && window.catBookingApp.uiManager) {
        window.catBookingApp.uiManager.handleCancelBooking(bookingId);
    }
}

function navigateToPage(pageId) {
    if (window.catBookingApp && window.catBookingApp.uiManager) {
        window.catBookingApp.uiManager.navigateToPage(pageId);
    }
}

// 导出到全局
window.UIManager = UIManager;
