# 前端API接口文档

## 猫咪信息接口

### 获取猫咪列表

**接口地址**: `GET /api/cats`

**请求参数**: 无

**响应格式**:

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
      "traits": "[{\"name\":\"颜值\",\"stars\":5},{\"name\":\"体重\",\"stars\":13}]",
      "imageUrl": "https://example.com/cat1.jpg",
      "isActive": true
    },
    {
      "id": 2,
      "name": "豆豆",
      "breed": "西伯利亚森林猫",
      "description": "猫舍神秘嘉宾，很少露面（据说摸过豆豆的人都发大财了）",
      "traits": "[{\"name\":\"颜值\",\"stars\":5},{\"name\":\"神秘指数\",\"stars\":4}]",
      "imageUrl": "https://example.com/cat2.jpg",
      "isActive": true
    },
    {
      "id": 3,
      "name": "小wlsa",
      "breed": "奶牛猫",
      "description": "如今已经焕然一新的流浪猫，但是攻击性略强（畏）",
      "traits": "[{\"name\":\"颜值\",\"stars\":3},{\"name\":\"攻击性\",\"stars\":4}]",
      "imageUrl": "https://example.com/cat3.jpg",
      "isActive": true
    },
    {
      "id": 4,
      "name": "肉松",
      "breed": "橘猫",
      "description": "最新成员，胆子大，极其亲人，喜欢探索自己的"领地"",
      "traits": "[{\"name\":\"颜值\",\"stars\":4},{\"name\":\"外向\",\"stars\":5}]",
      "imageUrl": "https://example.com/cat4.jpg",
      "isActive": true
    }
  ]
}
```

## 字段说明

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `id` | Number | 猫咪ID | `1` |
| `name` | String | 猫咪名称 | `"小花"` |
| `breed` | String | 猫咪品种 | `"布偶猫"` |
| `description` | String | 猫咪描述 | `"猫舍最资深的员工..."` |
| `traits` | String (JSON) | 猫咪特征（需要JSON解析） | `"[{\"name\":\"颜值\",\"stars\":5}]"` |
| `imageUrl` | String | 猫咪图片URL | `"https://example.com/cat.jpg"` |
| `isActive` | Boolean | 是否活跃 | `true` |

## Traits字段解析

`traits` 字段是一个JSON字符串，解析后为数组格式：

```javascript
// 原始字段
"traits": "[{\"name\":\"颜值\",\"stars\":5},{\"name\":\"体重\",\"stars\":13}]"

// 解析后
[
  {"name": "颜值", "stars": 5},
  {"name": "体重", "stars": 13}
]
```

### Traits对象说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `name` | String | 特征名称（如：颜值、体重、神秘指数、攻击性、外向等） |
| `stars` | Number | 星级评分（1-13，用于显示星星数量） |

## 前端处理示例

```javascript
// 1. 获取猫咪数据
const response = await fetch('/api/cats');
const result = await response.json();

if (result.code === 200) {
  const cats = result.data;
  
  // 2. 解析每只猫的traits
  cats.forEach(cat => {
    // 解析JSON字符串
    const traits = JSON.parse(cat.traits);
    
    // 3. 渲染特征
    traits.forEach(trait => {
      const stars = '⭐️'.repeat(trait.stars);
      console.log(`${trait.name}: ${stars}`);
    });
  });
}
```

## 显示效果示例

**小花（布偶猫）**
- 猫舍最资深的员工，心理咨询室的交际花（不过暑假过后已经胖成煤气罐了）
- 颜值 ⭐️⭐️⭐️⭐️⭐️
- 体重 ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️

**豆豆（西伯利亚森林猫）**
- 猫舍神秘嘉宾，很少露面（据说摸过豆豆的人都发大财了）
- 颜值 ⭐️⭐️⭐️⭐️⭐️
- 神秘指数 ⭐️⭐️⭐️⭐️

**小wlsa（奶牛猫）**
- 如今已经焕然一新的流浪猫，但是攻击性略强（畏）
- 颜值 ⭐️⭐️⭐️
- 攻击性 ⭐️⭐️⭐️⭐️

**肉松（橘猫）**
- 最新成员，胆子大，极其亲人，喜欢探索自己的"领地"
- 颜值 ⭐️⭐️⭐️⭐️
- 外向 ⭐️⭐️⭐️⭐️⭐️

## 错误处理

**错误响应格式**:

```json
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```

## 注意事项

1. ⚠️ **traits字段是字符串类型**，需要使用 `JSON.parse()` 解析
2. ⚠️ **imageUrl需要图床支持**，建议使用CDN或图床服务
3. ⚠️ **stars可以大于5**（如体重13颗星），前端需支持动态渲染
4. ✅ **isActive字段**可用于过滤不活跃的猫咪
5. ✅ **响应格式统一**，都包含 `code`, `message`, `data` 三个字段

## 更新建议

### 给后端的建议

如果后端可以修改，建议将 `traits` 改为数组类型而非字符串：

```json
{
  "id": 1,
  "name": "小花",
  "traits": [
    {"name": "颜值", "stars": 5},
    {"name": "体重", "stars": 13}
  ]
}
```

这样前端就不需要额外的JSON解析步骤。

### 前端兼容性处理

当前前端代码已经做了兼容处理，支持两种格式：

```javascript
let traits = [];
try {
  if (typeof cat.traits === 'string') {
    traits = JSON.parse(cat.traits);  // 字符串格式
  } else if (Array.isArray(cat.traits)) {
    traits = cat.traits;  // 数组格式
  }
} catch (e) {
  console.warn('解析traits失败:', e);
  traits = [];
}
```

