<template>
  <nav class="navbar">
    <div class="nav-brand">
      <router-link to="/">青少年编程学习系统</router-link>
    </div>
    <div class="nav-menu">
      <router-link to="/course/list" class="nav-item">
        <i class="el-icon-reading"></i>
        课程列表
      </router-link>
      <router-link to="/sensor" class="nav-item">
        <i class="el-icon-monitor"></i>
        传感器监控
      </router-link>
      <router-link to="/course/practice" class="nav-item">
        <i class="el-icon-edit-outline"></i>
        编程练习
      </router-link>
      <router-link to="/learn" class="nav-item">
        <i class="el-icon-notebook"></i>
        学习中心
      </router-link>
    </div>
    <div class="nav-right">
      <el-switch
        v-model="isDarkMode"
        @change="toggleDarkMode"
        active-text="深色"
        inactive-text="浅色"
      />
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isDarkMode = ref(false)

const toggleDarkMode = (value) => {
  document.documentElement.classList.toggle('dark', value)
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  background: var(--el-color-primary);
  color: white;
}

.nav-brand {
  font-size: 1.2em;
  font-weight: bold;
}

.nav-brand a {
  color: white;
  text-decoration: none;
}

.nav-menu {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-item i {
  font-size: 1.2em;
}

.nav-right {
  display: flex;
  align-items: center;
}

/* 深色模式适配 */
:deep(.el-switch__label) {
  color: white !important;
}
</style> 