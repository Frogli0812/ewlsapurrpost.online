package cc.mymc.catbookbackend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 猫咪实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "cats")
public class Cat extends BaseEntity {

    @NotBlank(message = "猫咪名字不能为空")
    @Size(min = 1, max = 50, message = "猫咪名字长度必须在1-50字符之间")
    @Column(nullable = false, length = 50)
    private String name;

    @NotBlank(message = "品种不能为空")
    @Size(min = 1, max = 50, message = "品种长度必须在1-50字符之间")
    @Column(nullable = false, length = 50)
    private String breed;

    @Size(max = 500, message = "描述不能超过500字符")
    @Column(length = 500)
    private String description;

    @Column(length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(columnDefinition = "TEXT")
    private String traits;  // JSON格式存储特性，如：[{"name":"颜值","stars":5},{"name":"体重","stars":13}]

    @Size(max = 500, message = "特殊说明不能超过500字符")
    @Column(length = 500)
    private String specialNotes;
}
