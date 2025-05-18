<template>
  <view class="container">
    <view class="card">
      <text class="title">关于我们</text>
      <view class="content">
        <text class="desc">青少年编程学习系统是一个专门为青少年设计的编程学习平台。我们的目标是通过有趣和互动的方式，帮助青少年掌握编程技能，培养逻辑思维能力。</text>
        <text class="subtitle">我们的特色</text>
        <view class="feature-list">
          <text class="feature-item">• 趣味性的编程课程</text>
          <text class="feature-item">• 互动式的学习体验</text>
          <text class="feature-item">• 专业的导师指导</text>
          <text class="feature-item">• 实时的学习反馈</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style>
.container {
  padding: 15px;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  display: block;
  margin-bottom: 15px;
}

.content {
  margin-top: 15px;
}

.desc {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  display: block;
}

.subtitle {
  font-size: 18px;
  font-weight: bold;
  display: block;
  margin: 15px 0;
}

.feature-list {
  padding-left: 10px;
}

.feature-item {
  font-size: 14px;
  color: #333;
  line-height: 1.8;
  display: block;
}
</style> 