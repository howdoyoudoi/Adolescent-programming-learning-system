<template>
  <view class="register-page">
    <view class="container">
      <!-- Logo -->
      <view class="logo">
        <image class="logo-img" src="/static/logo.png" mode="aspectFit"></image>
      </view>

      <!-- 表单区域 -->
      <view class="form-container">
        <!-- 用户名输入框 -->
        <view class="form-item">
          <text class="form-label">用户名</text>
          <input 
            class="input-field" 
            type="text" 
            v-model="formData.username" 
            placeholder="请输入账号"
            placeholder-class="input-placeholder"
          />
        </view>

        <!-- 密码输入框 -->
        <view class="form-item">
          <text class="form-label">密码</text>
          <input 
            class="input-field" 
            type="password" 
            v-model="formData.password" 
            placeholder="请输入密码"
            placeholder-class="input-placeholder"
          />
          <text class="tips">密码长度至少6位，包含字母和数字</text>
        </view>

        <!-- 确认密码输入框 -->
        <view class="form-item">
          <text class="form-label">确认密码</text>
          <input 
            class="input-field" 
            type="password" 
            v-model="formData.confirmPassword" 
            placeholder="请再次输入密码"
            placeholder-class="input-placeholder"
          />
        </view>

        <!-- 注册按钮 -->
        <button class="submit-btn" @tap="handleRegister">注册</button>

        <!-- 底部链接 -->
        <view class="bottom-links">
          <text class="link-text" @tap="goToLogin">已有账号？立即登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 表单数据
const formData = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

// 注册方法
const handleRegister = () => {
  const { username, password, confirmPassword } = formData.value

  // 表单验证
  if (!username || !password || !confirmPassword) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
    return
  }

  if (password !== confirmPassword) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    })
    return
  }

  // 密码强度验证
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
  if (!passwordRegex.test(password)) {
    uni.showToast({
      title: '密码必须至少6位，包含字母和数字',
      icon: 'none'
    })
    return
  }

  // TODO: 实现注册逻辑
  uni.showLoading({
    title: '注册中...'
  })

  // 模拟注册请求
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '注册成功',
      icon: 'success',
      duration: 1500,
      success: () => {
        // 注册成功后跳转到登录页
        setTimeout(() => {
          uni.redirectTo({
            url: '/pages/login/login'
          })
        }, 1500)
      }
    })
  }, 1500)
}

// 跳转到登录页
const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/login'
  })
}
</script>

<style lang="scss">
.register-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.container {
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.logo {
  text-align: center;
  margin: 40px 0;
  
  .logo-img {
    width: 100px;
    height: 100px;
    border-radius: 20px;
  }
}

.form-container {
  padding: 0 15px;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-size: 28rpx;
  font-weight: 500;
}

.input-field {
  width: 100%;
  height: 96rpx;
  padding: 0 30rpx;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 32rpx;
  background-color: #fff;
  
  &:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
}

.input-placeholder {
  color: #999;
}

.tips {
  font-size: 24rpx;
  color: #666;
  margin-top: 8rpx;
  padding-left: 30rpx;
}

.submit-btn {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  background-color: #4CAF50;
  color: #fff;
  font-size: 32rpx;
  border-radius: 10px;
  border: none;
  margin: 40rpx 0;
  
  &:active {
    background-color: #45a049;
    transform: scale(0.98);
  }
}

.bottom-links {
  text-align: center;
  margin-top: 30rpx;
  
  .link-text {
    color: #666;
    font-size: 28rpx;
    
    &:active {
      color: #4CAF50;
    }
  }
}
</style> 