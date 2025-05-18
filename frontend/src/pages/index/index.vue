<template>
  <view class="container">
    <view class="header">
      <text class="title">欢迎来到青少年编程学习系统</text>
      <text class="subtitle">开启你的编程之旅</text>
    </view>

    <view class="nav-grid">
      <view class="nav-item" @tap="goToCourseList">
        <view class="nav-icon">
          <svg width="40" height="40"><use href="/static/images/nav-icons.svg#icon-course"/></svg>
        </view>
        <text class="nav-text">课程列表</text>
      </view>
      
      <navigator url="/pages/sensor/index" class="nav-item">
        <view class="nav-icon">
          <svg width="40" height="40"><use href="/static/images/nav-icons.svg#icon-sensor"/></svg>
        </view>
        <text class="nav-text">传感器监控</text>
      </navigator>
      
      <navigator url="/pages/practice/index" class="nav-item">
        <view class="nav-icon">
          <svg width="40" height="40"><use href="/static/images/nav-icons.svg#icon-practice"/></svg>
        </view>
        <text class="nav-text">编程练习</text>
      </navigator>
    </view>

    <view class="course-section">
      <view class="section-header">
        <text class="section-title">推荐课程</text>
        <view class="more-link" @tap="goToCourseList">查看更多 ></view>
      </view>
      <view class="course-list">
        <view v-for="(course, index) in recommendedCourses" :key="index" class="course-card">
          <image :src="course.cover" mode="aspectFill" class="course-image"></image>
          <view class="course-info">
            <text class="course-name">{{ course.name }}</text>
            <text class="course-desc">{{ course.description }}</text>
            <view class="course-meta">
              <text class="meta-item">{{ course.duration }}课时</text>
              <text class="meta-item">{{ course.students }}人学习</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      recommendedCourses: [
        {
          name: 'Python编程基础',
          description: '从零开始学习Python编程，掌握编程思维',
          cover: '/static/images/course-placeholder.svg',
          duration: 30,
          students: 1280
        },
        {
          name: 'Java程序设计',
          description: '全面学习Java语言，构建完整知识体系',
          cover: '/static/images/course-placeholder.svg',
          duration: 45,
          students: 960
        }
      ]
    }
  },
  methods: {
    goToCourseList() {
      uni.switchTab({
        url: '/pages/course/list'
      })
    }
  }
}
</script>

<style>
.container {
  padding: 30rpx;
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

.nav-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30rpx;
  margin-bottom: 50rpx;
}

.nav-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  text-align: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.nav-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon svg {
  color: #4CAF50;
}

.nav-text {
  font-size: 28rpx;
  color: #333;
}

.course-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.more-link {
  font-size: 24rpx;
  color: #4CAF50;
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.course-card {
  display: flex;
  background: #f8f9fa;
  border-radius: 12rpx;
  overflow: hidden;
}

.course-image {
  width: 200rpx;
  height: 200rpx;
  flex-shrink: 0;
}

.course-info {
  flex: 1;
  padding: 20rpx;
}

.course-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.course-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 20rpx;
  display: block;
}

.course-meta {
  display: flex;
  gap: 20rpx;
}

.meta-item {
  font-size: 24rpx;
  color: #999;
}
</style>