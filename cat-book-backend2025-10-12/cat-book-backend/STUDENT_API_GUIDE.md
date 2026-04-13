# 学生社团撸猫预约系统 - API使用指南

## 🎯 系统特点

- ✅ **无需登录**：学生可直接预约，无需注册账号
- ✅ **真实位置**：每个时间段有5个真实座位，显示具体占用情况
- ✅ **班级管理**：使用班级+姓名进行学生身份识别
- ✅ **多时段预约**：一个学生可以预约多个时间段
- ✅ **实时数据**：所有位置信息都是真实的，不是模拟数据

## 🚀 核心API接口

### 1. 查看可用时间段

```http
GET /api/available-slots?date=2023-12-15
```

**返回示例：**
```json
{
  "success": true,
  "data": [
    {
      "time": "10:00",
      "date": "2023-12-15",
      "timeSlotDescription": "10:00-10:30",
      "totalCapacity": 5,
      "bookedCount": 2,
      "availableCapacity": 3,
      "isAvailable": true,
      "isFull": false
    }
  ]
}
```

### 2. 查看时间段详情（🔥 核心功能）

```http
GET /api/available-slots/detail?date=2023-12-15&time=14:00
```

**返回示例：**
```json
{
  "success": true,
  "data": {
    "date": "2023-12-15",
    "time": "14:00",
    "timeSlotDescription": "14:00-14:30",
    "totalPositions": 5,
    "bookedPositions": 2,
    "availablePositions": 3,
    "isFull": false,
    "positions": [
      {
        "position": 1,
        "isBooked": true,
        "studentName": "张三",
        "studentClass": "计算机1班",
        "studentIdentity": "计算机1班 - 张三",
        "bookingId": 123,
        "note": "第一次来撸猫"
      },
      {
        "position": 2,
        "isBooked": false
      },
      {
        "position": 3,
        "isBooked": true,
        "studentName": "李四",
        "studentClass": "软件工程2班",
        "studentIdentity": "软件工程2班 - 李四",
        "bookingId": 124,
        "note": "很喜欢小猫"
      },
      {
        "position": 4,
        "isBooked": false
      },
      {
        "position": 5,
        "isBooked": false
      }
    ]
  }
}
```

### 3. 创建预约

```http
POST /api/bookings
Content-Type: application/json

{
  "date": "2023-12-15",
  "time": "14:00",
  "studentName": "王五",
  "studentClass": "数据科学1班",
  "position": 2,
  "note": "第一次来，很期待"
}
```

### 4. 取消预约

```http
DELETE /api/bookings/123
Content-Type: application/json

{
  "cancelReason": "临时有事无法前来"
}
```

### 5. 查询学生预约记录

```http
GET /api/bookings/by-student?studentClass=计算机1班&studentName=张三
```

```http
GET /api/bookings/by-class?studentClass=计算机1班
```

## 📱 前端开发建议

### 时间段选择页面
```javascript
// 1. 获取可用时间段
async function loadTimeSlots(date) {
    const response = await fetch(`/api/available-slots?date=${date}`);
    const data = await response.json();
    
    // 显示时间段列表，每个时间段显示剩余位置数
    data.data.forEach(slot => {
        console.log(`${slot.timeSlotDescription}: 剩余${slot.availableCapacity}个位置`);
    });
}
```

### 位置详情页面（🔥 核心页面）
```javascript
// 2. 点击时间段，显示详细位置信息
async function showTimeSlotDetail(date, time) {
    const response = await fetch(`/api/available-slots/detail?date=${date}&time=${time}`);
    const data = await response.json();
    
    // 显示5个位置的详细信息
    data.data.positions.forEach(position => {
        if (position.isBooked) {
            console.log(`位置${position.position}: ${position.studentIdentity} - ${position.note}`);
        } else {
            console.log(`位置${position.position}: 空闲 [+ 预约按钮]`);
        }
    });
}
```

### 预约创建
```javascript
// 3. 点击空闲位置的"+"按钮，创建预约
async function createBooking(date, time, position) {
    const bookingData = {
        date: date,
        time: time,
        studentName: "张三",
        studentClass: "计算机1班", 
        position: position,
        note: "第一次来撸猫"
    };
    
    const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    });
    
    if (response.ok) {
        alert('预约成功！');
        // 刷新位置信息
        showTimeSlotDetail(date, time);
    }
}
```

## 📊 业务规则

### 时间规则
- **营业时间**：周二至周日 10:00-18:00
- **休息时间**：周一全天休息
- **时间段**：30分钟一个时间段

### 预约规则
- **位置数量**：每个时间段固定5个位置
- **取消限制**：预约时间前1小时可取消
- **多时段预约**：同一学生可预约多个时间段
- **信息要求**：必须提供真实的班级和姓名

### 数据展示
- **真实姓名**：显示预约学生的真实班级和姓名
- **实时更新**：位置状态实时更新，不是假数据
- **位置编号**：1-5号固定位置，便于现场管理

## 🎨 前端UI建议

### 时间段选择界面
```
[日期选择器: 2023-12-15]

可用时间段：
┌─────────────────────────┐
│ 10:00-10:30  剩余3位置    │ ← 点击进入详情页
├─────────────────────────┤
│ 10:30-11:00  剩余5位置    │
├─────────────────────────┤
│ 14:00-14:30  剩余1位置    │
├─────────────────────────┤
│ 14:30-15:00  已满        │
└─────────────────────────┘
```

### 位置详情界面（核心界面）
```
2023-12-15  14:00-14:30

位置布局：
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│   1号    │   2号    │   3号    │   4号    │   5号    │
│ 计算机1班 │   [+]   │ 软工2班  │   [+]   │   [+]   │
│   张三   │  空闲位置  │   李四   │  空闲位置  │  空闲位置  │
│第一次来撸猫│         │很喜欢小猫 │         │         │
└─────────┴─────────┴─────────┴─────────┴─────────┘

说明：
- 已预约位置显示：班级、姓名、备注
- 空闲位置显示：[+] 按钮，点击可预约
- 位置编号固定，便于现场座位管理
```

## 🔧 管理员功能

管理员需要登录后可以：
- 查看所有预约数据
- 修改/取消任意预约
- 管理猫咪信息
- 查看统计数据

**管理员登录：**
- 用户名：`admin`
- 密码：`123456`

---

**🐱 这样学生们就可以看到真实的位置预约情况，知道和谁一起撸猫啦！**
