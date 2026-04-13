package cc.mymc.catbookbackend.config;

import cc.mymc.catbookbackend.entity.Admin;
import cc.mymc.catbookbackend.entity.Cat;
import cc.mymc.catbookbackend.entity.Booking;
import cc.mymc.catbookbackend.repository.AdminRepository;
import cc.mymc.catbookbackend.repository.CatRepository;
import cc.mymc.catbookbackend.repository.BookingRepository;
import cn.hutool.crypto.digest.BCrypt;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * 数据初始化器
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final CatRepository catRepository;
    private final BookingRepository bookingRepository;

    @Override
    public void run(String... args) {
        initAdminData();
        initCatData();
    }

    /**
     * 初始化管理员数据
     */
    private void initAdminData() {
        if (adminRepository.count() == 0) {
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword(BCrypt.hashpw("123456", BCrypt.gensalt()));
            admin.setName("系统管理员");
            admin.setEmail("admin@example.com");
            admin.setPhone("13800138000");
            admin.setRole(Admin.Role.SUPER_ADMIN);
            
            adminRepository.save(admin);
            log.info("初始化管理员账号成功: username=admin, password=123456");
        }
    }

    /**
     * 初始化猫咪数据
     */
    private void initCatData() {
        // 更新现有猫咪的图片URL（如果没有的话）
        updateExistingCatsImages();
        
        if (catRepository.count() == 0) {
            // 小花 - 布偶猫
            Cat cat1 = new Cat();
            cat1.setName("小花");
            cat1.setBreed("布偶猫");
            cat1.setDescription("猫舍最资深的员工，心理咨询室的交际花（不过暑假过后已经胖成煤气罐了）");
            cat1.setTraits("[{\"name\":\"颜值\",\"stars\":5},{\"name\":\"体重\",\"stars\":13}]");
            cat1.setImageUrl("https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=600&fit=crop");
            catRepository.save(cat1);

            // 豆豆 - 西伯利亚森林猫
            Cat cat2 = new Cat();
            cat2.setName("豆豆");
            cat2.setBreed("西伯利亚森林猫");
            cat2.setDescription("猫舍神秘嘉宾，很少露面（据说摸过豆豆的人都发大财了）");
            cat2.setTraits("[{\"name\":\"颜值\",\"stars\":5},{\"name\":\"神秘指数\",\"stars\":4}]");
            cat2.setImageUrl("https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=600&h=600&fit=crop");
            catRepository.save(cat2);

            // 小wlsa - 奶牛猫
            Cat cat3 = new Cat();
            cat3.setName("小wlsa");
            cat3.setBreed("奶牛猫");
            cat3.setDescription("如今已经焕然一新的流浪猫，但是攻击性略强（畏）");
            cat3.setTraits("[{\"name\":\"颜值\",\"stars\":3},{\"name\":\"攻击性\",\"stars\":4}]");
            cat3.setImageUrl("https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=600&h=600&fit=crop");
            catRepository.save(cat3);

            // 肉松 - 橘猫
            Cat cat4 = new Cat();
            cat4.setName("肉松");
            cat4.setBreed("橘猫");
            cat4.setDescription("最新成员，胆子大，极其亲人，喜欢探索自己的\"领地\"");
            cat4.setTraits("[{\"name\":\"颜值\",\"stars\":4},{\"name\":\"外向\",\"stars\":5}]");
            cat4.setImageUrl("https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&h=600&fit=crop");
            catRepository.save(cat4);

            log.info("初始化猫咪数据成功，共{}只猫咪", catRepository.count());
        }
        
        initSampleBookings();
    }

    /**
     * 更新现有猫咪的图片URL
     */
    private void updateExistingCatsImages() {
        java.util.List<cc.mymc.catbookbackend.entity.Cat> allCats = catRepository.findAll();
        
        for (cc.mymc.catbookbackend.entity.Cat cat : allCats) {
            // 如果猫咪没有图片URL，则添加
            if (cat.getImageUrl() == null || cat.getImageUrl().trim().isEmpty()) {
                switch (cat.getName()) {
                    case "小花":
                        cat.setImageUrl("https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=600&fit=crop");
                        break;
                    case "豆豆":
                        cat.setImageUrl("https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=600&h=600&fit=crop");
                        break;
                    case "小wlsa":
                        cat.setImageUrl("https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=600&h=600&fit=crop");
                        break;
                    case "肉松":
                        cat.setImageUrl("https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&h=600&fit=crop");
                        break;
                    default:
                        cat.setImageUrl("https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop");
                        break;
                }
                catRepository.save(cat);
                log.info("更新猫咪 {} 的图片URL", cat.getName());
            }
        }
    }

    /**
     * 初始化示例预约数据
     */
    private void initSampleBookings() {
        if (bookingRepository.count() == 0) {
            java.time.LocalDate today = java.time.LocalDate.now();
            java.time.LocalDate tomorrow = today.plusDays(1);
            
            // 今天14:00的预约示例
            Booking booking1 = new Booking();
            booking1.setDate(today);
            booking1.setTime(java.time.LocalTime.of(14, 0));
            booking1.setStudentName("张三");
            booking1.setStudentClass("计算机1班");
            booking1.setPosition(1);
            booking1.setNote("第一次来撸猫");
            bookingRepository.save(booking1);

            // 今天14:00的另一个预约
            Booking booking2 = new Booking();
            booking2.setDate(today);
            booking2.setTime(java.time.LocalTime.of(14, 0));
            booking2.setStudentName("李四");
            booking2.setStudentClass("软件工程2班");
            booking2.setPosition(3);
            booking2.setNote("很喜欢小猫");
            bookingRepository.save(booking2);

            // 明天10:00的预约
            Booking booking3 = new Booking();
            booking3.setDate(tomorrow);
            booking3.setTime(java.time.LocalTime.of(10, 0));
            booking3.setStudentName("王五");
            booking3.setStudentClass("数据科学1班");
            booking3.setPosition(2);
            booking3.setNote("带朋友一起来");
            bookingRepository.save(booking3);

            log.info("初始化示例预约数据成功，共{}条预约", bookingRepository.count());
        }
    }
}
