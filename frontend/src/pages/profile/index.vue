<template>
  <view class="container">
    <view class="header">
      <view class="profile-info">
        <view class="avatar">👤</view>
        <view class="user-info">
          <text class="username">用户名</text>
          <text class="user-desc">开启您的编程之旅</text>
        </view>
      </view>
    </view>
    <view class="content">
      <view class="menu-list">
        <view class="menu-item" v-for="(item, index) in menuItems" :key="index" @click="handleMenuClick(item)">
          <text class="menu-title">{{ item.title }}</text>
          <text class="menu-arrow">></text>
        </view>
      </view>
    </view>
    <!-- 新增退出登录按钮 -->
    <view class="logout-section">
      <button class="logout-btn" @tap="logout">退出登录</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { title: '我的课程', action: 'courses' },
        { title: '学习记录', action: 'history' },
        { title: '我的作品', action: 'projects' },
        { title: '设置', action: 'settings' }
      ]
    }
  },
  methods: {
    handleMenuClick(item) {
      console.log('点击菜单项:', item.title)
      // 根据不同的action执行相应的操作
      switch(item.action) {
        case 'courses':
          uni.switchTab({ url: '/pages/course/list' })
          break
        case 'history':
          uni.navigateTo({ url: '/pages/record/index' })
          break
        case 'projects':
          uni.navigateTo({ url: '/pages/projects/index' })
          break
        case 'settings':
          uni.showToast({ title: '功能开发中', icon: 'none' })
          break
      }
    },
    logout() {
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
      uni.reLaunch({
        url: '/pages/login/index'
      })
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background-color: #f8f8f8;
}

.header {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 12px;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 64px;
  height: 64px;
  background-color: #f0f0f0;
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.user-desc {
  font-size: 14px;
  color: #666;
}

.content {
  padding: 0 20px;
}

.menu-list {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-title {
  font-size: 16px;
  color: #333;
}

.menu-arrow {
  color: #999;
}

.menu-item:active {
  background-color: #f8f8f8;
}

.logout-section {
  margin: 40px 20px 0 20px;
}
.logout-btn {
  width: 100%;
  height: 44px;
  background: #f44336;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
}
.logout-btn:active {
  background: #d32f2f;
}
</style> 