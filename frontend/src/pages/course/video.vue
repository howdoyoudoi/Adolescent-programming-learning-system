<template>
  <view class="video-page">
    <!-- 自定义导航栏 -->
    <view class="custom-nav">
      <view class="nav-back" @tap="goBack">
        <text class="iconfont icon-back">←</text>
      </view>
      <text class="nav-title">视频播放</text>
    </view>

    <!-- 视频播放器 -->
    <view class="video-container">
      <video
        :src="currentVideo.url"
        :poster="currentVideo.poster"
        :controls="true"
        :show-center-play-btn="true"
        :enable-progress-gesture="true"
        :show-fullscreen-btn="true"
        @timeupdate="onTimeUpdate"
        @ended="onVideoEnded"
        class="video-player"
        id="videoPlayer"
      ></video>
    </view>

    <!-- 视频信息 -->
    <view class="video-info">
      <text class="video-title">{{ currentVideo.title }}</text>
      <view class="meta">
        <text class="views">{{ currentVideo.views }}次观看</text>
        <text class="duration">{{ formatDuration(currentVideo.duration) }}</text>
      </view>
    </view>

    <!-- 课程进度 -->
    <view class="progress-section">
      <view class="progress-header">
        <text class="section-title">学习进度</text>
        <text class="progress-text">{{ completedCount }}/{{ totalVideos }}</text>
      </view>
      <progress :percent="progressPercent" stroke-width="4" color="#4CAF50" />
    </view>

    <!-- 视频列表 -->
    <scroll-view scroll-y class="video-list">
      <view
        v-for="(video, index) in courseVideos"
        :key="index"
        :class="['video-item', { active: currentVideo.id === video.id }]"
        @tap="switchVideo(video)"
      >
        <image :src="video.thumbnail" mode="aspectFill" class="thumbnail" />
        <view class="item-info">
          <text class="item-title">{{ video.title }}</text>
          <text class="item-duration">{{ formatDuration(video.duration) }}</text>
        </view>
        <text v-if="video.completed" class="completed-tag">已完成</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      courseId: '',
      videoId: '',
      currentVideo: {
        id: 1,
        title: '1.1 Python简介与环境搭建',
        url: 'https://example.com/videos/python-intro.mp4',
        poster: '/static/images/course-placeholder.svg',
        thumbnail: '/static/images/course-placeholder.svg',
        duration: 1500, // 秒
        views: 1280
      },
      courseVideos: [
        {
          id: 1,
          title: '1.1 Python简介与环境搭建',
          thumbnail: '/static/images/course-placeholder.svg',
          duration: 1500,
          completed: true
        },
        {
          id: 2,
          title: '1.2 第一个Python程序',
          thumbnail: '/static/images/course-placeholder.svg',
          duration: 1200,
          completed: false
        },
        {
          id: 3,
          title: '1.3 变量与数据类型',
          thumbnail: '/static/images/course-placeholder.svg',
          duration: 1800,
          completed: false
        }
      ],
      watchProgress: {},
      completedVideos: new Set()
    }
  },
  computed: {
    totalVideos() {
      return this.courseVideos.length
    },
    completedCount() {
      return this.completedVideos.size
    },
    progressPercent() {
      return (this.completedCount / this.totalVideos) * 100
    }
  },
  onLoad(options) {
    if (options.id) {
      this.videoId = parseInt(options.id)
      // 根据videoId设置当前视频
      const video = this.courseVideos.find(v => v.id === this.videoId)
      if (video) {
        this.currentVideo = {
          ...video,
          url: `https://example.com/videos/video-${video.id}.mp4`,
          poster: video.thumbnail
        }
      }
    }
    if (options.courseId) {
      this.courseId = options.courseId
    }
    // 加载已保存的观看进度
    this.loadProgress()
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    },
    onTimeUpdate(e) {
      const currentTime = e.detail.currentTime
      const duration = e.detail.duration
      // 保存观看进度
      this.watchProgress[this.currentVideo.id] = currentTime
      uni.setStorageSync(`video_progress_${this.currentVideo.id}`, currentTime)
      
      // 如果观看超过90%，标记为已完成
      if (currentTime / duration > 0.9) {
        this.markAsCompleted(this.currentVideo.id)
      }
    },
    onVideoEnded() {
      this.markAsCompleted(this.currentVideo.id)
      // 自动播放下一个视频
      const currentIndex = this.courseVideos.findIndex(v => v.id === this.currentVideo.id)
      if (currentIndex < this.courseVideos.length - 1) {
        this.switchVideo(this.courseVideos[currentIndex + 1])
      }
    },
    markAsCompleted(videoId) {
      this.completedVideos.add(videoId)
      const video = this.courseVideos.find(v => v.id === videoId)
      if (video) {
        video.completed = true
      }
      // 保存完成状态
      uni.setStorageSync(`completed_videos_${this.courseId}`, Array.from(this.completedVideos))
    },
    switchVideo(video) {
      this.currentVideo = {
        ...video,
        url: `https://example.com/videos/video-${video.id}.mp4`,
        poster: video.thumbnail
      }
      // 恢复观看进度
      const progress = uni.getStorageSync(`video_progress_${video.id}`)
      if (progress) {
        setTimeout(() => {
          const videoContext = uni.createVideoContext('videoPlayer', this)
          videoContext.seek(progress)
        }, 100)
      }
    },
    loadProgress() {
      // 加载已完成的视频
      const completed = uni.getStorageSync(`completed_videos_${this.courseId}`)
      if (completed) {
        this.completedVideos = new Set(completed)
        this.courseVideos.forEach(video => {
          video.completed = this.completedVideos.has(video.id)
        })
      }
      
      // 加载当前视频的观看进度
      const progress = uni.getStorageSync(`video_progress_${this.videoId}`)
      if (progress) {
        setTimeout(() => {
          const videoContext = uni.createVideoContext('videoPlayer', this)
          videoContext.seek(progress)
        }, 100)
      }
    }
  }
}
</script>

<style>
.video-page {
  min-height: 100vh;
  background: #f8f8f8;
}

.custom-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 88rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  z-index: 100;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.nav-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-back {
  font-size: 40rpx;
  color: #333;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.video-container {
  width: 100%;
  background: #000;
  margin-top: 88rpx;
}

.video-player {
  width: 100%;
  height: 422rpx;
}

.video-info {
  background: #fff;
  padding: 30rpx;
}

.video-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.meta {
  display: flex;
  gap: 20rpx;
}

.views, .duration {
  font-size: 24rpx;
  color: #999;
}

.progress-section {
  background: #fff;
  margin-top: 20rpx;
  padding: 30rpx;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.progress-text {
  font-size: 24rpx;
  color: #666;
}

.video-list {
  margin-top: 20rpx;
  background: #fff;
  max-height: calc(100vh - 750rpx);
}

.video-item {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #eee;
}

.video-item.active {
  background: rgba(76, 175, 80, 0.05);
}

.thumbnail {
  width: 200rpx;
  height: 112rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.item-info {
  flex: 1;
}

.item-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.item-duration {
  font-size: 24rpx;
  color: #999;
}

.completed-tag {
  font-size: 24rpx;
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 100rpx;
}
</style> 