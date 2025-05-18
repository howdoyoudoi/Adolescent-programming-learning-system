import { createApp } from 'vue'
import App from './App.vue'
import { loadResources } from './config/resources'

// 创建Vue应用实例
const app = createApp(App)

// 加载资源并启动应用
loadResources().then(resources => {
  // 将资源注入到全局属性中
  app.config.globalProperties.$resources = resources;
  
  // 挂载应用
  app.mount('#app')
}).catch(error => {
  console.error('资源加载失败，但应用将继续运行：', error);
  // 即使资源加载失败，也启动应用
  app.mount('#app')
}); 