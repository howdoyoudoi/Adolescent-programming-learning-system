# 青少年编程平台 API 文档

## 基础信息

- 基础URL: `https://fylogmmflhxi.sealosbja.site/api/v1`
- 认证方式: Bearer Token
- 响应格式: JSON

## 认证

所有接口（除注册和登录外）都需要在请求头中添加：
```
Authorization: Bearer <token>
```

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": {
    // 具体数据
  }
}
```

### 错误响应
```json
{
  "success": false,
  "message": "错误信息"
}
```

## 用户接口

### 用户注册
- **URL**: `/users/register`
- **方法**: POST
- **请求体**:
```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

### 用户登录
- **URL**: `/users/login`
- **方法**: POST
- **请求体**:
```json
{
  "username": "string",
  "password": "string"
}
```

### 获取用户信息
- **URL**: `/users/me`
- **方法**: GET
- **需要认证**: 是

## 项目接口

### 获取项目列表
- **URL**: `/projects`
- **方法**: GET
- **需要认证**: 是
- **响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "userId": "number",
      "module": "string",
      "title": "string",
      "description": "string",
      "filePath": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

### 上传项目
- **URL**: `/projects`
- **方法**: POST
- **需要认证**: 是
- **请求格式**: multipart/form-data
- **参数**:
  - `module`: 模块名称（Python/Blockly）
  - `title`: 项目标题
  - `description`: 项目描述（可选）
  - `file`: 项目文件（.py/.json/.txt）
- **文件限制**:
  - 大小: 最大10MB
  - 类型: .py, .json, .txt

### 删除项目
- **URL**: `/projects/:id`
- **方法**: DELETE
- **需要认证**: 是

## 课程接口

### 获取课程列表
- **URL**: `/courses`
- **方法**: GET
- **需要认证**: 是

### 获取课程详情
- **URL**: `/courses/:id`
- **方法**: GET
- **需要认证**: 是

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 注意事项

1. 所有请求和响应都使用 UTF-8 编码
2. 文件上传接口使用 multipart/form-data 格式
3. 时间格式统一使用 ISO 8601 标准
4. 分页参数（如果支持）使用 page 和 pageSize
5. 所有接口都支持 CORS 跨域访问

## 示例代码

### 前端请求示例（使用 axios）

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://fylogmmflhxi.sealosbja.site/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 设置请求拦截器
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 获取项目列表
const getProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    console.error('获取项目列表失败:', error);
    throw error;
  }
};

// 上传项目
const uploadProject = async (formData) => {
  try {
    const response = await api.post('/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('上传项目失败:', error);
    throw error;
  }
};
```

## 更新日志

- 2024-03-xx: 初始版本发布 