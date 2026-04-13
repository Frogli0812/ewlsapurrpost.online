package cc.mymc.catbookbackend.controller;

import cc.mymc.catbookbackend.dto.request.AdminLoginRequest;
import cc.mymc.catbookbackend.dto.response.ApiResponse;
import cc.mymc.catbookbackend.entity.Admin;
import cc.mymc.catbookbackend.service.AdminService;
import cn.dev33.satoken.annotation.SaCheckRole;
import cn.dev33.satoken.stp.StpUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 管理员控制器
 */
@Tag(name = "管理员管理", description = "管理员登录和权限管理")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @Operation(summary = "管理员登录", description = "管理员用户名密码登录")
    @PostMapping("/login")
    public ApiResponse<Map<String, Object>> login(@Valid @RequestBody AdminLoginRequest request) {
        String token = adminService.login(request.getUsername(), request.getPassword());
        
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("tokenName", StpUtil.getTokenName());
        result.put("loginId", StpUtil.getLoginId());
        
        return ApiResponse.success(result, "登录成功");
    }

    @Operation(summary = "管理员登出", description = "管理员登出系统")
    @PostMapping("/logout")
    @SaCheckRole("admin")
    public ApiResponse<Void> logout() {
        adminService.logout();
        return ApiResponse.success(null, "登出成功");
    }

    @Operation(summary = "获取当前管理员信息", description = "获取当前登录管理员的详细信息")
    @GetMapping("/profile")
    @SaCheckRole("admin")
    public ApiResponse<Admin> getProfile() {
        Admin admin = adminService.getCurrentAdmin();
        // 隐藏密码
        admin.setPassword(null);
        return ApiResponse.success(admin);
    }

    @Operation(summary = "检查登录状态", description = "检查当前用户是否已登录")
    @GetMapping("/check")
    public ApiResponse<Map<String, Object>> checkLogin() {
        Map<String, Object> result = new HashMap<>();
        result.put("isLogin", StpUtil.isLogin());
        
        if (StpUtil.isLogin()) {
            result.put("loginId", StpUtil.getLoginId());
            result.put("tokenTimeout", StpUtil.getTokenTimeout());
            result.put("role", StpUtil.getSession().get("role"));
            result.put("username", StpUtil.getSession().get("username"));
            result.put("name", StpUtil.getSession().get("name"));
        }
        
        return ApiResponse.success(result);
    }

    @Operation(summary = "修改密码", description = "管理员修改自己的密码")
    @PostMapping("/change-password")
    @SaCheckRole("admin")
    public ApiResponse<Void> changePassword(@RequestBody Map<String, String> request) {
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");
        
        adminService.changePassword(oldPassword, newPassword);
        return ApiResponse.success(null, "密码修改成功");
    }
}
