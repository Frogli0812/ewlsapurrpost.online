package cc.mymc.catbookbackend.entity;

import cc.mymc.catbookbackend.util.BusinessUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

/**
 * 预约实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "bookings", indexes = {
    @Index(name = "idx_booking_date_time_position", columnList = "date, time, position"),
    @Index(name = "idx_booking_class", columnList = "studentClass"),
    @Index(name = "idx_booking_status", columnList = "status")
})
public class Booking extends BaseEntity {

    @NotNull(message = "预约日期不能为空")
    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @NotNull(message = "预约时间不能为空")
    @Column(nullable = false)
    @JsonFormat(pattern = "HH:mm")
    private LocalTime time;

    @NotBlank(message = "学生姓名不能为空")
    @Size(min = 2, max = 20, message = "学生姓名长度必须在2-20字符之间")
    @Column(nullable = false, length = 20)
    private String studentName;

    @NotBlank(message = "班级不能为空")
    @Size(min = 2, max = 50, message = "班级长度必须在2-50字符之间")
    @Column(nullable = false, length = 50)
    private String studentClass;

    @NotNull(message = "预约位置不能为空")
    @Min(value = 1, message = "位置编号必须在1-5之间")
    @Max(value = 5, message = "位置编号必须在1-5之间")
    @Column(nullable = false)
    private Integer position;

    @Size(max = 200, message = "备注信息不能超过200字符")
    @Column(length = 200)
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.CONFIRMED;


    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime cancelledAt;

    @Size(max = 200, message = "取消原因不能超过200字符")
    @Column(length = 200)
    private String cancelReason;

    /**
     * 预约状态枚举
     */
    public enum BookingStatus {
        CONFIRMED("已确认"),
        CANCELLED("已取消"),
        COMPLETED("已完成"),
        NO_SHOW("未到场");

        private final String description;

        BookingStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * 获取时间段描述
     */
    public String getTimeSlotDescription() {
        if (time == null) {
            return "";
        }
        return BusinessUtil.formatTimeSlot(time);
    }

    /**
     * 检查是否可以取消
     */
    public boolean canCancel() {
        if (status != BookingStatus.CONFIRMED) {
            return false;
        }
        
        LocalDateTime bookingDateTime = LocalDateTime.of(date, time);
        LocalDateTime now = LocalDateTime.now();
        
        // 检查是否在预约时间前至少1小时
        return bookingDateTime.isAfter(now.plusHours(1));
    }

    /**
     * 获取取消状态信息
     */
    public CancelStatus getCancelStatus() {
        if (status != BookingStatus.CONFIRMED) {
            return CancelStatus.NOT_CONFIRMED;
        }
        
        LocalDateTime bookingDateTime = LocalDateTime.of(date, time);
        LocalDateTime now = LocalDateTime.now();
        
        // 时间段结束时间（预约时间+时间段时长）
        LocalDateTime bookingEndTime = bookingDateTime.plusMinutes(cc.mymc.catbookbackend.util.BusinessUtil.TIME_SLOT_DURATION);
        
        if (now.isAfter(bookingEndTime)) {
            // 时间段已结束
            return CancelStatus.TIME_PASSED;
        } else if (now.isAfter(bookingDateTime)) {
            // 时间段进行中
            return CancelStatus.IN_PROGRESS;
        } else if (bookingDateTime.isBefore(now.plusHours(1))) {
            // 距离预约时间不足1小时
            return CancelStatus.TOO_CLOSE;
        } else {
            // 可以取消
            return CancelStatus.CAN_CANCEL;
        }
    }

    /**
     * 取消状态枚举
     */
    public enum CancelStatus {
        CAN_CANCEL("可以取消"),
        TOO_CLOSE("预约时间过近，无法取消"),
        TIME_PASSED("预约时间已过，无法取消"), 
        IN_PROGRESS("预约时间段进行中，无法取消"),
        NOT_CONFIRMED("预约状态不是已确认，无法取消");

        private final String message;

        CancelStatus(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }

    /**
     * 获取学生标识
     */
    public String getStudentIdentity() {
        return studentClass + " - " + studentName;
    }
}
