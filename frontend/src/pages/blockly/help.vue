<template>
  <view class="help-container">
    <view class="section">
      <text class="section-title">基础操作指南</text>
      <view class="content">
        <text class="item">1. 从左侧工具箱中拖拽积木块到工作区</text>
        <text class="item">2. 将积木块组合形成程序逻辑</text>
        <text class="item">3. 点击"运行"按钮查看效果</text>
        <text class="item">4. 使用底部工具栏保存或分享您的作品</text>
      </view>
    </view>

    <view class="section">
      <text class="section-title">积木块说明</text>
      <view class="content">
        <view class="block-type">
          <text class="type-title">控制类</text>
          <text class="type-desc">• 条件判断：用于设置if-else逻辑</text>
          <text class="type-desc">• 循环控制：用于重复执行某些操作</text>
        </view>
        <view class="block-type">
          <text class="type-title">绘图类</text>
          <text class="type-desc">• 移动绘制：控制画笔移动</text>
          <text class="type-desc">• 形状绘制：绘制各种基本图形</text>
        </view>
        <view class="block-type">
          <text class="type-title">数学类</text>
          <text class="type-desc">• 数字：提供数值输入</text>
          <text class="type-desc">• 运算：进行基本的数学运算</text>
        </view>
      </view>
    </view>

    <view class="section">
      <text class="section-title">快捷操作</text>
      <view class="content">
        <text class="item">• 双击积木块：复制一个相同的积木块</text>
        <text class="item">• 右键积木块：显示更多操作选项</text>
        <text class="item">• 拖拽到垃圾桶：删除积木块</text>
        <text class="item">• 点击空白处：取消选中状态</text>
      </view>
    </view>

    <view class="section">
      <text class="section-title">示例项目</text>
      <view class="examples">
        <view class="example-item" v-for="(example, index) in examples" :key="index" @click="loadExample(example)">
          <image class="example-image" :src="example.image" mode="aspectFill"></image>
          <text class="example-name">{{ example.name }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      examples: [
        {
          name: '绘制房子',
          image: '/static/images/example-house.png',
          code: '...' // 示例代码
        },
        {
          name: '画五角星',
          image: '/static/images/example-star.png',
          code: '...' // 示例代码
        },
        {
          name: '彩色方块',
          image: '/static/images/example-squares.png',
          code: '...' // 示例代码
        }
      ]
    }
  },
  methods: {
    loadExample(example) {
      // 将示例代码加载到编辑器
      uni.setStorageSync('blockly_temp_code', example.code)
      uni.navigateBack()
    }
  }
}
</script>

<style>
.help-container {
  padding: 15px;
  background-color: #f5f5f5;
}

.section {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.content {
  color: #666;
}

.item {
  font-size: 14px;
  line-height: 1.8;
  display: block;
}

.block-type {
  margin-bottom: 15px;
}

.type-title {
  font-size: 16px;
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 5px;
  display: block;
}

.type-desc {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  display: block;
}

.examples {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -5px;
}

.example-item {
  width: calc(33.33% - 10px);
  margin: 5px;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.example-image {
  width: 100%;
  height: 100px;
  background-color: #eee;
}

.example-name {
  font-size: 12px;
  color: #333;
  padding: 5px;
  text-align: center;
  display: block;
}
</style> 