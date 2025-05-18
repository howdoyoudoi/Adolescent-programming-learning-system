import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SensorMonitor from '../components/SensorMonitor.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/sensor',
    name: 'SensorMonitor',
    component: SensorMonitor
  },
  {
    path: '/course/list',
    name: 'CourseList',
    component: () => import('@/pages/course/list.vue')
  },
  {
    path: '/course/practice',
    name: 'Practice',
    component: () => import('@/pages/course/practice.vue')
  },
  {
    path: '/learn',
    name: 'Learn',
    component: () => import('@/pages/learn/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router 