package cc.mymc.catbookbackend.repository;

import cc.mymc.catbookbackend.entity.Cat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 猫咪数据访问层
 */
@Repository
public interface CatRepository extends JpaRepository<Cat, Long> {

    /**
     * 查找所有活跃的猫咪
     */
    List<Cat> findByIsActiveTrue();

    /**
     * 根据品种查找猫咪
     */
    List<Cat> findByBreedContainingIgnoreCase(String breed);

    /**
     * 统计活跃猫咪数量
     */
    @Query("SELECT COUNT(c) FROM Cat c WHERE c.isActive = true")
    long countActiveCats();
}
