# OpenAPI definition


**简介**:OpenAPI definition


**HOST**:http://localhost:8081


**联系人**:


**Version**:v0


**接口路径**:/v3/api-docs


[TOC]






# 统计数据


## 获取统计数据


**接口地址**:`/api/statistics`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取系统的各项统计数据</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseStatisticsResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|StatisticsResponse|StatisticsResponse|
|&emsp;&emsp;totalCats|猫咪总数|integer(int32)||
|&emsp;&emsp;totalBookings|总预约数|integer(int32)||
|&emsp;&emsp;totalVisitors|总访客数|integer(int32)||
|&emsp;&emsp;activeBookings|活跃预约数|integer(int32)||
|&emsp;&emsp;completedBookings|已完成预约数|integer(int32)||
|&emsp;&emsp;cancelledBookings|已取消预约数|integer(int32)||
|&emsp;&emsp;cancellationRate|取消率(%)|string||
|&emsp;&emsp;completionRate|完成率(%)|string||
|&emsp;&emsp;averageRating|平均评分|number(double)||
|&emsp;&emsp;monthlyBookings|月度预约统计|array|MonthlyBooking|
|&emsp;&emsp;&emsp;&emsp;month|月份|string||
|&emsp;&emsp;&emsp;&emsp;count|预约数量|integer(int32)||
|&emsp;&emsp;popularTimeSlots|热门时间段|array|PopularTimeSlot|
|&emsp;&emsp;&emsp;&emsp;time|时间|string||
|&emsp;&emsp;&emsp;&emsp;count|预约次数|integer(int32)||
|&emsp;&emsp;generatedAt|统计生成时间|string(date-time)||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": {
		"totalCats": 3,
		"totalBookings": 156,
		"totalVisitors": 156,
		"activeBookings": 12,
		"completedBookings": 128,
		"cancelledBookings": 16,
		"cancellationRate": 10.26,
		"completionRate": 82.05,
		"averageRating": 4.8,
		"monthlyBookings": [
			{
				"month": "2023-12",
				"count": 45
			}
		],
		"popularTimeSlots": [
			{
				"time": "14:00",
				"count": 28
			}
		],
		"generatedAt": ""
	},
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


# 管理员管理


## 管理员登出


**接口地址**:`/api/admin/logout`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员登出系统</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseVoid|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|string||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": {},
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


## 管理员登录


**接口地址**:`/api/admin/login`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员用户名密码登录</p>



**请求示例**:


```javascript
{
  "username": "admin",
  "password": 123456
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|adminLoginRequest|管理员登录请求|body|true|AdminLoginRequest|AdminLoginRequest|
|&emsp;&emsp;username|用户名||true|string||
|&emsp;&emsp;password|密码||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseMapStringObject|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|object||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": {},
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


## 修改密码


**接口地址**:`/api/admin/change-password`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员修改自己的密码</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseVoid|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|string||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": {},
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


## 获取当前管理员信息


**接口地址**:`/api/admin/profile`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取当前登录管理员的详细信息</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseAdmin|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|Admin|Admin|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;username||string||
|&emsp;&emsp;password||string||
|&emsp;&emsp;name||string||
|&emsp;&emsp;email||string||
|&emsp;&emsp;phone||string||
|&emsp;&emsp;role|可用值:SUPER_ADMIN,ADMIN|string||
|&emsp;&emsp;isActive||boolean||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": {
		"id": 0,
		"createdAt": "",
		"updatedAt": "",
		"username": "",
		"password": "",
		"name": "",
		"email": "",
		"phone": "",
		"role": "",
		"isActive": true
	},
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


## 检查登录状态


**接口地址**:`/api/admin/check`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>检查当前用户是否已登录</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseMapStringObject|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|object||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": {},
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


# 猫咪管理


## 获取指定猫咪信息


**接口地址**:`/api/cats/{catId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据猫咪ID获取详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|catId|猫咪ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseCat|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|Cat|Cat|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;name||string||
|&emsp;&emsp;breed||string||
|&emsp;&emsp;age||number(double)||
|&emsp;&emsp;personality||string||
|&emsp;&emsp;favoriteToy||string||
|&emsp;&emsp;imageUrl||string||
|&emsp;&emsp;isActive||boolean||
|&emsp;&emsp;healthStatus|可用值:HEALTHY,SICK,RECOVERING|string||
|&emsp;&emsp;specialNotes||string||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": {
		"id": 0,
		"createdAt": "",
		"updatedAt": "",
		"name": "",
		"breed": "",
		"age": 0,
		"personality": "",
		"favoriteToy": "",
		"imageUrl": "",
		"isActive": true,
		"healthStatus": "",
		"specialNotes": ""
	},
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


## 更新猫咪信息


**接口地址**:`/api/cats/{catId}`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新指定猫咪的信息</p>



**请求示例**:


```javascript
{
  "name": "橘子",
  "breed": "橘猫",
  "age": 2,
  "personality": "温顺、贪吃、喜欢被摸肚子",
  "favoriteToy": "毛线球",
  "imageUrl": "",
  "isActive": true,
  "healthStatus": "HEALTHY",
  "specialNotes": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|catId|猫咪ID|path|true|integer(int64)||
|catCreateRequest|创建猫咪请求|body|true|CatCreateRequest|CatCreateRequest|
|&emsp;&emsp;name|猫咪名字||true|string||
|&emsp;&emsp;breed|品种||true|string||
|&emsp;&emsp;age|年龄(岁)||true|number(double)||
|&emsp;&emsp;personality|性格描述||false|string||
|&emsp;&emsp;favoriteToy|最喜欢的玩具||false|string||
|&emsp;&emsp;imageUrl|照片URL||false|string||
|&emsp;&emsp;isActive|是否活跃||false|boolean||
|&emsp;&emsp;healthStatus|健康状态,可用值:HEALTHY,SICK,RECOVERING||false|string||
|&emsp;&emsp;specialNotes|特殊说明||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseCat|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|Cat|Cat|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;name||string||
|&emsp;&emsp;breed||string||
|&emsp;&emsp;age||number(double)||
|&emsp;&emsp;personality||string||
|&emsp;&emsp;favoriteToy||string||
|&emsp;&emsp;imageUrl||string||
|&emsp;&emsp;isActive||boolean||
|&emsp;&emsp;healthStatus|可用值:HEALTHY,SICK,RECOVERING|string||
|&emsp;&emsp;specialNotes||string||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": {
		"id": 0,
		"createdAt": "",
		"updatedAt": "",
		"name": "",
		"breed": "",
		"age": 0,
		"personality": "",
		"favoriteToy": "",
		"imageUrl": "",
		"isActive": true,
		"healthStatus": "",
		"specialNotes": ""
	},
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


## 删除猫咪信息


**接口地址**:`/api/cats/{catId}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>从系统中删除指定猫咪（软删除，设置为不活跃状态）</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|catId|猫咪ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseVoid|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|string||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": {},
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


## 获取所有猫咪信息


**接口地址**:`/api/cats`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>返回系统中所有活跃猫咪的信息列表</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseListCat|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|array|Cat|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;name||string||
|&emsp;&emsp;breed||string||
|&emsp;&emsp;age||number(double)||
|&emsp;&emsp;personality||string||
|&emsp;&emsp;favoriteToy||string||
|&emsp;&emsp;imageUrl||string||
|&emsp;&emsp;isActive||boolean||
|&emsp;&emsp;healthStatus|可用值:HEALTHY,SICK,RECOVERING|string||
|&emsp;&emsp;specialNotes||string||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": [
		{
			"id": 0,
			"createdAt": "",
			"updatedAt": "",
			"name": "",
			"breed": "",
			"age": 0,
			"personality": "",
			"favoriteToy": "",
			"imageUrl": "",
			"isActive": true,
			"healthStatus": "",
			"specialNotes": ""
		}
	],
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


## 添加新猫咪


**接口地址**:`/api/cats`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>添加新的猫咪信息到系统中</p>



**请求示例**:


```javascript
{
  "name": "橘子",
  "breed": "橘猫",
  "age": 2,
  "personality": "温顺、贪吃、喜欢被摸肚子",
  "favoriteToy": "毛线球",
  "imageUrl": "",
  "isActive": true,
  "healthStatus": "HEALTHY",
  "specialNotes": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|catCreateRequest|创建猫咪请求|body|true|CatCreateRequest|CatCreateRequest|
|&emsp;&emsp;name|猫咪名字||true|string||
|&emsp;&emsp;breed|品种||true|string||
|&emsp;&emsp;age|年龄(岁)||true|number(double)||
|&emsp;&emsp;personality|性格描述||false|string||
|&emsp;&emsp;favoriteToy|最喜欢的玩具||false|string||
|&emsp;&emsp;imageUrl|照片URL||false|string||
|&emsp;&emsp;isActive|是否活跃||false|boolean||
|&emsp;&emsp;healthStatus|健康状态,可用值:HEALTHY,SICK,RECOVERING||false|string||
|&emsp;&emsp;specialNotes|特殊说明||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseCat|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|Cat|Cat|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;name||string||
|&emsp;&emsp;breed||string||
|&emsp;&emsp;age||number(double)||
|&emsp;&emsp;personality||string||
|&emsp;&emsp;favoriteToy||string||
|&emsp;&emsp;imageUrl||string||
|&emsp;&emsp;isActive||boolean||
|&emsp;&emsp;healthStatus|可用值:HEALTHY,SICK,RECOVERING|string||
|&emsp;&emsp;specialNotes||string||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": {
		"id": 0,
		"createdAt": "",
		"updatedAt": "",
		"name": "",
		"breed": "",
		"age": 0,
		"personality": "",
		"favoriteToy": "",
		"imageUrl": "",
		"isActive": true,
		"healthStatus": "",
		"specialNotes": ""
	},
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


## 根据品种搜索猫咪


**接口地址**:`/api/cats/search`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据品种名称搜索相关猫咪</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|breed|品种名称|query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseListCat|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|array|Cat|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;name||string||
|&emsp;&emsp;breed||string||
|&emsp;&emsp;age||number(double)||
|&emsp;&emsp;personality||string||
|&emsp;&emsp;favoriteToy||string||
|&emsp;&emsp;imageUrl||string||
|&emsp;&emsp;isActive||boolean||
|&emsp;&emsp;healthStatus|可用值:HEALTHY,SICK,RECOVERING|string||
|&emsp;&emsp;specialNotes||string||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": [
		{
			"id": 0,
			"createdAt": "",
			"updatedAt": "",
			"name": "",
			"breed": "",
			"age": 0,
			"personality": "",
			"favoriteToy": "",
			"imageUrl": "",
			"isActive": true,
			"healthStatus": "",
			"specialNotes": ""
		}
	],
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


# 时间段管理


## 获取可用时间段


**接口地址**:`/api/available-slots`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>查询指定日期的可用时间段信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|date|查询日期|query|true|string(date)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseListTimeSlotResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|array|TimeSlotResponse|
|&emsp;&emsp;time|时间|string||
|&emsp;&emsp;date|日期|string(date)||
|&emsp;&emsp;totalCapacity|总容量|integer(int32)||
|&emsp;&emsp;bookedCount|已预约人数|integer(int32)||
|&emsp;&emsp;availableCapacity|剩余容量|integer(int32)||
|&emsp;&emsp;isAvailable|是否可预约|boolean||
|&emsp;&emsp;isFull|是否已满|boolean||
|&emsp;&emsp;notes|特殊说明|string||
|&emsp;&emsp;timeSlotDescription|时间段描述|string||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": [
		{
			"time": "14:00",
			"date": "2023-12-15",
			"totalCapacity": 5,
			"bookedCount": 2,
			"availableCapacity": 3,
			"isAvailable": true,
			"isFull": false,
			"notes": "",
			"timeSlotDescription": "14:00-14:30"
		}
	],
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


## 获取时间段详情


**接口地址**:`/api/available-slots/detail`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>查询指定时间段的详细位置信息，显示5个位置的预约情况</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|date|查询日期|query|true|string(date)||
|time|查询时间|query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseTimeSlotDetailResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|TimeSlotDetailResponse|TimeSlotDetailResponse|
|&emsp;&emsp;date|日期|string(date)||
|&emsp;&emsp;time|时间|string||
|&emsp;&emsp;timeSlotDescription|时间段描述|string||
|&emsp;&emsp;totalPositions|总位置数|integer(int32)||
|&emsp;&emsp;bookedPositions|已预约位置数|integer(int32)||
|&emsp;&emsp;availablePositions|剩余位置数|integer(int32)||
|&emsp;&emsp;isFull|是否已满|boolean||
|&emsp;&emsp;positions|位置详情列表|array|PositionInfo|
|&emsp;&emsp;&emsp;&emsp;position|位置编号|integer(int32)||
|&emsp;&emsp;&emsp;&emsp;isBooked|是否已预约|boolean||
|&emsp;&emsp;&emsp;&emsp;studentName|学生姓名|string||
|&emsp;&emsp;&emsp;&emsp;studentClass|班级|string||
|&emsp;&emsp;&emsp;&emsp;studentIdentity|学生标识|string||
|&emsp;&emsp;&emsp;&emsp;bookingId|预约ID|integer(int64)||
|&emsp;&emsp;&emsp;&emsp;note|备注|string||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
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
				"note": "第一次来"
			}
		]
	},
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


# 系统健康


## 健康检查


**接口地址**:`/api/health`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>检查API服务健康状态</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


# 预约管理


## 获取预约详情


**接口地址**:`/api/bookings/{bookingId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据预约ID获取详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|bookingId|预约ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseBooking|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|Booking|Booking|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;date||string(date)||
|&emsp;&emsp;time||string||
|&emsp;&emsp;studentName||string||
|&emsp;&emsp;studentClass||string||
|&emsp;&emsp;position||integer(int32)||
|&emsp;&emsp;note||string||
|&emsp;&emsp;status|可用值:CONFIRMED,CANCELLED,COMPLETED,NO_SHOW|string||
|&emsp;&emsp;cancelledAt||string(date-time)||
|&emsp;&emsp;cancelReason||string||
|&emsp;&emsp;studentIdentity||string||
|&emsp;&emsp;timeSlotDescription||string||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": {
		"id": 0,
		"createdAt": "",
		"updatedAt": "",
		"date": "",
		"time": "",
		"studentName": "",
		"studentClass": "",
		"position": 0,
		"note": "",
		"status": "",
		"cancelledAt": "",
		"cancelReason": "",
		"studentIdentity": "",
		"timeSlotDescription": ""
	},
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


## 更新预约信息


**接口地址**:`/api/bookings/{bookingId}`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新预约的详细信息</p>



**请求示例**:


```javascript
{
  "date": "2023-12-15",
  "time": "14:00",
  "studentName": "张三",
  "studentClass": "计算机1班",
  "position": 1,
  "note": "第一次来，很期待"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|bookingId|预约ID|path|true|integer(int64)||
|studentBookingRequest|学生预约请求|body|true|StudentBookingRequest|StudentBookingRequest|
|&emsp;&emsp;date|预约日期||true|string(date)||
|&emsp;&emsp;time|预约时间||true|string||
|&emsp;&emsp;studentName|学生姓名||true|string||
|&emsp;&emsp;studentClass|班级||true|string||
|&emsp;&emsp;position|预约位置(1-5)||true|integer(int32)||
|&emsp;&emsp;note|备注信息||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseBooking|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|Booking|Booking|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;date||string(date)||
|&emsp;&emsp;time||string||
|&emsp;&emsp;studentName||string||
|&emsp;&emsp;studentClass||string||
|&emsp;&emsp;position||integer(int32)||
|&emsp;&emsp;note||string||
|&emsp;&emsp;status|可用值:CONFIRMED,CANCELLED,COMPLETED,NO_SHOW|string||
|&emsp;&emsp;cancelledAt||string(date-time)||
|&emsp;&emsp;cancelReason||string||
|&emsp;&emsp;studentIdentity||string||
|&emsp;&emsp;timeSlotDescription||string||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": {
		"id": 0,
		"createdAt": "",
		"updatedAt": "",
		"date": "",
		"time": "",
		"studentName": "",
		"studentClass": "",
		"position": 0,
		"note": "",
		"status": "",
		"cancelledAt": "",
		"cancelReason": "",
		"studentIdentity": "",
		"timeSlotDescription": ""
	},
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


## 取消预约


**接口地址**:`/api/bookings/{bookingId}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>取消指定的预约（学生社团使用，无需验证）</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|bookingId|预约ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseVoid|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|string||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": {},
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


## 获取预约列表


**接口地址**:`/api/bookings`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取预约列表，支持查询参数过滤</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|date|按日期过滤|query|false|string(date)||
|status|按状态过滤,可用值:CONFIRMED,CANCELLED,COMPLETED,NO_SHOW|query|false|string||
|studentClass|按班级查询|query|false|string||
|page|页码|query|false|integer(int32)||
|limit|每页数量|query|false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseMapStringObject|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|object||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": {},
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


## 创建新预约


**接口地址**:`/api/bookings`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>学生创建新的预约</p>



**请求示例**:


```javascript
{
  "date": "2023-12-15",
  "time": "14:00",
  "studentName": "张三",
  "studentClass": "计算机1班",
  "position": 1,
  "note": "第一次来，很期待"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|studentBookingRequest|学生预约请求|body|true|StudentBookingRequest|StudentBookingRequest|
|&emsp;&emsp;date|预约日期||true|string(date)||
|&emsp;&emsp;time|预约时间||true|string||
|&emsp;&emsp;studentName|学生姓名||true|string||
|&emsp;&emsp;studentClass|班级||true|string||
|&emsp;&emsp;position|预约位置(1-5)||true|integer(int32)||
|&emsp;&emsp;note|备注信息||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseBooking|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|Booking|Booking|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;date||string(date)||
|&emsp;&emsp;time||string||
|&emsp;&emsp;studentName||string||
|&emsp;&emsp;studentClass||string||
|&emsp;&emsp;position||integer(int32)||
|&emsp;&emsp;note||string||
|&emsp;&emsp;status|可用值:CONFIRMED,CANCELLED,COMPLETED,NO_SHOW|string||
|&emsp;&emsp;cancelledAt||string(date-time)||
|&emsp;&emsp;cancelReason||string||
|&emsp;&emsp;studentIdentity||string||
|&emsp;&emsp;timeSlotDescription||string||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": {
		"id": 0,
		"createdAt": "",
		"updatedAt": "",
		"date": "",
		"time": "",
		"studentName": "",
		"studentClass": "",
		"position": 0,
		"note": "",
		"status": "",
		"cancelledAt": "",
		"cancelReason": "",
		"studentIdentity": "",
		"timeSlotDescription": ""
	},
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


## 根据学生查询预约


**接口地址**:`/api/bookings/by-student`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>查询指定学生的预约记录</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|studentClass|班级|query|true|string||
|studentName|学生姓名|query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseListBooking|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|array|Booking|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;date||string(date)||
|&emsp;&emsp;time||string||
|&emsp;&emsp;studentName||string||
|&emsp;&emsp;studentClass||string||
|&emsp;&emsp;position||integer(int32)||
|&emsp;&emsp;note||string||
|&emsp;&emsp;status|可用值:CONFIRMED,CANCELLED,COMPLETED,NO_SHOW|string||
|&emsp;&emsp;cancelledAt||string(date-time)||
|&emsp;&emsp;cancelReason||string||
|&emsp;&emsp;studentIdentity||string||
|&emsp;&emsp;timeSlotDescription||string||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": [
		{
			"id": 0,
			"createdAt": "",
			"updatedAt": "",
			"date": "",
			"time": "",
			"studentName": "",
			"studentClass": "",
			"position": 0,
			"note": "",
			"status": "",
			"cancelledAt": "",
			"cancelReason": "",
			"studentIdentity": "",
			"timeSlotDescription": ""
		}
	],
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```


## 根据班级查询预约


**接口地址**:`/api/bookings/by-class`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>查询指定班级的预约记录</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|studentClass|班级|query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponseListBooking|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|操作是否成功|boolean||
|data|响应数据|array|Booking|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;date||string(date)||
|&emsp;&emsp;time||string||
|&emsp;&emsp;studentName||string||
|&emsp;&emsp;studentClass||string||
|&emsp;&emsp;position||integer(int32)||
|&emsp;&emsp;note||string||
|&emsp;&emsp;status|可用值:CONFIRMED,CANCELLED,COMPLETED,NO_SHOW|string||
|&emsp;&emsp;cancelledAt||string(date-time)||
|&emsp;&emsp;cancelReason||string||
|&emsp;&emsp;studentIdentity||string||
|&emsp;&emsp;timeSlotDescription||string||
|message|响应消息|string||
|errors|错误信息列表|array||
|timestamp|响应时间戳|string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"success": true,
	"data": [
		{
			"id": 0,
			"createdAt": "",
			"updatedAt": "",
			"date": "",
			"time": "",
			"studentName": "",
			"studentClass": "",
			"position": 0,
			"note": "",
			"status": "",
			"cancelledAt": "",
			"cancelReason": "",
			"studentIdentity": "",
			"timeSlotDescription": ""
		}
	],
	"message": "操作成功",
	"errors": [],
	"timestamp": "2023-12-01T10:00:00"
}
```