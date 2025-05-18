<template>
  <view class="tab-bar">
    <view 
      v-for="(item, index) in tabs" 
      :key="index"
      class="tab-item"
      :class="{ active: currentTab === item.name }"
      @click="switchTab(item.name)"
    >
      <view class="tab-icon">
        <template v-if="item.name === 'home'">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </template>
        <template v-else-if="item.name === 'inbox'">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5v-3h3.56c.69 1.19 1.97 2 3.45 2s2.75-.81 3.45-2H19v3zm0-5h-4.99c0 1.1-.9 2-2 2s-2-.9-2-2H5V5h14v9z"/>
          </svg>
        </template>
        <template v-else-if="item.name === 'profile'">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </template>
      </view>
      <text class="tab-label">{{ item.label }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TabBar',
  data() {
    return {
      currentTab: 'home',
      tabs: [
        { name: 'home', label: '首页' },
        { name: 'inbox', label: '消息' },
        { name: 'profile', label: '我的' }
      ]
    }
  },
  methods: {
    switchTab(name) {
      this.currentTab = name;
      this.$emit('tab-change', name);
    }
  }
}
</script>

<style>
.tab-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  background-color: #ffffff;
  border-top: 1px solid #eee;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 4px 0;
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  margin-bottom: 2px;
  color: #666;
}

.tab-item.active .tab-icon {
  color: #4CAF50;
}

.tab-label {
  font-size: 12px;
  color: #666;
}

.tab-item.active .tab-label {
  color: #4CAF50;
}

/* 添加点击反馈 */
.tab-item:active {
  opacity: 0.7;
}
</style> 