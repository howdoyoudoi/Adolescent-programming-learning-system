<!-- 课程播放页面 -->
<template>
  <div class="course-page">
    <!-- 课程内容区域 -->
    <div class="course-content">
      <CoursePlayer :video-list="videoList" @video-change="handleVideoChange" />
      
      <!-- 课程信息 -->
      <div class="course-info">
        <h1 class="course-title">{{ course.title }}</h1>
        <div class="course-meta">
          <span class="teacher">讲师：{{ course.teacher }}</span>
          <span class="students">{{ course.studentCount }}人在学</span>
          <span class="rating">
            <i class="icon-star"></i>
            {{ course.rating }}
          </span>
        </div>
        <div class="course-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-btn"
            :class="{ active: currentTab === tab.id }"
            @click="currentTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
        
        <!-- 课程简介 -->
        <div v-if="currentTab === 'intro'" class="tab-content">
          <div class="course-description">
            <h3>课程介绍</h3>
            <p>{{ course.description }}</p>
          </div>
          <div class="course-outline">
            <h3>课程大纲</h3>
            <ul class="outline-list">
              <li v-for="(chapter, index) in course.outline" :key="index">
                <h4>{{ chapter.title }}</h4>
                <ul>
                  <li v-for="(lesson, lIndex) in chapter.lessons" :key="lIndex">
                    {{ lesson }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- 课程评论 -->
        <div v-if="currentTab === 'comments'" class="tab-content">
          <CourseComments :course-id="course.id" @comment-added="handleCommentAdded" />
        </div>
        
        <!-- 学习笔记 -->
        <div v-if="currentTab === 'notes'" class="tab-content">
          <div class="notes-editor">
            <textarea
              v-model="currentNote"
              placeholder="记录你的学习笔记..."
              :rows="5"
              class="note-textarea"
            ></textarea>
            <div class="note-actions">
              <button @click="saveNote" class="save-btn">保存笔记</button>
            </div>
          </div>
          <div class="notes-list">
            <div v-for="note in notes" :key="note.id" class="note-item">
              <div class="note-header">
                <span class="note-time">{{ formatTime(note.timestamp) }}</span>
                <div class="note-actions">
                  <button @click="editNote(note)" class="action-btn">编辑</button>
                  <button @click="deleteNote(note.id)" class="action-btn delete">删除</button>
                </div>
              </div>
              <div class="note-content">{{ note.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 课程目录侧边栏 -->
    <div class="course-sidebar">
      <h3 class="sidebar-title">课程目录</h3>
      <div class="video-list">
        <div
          v-for="(video, index) in videoList"
          :key="index"
          class="video-item"
          :class="{ active: currentVideoIndex === index, completed: completedVideos.has(video.url) }"
          @click="changeVideo(index)"
        >
          <div class="video-info">
            <span class="video-title">{{ video.title }}</span>
            <span class="video-duration">{{ video.duration }}</span>
          </div>
          <i v-if="completedVideos.has(video.url)" class="icon-check"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CoursePlayer from '@/components/CoursePlayer.vue'
import CourseComments from '@/components/CourseComments.vue'

export default {
  name: 'CoursePage',
  components: {
    CoursePlayer,
    CourseComments
  },
  data() {
    return {
      currentTab: 'intro',
      currentVideoIndex: 0,
      currentNote: '',
      completedVideos: new Set(),
      tabs: [
        { id: 'intro', name: '课程介绍' },
        { id: 'comments', name: '课程评论' },
        { id: 'notes', name: '学习笔记' }
      ],
      course: {
        id: '1',
        title: 'Python编程基础入门',
        teacher: '王老师',
        studentCount: 1234,
        rating: 4.8,
        description: '本课程将带你从零开始学习Python编程，通过实践项目掌握Python基础知识。',
        outline: [
          {
            title: '第一章：Python基础',
            lessons: [
              'Python环境搭建',
              '变量和数据类型',
              '条件语句和循环'
            ]
          },
          {
            title: '第二章：函数和模块',
            lessons: [
              '函数的定义和调用',
              '模块的使用',
              '包的管理'
            ]
          }
        ]
      },
      videoList: [
        {
          title: 'Python基础入门 - 第1课',
          description: '本课程将介绍Python编程的基础知识，包括变量、数据类型和基本语法。',
          url: 'https://example.com/videos/python-basics-1.mp4',
          poster: 'data:image/jpeg;base64,...', // 实际使用时替换为真实的base64图片数据
          duration: '25:30'
        },
        {
          title: 'Python基础入门 - 第2课',
          description: '学习Python中的条件语句和循环结构。',
          url: 'https://example.com/videos/python-basics-2.mp4',
          poster: 'data:image/jpeg;base64,...', // 实际使用时替换为真实的base64图片数据
          duration: '28:15'
        }
      ],
      notes: [
        {
          id: '1',
          content: 'Python中的变量不需要声明类型，这一点和Java、C++不同。',
          timestamp: Date.now() - 86400000
        }
      ]
    }
  },
  methods: {
    handleVideoChange(index) {
      this.currentVideoIndex = index
    },
    
    changeVideo(index) {
      if (index >= 0 && index < this.videoList.length) {
        this.currentVideoIndex = index
        this.$refs.coursePlayer.changeVideo(index)
      }
    },
    
    handleCommentAdded(comment) {
      // 可以在这里处理新评论，例如显示提示信息
      console.log('新评论已添加：', comment)
    },
    
    saveNote() {
      if (!this.currentNote.trim()) return
      
      const note = {
        id: Date.now().toString(),
        content: this.currentNote,
        timestamp: Date.now()
      }
      
      this.notes.unshift(note)
      this.currentNote = ''
      
      // 保存到localStorage
      this.saveNotesToStorage()
    },
    
    editNote(note) {
      this.currentNote = note.content
      this.deleteNote(note.id)
    },
    
    deleteNote(noteId) {
      this.notes = this.notes.filter(note => note.id !== noteId)
      this.saveNotesToStorage()
    },
    
    saveNotesToStorage() {
      localStorage.setItem(`course_notes_${this.course.id}`, JSON.stringify(this.notes))
    },
    
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
  },
  mounted() {
    // 加载笔记
    const savedNotes = localStorage.getItem(`course_notes_${this.course.id}`)
    if (savedNotes) {
      this.notes = JSON.parse(savedNotes)
    }
    
    // 加载已完成视频
    const savedCompleted = localStorage.getItem('completedVideos')
    if (savedCompleted) {
      this.completedVideos = new Set(JSON.parse(savedCompleted))
    }
  }
}
</script>

<style>
.course-page {
  display: flex;
  height: 100vh;
  background: #f8f9fa;
}

.course-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.course-info {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.course-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.course-meta {
  display: flex;
  gap: 20px;
  color: #666;
  margin-bottom: 20px;
}

.icon-star {
  color: #f0ad4e;
}

.course-tabs {
  display: flex;
  gap: 10px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  font-size: 16px;
  position: relative;
}

.tab-btn.active {
  color: #4CAF50;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #4CAF50;
}

.tab-content {
  min-height: 300px;
}

.course-description {
  margin-bottom: 30px;
}

.outline-list {
  list-style: none;
  padding: 0;
}

.outline-list h4 {
  margin: 20px 0 10px;
  color: #333;
}

.outline-list ul {
  list-style: none;
  padding-left: 20px;
}

.outline-list ul li {
  color: #666;
  margin: 5px 0;
}

.notes-editor {
  margin-bottom: 30px;
}

.note-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
  line-height: 1.5;
}

.note-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.save-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.note-item {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
}

.note-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.note-time {
  color: #999;
  font-size: 14px;
}

.action-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px 8px;
}

.action-btn.delete {
  color: #f44336;
}

.course-sidebar {
  width: 300px;
  background: #fff;
  border-left: 1px solid #eee;
  padding: 20px;
  overflow-y: auto;
}

.sidebar-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.video-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.icon-check {
  color: #4CAF50;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .course-page {
    background: #1a1a1a;
  }
  
  .course-content,
  .course-sidebar {
    background: #1e1e1e;
  }
  
  .course-info {
    background: #2d2d2d;
  }
  
  .course-title {
    color: #fff;
  }
  
  .course-meta {
    color: #999;
  }
  
  .tab-btn {
    color: #999;
  }
  
  .outline-list h4 {
    color: #fff;
  }
  
  .outline-list ul li {
    color: #999;
  }
  
  .note-textarea {
    background: #2d2d2d;
    border-color: #3d3d3d;
    color: #fff;
  }
  
  .note-item {
    border-color: #3d3d3d;
    background: #2d2d2d;
  }
  
  .video-item {
    border-bottom-color: #3d3d3d;
  }
  
  .video-item:hover {
    background: #2d2d2d;
  }
  
  .video-item.active {
    background: #1b5e20;
  }
  
  .video-item.completed {
    background: #3d3d3d;
  }
}
</style> 