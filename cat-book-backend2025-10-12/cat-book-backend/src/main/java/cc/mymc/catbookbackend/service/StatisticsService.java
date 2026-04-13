package cc.mymc.catbookbackend.service;

import cc.mymc.catbookbackend.dto.response.StatisticsResponse;
import cc.mymc.catbookbackend.entity.Booking;
import cc.mymc.catbookbackend.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 统计服务层
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final BookingRepository bookingRepository;
    private final CatService catService;

    /**
     * 获取系统统计数据
     */
    public StatisticsResponse getStatistics() {
        StatisticsResponse stats = new StatisticsResponse();
        
        // 猫咪总数
        stats.setTotalCats((int) catService.countActiveCats());
        
        // 预约统计
        long totalBookings = bookingRepository.countByStatus(Booking.BookingStatus.CONFIRMED) +
                           bookingRepository.countByStatus(Booking.BookingStatus.COMPLETED) +
                           bookingRepository.countByStatus(Booking.BookingStatus.CANCELLED) +
                           bookingRepository.countByStatus(Booking.BookingStatus.NO_SHOW);
        stats.setTotalBookings((int) totalBookings);
        
        long activeBookings = bookingRepository.countByStatus(Booking.BookingStatus.CONFIRMED);
        stats.setActiveBookings((int) activeBookings);
        
        long completedBookings = bookingRepository.countByStatus(Booking.BookingStatus.COMPLETED);
        stats.setCompletedBookings((int) completedBookings);
        
        long cancelledBookings = bookingRepository.countByStatus(Booking.BookingStatus.CANCELLED);
        stats.setCancelledBookings((int) cancelledBookings);
        
        // 访客总数
        Integer totalVisitors = bookingRepository.countTotalVisitors();
        stats.setTotalVisitors(totalVisitors != null ? totalVisitors : 0);
        
        // 计算取消率和完成率
        if (totalBookings > 0) {
            BigDecimal cancellationRate = BigDecimal.valueOf(cancelledBookings)
                    .divide(BigDecimal.valueOf(totalBookings), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            stats.setCancellationRate(cancellationRate.setScale(2, RoundingMode.HALF_UP).toString());
            
            BigDecimal completionRate = BigDecimal.valueOf(completedBookings)
                    .divide(BigDecimal.valueOf(totalBookings), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            stats.setCompletionRate(completionRate.setScale(2, RoundingMode.HALF_UP).toString());
        } else {
            stats.setCancellationRate("0.00");
            stats.setCompletionRate("0.00");
        }
        
        // 平均评分 (暂时设为固定值，后续可扩展评分功能)
        stats.setAverageRating(4.8);
        
        // 月度预约统计
        List<Object[]> monthlyData = bookingRepository.findMonthlyBookingStats();
        List<StatisticsResponse.MonthlyBooking> monthlyBookings = monthlyData.stream()
                .map(row -> new StatisticsResponse.MonthlyBooking((String) row[0], ((Number) row[1]).intValue()))
                .collect(Collectors.toList());
        stats.setMonthlyBookings(monthlyBookings);
        
        // 热门时间段统计
        List<Object[]> popularData = bookingRepository.findPopularTimeSlots();
        List<StatisticsResponse.PopularTimeSlot> popularTimeSlots = popularData.stream()
                .limit(10) // 取前10个
                .map(row -> new StatisticsResponse.PopularTimeSlot(row[0].toString(), ((Number) row[1]).intValue()))
                .collect(Collectors.toList());
        stats.setPopularTimeSlots(popularTimeSlots);
        
        stats.setGeneratedAt(LocalDateTime.now());
        
        log.info("生成统计数据成功");
        return stats;
    }
}
