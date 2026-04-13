package cc.mymc.catbookbackend.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 统一API响应格式
 */
@Data
@Schema(description = "API响应")
public class ApiResponse<T> {

    @Schema(description = "操作是否成功", example = "true")
    private Boolean success;

    @Schema(description = "响应数据")
    private T data;

    @Schema(description = "响应消息", example = "操作成功")
    private String message;

    @Schema(description = "错误信息列表")
    private List<String> errors;

    @Schema(description = "响应时间戳", example = "2023-12-01T10:00:00")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    public ApiResponse() {
        this.timestamp = LocalDateTime.now();
        this.errors = new ArrayList<>();
    }

    public ApiResponse(Boolean success, T data, String message) {
        this();
        this.success = success;
        this.data = data;
        this.message = message;
    }

    public ApiResponse(Boolean success, T data, String message, List<String> errors) {
        this(success, data, message);
        this.errors = errors != null ? errors : new ArrayList<>();
    }

    /**
     * 创建成功响应
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, "");
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, data, message);
    }

    public static <T> ApiResponse<T> success() {
        return new ApiResponse<>(true, null, "");
    }

    /**
     * 创建失败响应
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message);
    }

    public static <T> ApiResponse<T> error(String message, List<String> errors) {
        return new ApiResponse<>(false, null, message, errors);
    }

    /**
     * 创建验证错误响应
     */
    public static <T> ApiResponse<T> validationError(List<String> errors) {
        return new ApiResponse<>(false, null, "数据验证失败", errors);
    }
}
