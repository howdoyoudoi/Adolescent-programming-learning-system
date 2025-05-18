<template>
  <view class="login-container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 顶部返回按钮 -->
    <view class="nav-back" @tap="goBack">
      <text class="back-icon">←</text>
    </view>

    <!-- 登录内容区 -->
    <view class="login-content">
      <!-- 标题区域 -->
      <view class="login-header">
        <text class="welcome-text">欢迎回来</text>
        <text class="sub-title">青少年编程学习系统</text>
      </view>

      <!-- 表单区域 -->
      <view class="login-form">
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

        <!-- 记住密码和忘记密码 -->
        <view class="form-options">
          <label class="remember-pwd">
            <checkbox :checked="rememberPassword" @tap="rememberPassword = !rememberPassword" />
            <text>记住密码</text>
          </label>
          <text class="forget-pwd" @tap="onForgetPassword">忘记密码？</text>
        </view>

        <!-- 登录按钮 -->
        <button class="login-btn" @tap="handleLogin">登录</button>

        <!-- 其他登录方式 -->
        <view class="other-login">
          <view class="divider">
            <view class="line"></view>
            <text>其他登录方式</text>
            <view class="line"></view>
          </view>
          <view class="social-login">
            <view class="social-item" @tap="socialLogin('wechat')">
              <image src="/static/icons/wechat.png" mode="aspectFit" class="social-icon"></image>
            </view>
            <view class="social-item" @tap="socialLogin('qq')">
              <image src="/static/icons/qq.png" mode="aspectFit" class="social-icon"></image>
            </view>
          </view>
        </view>

        <!-- 注册入口 -->
        <view class="register-entry">
          <text>还没有账号？</text>
          <text class="register-link" @tap="goToRegister">立即注册</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 20,
      username: '',
      password: '',
      rememberPassword: false
    }
  },
  onLoad() {
    // 获取状态栏高度
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight
    
    // 检查是否记住密码
    const savedUsername = uni.getStorageSync('savedUsername')
    const savedPassword = uni.getStorageSync('savedPassword')
    if (savedUsername && savedPassword) {
      this.username = savedUsername
      this.password = savedPassword
      this.rememberPassword = true
    }
    
    // 检查是否已登录
    const token = uni.getStorageSync('token')
    if (token) {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    handleLogin() {
      if (!this.username || !this.password) {
        uni.showToast({
          title: '请输入用户名和密码',
          icon: 'none'
        })
        return
      }
      
      uni.showLoading({
        title: '登录中...'
      })
      
      // 模拟登录请求
      setTimeout(() => {
        uni.hideLoading()
        
        // 保存登录状态和用户信息
        try {
          uni.setStorageSync('token', 'demo_token_' + Date.now())
          uni.setStorageSync('userInfo', {
            username: this.username,
            loginTime: new Date().toISOString()
          })
          
          if (this.rememberPassword) {
            uni.setStorageSync('savedUsername', this.username)
            uni.setStorageSync('savedPassword', this.password)
          } else {
            uni.removeStorageSync('savedUsername')
            uni.removeStorageSync('savedPassword')
          }
          
          uni.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          })
          
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/index/index'
            })
          }, 1500)
        } catch (e) {
          uni.showToast({
            title: '登录失败，请重试',
            icon: 'none'
          })
        }
      }, 1000)
    },
    onForgetPassword() {
      uni.showToast({
        title: '请联系管理员重置密码',
        icon: 'none'
      })
    },
    goToRegister() {
      uni.navigateTo({
        url: '/pages/register/register'
      })
    },
    socialLogin(type) {
      uni.showToast({
        title: type === 'wechat' ? '微信登录功能开发中' : 'QQ登录功能开发中',
        icon: 'none'
      })
    }
  }
}
</script>

<style>
.login-container {
  min-height: 100vh;
  background-color: #ffffff;
}

.status-bar {
  background-color: #ffffff;
}

.nav-back {
  padding: 15px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}

.back-icon {
  font-size: 20px;
  color: #333;
}

.login-content {
  padding: 40px 30px;
}

.login-header {
  margin-bottom: 50px;
}

.welcome-text {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.sub-title {
  font-size: 16px;
  color: #666;
}

.input-group {
  margin-bottom: 25px;
}

.input-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.input-field {
  width: 100%;
  height: 45px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 15px;
  font-size: 16px;
  background-color: #f8f8f8;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.remember-pwd {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.forget-pwd {
  font-size: 14px;
  color: #4CAF50;
}

.login-btn {
  width: 100%;
  height: 45px;
  background-color: #4CAF50;
  color: #fff;
  border-radius: 8px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}

.login-btn:active {
  background-color: #43A047;
}

.other-login {
  margin-bottom: 30px;
}

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.line {
  flex: 1;
  height: 1px;
  background-color: #e0e0e0;
}

.divider text {
  color: #999;
  font-size: 14px;
  padding: 0 15px;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.social-item {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  padding: 8px;
}

.social-icon {
  width: 24px;
  height: 24px;
}

.register-entry {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.register-link {
  color: #4CAF50;
  margin-left: 5px;
}
</style> 