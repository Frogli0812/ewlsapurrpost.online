package cc.mymc.catbookbackend.service;

import cc.mymc.catbookbackend.dto.request.StudentBookingRequest;
import cc.mymc.catbookbackend.dto.response.TimeSlotResponse;
import cc.mymc.catbookbackend.dto.response.TimeSlotDetailResponse;
import cc.mymc.catbookbackend.entity.Booking;
import cc.mymc.catbookbackend.exception.BusinessException;
import cc.mymc.catbookbackend.repository.BookingRepository;
import cc.mymc.catbookbackend.util.BusinessUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 预约服务层
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    
    // 营业时间配置
    private static final int MAX_POSITIONS_PER_SLOT = 5;

    /**
     * 分页获取预约列表
     */
    public Page<Booking> getBookings(LocalDate date, Booking.BookingStatus status, String studentClass, Pageable pageable) {
        if (studentClass != null && !studentClass.trim().isEmpty()) {
            return bookingRepository.findByStudentClassOrderByDateDescTimeDesc(studentClass, pageable);
        }
        
        if (status != null) {
            return bookingRepository.findByStatusOrderByDateDescTimeDesc(status, pageable);
        }
        
        if (date != null) {
            return bookingRepository.findByDateOrderByTimeAscPositionAsc(date, pageable);
        }
        
        return bookingRepository.findAll(pageable);
    }

    /**
     * 根据ID获取预约详情
     */
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new BusinessException("预约不存在"));
    }

    /**
     * 创建新预约
     */
    @Transactional
    public Booking createBooking(StudentBookingRequest request) {
        // 验证营业时间
        validateBusinessHours(request.getDate(), request.getTime());
        
        // 检查位置是否已被预约
        validatePositionAvailable(request.getDate(), request.getTime(), request.getPosition());
        
        Booking booking = new Booking();
        BeanUtils.copyProperties(request, booking);
        
        Booking savedBooking = bookingRepository.save(booking);
        log.info("创建预约成功，ID: {}, 学生: {}, 班级: {}, 日期: {}, 时间: {}, 位置: {}", 
                savedBooking.getId(), savedBooking.getStudentName(), savedBooking.getStudentClass(), 
                savedBooking.getDate(), savedBooking.getTime(), savedBooking.getPosition());
        
        return savedBooking;
    }

    /**
     * 更新预约信息
     */
    @Transactional
    public Booking updateBooking(Long id, StudentBookingRequest request) {
        Booking booking = getBookingById(id);
        
        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new BusinessException("只能修改已确认状态的预约");
        }
        
        // 如果修改了日期、时间或位置，需要重新验证
        boolean dateTimeChanged = !booking.getDate().equals(request.getDate()) || !booking.getTime().equals(request.getTime());
        boolean positionChanged = !booking.getPosition().equals(request.getPosition());
        
        if (dateTimeChanged || positionChanged) {
            validateBusinessHours(request.getDate(), request.getTime());
            validatePositionAvailable(request.getDate(), request.getTime(), request.getPosition());
        }
        
        BeanUtils.copyProperties(request, booking, "id", "createdAt", "status");
        
        Booking updatedBooking = bookingRepository.save(booking);
        log.info("更新预约成功，ID: {}", updatedBooking.getId());
        
        return updatedBooking;
    }

    /**
     * 取消预约（管理员）
     */
    @Transactional
    public void cancelBooking(Long id, String cancelReason) {
        Booking booking = getBookingById(id);
        
        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BusinessException("预约已被取消");
        }
        
        // 管理员可以强制取消任何状态的预约，但给出合适的提示
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancelReason(cancelReason);
        booking.setCancelledAt(java.time.LocalDateTime.now());
        
        bookingRepository.save(booking);
        log.info("管理员取消预约成功，ID: {}, 原因: {}", booking.getId(), cancelReason);
    }

    /**
     * 直接取消预约（学生社团使用，无需验证）
     */
    @Transactional
    public void cancelBookingDirect(Long id, String cancelReason) {
        Booking booking = getBookingById(id);
        
        // 获取详细的取消状态
        Booking.CancelStatus cancelStatus = booking.getCancelStatus();
        if (cancelStatus != Booking.CancelStatus.CAN_CANCEL) {
            throw new BusinessException(cancelStatus.getMessage());
        }
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancelReason(cancelReason);
        booking.setCancelledAt(java.time.LocalDateTime.now());
        
        bookingRepository.save(booking);
        log.info("取消预约成功，ID: {}, 学生: {}, 原因: {}", booking.getId(), booking.getStudentIdentity(), cancelReason);
    }

    /**
     * 获取指定日期的可用时间段
     */
    public List<TimeSlotResponse> getAvailableSlots(LocalDate date) {
        validateBusinessDate(date);
        
        List<TimeSlotResponse> slots = new ArrayList<>();
        
        // 生成所有时间段
        List<LocalTime> timeSlots = BusinessUtil.generateTimeSlots();
        for (LocalTime time : timeSlots) {
            // 检查已预约位置数
            Integer bookedCount = bookingRepository.countBookedPositionsByDateAndTime(date, time);
            if (bookedCount == null) {
                bookedCount = 0;
            }
            
            TimeSlotResponse slot = new TimeSlotResponse(time, date, MAX_POSITIONS_PER_SLOT, bookedCount);
            slots.add(slot);
        }
        
        return slots;
    }

    /**
     * 获取指定时间段的详细位置信息
     */
    public TimeSlotDetailResponse getTimeSlotDetail(LocalDate date, LocalTime time) {
        validateBusinessDate(date);
        
        // 获取该时间段的所有预约
        List<Booking> bookings = bookingRepository.findByDateAndTimeAndStatusOrderByPosition(
                date, time, Booking.BookingStatus.CONFIRMED);
        
        TimeSlotDetailResponse response = new TimeSlotDetailResponse();
        response.setDate(date);
        response.setTime(time);
        response.setTimeSlotDescription(BusinessUtil.formatTimeSlot(time));
        response.setTotalPositions(MAX_POSITIONS_PER_SLOT);
        response.setBookedPositions(bookings.size());
        response.setAvailablePositions(MAX_POSITIONS_PER_SLOT - bookings.size());
        response.setIsFull(bookings.size() >= MAX_POSITIONS_PER_SLOT);
        
        // 生成位置信息列表
        List<TimeSlotDetailResponse.PositionInfo> positions = new ArrayList<>();
        for (int i = 1; i <= MAX_POSITIONS_PER_SLOT; i++) {
            final int position = i;
            
            // 查找该位置的预约
            Booking booking = bookings.stream()
                    .filter(b -> b.getPosition().equals(position))
                    .findFirst()
                    .orElse(null);
            
            if (booking != null) {
                // 位置已被预约
                positions.add(new TimeSlotDetailResponse.PositionInfo(
                        position, 
                        booking.getStudentName(), 
                        booking.getStudentClass(), 
                        booking.getId(),
                        booking.getNote()
                ));
            } else {
                // 位置空闲
                positions.add(new TimeSlotDetailResponse.PositionInfo(position));
            }
        }
        
        response.setPositions(positions);
        return response;
    }

    /**
     * 验证营业时间
     */
    private void validateBusinessHours(LocalDate date, LocalTime time) {
        validateBusinessDate(date);
        
        if (!BusinessUtil.isBusinessTime(time)) {
            throw new BusinessException(String.format("营业时间为 %02d:00-%02d:00，时间间隔为%d分钟", 
                    BusinessUtil.START_HOUR, BusinessUtil.END_HOUR, BusinessUtil.TIME_SLOT_DURATION));
        }
    }

    /**
     * 验证营业日期
     */
    private void validateBusinessDate(LocalDate date) {
        if (date.isBefore(LocalDate.now())) {
            throw new BusinessException("预约日期不能是过去的日期");
        }
        
        if (!BusinessUtil.isBusinessDay(date)) {
            throw new BusinessException("该日期不可预约，请选择其他日期");
        }
    }

    /**
     * 验证位置是否可用
     */
    private void validatePositionAvailable(LocalDate date, LocalTime time, Integer position) {
        if (position < 1 || position > MAX_POSITIONS_PER_SLOT) {
            throw new BusinessException("位置编号必须在1-5之间");
        }
        
        boolean isOccupied = bookingRepository.existsByDateAndTimeAndPosition(date, time, position);
        if (isOccupied) {
            throw new BusinessException("位置" + position + "已被预约，请选择其他位置");
        }
    }

    /**
     * 根据班级查询预约列表
     */
    public List<Booking> getBookingsByClass(String studentClass) {
        return bookingRepository.findByStudentClass(studentClass);
    }

    /**
     * 根据学生姓名查询预约列表
     */
    public List<Booking> getBookingsByStudent(String studentClass, String studentName) {
        return bookingRepository.findByStudentClassAndStudentName(studentClass, studentName);
    }

    /**
     * 统计预约数据
     */
    public long countBookingsByStatus(Booking.BookingStatus status) {
        return bookingRepository.countByStatus(status);
    }

    /**
     * 统计总访客数
     */
    public Integer countTotalVisitors() {
        Integer count = bookingRepository.countTotalVisitors();
        return count != null ? count : 0;
    }
}

