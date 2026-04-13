package cc.mymc.catbookbackend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 管理员实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "admins", indexes = {
    @Index(name = "idx_admin_username", columnList = "username", unique = true)
})
public class Admin extends BaseEntity {

    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度必须在3-20字符之间")
    @Column(nullable = false, unique = true, length = 20)
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, message = "密码长度不能少于6个字符")
    @Column(nullable = false)
    private String password;

    @NotBlank(message = "姓名不能为空")
    @Size(min = 2, max = 20, message = "姓名长度必须在2-20字符之间")
    @Column(nullable = false, length = 20)
    private String name;

    @Email(message = "邮箱格式无效")
    @Size(max = 100, message = "邮箱长度不能超过100字符")
    @Column(length = 100)
    private String email;

    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式无效")
    @Column(length = 11)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.ADMIN;

    @Column(nullable = false)
    private Boolean isActive = true;

    /**
     * 角色枚举
     */
    public enum Role {
        SUPER_ADMIN("超级管理员"),
        ADMIN("管理员");

        private final String description;

        Role(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }
}
