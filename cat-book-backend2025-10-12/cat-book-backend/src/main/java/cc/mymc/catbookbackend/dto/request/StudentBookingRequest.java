package cc.mymc.catbookbackend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * 学生预约请求DTO
 */
@Data
@Schema(description = "学生预约请求")
public class StudentBookingRequest {

    @NotNull(message = "预约日期不能为空")
    @Schema(description = "预约日期", example = "2023-12-15")
    private LocalDate date;

    @NotNull(message = "预约时间不能为空")
    @Schema(description = "预约时间", example = "14:00")
    private LocalTime time;

    @NotBlank(message = "学生姓名不能为空")
    @Size(min = 2, max = 20, message = "学生姓名长度必须在2-20字符之间")
    @Schema(description = "学生姓名", example = "张三")
    private String studentName;

    @NotBlank(message = "班级不能为空")
    @Size(min = 2, max = 50, message = "班级长度必须在2-50字符之间")
    @Schema(description = "班级", example = "计算机1班")
    private String studentClass;

    @NotNull(message = "预约位置不能为空")
    @Min(value = 1, message = "位置编号必须在1-5之间")
    @Max(value = 5, message = "位置编号必须在1-5之间")
    @Schema(description = "预约位置(1-5)", example = "1")
    private Integer position;

    @Size(max = 200, message = "备注信息不能超过200字符")
    @Schema(description = "备注信息", example = "第一次来，很期待")
    private String note;
}
