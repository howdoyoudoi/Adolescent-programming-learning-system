<template>
  <view class="home-container">
    <!-- 背景装饰 -->
    <view class="background-decoration">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 顶部欢迎区域 -->
      <view class="header">
        <text class="welcome">欢迎使用</text>
        <text class="system-name">青少年编程学习系统</text>
        <text class="slogan">让编程更简单，让学习更有趣</text>
      </view>
      
      <!-- 功能卡片区域 -->
      <view class="card-list">
        <view class="card" hover-class="card-hover" @tap="handleNavigation('blockly')">
          <view class="card-content">
            <view class="icon-wrapper blockly-icon">
              <image src="../../static/icons/blocks.svg" mode="aspectFit" class="card-icon"></image>
            </view>
            <view class="card-info">
              <text class="card-title">图形化编程</text>
              <text class="card-desc">使用积木块进行编程学习</text>
            </view>
          </view>
          <text class="card-arrow">→</text>
        </view>
        
        <view class="card" hover-class="card-hover" @tap="handleNavigation('python')">
          <view class="card-content">
            <view class="icon-wrapper python-icon">
              <image src="../../static/icons/python.svg" mode="aspectFit" class="card-icon"></image>
            </view>
            <view class="card-info">
              <text class="card-title">Python编程</text>
              <text class="card-desc">学习Python编程基础</text>
            </view>
          </view>
          <text class="card-arrow">→</text>
        </view>
      </view>

      <!-- 底部信息 -->
      <view class="footer">
        <text class="footer-text">开启您的编程之旅</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      username: ''
    }
  },
  onLoad() {
    // 检查登录状态
    const token = uni.getStorageSync('token')
    if (!token) {
      uni.reLaunch({
        url: '/pages/login/login'
      })
      return
    }
    // 获取用户信息
    const userInfo = uni.getStorageSync('userInfo')
    if (userInfo) {
      this.username = userInfo.username
    }
  },
  methods: {
    handleNavigation(type) {
      switch (type) {
        case 'blockly':
          uni.navigateTo({
            url: '/pages/blockly/index'
          })
          break
        case 'python':
          uni.showToast({
            title: 'Python编程功能开发中',
            icon: 'none'
          })
          break
      }
    }
  }
}
</script>

<style>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f8ff 0%, #f0f4ff 100%);
  position: relative;
  overflow: hidden;
}

.background-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}

.circle-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #4CAF50, #81C784);
  top: -100px;
  right: -100px;
}

.circle-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #2196F3, #64B5F6);
  bottom: -50px;
  left: -50px;
}

.content {
  position: relative;
  padding: 40px 20px;
  z-index: 1;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  animation: fadeInDown 0.8s ease-out;
}

.welcome {
  font-size: 24px;
  color: #333;
  display: block;
  margin-bottom: 10px;
}

.system-name {
  font-size: 28px;
  font-weight: bold;
  color: #1a1a1a;
  display: block;
  margin-bottom: 15px;
  background: linear-gradient(45deg, #4CAF50, #2196F3);
  -webkit-background-clip: text;
  color: transparent;
}

.slogan {
  font-size: 16px;
  color: #666;
  display: block;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeInUp 0.8s ease-out;
}

.card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.card-hover {
  transform: translateX(10px);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.blockly-icon {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.1) 100%);
  border: 2px solid rgba(76, 175, 80, 0.2);
}

.python-icon {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(100, 181, 246, 0.1) 100%);
  border: 2px solid rgba(33, 150, 243, 0.2);
}

.card:hover .icon-wrapper {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 35px;
  height: 35px;
  transition: all 0.3s ease;
}

.card:hover .card-icon {
  transform: scale(1.1);
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
  display: block;
}

.card-desc {
  font-size: 14px;
  color: #666;
  display: block;
}

.card-arrow {
  font-size: 24px;
  color: #4CAF50;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.card:hover .card-arrow {
  opacity: 1;
  transform: translateX(5px);
}

.footer {
  text-align: center;
  margin-top: 40px;
  animation: fadeIn 1s ease-out;
}

.footer-text {
  font-size: 16px;
  color: #666;
  opacity: 0.8;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style> 