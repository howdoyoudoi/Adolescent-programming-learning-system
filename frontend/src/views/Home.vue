<template>
  <div class="home container">
    <div class="card">
      <h1 class="text-center">欢迎来到青少年编程学习系统</h1>
      <p class="text-center mt-16">开始您的编程学习之旅</p>
    </div>
    
    <div class="card">
      <h2>最近课程</h2>
      <div class="course-list">
        <div v-for="course in courses" :key="course.id" class="course-item">
          <h3>{{ course.title }}</h3>
          <p>{{ course.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      courses: [
        {
          id: 1,
          title: 'Python基础入门',
          description: '学习Python编程的基本概念和语法'
        },
        {
          id: 2,
          title: '网页设计基础',
          description: '学习HTML、CSS和JavaScript基础'
        }
      ]
    }
  }
}
</script>

<style scoped>
.home {
  padding-top: 20px;
}

.course-list {
  margin-top: 16px;
}

.course-item {
  padding: 16px;
  border: 1px solid #eee;
  border-radius: var(--border-radius);
  margin-bottom: 16px;
}

.course-item h3 {
  color: var(--primary-color);
  margin-bottom: 8px;
}
</style> 