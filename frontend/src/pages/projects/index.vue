<template>
  <view class="projects-container">
    <view class="header">
      <text class="title">我的作品</text>
    </view>
    <view class="projects-list">
      <view class="project-item" v-for="(item, index) in projects" :key="item.id">
        <text class="project-title">{{ item.title }}</text>
        <text class="project-module">模块：{{ item.module }}</text>
        <text class="project-desc">{{ item.description }}</text>
        <text class="project-date">{{ item.created_at }}</text>
        <view v-if="item.file_url">
          <a :href="item.file_url" target="_blank" class="project-link">查看作品</a>
        </view>
      </view>
      <view v-if="projects.length === 0" class="empty">暂无作品</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      projects: []
    }
  },
  onLoad() {
    this.fetchProjects()
  },
  methods: {
    async fetchProjects() {
      try {
        const res = await uni.request({
          url: 'http://localhost:3000/api/projects', // 请替换为实际后端API地址
          method: 'GET',
          header: {
            'Authorization': 'Bearer ' + uni.getStorageSync('token')
          }
        })
        if (res[1].statusCode === 200) {
          this.projects = res[1].data
        } else {
          uni.showToast({ title: '获取作品失败', icon: 'none' })
        }
      } catch (e) {
        uni.showToast({ title: '网络错误', icon: 'none' })
      }
    }
  }
}
</script>

<style>
.projects-container {
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
.projects-list {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
}
.project-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.project-item:last-child {
  border-bottom: none;
}
.project-title {
  font-size: 28rpx;
  color: #4CAF50;
  font-weight: bold;
}
.project-module {
  font-size: 24rpx;
  color: #2196F3;
}
.project-desc {
  font-size: 24rpx;
  color: #666;
}
.project-date {
  font-size: 22rpx;
  color: #999;
}
.project-link {
  color: #4CAF50;
  font-size: 24rpx;
  text-decoration: underline;
  margin-top: 4rpx;
}
.empty {
  text-align: center;
  color: #bbb;
  padding: 40rpx 0;
}
</style> 