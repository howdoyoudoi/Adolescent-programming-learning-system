<template>
  <view class="app-container">
    <router-view></router-view>
    <TabBar v-if="showTabBar" @tab-change="handleTabChange" />
  </view>
</template>

<script>
import TabBar from './components/TabBar.vue'

export default {
  components: {
    TabBar
  },
  data() {
    return {
      showTabBar: true
    }
  },
  onLaunch() {
    console.log('App Launch')
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  },
  methods: {
    handleTabChange(tab) {
      // 使用 switchTab 进行标签页切换
      switch(tab) {
        case 'home':
          uni.switchTab({ url: '/pages/index/index' });
          break;
        case 'inbox':
          uni.switchTab({ url: '/pages/inbox/index' });
          break;
        case 'profile':
          uni.switchTab({ url: '/pages/profile/index' });
          break;
      }
    }
  }
}
</script>

<style>
@import './static/css/tabbar-icons.css';

/*每个页面公共css */
page {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
    sans-serif;
}

/* 解决头条小程序组件内引用原生组件时，原生组件显示层级错误的问题 */
.fix-pc-native {
  position: relative;
  z-index: 1;
}

view {
  font-size: 14px;
  line-height: 1.8;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
  padding-bottom: 50px; /* 为底部导航栏留出空间 */
}

/* 修复小程序原生组件层级问题 */
.fix-pc-native {
  z-index: 999;
}

page {
  background-color: #f8f8f8;
}
</style>
