<!-- 课程视频播放器组件 -->
<template>
  <div class="course-player">
    <div class="video-container">
      <video
        ref="videoPlayer"
        :src="currentVideo.url"
        :poster="currentVideo.poster"
        controls
        class="video-player"
        @error="handleVideoError"
        @timeupdate="handleTimeUpdate"
        @ended="handleVideoEnd"
        :title="currentVideo.title"
      ></video>
      
      <!-- 自定义进度条 -->
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
      
      <!-- 播放控制 -->
      <div class="video-controls">
        <button @click="togglePlay">{{ isPlaying ? '暂停' : '播放' }}</button>
        <button @click="rewind">后退10秒</button>
        <button @click="forward">前进10秒</button>
        <span class="time">{{ currentTime }} / {{ duration }}</span>
      </div>
    </div>
    
    <div class="course-info">
      <h3 class="course-title">{{ currentVideo.title }}</h3>
      <p class="course-description">{{ currentVideo.description }}</p>
    </div>
    
    <div class="video-list">
      <h4 class="section-title">课程列表</h4>
      <div class="video-scroll">
        <div 
          v-for="(video, index) in videoList" 
          :key="index"
          class="video-item"
          :class="{ active: currentVideoIndex === index, completed: completedVideos.has(video.url) }"
          @click="changeVideo(index)"
        >
          <img :src="video.thumbnail" class="video-thumbnail" alt="视频缩略图" />
          <div class="video-info">
            <span class="video-title">{{ video.title }}</span>
            <span class="video-duration">{{ video.duration }}</span>
          </div>
          <span class="completed-icon" v-if="completedVideos.has(video.url)">✓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CoursePlayer',
  data() {
    return {
      currentVideoIndex: 0,
      videoList: [
        {
          title: 'Python基础入门 - 第1课',
          description: '本课程将介绍Python编程的基础知识，包括变量、数据类型和基本语法。',
          url: 'https://example.com/videos/python-basics-1.mp4',
          poster: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2SiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9k=',
          thumbnail: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIHMUEGEyFRFGFxIjKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2SiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9k=',
          duration: '25:30'
        },
        {
          title: 'Python基础入门 - 第2课',
          description: '学习Python中的条件语句和循环结构。',
          url: 'https://example.com/videos/python-basics-2.mp4',
          poster: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIHMUEGEyFRFGFxIjKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2SiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9k=',
          thumbnail: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIHMUEGEyFRFGFxIjKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2SiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9k=',
          duration: '28:15'
        }
      ],
      playbackProgress: {},
      isPlaying: false,
      progress: 0,
      currentTime: '00:00',
      duration: '00:00',
      completedVideos: new Set()
    }
  },
  computed: {
    currentVideo() {
      return this.videoList[this.currentVideoIndex]
    }
  },
  methods: {
    changeVideo(index) {
      if (index >= 0 && index < this.videoList.length) {
        this.currentVideoIndex = index
      }
    },
    handleVideoError(error) {
      console.error('视频播放错误：', error)
      // 使用浏览器原生alert替代uni.showToast
      alert('视频加载失败，请稍后重试')
    },
    handleTimeUpdate(event) {
      const video = event.target
      this.progress = (video.currentTime / video.duration) * 100
      this.currentTime = this.formatTime(video.currentTime)
      this.duration = this.formatTime(video.duration)
      
      // 保存播放进度
      const videoId = this.currentVideo.url
      this.playbackProgress[videoId] = video.currentTime
      localStorage.setItem('videoProgress', JSON.stringify(this.playbackProgress))
      
      // 检查是否完成观看（进度超过90%）
      if ((video.currentTime / video.duration) > 0.9) {
        this.completedVideos.add(videoId)
        localStorage.setItem('completedVideos', JSON.stringify(Array.from(this.completedVideos)))
      }
    },
    handleVideoEnd() {
      this.isPlaying = false
      this.completedVideos.add(this.currentVideo.url)
      localStorage.setItem('completedVideos', JSON.stringify(Array.from(this.completedVideos)))
      
      // 自动播放下一个视频
      if (this.currentVideoIndex < this.videoList.length - 1) {
        this.changeVideo(this.currentVideoIndex + 1)
      }
    },
    togglePlay() {
      const video = this.$refs.videoPlayer
      if (video.paused) {
        video.play()
        this.isPlaying = true
      } else {
        video.pause()
        this.isPlaying = false
      }
    },
    rewind() {
      const video = this.$refs.videoPlayer
      video.currentTime = Math.max(0, video.currentTime - 10)
    },
    forward() {
      const video = this.$refs.videoPlayer
      video.currentTime = Math.min(video.duration, video.currentTime + 10)
    },
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
  },
  mounted() {
    // 加载播放进度
    const savedProgress = localStorage.getItem('videoProgress')
    if (savedProgress) {
      this.playbackProgress = JSON.parse(savedProgress)
    }
    
    // 加载已完成视频列表
    const savedCompleted = localStorage.getItem('completedVideos')
    if (savedCompleted) {
      this.completedVideos = new Set(JSON.parse(savedCompleted))
    }
  }
}
</script>

<style>
.course-player {
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.video-container {
  width: 100%;
  position: relative;
  background: #000;
}

.video-player {
  width: 100%;
  aspect-ratio: 16/9;
  max-height: 600px;
}

.course-info {
  padding: 20px;
  background: #fff;
  margin-bottom: 20px;
}

.course-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.course-description {
  font-size: 16px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.video-list {
  flex: 1;
  background: #fff;
  padding: 20px;
  overflow: hidden;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.video-scroll {
  height: calc(100vh - 700px);
  overflow-y: auto;
}

.video-item {
  display: flex;
  padding: 20px;
  border-bottom: 1px solid #eee;
  align-items: center;
  transition: background-color 0.3s;
  cursor: pointer;
}

.video-item:hover {
  background: #f5f5f5;
}

.video-item.active {
  background: #e8f5e9;
}

.video-item.completed {
  background: #f5f5f5;
}

.video-thumbnail {
  width: 160px;
  height: 90px;
  border-radius: 8px;
  margin-right: 20px;
  object-fit: cover;
}

.video-info {
  flex: 1;
}

.video-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.video-duration {
  font-size: 14px;
  color: #999;
}

.completed-icon {
  color: #4CAF50;
  margin-left: 10px;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .course-player {
    background: #1a1a1a;
  }
  
  .course-info,
  .video-list {
    background: #2d2d2d;
  }
  
  .course-title,
  .section-title {
    color: #fff;
  }
  
  .course-description {
    color: #aaa;
  }
  
  .video-item {
    border-bottom-color: #333;
  }
  
  .video-item:hover {
    background: #3d3d3d;
  }
  
  .video-item.active {
    background: #1b5e20;
  }
  
  .video-item.completed {
    background: #3d3d3d;
  }
  
  .video-title {
    color: #fff;
  }
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  position: absolute;
  bottom: 0;
  left: 0;
  cursor: pointer;
}

.progress {
  height: 100%;
  background: #4CAF50;
  transition: width 0.1s linear;
}

.video-controls {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 10px;
}

.video-controls button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.video-controls button:hover {
  background: #45a049;
}

.time {
  color: white;
  font-size: 14px;
  margin-left: auto;
}
</style> 