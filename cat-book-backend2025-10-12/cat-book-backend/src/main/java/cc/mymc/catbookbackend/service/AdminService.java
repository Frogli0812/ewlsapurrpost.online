package cc.mymc.catbookbackend.service;

import cc.mymc.catbookbackend.entity.Admin;
import cc.mymc.catbookbackend.exception.BusinessException;
import cc.mymc.catbookbackend.repository.AdminRepository;
import cn.dev33.satoken.stp.StpUtil;
import cn.hutool.crypto.digest.BCrypt;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 管理员服务层
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    /**
     * 管理员登录
     */
    public String login(String username, String password) {
        Admin admin = adminRepository.findByUsernameAndIsActiveTrue(username)
                .orElseThrow(() -> new BusinessException("用户名或密码错误"));

        if (!BCrypt.checkpw(password, admin.getPassword())) {
            throw new BusinessException("用户名或密码错误");
        }

        // 登录成功，生成token
        StpUtil.login(admin.getId());
        // 存储角色信息
        StpUtil.getSession().set("role", admin.getRole().name());
        StpUtil.getSession().set("username", admin.getUsername());
        StpUtil.getSession().set("name", admin.getName());

        log.info("管理员登录成功，用户名: {}", username);
        return StpUtil.getTokenValue();
    }

    /**
     * 管理员登出
     */
    public void logout() {
        StpUtil.logout();
        log.info("管理员登出成功");
    }

    /**
     * 获取当前登录管理员信息
     */
    public Admin getCurrentAdmin() {
        if (!StpUtil.isLogin()) {
            throw new BusinessException("未登录");
        }

        Long adminId = StpUtil.getLoginIdAsLong();
        return adminRepository.findById(adminId)
                .orElseThrow(() -> new BusinessException("管理员不存在"));
    }

    /**
     * 创建管理员账号
     */
    @Transactional
    public Admin createAdmin(String username, String password, String name, String email, String phone) {
        if (adminRepository.existsByUsername(username)) {
            throw new BusinessException("用户名已存在");
        }

        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setPassword(BCrypt.hashpw(password, BCrypt.gensalt()));
        admin.setName(name);
        admin.setEmail(email);
        admin.setPhone(phone);
        admin.setRole(Admin.Role.ADMIN);

        Admin savedAdmin = adminRepository.save(admin);
        log.info("创建管理员账号成功，用户名: {}", username);

        return savedAdmin;
    }

    /**
     * 修改密码
     */
    @Transactional
    public void changePassword(String oldPassword, String newPassword) {
        Admin admin = getCurrentAdmin();

        if (!BCrypt.checkpw(oldPassword, admin.getPassword())) {
            throw new BusinessException("原密码错误");
        }

        admin.setPassword(BCrypt.hashpw(newPassword, BCrypt.gensalt()));
        adminRepository.save(admin);

        log.info("管理员修改密码成功，用户名: {}", admin.getUsername());
    }
}
