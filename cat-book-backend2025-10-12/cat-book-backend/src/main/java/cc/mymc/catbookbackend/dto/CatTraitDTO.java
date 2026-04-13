package cc.mymc.catbookbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 猫咪特性DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CatTraitDTO {
    /**
     * 特性名称，如：颜值、体重、神秘指数、攻击性、外向
     */
    private String name;
    
    /**
     * 星级评分（1-15星）
     */
    private Integer stars;
}

