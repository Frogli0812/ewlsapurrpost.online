# 猫咪信息 API 文档

## 获取所有活跃猫咪列表

### 接口信息
- **接口路径**: `GET /api/cats`
- **接口描述**: 获取所有活跃状态的猫咪列表
- **是否需要认证**: 否

### 请求参数
无

### 响应示例

```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "name": "小花",
      "breed": "布偶猫",
      "description": "猫舍最资深的员工，心理咨询室的交际花（不过暑假过后已经胖成煤气罐了）",
      "imageUrl": "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=600&fit=crop",
      "traits": "[{\"name\":\"颜值\",\"stars\":5},{\"name\":\"体重\",\"stars\":13}]",
      "isActive": true,
      "specialNotes": null,
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    },
    {
      "id": 2,
      "name": "豆豆",
      "breed": "西伯利亚森林猫",
      "description": "猫舍神秘嘉宾，很少露面（据说摸过豆豆的人都发大财了）",
      "imageUrl": "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=600&h=600&fit=crop",
      "traits": "[{\"name\":\"颜值\",\"stars\":5},{\"name\":\"神秘指数\",\"stars\":4}]",
      "isActive": true,
      "specialNotes": null,
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    },
    {
      "id": 3,
      "name": "小wlsa",
      "breed": "奶牛猫",
      "description": "如今已经焕然一新的流浪猫，但是攻击性略强（畏）",
      "imageUrl": "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=600&h=600&fit=crop",
      "traits": "[{\"name\":\"颜值\",\"stars\":3},{\"name\":\"攻击性\",\"stars\":4}]",
      "isActive": true,
      "specialNotes": null,
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    },
    {
      "id": 4,
      "name": "肉松",
      "breed": "橘猫",
      "description": "最新成员，胆子大，极其亲人，喜欢探索自己的\"领地\"",
      "imageUrl": "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&h=600&fit=crop",
      "traits": "[{\"name\":\"颜值\",\"stars\":4},{\"name\":\"外向\",\"stars\":5}]",
      "isActive": true,
      "specialNotes": null,
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    }
  ]
}
```

### 响应字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 响应状态码，200表示成功 |
| message | String | 响应消息 |
| data | Array | 猫咪列表数组 |
| data[].id | Long | 猫咪ID |
| data[].name | String | 猫咪名称 |
| data[].breed | String | 猫咪品种 |
| data[].description | String | 猫咪描述信息 |
| data[].imageUrl | String | 猫咪照片URL |
| data[].traits | String | 猫咪特性（JSON字符串格式） |
| data[].isActive | Boolean | 是否活跃 |
| data[].specialNotes | String | 特殊说明（可为null） |
| data[].createdAt | DateTime | 创建时间 |
| data[].updatedAt | DateTime | 更新时间 |

### traits 字段格式说明

`traits` 字段是一个JSON字符串，需要前端解析后使用。格式如下：

```json
[
  {
    "name": "颜值",
    "stars": 5
  },
  {
    "name": "体重",
    "stars": 13
  }
]
```

- `name`: 特性名称（如：颜值、体重、神秘指数、攻击性、外向等）
- `stars`: 星级评分（1-15星，根据不同特性可能有不同的最大值）

### 前端使用示例（Vue3）

```javascript
// 获取猫咪列表
const getCats = async () => {
  try {
    const response = await fetch('/api/cats');
    const result = await response.json();
    
    if (result.code === 200) {
      // 解析traits字段
      const cats = result.data.map(cat => ({
        ...cat,
        traits: cat.traits ? JSON.parse(cat.traits) : []
      }));
      
      console.log(cats);
      // cats[0].traits = [{"name":"颜值","stars":5}, {"name":"体重","stars":13}]
    }
  } catch (error) {
    console.error('获取猫咪列表失败', error);
  }
};
```

### 前端展示示例（Vue3 Template）

```vue
<template>
  <div class="cat-list">
    <div v-for="cat in cats" :key="cat.id" class="cat-card">
      <img :src="cat.imageUrl" :alt="cat.name" />
      <h3>{{ cat.name }}</h3>
      <p class="breed">{{ cat.breed }}</p>
      <p class="description">{{ cat.description }}</p>
      
      <div class="traits">
        <div v-for="trait in cat.traits" :key="trait.name" class="trait-item">
          <span class="trait-name">{{ trait.name }}</span>
          <span class="stars">{{ '⭐️'.repeat(trait.stars) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const cats = ref([]);

onMounted(async () => {
  const response = await fetch('/api/cats');
  const result = await response.json();
  
  if (result.code === 200) {
    cats.value = result.data.map(cat => ({
      ...cat,
      traits: cat.traits ? JSON.parse(cat.traits) : []
    }));
  }
});
</script>
```

---

## 获取单个猫咪详情

### 接口信息
- **接口路径**: `GET /api/cats/{id}`
- **接口描述**: 根据ID获取猫咪详细信息
- **是否需要认证**: 否

### 请求参数

| 参数名 | 类型 | 位置 | 必填 | 说明 |
|--------|------|------|------|------|
| id | Long | Path | 是 | 猫咪ID |

### 响应示例

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "name": "小花",
    "breed": "布偶猫",
    "description": "猫舍最资深的员工，心理咨询室的交际花（不过暑假过后已经胖成煤气罐了）",
    "imageUrl": "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=600&fit=crop",
    "traits": "[{\"name\":\"颜值\",\"stars\":5},{\"name\":\"体重\",\"stars\":13}]",
    "isActive": true,
    "specialNotes": null,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
}
```

---

## 数据变更说明

### 已移除的字段（旧版本）
- `age` (Double) - 年龄
- `personality` (String) - 性格描述
- `favoriteToy` (String) - 最喜欢的玩具
- `healthStatus` (Enum) - 健康状态

### 新增的字段（新版本）
- `description` (String) - 猫咪描述信息
- `traits` (String) - 猫咪特性（JSON格式）

### 迁移建议
如果前端代码中使用了旧字段，请按以下方式调整：
- 使用 `description` 替代 `personality`、`favoriteToy` 的组合展示
- 使用 `traits` 数组中的特性替代固定的星级展示
- 不再依赖 `age` 和 `healthStatus` 字段

