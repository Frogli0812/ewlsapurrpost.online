package cc.mymc.catbookbackend.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * 时间段详情响应DTO
 */
@Data
@Schema(description = "时间段详情信息")
public class TimeSlotDetailResponse {

    @Schema(description = "日期", example = "2023-12-15")
    private LocalDate date;

    @Schema(description = "时间", example = "14:00")
    private LocalTime time;

    @Schema(description = "时间段描述", example = "14:00-14:30")
    private String timeSlotDescription;

    @Schema(description = "总位置数", example = "5")
    private Integer totalPositions = 5;

    @Schema(description = "已预约位置数", example = "2")
    private Integer bookedPositions;

    @Schema(description = "剩余位置数", example = "3")
    private Integer availablePositions;

    @Schema(description = "是否已满", example = "false")
    private Boolean isFull;

    @Schema(description = "位置详情列表")
    private List<PositionInfo> positions;

    @Data
    @Schema(description = "位置信息")
    public static class PositionInfo {
        
        @Schema(description = "位置编号", example = "1")
        private Integer position;

        @Schema(description = "是否已预约", example = "true")
        private Boolean isBooked;

        @Schema(description = "学生姓名", example = "张三")
        private String studentName;

        @Schema(description = "班级", example = "计算机1班")
        private String studentClass;

        @Schema(description = "学生标识", example = "计算机1班 - 张三")
        private String studentIdentity;

        @Schema(description = "预约ID", example = "123")
        private Long bookingId;

        @Schema(description = "备注", example = "第一次来")
        private String note;

        public PositionInfo(Integer position) {
            this.position = position;
            this.isBooked = false;
        }

        public PositionInfo(Integer position, String studentName, String studentClass, Long bookingId, String note) {
            this.position = position;
            this.isBooked = true;
            this.studentName = studentName;
            this.studentClass = studentClass;
            this.studentIdentity = studentClass + " - " + studentName;
            this.bookingId = bookingId;
            this.note = note;
        }
    }
}
