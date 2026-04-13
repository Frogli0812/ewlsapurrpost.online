package cc.mymc.catbookbackend.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 统计数据响应DTO
 */
@Data
@Schema(description = "统计数据")
public class StatisticsResponse {

    @Schema(description = "猫咪总数", example = "3")
    private Integer totalCats;

    @Schema(description = "总预约数", example = "156")
    private Integer totalBookings;

    @Schema(description = "总访客数", example = "156")
    private Integer totalVisitors;

    @Schema(description = "活跃预约数", example = "12")
    private Integer activeBookings;

    @Schema(description = "已完成预约数", example = "128")
    private Integer completedBookings;

    @Schema(description = "已取消预约数", example = "16")
    private Integer cancelledBookings;

    @Schema(description = "取消率(%)", example = "10.26")
    private String cancellationRate;

    @Schema(description = "完成率(%)", example = "82.05")
    private String completionRate;

    @Schema(description = "平均评分", example = "4.8")
    private Double averageRating;

    @Schema(description = "月度预约统计")
    private List<MonthlyBooking> monthlyBookings;

    @Schema(description = "热门时间段")
    private List<PopularTimeSlot> popularTimeSlots;

    @Schema(description = "统计生成时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime generatedAt;

    @Data
    @Schema(description = "月度预约统计")
    public static class MonthlyBooking {
        @Schema(description = "月份", example = "2023-12")
        private String month;

        @Schema(description = "预约数量", example = "45")
        private Integer count;

        public MonthlyBooking(String month, Integer count) {
            this.month = month;
            this.count = count;
        }
    }

    @Data
    @Schema(description = "热门时间段")
    public static class PopularTimeSlot {
        @Schema(description = "时间", example = "14:00")
        private String time;

        @Schema(description = "预约次数", example = "28")
        private Integer count;

        public PopularTimeSlot(String time, Integer count) {
            this.time = time;
            this.count = count;
        }
    }
}
