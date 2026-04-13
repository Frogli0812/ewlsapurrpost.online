package cc.mymc.catbookbackend.exception;

import cc.mymc.catbookbackend.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 全局异常处理器
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException e) {
        log.warn("业务异常: {}", e.getMessage());
        return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
    }

    /**
     * 处理参数验证异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException e) {
        List<String> errors = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());
        
        log.warn("参数验证失败: {}", errors);
        return ResponseEntity.badRequest()
                .body(ApiResponse.validationError(errors));
    }

    /**
     * 处理绑定异常
     */
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiResponse<Void>> handleBindException(BindException e) {
        List<String> errors = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());
        
        log.warn("参数绑定失败: {}", errors);
        return ResponseEntity.badRequest()
                .body(ApiResponse.validationError(errors));
    }

    /**
     * 处理约束违反异常
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConstraintViolationException(ConstraintViolationException e) {
        List<String> errors = e.getConstraintViolations()
                .stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.toList());
        
        log.warn("约束验证失败: {}", errors);
        return ResponseEntity.badRequest()
                .body(ApiResponse.validationError(errors));
    }

    /**
     * 处理静态资源找不到异常（避免无用的错误日志）
     */
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNoResourceFoundException(NoResourceFoundException e) {
        // 对于favicon.ico等常见静态资源请求，不记录错误日志
        String resourcePath = e.getResourcePath();
        if (resourcePath != null && (resourcePath.equals("favicon.ico") || 
                                   resourcePath.equals("api") || 
                                   resourcePath.endsWith(".html") ||
                                   resourcePath.endsWith(".css") ||
                                   resourcePath.endsWith(".js"))) {
            // 只记录debug级别日志，不产生ERROR日志
            log.debug("静态资源未找到: {}", resourcePath);
        } else {
            log.info("资源未找到: {}", resourcePath);
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("资源未找到"));
    }

    /**
     * 处理其他异常
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        // 对于静态资源找不到的异常，降低日志级别
        if (e instanceof NoResourceFoundException) {
            NoResourceFoundException nrfe = (NoResourceFoundException) e;
            String resourcePath = nrfe.getResourcePath();
            if (resourcePath != null && (resourcePath.equals("favicon.ico") || 
                                       resourcePath.equals("api") || 
                                       resourcePath.endsWith(".html") ||
                                       resourcePath.endsWith(".css") ||
                                       resourcePath.endsWith(".js"))) {
                log.debug("静态资源未找到: {}", resourcePath);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("资源未找到"));
            }
        }
        
        // 其他异常正常记录
        log.error("系统异常: {}", e.getMessage());
        log.debug("异常详情", e);  // 详细堆栈只在debug级别显示
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("服务器内部错误"));
    }
}
