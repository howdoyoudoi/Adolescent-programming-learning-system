<template>
  <view class="login-container">
    <view class="login-card">
      <view class="login-header">
        <text class="login-title">欢迎登录</text>
        <text class="login-subtitle">青少年编程学习系统</text>
      </view>
      
      <view class="form-group">
        <view class="input-group">
          <text class="input-label">用户名</text>
          <input 
            class="input-field" 
            type="text" 
            v-model="username"
            placeholder="请输入用户名"
          />
        </view>
        
        <view class="input-group">
          <text class="input-label">密码</text>
          <input 
            class="input-field" 
            type="password" 
            v-model="password"
            placeholder="请输入密码"
          />
        </view>
        
        <view class="remember-forgot">
          <label class="remember-me">
            <checkbox :checked="rememberMe" @tap="toggleRemember" color="#4CAF50" />
            <text>记住我</text>
          </label>
          <view class="forgot-password" @tap="goToForgotPassword">
            忘记密码？
          </view>
        </view>
      </view>
      
      <button class="login-button" @tap="handleLogin" :disabled="isLoading">
        <text v-if="!isLoading">登录</text>
        <view v-else class="loading-spinner"></view>
      </button>
      
      <view class="register-link">
        <text>还没有账号？</text>
        <text class="link" @tap="goToRegister">立即注册</text>
      </view>
    </view>
  </view>
</template>

<script>
import { userApi } from '@/api'

export default {
  data() {
    return {
      username: '',
      password: '',
      rememberMe: false,
      isLoading: false,
      isSubmitting: false,
      errorMessage: '',
      retryCount: 0,
      maxRetries: 3
    }
  },
  methods: {
    toggleRemember() {
      this.rememberMe = !this.rememberMe
    },
    async handleLogin() {
      if (!this.validateForm() || this.isSubmitting) {
        return
      }

      this.isSubmitting = true
      this.isLoading = true
      this.errorMessage = ''

      try {
        const requestData = {
          username: this.username,
          password: this.password
        }
        
        console.log('发送登录请求：', requestData)
        
        const response = await userApi.login(requestData)
        
        console.log('登录响应：', response)

        if (response.code === 200) {
          uni.showToast({
            title: response.message || '登录成功',
            icon: 'success'
          })
          
          // 保存token
          uni.setStorageSync('token', response.data.token)
          
          setTimeout(() => {
            this.goToHome()
          }, 1500)
        } else {
          throw new Error(response.message || '登录失败')
        }
      } catch (error) {
        console.error('登录失败：', error)
        
        if (error.statusCode === 500 && this.retryCount < this.maxRetries) {
          this.retryCount++
          this.errorMessage = `服务器错误，正在重试(${this.retryCount}/${this.maxRetries})...`
          setTimeout(() => {
            this.handleLogin()
          }, 1000)
          return
        }
        
        this.errorMessage = error.message || '登录失败，请稍后重试'
      } finally {
        this.isLoading = false
        this.isSubmitting = false
      }
    },
    goToForgotPassword() {
      uni.navigateTo({
        url: '/pages/forgot-password/index'
      })
    },
    goToRegister() {
      uni.navigateTo({
        url: '/pages/register/index'
      })
    },
    validateForm() {
      if (!this.username || !this.password) {
        uni.showToast({
          title: '请输入用户名和密码',
          icon: 'none'
        })
        return false
      }
      return true
    },
    goToHome() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  }
}
</script>

<style>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.8s ease-out;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  font-size: 28px;
  color: #2E7D32;
  font-weight: 700;
  margin-bottom: 8px;
  display: block;
}

.login-subtitle {
  font-size: 16px;
  color: #666;
  display: block;
}

.form-group {
  margin-bottom: 24px;
}

.input-group {
  margin-bottom: 20px;
}

.input-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  display: block;
  font-weight: 500;
}

.input-field {
  width: 100%;
  height: 44px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 16px;
  color: #333;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.input-field:focus {
  border-color: #4CAF50;
  background: white;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.forgot-password {
  font-size: 14px;
  color: #4CAF50;
  cursor: pointer;
}

.login-button {
  width: 100%;
  height: 44px;
  background: linear-gradient(90deg, #4CAF50, #2E7D32);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.login-button:active {
  transform: scale(0.98);
  background: linear-gradient(90deg, #43A047, #2E7D32);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

.register-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.link {
  color: #4CAF50;
  margin-left: 4px;
  cursor: pointer;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 适配暗色模式 */
@media (prefers-color-scheme: dark) {
  .login-container {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  }
  
  .login-card {
    background: #2d2d2d;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
  
  .login-title {
    color: #66BB6A;
  }
  
  .login-subtitle {
    color: #aaa;
  }
  
  .input-label {
    color: #fff;
  }
  
  .input-field {
    background: #3d3d3d;
    border-color: #444;
    color: #fff;
  }
  
  .input-field:focus {
    background: #444;
    border-color: #66BB6A;
    box-shadow: 0 0 0 2px rgba(102, 187, 106, 0.1);
  }
  
  .remember-me {
    color: #aaa;
  }
  
  .forgot-password {
    color: #66BB6A;
  }
  
  .register-link {
    color: #aaa;
  }
  
  .link {
    color: #66BB6A;
  }
}
</style> 