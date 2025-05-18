<template>
  <div class="learn-page">
    <div class="header">
      <div class="nav-tabs">
        <router-link to="/course/list" class="nav-tab">课程列表</router-link>
        <div class="nav-tab active">正在学习</div>
        <router-link to="/course/practice" class="nav-tab">编程练习</router-link>
      </div>
    </div>

    <div class="content-container">
      <div class="sidebar">
        <div class="course-info">
          <h2>{{ currentCourse.title }}</h2>
          <div class="progress-info">
            <div class="progress-bar">
              <div class="progress" :style="{ width: progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ progress }}% 完成</span>
          </div>
        </div>

        <div class="chapter-list">
          <div 
            v-for="(chapter, index) in chapters" 
            :key="chapter.id"
            class="chapter-item"
            :class="{ active: currentChapter === index }"
            @click="selectChapter(index)"
          >
            <div class="chapter-header">
              <span class="chapter-title">{{ chapter.title }}</span>
              <span class="chapter-duration">{{ formatDuration(chapter.duration) }}</span>
            </div>
            <div class="chapter-progress" :style="{ width: chapter.progress + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="main-content">
        <div class="video-section">
          <VideoPlayer 
            v-if="currentVideo.url"
            :video-url="currentVideo.url"
            @ended="handleVideoEnded"
          />
          <div v-else class="video-placeholder">
            <span>暂无视频内容</span>
          </div>
        </div>

        <div class="lesson-content">
          <h3>{{ currentVideo.title || '未选择课程' }}</h3>
          <div class="description" v-html="currentVideo.description"></div>
          
          <div class="resources" v-if="currentVideo.resources && currentVideo.resources.length">
            <h4>相关资源</h4>
            <ul>
              <li v-for="resource in currentVideo.resources" :key="resource.id">
                <a :href="resource.url" target="_blank">
                  {{ resource.title }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer.vue'

export default {
  name: 'LearnPage',
  components: {
    VideoPlayer
  },
  data() {
    return {
      currentCourse: {
        title: 'Python基础教程',
        progress: 35
      },
      currentChapter: 0,
      chapters: [
        {
          id: 1,
          title: '变量和数据类型',
          duration: 1200, // 20分钟
          progress: 100,
          videos: [
            {
              id: 1,
              title: '什么是变量？',
              url: 'https://www.w3schools.com/html/mov_bbb.mp4', // 使用测试视频
              description: '本节课将介绍Python中变量的概念、命名规则和使用方法。',
              resources: [
                {
                  id: 1,
                  title: '变量练习题',
                  url: '/exercises/variables.pdf'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          title: '条件语句',
          duration: 1500, // 25分钟
          progress: 0,
          videos: [
            {
              id: 2,
              title: 'if语句的使用',
              url: 'https://www.w3schools.com/html/mov_bbb.mp4', // 使用测试视频
              description: '学习如何使用if-else语句进行条件判断。'
            }
          ]
        }
      ]
    }
  },
  computed: {
    progress() {
      const totalChapters = this.chapters.length
      const completedProgress = this.chapters.reduce((sum, chapter) => sum + chapter.progress, 0)
      return Math.round(completedProgress / totalChapters)
    },
    currentVideo() {
      return this.chapters[this.currentChapter]?.videos[0] || {}
    }
  },
  methods: {
    selectChapter(index) {
      this.currentChapter = index
    },
    handleVideoEnded() {
      const chapter = this.chapters[this.currentChapter]
      if (chapter) {
        chapter.progress = 100
        // 自动播放下一章
        if (this.currentChapter < this.chapters.length - 1) {
          this.currentChapter++
        }
      }
    },
    formatDuration(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
  }
}
</script>

<style>
.learn-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  padding: 0 20px;
}

.nav-tabs {
  display: flex;
  gap: 20px;
  height: 50px;
  align-items: center;
}

.nav-tab {
  padding: 8px 16px;
  color: #666;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s;
}

.nav-tab:hover {
  color: #4CAF50;
  background: #f0f0f0;
}

.nav-tab.active {
  color: #4CAF50;
  font-weight: 500;
}

.content-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  background: #fff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.course-info {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.course-info h2 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s;
}

.progress-text {
  font-size: 14px;
  color: #666;
}

.chapter-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.chapter-item {
  padding: 15px;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  margin-bottom: 5px;
}

.chapter-item:hover {
  background: #f5f5f5;
}

.chapter-item.active {
  background: #e8f5e9;
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.chapter-title {
  font-size: 14px;
  color: #333;
}

.chapter-duration {
  font-size: 12px;
  color: #666;
}

.chapter-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: #4CAF50;
  transition: width 0.3s;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.video-section {
  margin-bottom: 20px;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 宽高比 */
}

.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 16px;
  background: #1e1e1e;
}

.lesson-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.lesson-content h3 {
  margin: 0 0 15px 0;
  font-size: 20px;
  color: #333;
}

.description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.resources h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
}

.resources ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.resources li {
  margin-bottom: 8px;
}

.resources a {
  color: #4CAF50;
  text-decoration: none;
}

.resources a:hover {
  text-decoration: underline;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style> 