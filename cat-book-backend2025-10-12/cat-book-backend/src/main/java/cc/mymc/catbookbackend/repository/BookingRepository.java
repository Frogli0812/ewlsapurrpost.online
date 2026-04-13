package cc.mymc.catbookbackend.repository;

import cc.mymc.catbookbackend.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * 预约数据访问层
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * 根据日期查询预约列表
     */
    List<Booking> findByDate(LocalDate date);

    /**
     * 根据日期和时间查询预约列表
     */
    List<Booking> findByDateAndTime(LocalDate date, LocalTime time);

    /**
     * 根据班级查询预约列表
     */
    List<Booking> findByStudentClass(String studentClass);

    /**
     * 根据学生姓名查询预约列表
     */
    List<Booking> findByStudentName(String studentName);

    /**
     * 根据班级和姓名查询预约列表
     */
    List<Booking> findByStudentClassAndStudentName(String studentClass, String studentName);

    /**
     * 根据状态查询预约列表
     */
    List<Booking> findByStatus(Booking.BookingStatus status);

    /**
     * 分页查询预约列表
     */
    Page<Booking> findByDateOrderByTimeAscPositionAsc(LocalDate date, Pageable pageable);

    /**
     * 根据班级分页查询预约列表
     */
    Page<Booking> findByStudentClassOrderByDateDescTimeDesc(String studentClass, Pageable pageable);

    /**
     * 根据状态分页查询预约列表
     */
    Page<Booking> findByStatusOrderByDateDescTimeDesc(Booking.BookingStatus status, Pageable pageable);

    /**
     * 查询指定日期和时间段的所有预约
     */
    List<Booking> findByDateAndTimeAndStatusOrderByPosition(LocalDate date, LocalTime time, Booking.BookingStatus status);

    /**
     * 检查指定位置是否已被预约
     */
    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.date = :date AND b.time = :time AND b.position = :position AND b.status = 'CONFIRMED'")
    boolean existsByDateAndTimeAndPosition(@Param("date") LocalDate date, @Param("time") LocalTime time, @Param("position") Integer position);

    /**
     * 统计指定日期和时间段的已预约位置数
     */
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.date = :date AND b.time = :time AND b.status = 'CONFIRMED'")
    Integer countBookedPositionsByDateAndTime(@Param("date") LocalDate date, @Param("time") LocalTime time);

    /**
     * 统计总预约数
     */
    long countByStatus(Booking.BookingStatus status);

    /**
     * 统计指定日期范围内的预约数
     */
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.date BETWEEN :startDate AND :endDate AND b.status = :status")
    long countByDateRangeAndStatus(@Param("startDate") LocalDate startDate, 
                                 @Param("endDate") LocalDate endDate, 
                                 @Param("status") Booking.BookingStatus status);

    /**
     * 统计总访客数（按位置计算）
     */
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'COMPLETED'")
    Integer countTotalVisitors();

    /**
     * 查询热门时间段
     */
    @Query("SELECT b.time, COUNT(b) as count FROM Booking b WHERE b.status = 'CONFIRMED' OR b.status = 'COMPLETED' GROUP BY b.time ORDER BY count DESC")
    List<Object[]> findPopularTimeSlots();

    /**
     * 查询月度预约统计
     */
    @Query("SELECT FUNCTION('DATE_FORMAT', b.date, '%Y-%m') as month, COUNT(b) as count FROM Booking b WHERE b.status != 'CANCELLED' GROUP BY month ORDER BY month")
    List<Object[]> findMonthlyBookingStats();

    /**
     * 查询班级预约统计
     */
    @Query("SELECT b.studentClass, COUNT(b) as count FROM Booking b WHERE b.status = 'CONFIRMED' OR b.status = 'COMPLETED' GROUP BY b.studentClass ORDER BY count DESC")
    List<Object[]> findClassBookingStats();
}
