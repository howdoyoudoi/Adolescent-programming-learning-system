# 青少年编程学习系统

## 项目结构

```
.
├── frontend/                 # 前端代码目录
│   ├── src/                 # 源代码目录
│   │   ├── api/            # API 请求相关代码
│   │   ├── components/     # 可复用组件
│   │   ├── pages/         # 页面组件
│   │   ├── store/         # 状态管理
│   │   └── utils/         # 工具函数
│   ├── public/            # 静态资源目录
│   ├── static/            # 静态资源目录
│   ├── index.html         # 主入口文件
│   ├── vite.config.js     # Vite 配置
│   └── package.json       # 项目依赖配置
├── backend/                # 后端代码目录
│   ├── src/               # 源代码目录
│   ├── config/            # 配置文件
│   └── package.json       # 项目依赖配置
└── docs/                  # 项目文档
    ├── api/              # API 文档
    └── design/           # 设计文档
```

## 开发环境设置

### 前端开发
1. 进入前端目录：`cd frontend`
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`

### 后端开发
1. 进入后端目录：`cd backend`
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`

## 重要文件说明

### 前端
- `frontend/src/api/index.js`: API 请求配置
- `frontend/vite.config.js`: 开发服务器配置
- `frontend/src/pages/login/index.vue`: 登录页面
- `frontend/src/pages/register/index.vue`: 注册页面

### 后端
- `backend/src/app.js`: 主应用文件
- `backend/src/routes/`: API 路由
- `backend/src/controllers/`: 控制器
- `backend/src/models/`: 数据模型

## 部署说明

1. 前端构建：`cd frontend && npm run build`
2. 后端部署：`cd backend && npm run start`

## 注意事项

- 开发时请确保前端和后端服务都正常运行
- API 请求地址配置在 `frontend/src/api/index.js`
- 跨域配置在 `frontend/vite.config.js` 