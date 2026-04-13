package cc.mymc.catbookbackend.dto.response;

import cc.mymc.catbookbackend.util.BusinessUtil;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * 时间段响应DTO
 */
@Data
@Schema(description = "时间段信息")
public class TimeSlotResponse {

    @Schema(description = "时间", example = "14:00")
    private LocalTime time;

    @Schema(description = "日期", example = "2023-12-15")
    private LocalDate date;


    @Schema(description = "总容量", example = "5")
    private Integer totalCapacity;

    @Schema(description = "已预约人数", example = "2")
    private Integer bookedCount;

    @Schema(description = "剩余容量", example = "3")
    private Integer availableCapacity;

    @Schema(description = "是否可预约", example = "true")
    private Boolean isAvailable;

    @Schema(description = "是否已满", example = "false")
    private Boolean isFull;

    @Schema(description = "特殊说明")
    private String notes;

    public TimeSlotResponse(LocalTime time, LocalDate date, Integer totalCapacity, Integer bookedCount) {
        this.time = time;
        this.date = date;
        this.totalCapacity = totalCapacity;
        this.bookedCount = bookedCount;
        this.availableCapacity = Math.max(0, totalCapacity - bookedCount);
        this.isFull = bookedCount >= totalCapacity;
        this.isAvailable = !this.isFull;
        this.notes = "";
    }

    @JsonProperty("timeSlotDescription")
    @Schema(description = "时间段描述", example = "14:00-14:30")
    public String getTimeSlotDescription() {
        if (time == null) {
            return "";
        }
        return BusinessUtil.formatTimeSlot(time);
    }
}
