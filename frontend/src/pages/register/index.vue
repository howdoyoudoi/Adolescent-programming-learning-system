<template>
  <view class="register-container">
    <view class="header">
      <text class="title">注册账号</text>
      <text class="subtitle">欢迎加入青少年编程学习系统</text>
    </view>

    <view class="form-container">
      <view class="form-group">
        <text class="label">用户名</text>
        <input 
          class="input" 
          v-model="form.username" 
          placeholder="请输入用户名（4-20个字符）"
          :disabled="isLoading"
        />
      </view>

      <view class="form-group">
        <text class="label">密码</text>
        <input 
          class="input" 
          v-model="form.password" 
          type="password" 
          placeholder="请输入密码（6-20个字符）"
          :disabled="isLoading"
        />
      </view>

      <view class="form-group">
        <text class="label">确认密码</text>
        <input 
          class="input" 
          v-model="form.confirmPassword" 
          type="password" 
          placeholder="请再次输入密码"
          :disabled="isLoading"
        />
      </view>

      <button 
        class="submit-btn" 
        @tap="handleRegister" 
        :disabled="isLoading || isSubmitting"
        :class="{ 'submit-btn-loading': isLoading }"
      >
        <text v-if="!isLoading">{{ isSubmitting ? '提交中...' : '注册' }}</text>
        <view v-else class="loading-spinner"></view>
      </button>

      <view v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </view>

      <view class="back-to-login" @tap="goToLogin">
        已有账号？立即登录
      </view>
    </view>
  </view>
</template>

<script>
import { userApi } from '@/api'

export default {
  data() {
    return {
      isLoading: false,
      isSubmitting: false,
      errorMessage: '',
      form: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      retryCount: 0,
      maxRetries: 3
    }
  },
  methods: {
    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/index'
      })
    },
    validateForm() {
      this.errorMessage = ''
      
      if (!this.form.username) {
        this.errorMessage = '请输入用户名'
        return false
      }
      if (this.form.username.length < 4 || this.form.username.length > 20) {
        this.errorMessage = '用户名长度应为4-20个字符'
        return false
      }
      if (!this.form.password) {
        this.errorMessage = '请输入密码'
        return false
      }
      if (this.form.password.length < 6 || this.form.password.length > 20) {
        this.errorMessage = '密码长度应为6-20个字符'
        return false
      }
      if (!this.form.confirmPassword) {
        this.errorMessage = '请确认密码'
        return false
      }
      if (this.form.password !== this.form.confirmPassword) {
        this.errorMessage = '两次输入的密码不一致'
        return false
      }
      return true
    },
    async handleRegister() {
      if (!this.validateForm() || this.isSubmitting) {
        return
      }

      this.isSubmitting = true
      this.isLoading = true
      this.errorMessage = ''

      try {
        const requestData = {
          username: this.form.username,
          password: this.form.password
        }
        
        console.log('发送注册请求：', requestData)
        
        const response = await userApi.register(requestData)
        
        console.log('注册响应：', response)

        if (response.code === 200) {
          uni.showToast({
            title: response.message || '注册成功',
            icon: 'success'
          })
          
          setTimeout(() => {
            this.goToLogin()
          }, 1500)
        } else {
          throw new Error(response.message || '注册失败')
        }
      } catch (error) {
        console.error('注册失败：', error)
        
        if (error.statusCode === 500 && this.retryCount < this.maxRetries) {
          this.retryCount++
          this.errorMessage = `服务器错误，正在重试(${this.retryCount}/${this.maxRetries})...`
          setTimeout(() => {
            this.handleRegister()
          }, 1000)
          return
        }
        
        this.errorMessage = error.message || '注册失败，请稍后重试'
      } finally {
        this.isLoading = false
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style>
.register-container {
  min-height: 100vh;
  padding: 40px 30px;
  background: #f8f9fa;
}

.header {
  margin-bottom: 40px;
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #666;
}

.form-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 20px;
}

.label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.input {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  height: 44px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.submit-btn-loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  margin: 0 auto;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.back-to-login {
  text-align: center;
  margin-top: 20px;
  color: #4CAF50;
  font-size: 14px;
}

.error-message {
  margin-top: 12px;
  padding: 8px;
  color: #f44336;
  background: #ffebee;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .register-container {
    background: #1a1a1a;
  }

  .form-container {
    background: #2d2d2d;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .title {
    color: #fff;
  }

  .subtitle {
    color: #aaa;
  }

  .label {
    color: #fff;
  }

  .input {
    background: #1e1e1e;
    border-color: #444;
    color: #fff;
  }

  .submit-btn:disabled {
    background: #444;
    color: #666;
  }
}
</style> 