<template>
  <view class="container">
    <view class="header">
      <text class="title">消息</text>
    </view>
    <view class="content">
      <view class="message-list">
        <view v-for="(message, index) in messages" :key="index" class="message-item">
          <view class="message-content">
            <text class="message-title">{{ message.title }}</text>
            <text class="message-desc">{{ message.content }}</text>
          </view>
          <text class="message-time">{{ message.time }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      messages: [
        {
          title: '系统通知',
          content: '欢迎使用青少年编程学习系统',
          time: '刚刚'
        },
        {
          title: '课程提醒',
          content: '您有一个新的编程课程等待学习',
          time: '10分钟前'
        }
      ]
    }
  }
}
</script>

<style>
.container {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.message-desc {
  font-size: 14px;
  color: #666;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}
</style> 