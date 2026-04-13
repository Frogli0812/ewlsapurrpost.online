package cc.mymc.catbookbackend.controller;

import cc.mymc.catbookbackend.dto.request.CatCreateRequest;
import cc.mymc.catbookbackend.dto.response.ApiResponse;
import cc.mymc.catbookbackend.entity.Cat;
import cc.mymc.catbookbackend.service.CatService;
import cn.dev33.satoken.annotation.SaCheckRole;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 猫咪管理控制器
 */
@Tag(name = "猫咪管理", description = "猫咪信息的增删改查")
@RestController
@RequestMapping("/api/cats")
@RequiredArgsConstructor
public class CatController {

    private final CatService catService;

    @Operation(summary = "获取所有猫咪信息", description = "返回系统中所有活跃猫咪的信息列表")
    @GetMapping
    public ApiResponse<List<Cat>> getAllCats() {
        List<Cat> cats = catService.getAllActiveCats();
        return ApiResponse.success(cats);
    }

    @Operation(summary = "获取指定猫咪信息", description = "根据猫咪ID获取详细信息")
    @GetMapping("/{catId}")
    public ApiResponse<Cat> getCatById(
            @Parameter(description = "猫咪ID", example = "1")
            @PathVariable Long catId) {
        Cat cat = catService.getCatById(catId);
        return ApiResponse.success(cat);
    }

    @Operation(summary = "添加新猫咪", description = "添加新的猫咪信息到系统中")
    @PostMapping
    @SaCheckRole("admin")
    public ApiResponse<Cat> createCat(@Valid @RequestBody CatCreateRequest request) {
        Cat cat = catService.createCat(request);
        return ApiResponse.success(cat, "猫咪添加成功");
    }

    @Operation(summary = "更新猫咪信息", description = "更新指定猫咪的信息")
    @PutMapping("/{catId}")
    @SaCheckRole("admin")
    public ApiResponse<Cat> updateCat(
            @Parameter(description = "猫咪ID", example = "1")
            @PathVariable Long catId,
            @Valid @RequestBody CatCreateRequest request) {
        Cat cat = catService.updateCat(catId, request);
        return ApiResponse.success(cat, "猫咪信息更新成功");
    }

    @Operation(summary = "删除猫咪信息", description = "从系统中删除指定猫咪（软删除，设置为不活跃状态）")
    @DeleteMapping("/{catId}")
    @SaCheckRole("admin")
    public ApiResponse<Void> deleteCat(
            @Parameter(description = "猫咪ID", example = "1")
            @PathVariable Long catId) {
        catService.deleteCat(catId);
        return ApiResponse.success(null, "猫咪删除成功");
    }

    @Operation(summary = "根据品种搜索猫咪", description = "根据品种名称搜索相关猫咪")
    @GetMapping("/search")
    public ApiResponse<List<Cat>> searchCatsByBreed(
            @Parameter(description = "品种名称", example = "橘猫")
            @RequestParam String breed) {
        List<Cat> cats = catService.searchCatsByBreed(breed);
        return ApiResponse.success(cats);
    }
}
