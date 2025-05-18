<template>
  <div class="video-player">
    <div class="video-container">
      <video
        ref="videoRef"
        class="video-element"
        :src="videoUrl"
        @timeupdate="handleTimeUpdate"
        @ended="handleVideoEnded"
        @loadedmetadata="handleVideoLoaded"
        @playing="isPlaying = true"
        @pause="isPlaying = false"
        @waiting="loading = true"
        @canplay="loading = false"
        preload="metadata"
      >
        您的浏览器不支持 HTML5 视频播放
      </video>
      
      <div class="video-controls" v-show="!loading">
        <div class="progress-bar" @click="handleProgressClick">
          <div class="progress-background"></div>
          <div class="progress-current" :style="{ width: progress + '%' }"></div>
          <div class="progress-handle" :style="{ left: progress + '%' }"></div>
        </div>
        
        <div class="control-buttons">
          <button class="control-btn" @click="togglePlay">
            <span class="icon">{{ isPlaying ? '⏸' : '▶' }}</span>
          </button>
          
          <div class="time-display">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </div>
          
          <div class="volume-control">
            <button class="control-btn" @click="toggleMute">
              <span class="icon">{{ isMuted ? '🔇' : '🔊' }}</span>
            </button>
            <input 
              type="range" 
              class="volume-slider" 
              min="0" 
              max="100" 
              v-model="volume"
              @input="handleVolumeChange"
            >
          </div>
          
          <button class="control-btn" @click="toggleFullscreen">
            <span class="icon">⛶</span>
          </button>
        </div>
      </div>
      
      <div class="loading-overlay" v-if="loading">
        <div class="loading-spinner"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  videoUrl: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['ended'])

const videoRef = ref(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const volume = ref(100)
const currentTime = ref(0)
const duration = ref(0)
const loading = ref(true)
const progress = ref(0)

const togglePlay = () => {
  const video = videoRef.value
  if (!video) return
  
  if (isPlaying.value) {
    video.pause()
  } else {
    video.play()
  }
}

const handleTimeUpdate = () => {
  const video = videoRef.value
  if (!video) return
  
  currentTime.value = video.currentTime
  progress.value = (video.currentTime / video.duration) * 100
}

const handleVideoEnded = () => {
  isPlaying.value = false
  emit('ended')
}

const handleVideoLoaded = () => {
  const video = videoRef.value
  if (!video) return
  
  duration.value = video.duration
  loading.value = false
}

const handleProgressClick = (e) => {
  const video = videoRef.value
  if (!video) return
  
  const rect = e.target.getBoundingClientRect()
  const pos = (e.clientX - rect.left) / rect.width
  video.currentTime = pos * video.duration
}

const toggleMute = () => {
  const video = videoRef.value
  if (!video) return
  
  video.muted = !video.muted
  isMuted.value = video.muted
}

const handleVolumeChange = () => {
  const video = videoRef.value
  if (!video) return
  
  video.volume = volume.value / 100
}

const toggleFullscreen = async () => {
  const container = videoRef.value?.parentElement
  if (!container) return
  
  try {
    if (!document.fullscreenElement) {
      await container.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  } catch (err) {
    console.error('全屏切换失败:', err)
  }
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 监听键盘事件
const handleKeydown = (e) => {
  if (!videoRef.value) return
  
  switch (e.code) {
    case 'Space':
      e.preventDefault()
      togglePlay()
      break
    case 'ArrowLeft':
      videoRef.value.currentTime -= 5
      break
    case 'ArrowRight':
      videoRef.value.currentTime += 5
      break
    case 'ArrowUp':
      volume.value = Math.min(100, volume.value + 5)
      handleVolumeChange()
      break
    case 'ArrowDown':
      volume.value = Math.max(0, volume.value - 5)
      handleVolumeChange()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style>
.video-player {
  width: 100%;
  background: #000;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.video-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 宽高比 */
}

.video-element {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
}

.video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  padding: 10px;
  opacity: 0;
  transition: opacity 0.3s;
}

.video-container:hover .video-controls {
  opacity: 1;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.2);
  cursor: pointer;
  position: relative;
  margin-bottom: 10px;
}

.progress-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.2);
}

.progress-current {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background: #4CAF50;
  transition: width 0.1s;
}

.progress-handle {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s;
}

.progress-bar:hover .progress-handle {
  opacity: 1;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 15px;
}

.control-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.control-btn:hover {
  opacity: 1;
}

.time-display {
  color: #fff;
  font-size: 14px;
  font-family: monospace;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-slider {
  width: 80px;
  height: 4px;
  -webkit-appearance: none;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 