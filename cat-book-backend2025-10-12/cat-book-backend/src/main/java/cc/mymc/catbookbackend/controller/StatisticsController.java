package cc.mymc.catbookbackend.controller;

import cc.mymc.catbookbackend.dto.response.ApiResponse;
import cc.mymc.catbookbackend.dto.response.StatisticsResponse;
import cc.mymc.catbookbackend.service.StatisticsService;
import cn.dev33.satoken.annotation.SaCheckRole;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 统计数据控制器
 */
@Tag(name = "统计数据", description = "系统统计数据查询")
@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    @Operation(summary = "获取统计数据", description = "获取系统的各项统计数据")
    @GetMapping
    @SaCheckRole("admin")
    public ApiResponse<StatisticsResponse> getStatistics() {
        StatisticsResponse statistics = statisticsService.getStatistics();
        return ApiResponse.success(statistics);
    }
}
