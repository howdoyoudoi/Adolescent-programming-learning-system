<template>
  <view class="course-detail">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="iconfont icon-back">←</text>
      </view>
      <image :src="course.cover || '/static/images/course-placeholder.svg'" mode="aspectFill" class="cover-image"></image>
      <view class="course-info">
        <text class="title">{{ course.name }}</text>
        <text class="teacher">讲师：{{ course.teacher }}</text>
        <view class="meta">
          <text class="meta-item">{{ course.duration }}课时</text>
          <text class="meta-item">{{ course.students }}人学习</text>
          <text class="meta-item">评分：{{ course.rating }}</text>
        </view>
      </view>
    </view>

    <view class="tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="['tab-item', { active: currentTab === tab.key }]"
        @click="currentTab = tab.key"
      >
        {{ tab.name }}
      </view>
    </view>

    <view class="content">
      <!-- 课程介绍 -->
      <view v-if="currentTab === 'intro'" class="tab-content">
        <view class="section">
          <text class="section-title">课程简介</text>
          <text class="description">{{ course.description }}</text>
        </view>
        
        <view class="section">
          <text class="section-title">课程大纲</text>
          <view class="outline-list">
            <view v-for="(chapter, index) in course.outline" :key="index" class="outline-item">
              <text class="chapter-title">{{ chapter.title }}</text>
              <view class="chapter-points">
                <text v-for="(point, pIndex) in chapter.points" :key="pIndex" class="point-item">
                  · {{ point }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 课程目录 -->
      <view v-if="currentTab === 'catalog'" class="tab-content">
        <view class="video-list">
          <view 
            v-for="(video, index) in course.videos" 
            :key="index"
            class="video-item"
            @click="navigateToVideo(video.id)"
          >
            <image :src="video.thumbnail" mode="aspectFill" class="video-thumb"></image>
            <view class="video-info">
              <text class="video-title">{{ video.title }}</text>
              <text class="video-duration">{{ video.duration }}</text>
            </view>
            <text class="video-status" :class="{ completed: video.completed }">
              {{ video.completed ? '已完成' : '未学习' }}
            </text>
          </view>
        </view>
      </view>

      <!-- 课程评价 -->
      <view v-if="currentTab === 'comments'" class="tab-content">
        <view class="comments-list">
          <view v-for="(comment, index) in course.comments" :key="index" class="comment-item">
            <image :src="comment.avatar" class="user-avatar"></image>
            <view class="comment-content">
              <view class="comment-header">
                <text class="username">{{ comment.username }}</text>
                <text class="rating">{{ '★'.repeat(comment.rating) }}</text>
              </view>
              <text class="comment-text">{{ comment.content }}</text>
              <text class="comment-time">{{ comment.time }}</text>
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
      courseId: '',
      currentTab: 'intro',
      tabs: [
        { key: 'intro', name: '课程介绍' },
        { key: 'catalog', name: '课程目录' },
        { key: 'comments', name: '课程评价' }
      ],
      course: {
        name: 'Python编程基础',
        teacher: '张老师',
        cover: '/static/images/course-placeholder.svg',
        duration: 30,
        students: 1280,
        rating: 4.8,
        description: '本课程从零开始，带你掌握Python编程基础知识，建立编程思维，掌握程序设计方法。通过大量实践练习，让你能够独立开发简单的Python程序。',
        outline: [
          {
            title: '第一章：Python入门基础',
            points: [
              'Python简介与环境搭建',
              '变量与数据类型',
              '基本运算符',
              '条件语句和循环'
            ]
          },
          {
            title: '第二章：函数与模块',
            points: [
              '函数的定义与调用',
              '参数传递',
              '返回值',
              '模块的使用'
            ]
          }
        ],
        videos: [
          {
            id: 1,
            title: '1.1 Python简介与环境搭建',
            thumbnail: '/static/images/course-placeholder.svg',
            duration: '25:30',
            completed: true
          },
          {
            id: 2,
            title: '1.2 第一个Python程序',
            thumbnail: '/static/images/course-placeholder.svg',
            duration: '20:15',
            completed: false
          }
        ],
        comments: [
          {
            username: '学员1',
            avatar: '/static/images/avatar-placeholder.svg',
            rating: 5,
            content: '课程内容很实用，讲解也很清晰',
            time: '2024-03-10'
          },
          {
            username: '学员2',
            avatar: '/static/images/avatar-placeholder.svg',
            rating: 4,
            content: '基础知识讲解的很详细，适合入门',
            time: '2024-03-09'
          }
        ]
      }
    }
  },
  onLoad(options) {
    if (options.id) {
      this.courseId = options.id;
      // 这里可以根据id加载课程数据
      // this.loadCourseData(this.courseId);
    }
  },
  methods: {
    goBack() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    },
    navigateToVideo(videoId) {
      uni.redirectTo({
        url: `/pages/course/video?id=${videoId}&courseId=${this.courseId}`
      });
    }
  }
}
</script>

<style>
.course-detail {
  min-height: 100vh;
  background: #f8f8f8;
}

.header {
  background: #fff;
  padding-bottom: 30rpx;
}

.cover-image {
  width: 100%;
  height: 400rpx;
}

.course-info {
  padding: 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.teacher {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
  display: block;
}

.meta {
  display: flex;
  gap: 30rpx;
}

.meta-item {
  font-size: 24rpx;
  color: #999;
}

.tabs {
  display: flex;
  background: #fff;
  padding: 0 30rpx;
  border-bottom: 1rpx solid #eee;
  position: sticky;
  top: 0;
  z-index: 1;
}

.tab-item {
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.tab-item.active {
  color: #4CAF50;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 30rpx;
  right: 30rpx;
  height: 4rpx;
  background: #4CAF50;
  border-radius: 2rpx;
}

.content {
  padding: 30rpx;
}

.section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.description {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.outline-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.outline-item {
  border-bottom: 1rpx solid #eee;
  padding-bottom: 20rpx;
}

.outline-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.chapter-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.chapter-points {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.point-item {
  font-size: 26rpx;
  color: #666;
}

.video-list {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.video-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.video-item:last-child {
  border-bottom: none;
}

.video-thumb {
  width: 160rpx;
  height: 90rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.video-info {
  flex: 1;
}

.video-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.video-duration {
  font-size: 24rpx;
  color: #999;
}

.video-status {
  font-size: 24rpx;
  color: #999;
  padding: 4rpx 12rpx;
  border-radius: 100rpx;
  background: #f0f0f0;
}

.video-status.completed {
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
}

.comments-list {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.comment-item {
  display: flex;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.comment-item:last-child {
  border-bottom: none;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  margin-right: 20rpx;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.username {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.rating {
  font-size: 24rpx;
  color: #FFB800;
}

.comment-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 10rpx;
  display: block;
}

.comment-time {
  font-size: 24rpx;
  color: #999;
}

.back-btn {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  z-index: 10;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.7);
  border-radius: 50%;
  font-size: 36rpx;
  color: #333;
}
</style> 