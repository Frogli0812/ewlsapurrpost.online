package cc.mymc.catbookbackend.controller;

import cc.mymc.catbookbackend.dto.response.ApiResponse;
import cc.mymc.catbookbackend.dto.response.TimeSlotResponse;
import cc.mymc.catbookbackend.dto.response.TimeSlotDetailResponse;
import cc.mymc.catbookbackend.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * 时间段控制器
 */
@Tag(name = "时间段管理", description = "时间段可用性查询")
@RestController
@RequestMapping("/api/available-slots")
@RequiredArgsConstructor
public class TimeSlotController {

    private final BookingService bookingService;

    @Operation(summary = "获取可用时间段", description = "查询指定日期的可用时间段信息")
    @GetMapping
    public ApiResponse<List<TimeSlotResponse>> getAvailableSlots(
            @Parameter(description = "查询日期", example = "2023-12-15", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        List<TimeSlotResponse> slots = bookingService.getAvailableSlots(date);
        return ApiResponse.success(slots);
    }

    @Operation(summary = "获取时间段详情", description = "查询指定时间段的详细位置信息，显示5个位置的预约情况")
    @GetMapping("/detail")
    public ApiResponse<TimeSlotDetailResponse> getTimeSlotDetail(
            @Parameter(description = "查询日期", example = "2023-12-15", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @Parameter(description = "查询时间", example = "14:00", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime time) {
        
        TimeSlotDetailResponse detail = bookingService.getTimeSlotDetail(date, time);
        return ApiResponse.success(detail);
    }
}
