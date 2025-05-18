<template>
  <view class="course-list-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="iconfont icon-search">🔍</text>
        <input 
          type="text" 
          v-model="searchKeyword"
          placeholder="搜索课程"
          class="search-input"
          @input="onSearch"
        />
      </view>
    </view>

    <!-- 分类标签 -->
    <scroll-view scroll-x class="category-scroll" show-scrollbar="false">
      <view class="category-list">
        <view 
          v-for="(category, index) in categories" 
          :key="index"
          :class="['category-item', { active: currentCategory === category.id }]"
          @tap="selectCategory(category.id)"
        >
          {{ category.name }}
        </view>
      </view>
    </scroll-view>

    <!-- 课程列表 -->
    <scroll-view 
      scroll-y 
      class="course-list"
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <view 
        v-for="(course, index) in filteredCourses" 
        :key="index"
        class="course-card"
        @tap="navigateToCourse(course.id)"
      >
        <image :src="course.cover" mode="aspectFill" class="course-image"></image>
        <view class="course-info">
          <text class="course-name">{{ course.name }}</text>
          <text class="course-desc">{{ course.description }}</text>
          <view class="course-meta">
            <view class="meta-left">
              <text class="teacher">{{ course.teacher }}</text>
              <text class="duration">{{ course.duration }}课时</text>
            </view>
            <view class="meta-right">
              <text class="students">{{ course.students }}人学习</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="isLoading" class="loading">
        <text>加载中...</text>
      </view>
      <view v-if="noMore" class="no-more">
        <text>没有更多课程了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      currentCategory: 'all',
      isRefreshing: false,
      isLoading: false,
      noMore: false,
      page: 1,
      categories: [
        { id: 'all', name: '全部' },
        { id: 'python', name: 'Python' },
        { id: 'java', name: 'Java' },
        { id: 'web', name: 'Web开发' },
        { id: 'ai', name: '人工智能' },
        { id: 'algorithm', name: '算法' }
      ],
      courses: [
        {
          id: 1,
          name: 'Python编程基础',
          description: '从零开始学习Python编程，掌握编程思维',
          cover: '/static/images/course-placeholder.svg',
          teacher: '张老师',
          duration: 30,
          students: 1280,
          category: 'python'
        },
        {
          id: 2,
          name: 'Java程序设计',
          description: '全面学习Java语言，构建完整知识体系',
          cover: '/static/images/course-placeholder.svg',
          teacher: '李老师',
          duration: 45,
          students: 960,
          category: 'java'
        },
        {
          id: 3,
          name: 'Web前端开发实战',
          description: '学习HTML、CSS、JavaScript，构建现代化网站',
          cover: '/static/images/course-placeholder.svg',
          teacher: '王老师',
          duration: 40,
          students: 850,
          category: 'web'
        }
      ]
    }
  },
  computed: {
    filteredCourses() {
      return this.courses.filter(course => {
        const matchCategory = this.currentCategory === 'all' || course.category === this.currentCategory
        const matchKeyword = course.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
                           course.description.toLowerCase().includes(this.searchKeyword.toLowerCase())
        return matchCategory && matchKeyword
      })
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    selectCategory(categoryId) {
      this.currentCategory = categoryId
    },
    onSearch() {
      // 实现搜索逻辑
    },
    async loadMore() {
      if (this.isLoading || this.noMore) return
      this.isLoading = true
      
      // 模拟加载更多数据
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 这里应该调用API获取更多课程
      this.page++
      if (this.page > 3) {
        this.noMore = true
      }
      
      this.isLoading = false
    },
    async onRefresh() {
      this.isRefreshing = true
      
      // 模拟刷新数据
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 这里应该调用API刷新课程列表
      this.page = 1
      this.noMore = false
      
      this.isRefreshing = false
    },
    navigateToCourse(courseId) {
      uni.redirectTo({
        url: `/pages/course/detail?id=${courseId}`
      })
    }
  }
}
</script>

<style>
.course-list-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.search-bar {
  padding: 20rpx 30rpx;
  background: #fff;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 8rpx;
  padding: 10rpx 20rpx;
}

.icon-search {
  margin-right: 10rpx;
  color: #999;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  height: 60rpx;
}

.category-scroll {
  background: #fff;
  padding: 20rpx 0;
  white-space: nowrap;
}

.category-list {
  display: inline-flex;
  padding: 0 20rpx;
}

.category-item {
  padding: 10rpx 30rpx;
  margin-right: 20rpx;
  font-size: 28rpx;
  color: #666;
  background: #f5f5f5;
  border-radius: 30rpx;
}

.category-item.active {
  color: #fff;
  background: #4CAF50;
}

.course-list {
  flex: 1;
  padding: 20rpx;
}

.course-card {
  margin-bottom: 20rpx;
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.course-image {
  width: 100%;
  height: 300rpx;
}

.course-info {
  padding: 20rpx;
}

.course-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.course-desc {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
  display: block;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.teacher {
  font-size: 24rpx;
  color: #4CAF50;
}

.duration {
  font-size: 24rpx;
  color: #999;
}

.students {
  font-size: 24rpx;
  color: #999;
}

.loading, .no-more {
  text-align: center;
  padding: 20rpx;
  color: #999;
  font-size: 24rpx;
}
</style> 