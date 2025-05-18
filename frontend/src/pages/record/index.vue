<template>
  <view class="record-container">
    <view class="header">
      <text class="title">学习记录</text>
    </view>
    <view class="record-list">
      <view class="record-item" v-for="(item, index) in records" :key="index">
        <text class="record-course">{{ item.course }}</text>
        <text class="record-progress">进度：{{ item.progress }}%</text>
        <text class="record-date">{{ item.date }}</text>
      </view>
      <view v-if="records.length === 0" class="empty">暂无学习记录</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      records: [
        { course: 'Python编程基础', progress: 80, date: '2024-06-01' },
        { course: 'Java程序设计', progress: 40, date: '2024-05-28' }
      ]
    }
  }
}
</script>

<style>
.record-container {
  min-height: 100vh;
  background: #f8f8f8;
  padding: 30rpx;
}
.header {
  text-align: center;
  margin-bottom: 30rpx;
}
.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
.record-list {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
}
.record-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.record-item:last-child {
  border-bottom: none;
}
.record-course {
  font-size: 28rpx;
  color: #4CAF50;
  font-weight: bold;
}
.record-progress {
  font-size: 24rpx;
  color: #666;
}
.record-date {
  font-size: 22rpx;
  color: #999;
}
.empty {
  text-align: center;
  color: #bbb;
  padding: 40rpx 0;
}
</style> 