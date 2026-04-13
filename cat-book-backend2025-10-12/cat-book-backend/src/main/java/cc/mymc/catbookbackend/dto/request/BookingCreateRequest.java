package cc.mymc.catbookbackend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * 创建预约请求DTO
 */
@Data
@Schema(description = "创建预约请求")
public class BookingCreateRequest {

    @NotNull(message = "预约日期不能为空")
    @Schema(description = "预约日期", example = "2023-12-15")
    private LocalDate date;

    @NotNull(message = "预约时间不能为空")
    @Schema(description = "预约时间", example = "14:00")
    private LocalTime time;

    @NotBlank(message = "预约人姓名不能为空")
    @Size(min = 2, max = 20, message = "姓名长度必须在2-20字符之间")
    @Schema(description = "预约人姓名", example = "张三")
    private String name;

    @NotBlank(message = "联系电话不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式无效")
    @Schema(description = "联系电话", example = "13800138000")
    private String phone;

    @Size(max = 200, message = "备注信息不能超过200字符")
    @Schema(description = "备注信息", example = "第一次来，很期待")
    private String note;

    @NotNull(message = "预约人数不能为空")
    @Min(value = 1, message = "预约人数不能少于1人")
    @Max(value = 5, message = "预约人数不能超过5人")
    @Schema(description = "预约人数", example = "2")
    private Integer numberOfPeople = 1;

    @Email(message = "邮箱格式无效")
    @Size(max = 100, message = "邮箱长度不能超过100字符")
    @Schema(description = "邮箱(可选)", example = "zhang@example.com")
    private String email;

    @Size(max = 50, message = "紧急联系人信息不能超过50字符")
    @Schema(description = "紧急联系人(可选)")
    private String emergencyContact;
}
