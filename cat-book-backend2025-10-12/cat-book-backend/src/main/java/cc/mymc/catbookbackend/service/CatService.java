package cc.mymc.catbookbackend.service;

import cc.mymc.catbookbackend.dto.request.CatCreateRequest;
import cc.mymc.catbookbackend.entity.Cat;
import cc.mymc.catbookbackend.exception.BusinessException;
import cc.mymc.catbookbackend.repository.CatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 猫咪服务层
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CatService {

    private final CatRepository catRepository;

    /**
     * 获取所有活跃猫咪
     */
    public List<Cat> getAllActiveCats() {
        return catRepository.findByIsActiveTrue();
    }

    /**
     * 根据ID获取猫咪详情
     */
    public Cat getCatById(Long id) {
        return catRepository.findById(id)
                .orElseThrow(() -> new BusinessException("猫咪不存在"));
    }

    /**
     * 创建新猫咪
     */
    @Transactional
    public Cat createCat(CatCreateRequest request) {
        Cat cat = new Cat();
        BeanUtils.copyProperties(request, cat);
        
        Cat savedCat = catRepository.save(cat);
        log.info("创建猫咪成功，ID: {}, 名称: {}", savedCat.getId(), savedCat.getName());
        
        return savedCat;
    }

    /**
     * 更新猫咪信息
     */
    @Transactional
    public Cat updateCat(Long id, CatCreateRequest request) {
        Cat cat = getCatById(id);
        
        BeanUtils.copyProperties(request, cat, "id", "createdAt");
        
        Cat updatedCat = catRepository.save(cat);
        log.info("更新猫咪信息成功，ID: {}, 名称: {}", updatedCat.getId(), updatedCat.getName());
        
        return updatedCat;
    }

    /**
     * 删除猫咪（软删除）
     */
    @Transactional
    public void deleteCat(Long id) {
        Cat cat = getCatById(id);
        cat.setIsActive(false);
        
        catRepository.save(cat);
        log.info("删除猫咪成功，ID: {}, 名称: {}", cat.getId(), cat.getName());
    }

    /**
     * 根据品种搜索猫咪
     */
    public List<Cat> searchCatsByBreed(String breed) {
        return catRepository.findByBreedContainingIgnoreCase(breed);
    }

    /**
     * 统计活跃猫咪数量
     */
    public long countActiveCats() {
        return catRepository.countActiveCats();
    }
}
