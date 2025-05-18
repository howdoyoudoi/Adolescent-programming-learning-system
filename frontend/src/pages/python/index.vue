<template>
  <view class="python-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-left">
        <view class="back-btn" @tap="goBack">
          <text class="iconfont">←</text>
          <text>返回</text>
        </view>
      </view>
      <view class="nav-title">Python编程</view>
      <view class="nav-right">
        <view class="action-btn" @tap="saveCode">
          <text class="iconfont">💾</text>
          <text>保存</text>
        </view>
        <view class="action-btn primary" @tap="runCode">
          <text class="iconfont">▶️</text>
          <text>运行</text>
        </view>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <view class="main-content">
      <!-- 代码编辑区域 -->
      <view class="code-section">
        <textarea
          class="code-editor"
          v-model="code"
          placeholder="在这里输入Python代码..."
          :disabled="isRunning"
        />
      </view>

      <!-- 输出显示区域 -->
      <view class="output-section">
        <view class="output-header">
          <text class="output-title">输出结果</text>
          <view class="clear-btn" @tap="clearOutput">
            <text class="iconfont">🗑️</text>
            <text>清除</text>
          </view>
        </view>
        <view class="output-content" :class="{ 'has-error': hasError }">
          <text class="output-text">{{ output || '暂无输出' }}</text>
        </view>
      </view>
    </view>

    <!-- 加载动画 -->
    <view class="loading-overlay" v-if="isRunning">
      <view class="loading-spinner"></view>
      <text>代码运行中...</text>
    </view>
  </view>
</template>

<script>
import { pythonApi } from '@/api'

export default {
  data() {
    return {
      code: '',
      output: '',
      isRunning: false,
      hasError: false
    }
  },
  onLoad() {
    // 尝试从本地存储加载上次的代码
    const savedCode = uni.getStorageSync('lastPythonCode')
    if (savedCode) {
      this.code = savedCode
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    async saveCode() {
      if (!this.code.trim()) {
        uni.showToast({
          title: '代码不能为空',
          icon: 'none'
        })
        return
      }

      try {
        const response = await pythonApi.save({
          code: this.code,
          title: '未命名代码',
          description: '通过Python编程页面保存的代码'
        })

        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })
        // 保存到本地存储
        uni.setStorageSync('lastPythonCode', this.code)
      } catch (error) {
        console.error('保存失败：', error)
      }
    },
    async runCode() {
      if (!this.code.trim()) {
        uni.showToast({
          title: '请先输入代码',
          icon: 'none'
        })
        return
      }

      this.isRunning = true
      this.hasError = false
      this.output = ''

      try {
        const response = await pythonApi.execute({
          code: this.code,
          timeout: 5000
        })

        this.output = response.data.output || '程序执行完成，无输出'
        this.hasError = false
        if (response.data.executionTime) {
          this.output += `\n\n执行时间: ${response.data.executionTime}ms`
        }
      } catch (error) {
        this.output = '执行出错：' + (error.message || '未知错误')
        this.hasError = true
      } finally {
        this.isRunning = false
      }
    },
    clearOutput() {
      this.output = ''
      this.hasError = false
    }
  }
}
</script>

<style>
.python-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.nav-bar {
  height: 50px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.back-btn, .action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:active, .action-btn:active {
  opacity: 0.7;
}

.action-btn.primary {
  background: #4CAF50;
  color: white;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  overflow: hidden;
}

.code-section {
  flex: 3;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.code-editor {
  width: 100%;
  height: 100%;
  padding: 16px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  border: none;
  resize: none;
  background: #1e1e1e;
  color: #d4d4d4;
}

.output-section {
  flex: 2;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.output-header {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.output-title {
  font-weight: 600;
  color: #333;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:active {
  opacity: 0.7;
}

.output-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  color: #333;
}

.output-content.has-error {
  color: #d32f2f;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: white;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 适配暗色模式 */
@media (prefers-color-scheme: dark) {
  .python-container {
    background: #1a1a1a;
  }

  .nav-bar {
    background: #2d2d2d;
  }

  .nav-title {
    color: #fff;
  }

  .code-section, .output-section {
    background: #2d2d2d;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .code-editor {
    background: #1e1e1e;
    color: #d4d4d4;
  }

  .output-header {
    border-bottom-color: #444;
  }

  .output-title {
    color: #fff;
  }

  .output-content {
    color: #d4d4d4;
  }

  .output-content.has-error {
    color: #ff6b6b;
  }
}
</style> 