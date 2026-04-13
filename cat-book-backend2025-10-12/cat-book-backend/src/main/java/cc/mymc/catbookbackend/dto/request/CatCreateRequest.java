package cc.mymc.catbookbackend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * 创建猫咪请求DTO
 */
@Data
@Schema(description = "创建猫咪请求")
public class CatCreateRequest {

    @NotBlank(message = "猫咪名字不能为空")
    @Size(min = 1, max = 50, message = "猫咪名字长度必须在1-50字符之间")
    @Schema(description = "猫咪名字", example = "小花")
    private String name;

    @NotBlank(message = "品种不能为空")
    @Size(min = 1, max = 50, message = "品种长度必须在1-50字符之间")
    @Schema(description = "品种", example = "布偶猫")
    private String breed;

    @Size(max = 500, message = "描述不能超过500字符")
    @Schema(description = "猫咪描述", example = "猫舍最资深的员工，心理咨询室的交际花")
    private String description;

    @Schema(description = "照片URL")
    private String imageUrl;

    @Schema(description = "是否活跃", example = "true")
    private Boolean isActive = true;

    @Schema(description = "特性JSON字符串", example = "[{\"name\":\"颜值\",\"stars\":5},{\"name\":\"体重\",\"stars\":13}]")
    private String traits;

    @Size(max = 500, message = "特殊说明不能超过500字符")
    @Schema(description = "特殊说明")
    private String specialNotes;
}
