<template>
  <view class="course-list">
    <view class="course-filters">
      <text class="filter-title">课程分类</text>
      <scroll-view scroll-x="true" class="filter-scroll">
        <view 
          v-for="(category, index) in categories" 
          :key="index"
          class="filter-item"
          :class="{ active: currentCategory === category }"
          @tap="selectCategory(category)"
        >
          {{ category }}
        </view>
      </scroll-view>
    </view>

    <view class="courses-grid">
      <view 
        v-for="(course, index) in filteredCourses" 
        :key="index"
        class="course-card"
        @tap="selectCourse(course)"
      >
        <image :src="course.coverImage" class="course-image" mode="aspectFill" />
        <view class="course-content">
          <text class="course-name">{{ course.name }}</text>
          <text class="course-brief">{{ course.brief }}</text>
          <view class="course-meta">
            <text class="course-lessons">{{ course.lessonCount }}课时</text>
            <text class="course-students">{{ course.studentCount }}人学习</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CourseList',
  data() {
    return {
      currentCategory: '全部',
      categories: ['全部', 'Python', 'Java', 'Web开发', '人工智能'],
      courses: [
        {
          id: 1,
          name: 'Python编程基础',
          brief: '从零开始学习Python编程，掌握编程思维',
          coverImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2SiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9k=',
          category: 'Python',
          lessonCount: 30,
          studentCount: 1280
        },
        {
          id: 2,
          name: 'Java程序设计',
          brief: '全面学习Java语言，构建完整知识体系',
          coverImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIHMUEGEyFRFGFxIjKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2SiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9k=',
          category: 'Java',
          lessonCount: 45,
          studentCount: 960
        },
        // 可以添加更多课程
      ]
    }
  },
  computed: {
    filteredCourses() {
      if (this.currentCategory === '全部') {
        return this.courses
      }
      return this.courses.filter(course => course.category === this.currentCategory)
    }
  },
  methods: {
    selectCategory(category) {
      this.currentCategory = category
    },
    selectCourse(course) {
      this.$emit('select-course', course)
    }
  }
}
</script>

<style>
.course-list {
  padding: 20rpx;
}

.course-filters {
  margin-bottom: 30rpx;
}

.filter-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
  display: block;
}

.filter-scroll {
  white-space: nowrap;
  margin-bottom: 20rpx;
}

.filter-item {
  display: inline-block;
  padding: 10rpx 30rpx;
  margin-right: 20rpx;
  border-radius: 30rpx;
  font-size: 28rpx;
  color: #666;
  background: #f5f5f5;
  transition: all 0.3s;
}

.filter-item.active {
  color: #fff;
  background: #4CAF50;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300rpx, 1fr));
  gap: 30rpx;
}

.course-card {
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.course-card:active {
  transform: scale(0.98);
}

.course-image {
  width: 100%;
  height: 200rpx;
}

.course-content {
  padding: 20rpx;
}

.course-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.course-brief {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 20rpx;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #999;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .course-list {
    background: #1a1a1a;
  }
  
  .filter-title {
    color: #aaa;
  }
  
  .filter-item {
    background: #333;
    color: #aaa;
  }
  
  .filter-item.active {
    background: #2E7D32;
  }
  
  .course-card {
    background: #2d2d2d;
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.2);
  }
  
  .course-name {
    color: #fff;
  }
  
  .course-brief {
    color: #aaa;
  }
  
  .course-meta {
    color: #888;
  }
}
</style> 