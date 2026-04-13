package cc.mymc.catbookbackend.controller;

import cc.mymc.catbookbackend.dto.request.StudentBookingRequest;
import cc.mymc.catbookbackend.dto.response.ApiResponse;
import cc.mymc.catbookbackend.dto.response.TimeSlotResponse;
import cc.mymc.catbookbackend.dto.response.TimeSlotDetailResponse;
import cc.mymc.catbookbackend.entity.Booking;
import cc.mymc.catbookbackend.service.BookingService;
import cn.dev33.satoken.annotation.SaCheckRole;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 预约管理控制器
 */
@Tag(name = "预约管理", description = "用户预约相关操作")
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @Operation(summary = "获取预约列表", description = "获取预约列表，支持查询参数过滤")
    @GetMapping
    @SaCheckRole("admin")
    public ApiResponse<Map<String, Object>> getBookings(
            @Parameter(description = "按日期过滤", example = "2023-12-15")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            
            @Parameter(description = "按状态过滤", example = "CONFIRMED")
            @RequestParam(required = false) Booking.BookingStatus status,
            
            @Parameter(description = "按班级查询", example = "计算机1班")
            @RequestParam(required = false) String studentClass,
            
            @Parameter(description = "页码", example = "1")
            @RequestParam(defaultValue = "1") int page,
            
            @Parameter(description = "每页数量", example = "20")
            @RequestParam(defaultValue = "20") int limit) {
        
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<Booking> bookingsPage = bookingService.getBookings(date, status, studentClass, pageable);
        
        Map<String, Object> result = new HashMap<>();
        result.put("bookings", bookingsPage.getContent());
        
        Map<String, Object> pagination = new HashMap<>();
        pagination.put("page", page);
        pagination.put("limit", limit);
        pagination.put("total", bookingsPage.getTotalElements());
        pagination.put("totalPages", bookingsPage.getTotalPages());
        pagination.put("hasNext", bookingsPage.hasNext());
        pagination.put("hasPrev", bookingsPage.hasPrevious());
        result.put("pagination", pagination);
        
        return ApiResponse.success(result);
    }

    @Operation(summary = "创建新预约", description = "学生创建新的预约")
    @PostMapping
    public ApiResponse<Booking> createBooking(@Valid @RequestBody StudentBookingRequest request) {
        Booking booking = bookingService.createBooking(request);
        return ApiResponse.success(booking, "预约创建成功");
    }

    @Operation(summary = "获取预约详情", description = "根据预约ID获取详细信息")
    @GetMapping("/{bookingId}")
    public ApiResponse<Booking> getBookingById(
            @Parameter(description = "预约ID", example = "123")
            @PathVariable Long bookingId) {
        Booking booking = bookingService.getBookingById(bookingId);
        return ApiResponse.success(booking);
    }

    @Operation(summary = "更新预约信息", description = "更新预约的详细信息")
    @PutMapping("/{bookingId}")
    @SaCheckRole("admin")
    public ApiResponse<Booking> updateBooking(
            @Parameter(description = "预约ID", example = "123")
            @PathVariable Long bookingId,
            @Valid @RequestBody StudentBookingRequest request) {
        Booking booking = bookingService.updateBooking(bookingId, request);
        return ApiResponse.success(booking, "预约信息更新成功");
    }

    @Operation(summary = "取消预约", description = "取消指定的预约（学生社团使用，无需验证）")
    @DeleteMapping("/{bookingId}")
    public ApiResponse<Void> cancelBooking(
            @Parameter(description = "预约ID", example = "123")
            @PathVariable Long bookingId,
            @RequestBody(required = false) Map<String, String> body) {
        
        String cancelReason = body != null ? body.get("cancelReason") : "学生主动取消";
        bookingService.cancelBookingDirect(bookingId, cancelReason);
        return ApiResponse.success(null, "预约已成功取消");
    }

    @Operation(summary = "根据班级查询预约", description = "查询指定班级的预约记录")
    @GetMapping("/by-class")
    public ApiResponse<List<Booking>> getBookingsByClass(
            @Parameter(description = "班级", example = "计算机1班")
            @RequestParam String studentClass) {
        List<Booking> bookings = bookingService.getBookingsByClass(studentClass);
        return ApiResponse.success(bookings);
    }

    @Operation(summary = "根据学生查询预约", description = "查询指定学生的预约记录")
    @GetMapping("/by-student")
    public ApiResponse<List<Booking>> getBookingsByStudent(
            @Parameter(description = "班级", example = "计算机1班")
            @RequestParam String studentClass,
            @Parameter(description = "学生姓名", example = "张三")
            @RequestParam String studentName) {
        List<Booking> bookings = bookingService.getBookingsByStudent(studentClass, studentName);
        return ApiResponse.success(bookings);
    }
}
