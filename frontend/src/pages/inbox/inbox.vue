<template>
  <view class="inbox-page">
    <view class="container">
      <!-- 搜索框 -->
      <view class="search-box">
        <input 
          type="text" 
          class="search-input" 
          placeholder="搜索" 
          v-model="searchText"
          placeholder-class="search-placeholder"
        />
        <text class="search-icon">🔍</text>
      </view>

      <!-- 通讯录列表 -->
      <view class="message-list">
        <view class="message-item" v-for="(item, index) in messageList" :key="index" @tap="handleMessageClick(item)">
          <view class="avatar">{{item.avatar}}</view>
          <view class="content">
            <view class="title">{{item.title}}</view>
            <view class="desc">{{item.description}}</view>
          </view>
          <view class="time">{{item.time}}</view>
        </view>
      </view>
    </view>

    <!-- 底部导航 -->
    <view class="bottom-nav">
      <view class="nav-item" @tap="switchTab('home')">
        <text class="nav-icon">🏠</text>
        <text class="nav-text">主页</text>
      </view>
      <view class="nav-item active">
        <text class="nav-icon">📬</text>
        <text class="nav-text">收件箱</text>
      </view>
      <view class="nav-item" @tap="switchTab('profile')">
        <text class="nav-icon">👤</text>
        <text class="nav-text">我的主页</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const searchText = ref('')

// 模拟的消息数据
const messageList = ref([
  {
    avatar: '👨‍🏫',
    title: '系统通知',
    description: '欢迎使用青少年编程学习系统！',
    time: '刚刚'
  },
  {
    avatar: '📚',
    title: '学习提醒',
    description: '您有一个新的学习任务待完成',
    time: '10分钟前'
  },
  {
    avatar: '🎯',
    title: '练习反馈',
    description: '恭喜你完成了今天的编程练习',
    time: '1小时前'
  },
  {
    avatar: '🏆',
    title: '成就系统',
    description: '你获得了"编程新手"徽章',
    time: '2小时前'
  }
])

// 处理消息点击
const handleMessageClick = (message) => {
  uni.showToast({
    title: '消息详情开发中...',
    icon: 'none'
  })
}

// 切换标签页
const switchTab = (tab) => {
  const routes = {
    home: '/pages/home/home',
    profile: '/pages/profile/profile'
  }
  
  if (routes[tab]) {
    uni.switchTab({
      url: routes[tab]
    })
  }
}
</script>

<style lang="scss">
.inbox-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  padding-bottom: 100px;
  position: relative;
}

.container {
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  height: 80rpx;
  background: #f5f5f5;
  border-radius: 10px;
  padding: 0 60rpx;
  font-size: 28rpx;
  border: none;
}

.search-placeholder {
  color: #999;
}

.search-icon {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 32rpx;
}

.message-list {
  .message-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:active {
      background-color: #f9f9f9;
    }
  }
  
  .avatar {
    width: 80rpx;
    height: 80rpx;
    background: #4CAF50;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40rpx;
    margin-right: 20rpx;
  }
  
  .content {
    flex: 1;
    
    .title {
      font-size: 32rpx;
      color: #333;
      margin-bottom: 4rpx;
    }
    
    .desc {
      font-size: 26rpx;
      color: #666;
    }
  }
  
  .time {
    font-size: 24rpx;
    color: #999;
    margin-left: 10rpx;
  }
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rpx 0;
  
  .nav-icon {
    font-size: 40rpx;
    margin-bottom: 4rpx;
  }
  
  .nav-text {
    font-size: 24rpx;
    color: #666;
  }
  
  &.active {
    .nav-text {
      color: #4CAF50;
    }
  }
}
</style> 