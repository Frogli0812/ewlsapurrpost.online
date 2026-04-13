package cc.mymc.catbookbackend.util;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 业务工具类
 */
public class BusinessUtil {

    // 营业时间配置
    public static final int START_HOUR = 16;
    public static final int END_HOUR = 17;
    public static final int TIME_SLOT_DURATION = 15; // 分钟
    public static final List<Integer> CLOSED_DAYS = List.of(); // 每天都可以预约
    
    // 午休时间（不再使用）
    public static final LocalTime LUNCH_START = LocalTime.of(13, 0);
    public static final LocalTime LUNCH_END = LocalTime.of(14, 0);

    /**
     * 生成所有营业时间段（3个时间段）
     */
    public static List<LocalTime> generateTimeSlots() {
        List<LocalTime> timeSlots = new ArrayList<>();
        
        // 固定的时间段列表
        timeSlots.add(LocalTime.of(16, 0));  // 16:00-16:15
        timeSlots.add(LocalTime.of(16, 20)); // 16:20-16:35
        timeSlots.add(LocalTime.of(16, 40)); // 16:40-16:55
        
        return timeSlots;
    }

    /**
     * 检查是否为营业日
     */
    public static boolean isBusinessDay(LocalDate date) {
        int dayOfWeek = date.getDayOfWeek().getValue(); // 1=周一, 7=周日
        return !CLOSED_DAYS.contains(dayOfWeek);
    }

    /**
     * 检查是否为营业时间（匹配固定的时间段列表）
     */
    public static boolean isBusinessTime(LocalTime time) {
        return generateTimeSlots().contains(time);
    }

    /**
     * 格式化时间段描述
     */
    public static String formatTimeSlot(LocalTime startTime) {
        LocalTime endTime = startTime.plusMinutes(TIME_SLOT_DURATION);
        return String.format("%02d:%02d-%02d:%02d", 
                           startTime.getHour(), startTime.getMinute(),
                           endTime.getHour(), endTime.getMinute());
    }

    /**
     * 验证手机号格式
     */
    public static boolean isValidPhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return false;
        }
        return phone.matches("^1[3-9]\\d{9}$");
    }

    /**
     * 验证邮箱格式
     */
    public static boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return true; // 邮箱可选
        }
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }
}
