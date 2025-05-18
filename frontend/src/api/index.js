// API基础配置
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1'  // 支持通过.env文件配置API地址

// 最大重试次数
const MAX_RETRIES = 3
// 重试延迟（毫秒）
const RETRY_DELAY = 1000

// 创建通用请求函数
const request = async (url, options = {}, retryCount = 0) => {
  const token = uni.getStorageSync('token')
  const defaultOptions = {
    header: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    timeout: 60000  // 增加到60秒超时
  }

  try {
    const fullUrl = `${baseURL}${url}`
    const requestData = {
      url: fullUrl,
      method: options.method || 'GET',
      data: options.body || options.data,
      ...defaultOptions,
      header: {
        ...defaultOptions.header,
        ...(options.header || {})
      }
    }

    console.log('发送请求：', {
      url: fullUrl,
      method: requestData.method,
      data: requestData.data,
      headers: requestData.header
    })

    const response = await uni.request(requestData)

    const { data, statusCode } = response
    console.log('请求响应：', { 
      statusCode, 
      data,
      url: fullUrl,
      method: requestData.method
    })

    // 处理token过期
    if (statusCode === 401) {
      uni.clearStorageSync()
      uni.showToast({
        title: '登录已过期，请重新登录',
        icon: 'none'
      })
      uni.reLaunch({
        url: '/pages/login/index'
      })
      return Promise.reject(new Error('登录已过期'))
    }

    // 处理其他错误
    if (statusCode >= 400) {
      const errorMessage = data.message || '请求失败'
      // 如果是网络错误且未超过最大重试次数，则进行重试
      if (statusCode >= 500 && retryCount < MAX_RETRIES) {
        console.log(`服务器错误(${statusCode})，${RETRY_DELAY/1000}秒后进行第${retryCount + 1}次重试`)
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
        return request(url, options, retryCount + 1)
      }
      
      const error = new Error(errorMessage)
      error.statusCode = statusCode
      error.response = data
      throw error
    }

    return data
  } catch (error) {
    console.error('请求错误：', {
      url: `${baseURL}${url}`,
      method: options.method || 'GET',
      error: error.message || error,
      statusCode: error.statusCode,
      response: error.response
    })
    
    // 如果是超时错误且未超过最大重试次数，则进行重试
    if (error.errMsg?.includes('timeout') && retryCount < MAX_RETRIES) {
      console.log(`请求超时，${RETRY_DELAY/1000}秒后进行第${retryCount + 1}次重试`)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      return request(url, options, retryCount + 1)
    }

    throw error
  }
}

// 用户相关API
export const userApi = {
  // 用户注册
  register: (data) => request('/auth/register', {
    method: 'POST',
    body: data
  }),
  
  // 用户登录
  login: (data) => request('/auth/login', {
    method: 'POST',
    body: data
  }),
  
  // 获取用户信息
  getMe: () => request('/users/me', {
    method: 'GET'
  })
}

// 项目相关API
export const projectApi = {
  // 获取项目列表
  getList: () => request('/projects', {
    method: 'GET'
  }),
  
  // 上传项目
  upload: (formData) => request('/projects', {
    method: 'POST',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  }),
  
  // 删除项目
  delete: (id) => request(`/projects/${id}`, {
    method: 'DELETE'
  })
}

// 课程相关API
export const courseApi = {
  // 获取课程列表
  getList: () => request('/courses', {
    method: 'GET'
  }),
  
  // 获取课程详情
  getDetail: (id) => request(`/courses/${id}`, {
    method: 'GET'
  })
}

// 系统相关API
export const systemApi = {
  // 健康检查
  healthCheck: () => request('/health', {
    method: 'GET'
  })
}

export const pythonApi = {
  // 执行代码
  execute: (data) => request('/python/execute', {
    method: 'POST',
    body: data
  }),
  // 保存代码
  save: (data) => request('/python/save', {
    method: 'POST',
    body: data
  }),
  // 获取代码列表
  getList: (params = {}) => request('/python/list', {
    method: 'GET',
    data: params
  }),
  // 获取代码详情
  getDetail: (id) => request(`/python/detail/${id}`, {
    method: 'GET'
  })
} 