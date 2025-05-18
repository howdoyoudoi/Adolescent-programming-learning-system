<template>
  <div class="about container">
    <div class="card">
      <h1 class="text-center">关于我们</h1>
      <div class="content mt-16">
        <p>青少年编程学习系统是一个专门为青少年设计的编程学习平台。我们的目标是通过有趣和互动的方式，帮助青少年掌握编程技能，培养逻辑思维能力。</p>
        <h2 class="mt-16">我们的特色</h2>
        <ul class="feature-list">
          <li>趣味性的编程课程</li>
          <li>互动式的学习体验</li>
          <li>专业的导师指导</li>
          <li>实时的学习反馈</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.about {
  padding-top: 20px;
}

.content {
  line-height: 1.6;
}

.feature-list {
  margin-top: 16px;
  padding-left: 20px;
}

.feature-list li {
  margin-bottom: 8px;
  position: relative;
}

.feature-list li::before {
  content: "•";
  color: var(--primary-color);
  position: absolute;
  left: -20px;
}
</style> 