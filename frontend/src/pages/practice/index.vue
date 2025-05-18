<template>
  <view class="practice-container">
    <view class="header">
      <text class="title">编程练习</text>
      <text class="subtitle">在这里练习编程，提升你的编程技能</text>
    </view>

    <view class="practice-grid">
      <navigator url="/pages/python/index" class="practice-item">
        <view class="practice-icon python">
          <svg width="40" height="40" viewBox="0 0 24 24">
            <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" fill="#3776AB"/>
            <path d="M12 4v4h4v2h-6V6H8v6h2v2H6v-6h2V4h4zm0 12v4h-4v-2h6v4h2v-6h-2v-2h4v6h-2v-4h-4z" fill="#3776AB"/>
          </svg>
        </view>
        <text class="practice-name">Python编程</text>
        <text class="practice-desc">使用Python语言编写代码，实现各种功能</text>
      </navigator>

      <navigator url="/pages/blockly/index" class="practice-item">
        <view class="practice-icon blockly">
          <svg width="40" height="40" viewBox="0 0 24 24">
            <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" fill="#4CAF50"/>
          </svg>
        </view>
        <text class="practice-name">图形化编程</text>
        <text class="practice-desc">使用积木搭建程序，轻松入门编程概念</text>
      </navigator>

      <view class="practice-item coming-soon">
        <view class="practice-icon">
          <svg width="40" height="40" viewBox="0 0 24 24">
            <path d="M11 4h2v4h-2V4zm0 6h2v2h-2v-2zm0 4h2v6h-2v-6z" fill="#999"/>
            <circle cx="12" cy="12" r="10" stroke="#999" fill="none" stroke-width="2"/>
          </svg>
        </view>
        <text class="practice-name">更多练习</text>
        <text class="practice-desc">敬请期待更多编程练习内容...</text>
      </view>
    </view>

    <view class="recent-section" v-if="recentPractices.length > 0">
      <view class="section-header">
        <text class="section-title">最近练习</text>
      </view>
      <view class="recent-list">
        <view v-for="(practice, index) in recentPractices" :key="index" class="recent-item">
          <view class="recent-info">
            <text class="recent-name">{{ practice.name }}</text>
            <text class="recent-time">{{ practice.lastTime }}</text>
          </view>
          <text class="recent-progress">完成度: {{ practice.progress }}%</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PracticeIndex',
  data() {
    return {
      recentPractices: [
        {
          name: 'Python基础语法练习',
          lastTime: '2024-03-10',
          progress: 75
        },
        {
          name: '图形化编程入门',
          lastTime: '2024-03-09',
          progress: 90
        }
      ]
    }
  }
}
</script>

<style>
.practice-container {
  padding: 30rpx;
  min-height: 100vh;
  background: #f8f8f8;
}

.header {
  text-align: center;
  margin-bottom: 50rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
  display: block;
}

.practice-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30rpx;
  margin-bottom: 50rpx;
}

.practice-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  text-align: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.practice-icon {
  width: 80rpx;
  height: 80rpx;
  margin: 0 auto 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.practice-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.practice-desc {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.coming-soon {
  opacity: 0.6;
  cursor: not-allowed;
}

.recent-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-top: 30rpx;
}

.section-header {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.recent-info {
  flex: 1;
}

.recent-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 5rpx;
  display: block;
}

.recent-time {
  font-size: 24rpx;
  color: #999;
}

.recent-progress {
  font-size: 24rpx;
  color: #4CAF50;
}

.python {
  color: #3776AB;
}

.blockly {
  color: #4CAF50;
}
</style> 