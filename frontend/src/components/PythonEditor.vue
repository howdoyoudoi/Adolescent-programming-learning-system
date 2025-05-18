<template>
  <div class="python-editor" ref="editor">
    <div class="split-container" ref="container">
      <div class="editor-section split" ref="editorSection">
        <div class="toolbar">
          <div class="tool-group">
            <button class="tool-btn" @click="runCode">
              <span class="btn-icon">▶</span>
              <span class="btn-text">运行</span>
            </button>
            <button class="tool-btn" @click="saveCode">
              <span class="btn-icon">💾</span>
              <span class="btn-text">保存</span>
            </button>
            <button class="tool-btn" @click="clearCode">
              <span class="btn-icon">🗑</span>
              <span class="btn-text">清空</span>
            </button>
          </div>
        </div>

        <div class="code-container">
          <textarea
            class="code-editor"
            v-model="code"
            :placeholder="placeholder"
            @input="handleInput"
            spellcheck="false"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
          ></textarea>
        </div>
      </div>

      <div class="output-section split" ref="outputSection">
        <div class="section-header">
          <h3>输出区</h3>
        </div>
        <div class="output-content">
          <pre :class="['output-text', { error: hasError }]">{{ output || '程序输出将显示在这里...' }}</pre>
        </div>
      </div>

      <div class="demo-section split" ref="demoSection">
        <div class="section-header">
          <h3>演示区</h3>
        </div>
        <div class="demo-content">
          <div v-if="!output" class="demo-placeholder">
            <p>运行代码后，这里将显示程序的可视化效果...</p>
          </div>
          <div v-else class="demo-result">
            <div class="demo-visualization">
              {{ output }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { pythonApi } from '@/api'
import Split from 'split.js/dist/split'

export default {
  name: 'PythonEditor',
  props: {
    initialCode: {
      type: String,
      default: ''
    },
    solution: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      code: this.initialCode,
      output: '',
      showOutput: false,
      hasError: false,
      placeholder: '# 在这里编写Python代码\n# 示例：\nprint("Hello, World!")\n\n# 可以使用的Python标准库：\n# - math\n# - random\n# - datetime\n# - json',
      split: null
    }
  },
  watch: {
    initialCode(newVal) {
      this.code = newVal
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 确保DOM完全渲染后再初始化分割线
      this.initSplitPanes()
    })
    
    // 加载上次保存的代码
    const savedCode = localStorage.getItem('pythonCode')
    if (savedCode && !this.initialCode) {
      this.code = savedCode
    }

    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    // 清理事件监听和分割线实例
    if (this.split) {
      this.split.destroy()
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    initSplitPanes() {
      if (this.split) {
        this.split.destroy()
      }

      const savedSizes = localStorage.getItem('pythonEditorSplitSizes')
      const initialSizes = savedSizes ? JSON.parse(savedSizes) : [40, 30, 30]

      this.split = Split([
        this.$refs.editorSection,
        this.$refs.outputSection,
        this.$refs.demoSection
      ], {
        sizes: initialSizes,
        minSize: [200, 150, 150],
        gutterSize: 8,
        snapOffset: 0,
        dragInterval: 1,
        cursor: 'col-resize',
        gutter: (index, direction) => {
          const gutter = document.createElement('div')
          gutter.className = `gutter gutter-${direction} gutter-${index}`
          return gutter
        },
        elementStyle: (dimension, size, gutterSize) => ({
          'flex-basis': `calc(${size}% - ${gutterSize}px)`,
        }),
        gutterStyle: (dimension, gutterSize) => ({
          'flex-basis': `${gutterSize}px`,
        }),
        onDrag: () => {
          this.$emit('resize')
        },
        onDragEnd: () => {
          this.saveSplitSizes()
        }
      })

      // 强制重新计算大小
      this.split.setSizes(initialSizes)
    },
    handleResize() {
      if (this.split) {
        this.split.setSizes(this.split.getSizes())
      }
    },
    saveSplitSizes() {
      if (this.split) {
        const sizes = this.split.getSizes()
        localStorage.setItem('pythonEditorSplitSizes', JSON.stringify(sizes))
      }
    },
    async runCode() {
      if (!this.code.trim()) {
        alert('请先编写代码')
        return
      }

      const maxRetries = 3
      let retryCount = 0

      const executeWithRetry = async () => {
        try {
          const response = await pythonApi.execute({ code: this.code })
          this.output = response.data.output || '程序执行完成'
          this.hasError = false
          this.showOutput = true
        } catch (error) {
          console.error('代码执行错误：', error)
          
          // 检查是否是网络错误
          if (error.message.includes('ERR_CONNECTION_TIMED_OUT') && retryCount < maxRetries) {
            retryCount++
            this.output = `网络连接超时，正在进行第 ${retryCount} 次重试...`
            this.hasError = true
            this.showOutput = true
            
            // 延迟重试
            await new Promise(resolve => setTimeout(resolve, 1000))
            return executeWithRetry()
          }
          
          this.output = error.message === 'ERR_CONNECTION_TIMED_OUT' 
            ? '网络连接超时，请检查网络连接后重试'
            : error.message || '程序执行出错'
          this.hasError = true
          this.showOutput = true
        }
      }

      await executeWithRetry()
    },
    
    saveCode() {
      try {
        localStorage.setItem('pythonCode', this.code)
        // 使用原生alert替代uni.showToast
        alert('保存成功')
      } catch (error) {
        console.error('保存失败：', error)
        alert('保存失败')
      }
    },
    
    clearCode() {
      if (confirm('确定要清空当前代码吗？')) {
        this.code = ''
        this.output = ''
        this.showOutput = false
      }
    },
    
    handleInput(e) {
      this.$emit('update:code', this.code)
    },
    
    closeOutput() {
      this.showOutput = false
    }
  }
}
</script>

<style>
.python-editor {
  width: 100%;
  height: 100%;
  background: #2d2d2d;
  overflow: hidden;
}

.split-container {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.split {
  height: 100%;
  float: left;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #1e1e1e;
}

.gutter {
  background-color: #2d2d2d;
  position: relative;
  transition: background-color 0.15s ease;
}

.gutter:hover {
  background-color: #444;
}

.gutter-horizontal {
  cursor: col-resize;
  position: relative;
}

.gutter-horizontal::after {
  content: '';
  position: absolute;
  top: 0;
  left: 3px;
  bottom: 0;
  width: 2px;
  background: #666;
  opacity: 0;
  transition: opacity 0.2s;
}

.gutter-horizontal:hover::after {
  opacity: 1;
}

.gutter.dragging {
  background-color: #444;
}

.gutter.dragging::after {
  opacity: 1;
}

.section-header {
  padding: 10px;
  background: #2d2d2d;
  border-bottom: 1px solid #444;
  user-select: none;
}

.section-header h3 {
  margin: 0;
  color: #d4d4d4;
  font-size: 14px;
  font-weight: normal;
}

.toolbar {
  padding: 10px;
  background: #2d2d2d;
  border-bottom: 1px solid #444;
}

.tool-group {
  display: flex;
  gap: 10px;
}

.tool-btn {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: #2E7D32;
  color: white;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.tool-btn:hover {
  background: #1B5E20;
}

.tool-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.btn-icon {
  margin-right: 5px;
  font-size: 14px;
}

.code-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.code-editor {
  width: 100%;
  height: 100%;
  padding: 10px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.5;
  background: #1e1e1e;
  color: #d4d4d4;
  border: none;
  resize: none;
  outline: none;
  tab-size: 4;
}

.output-content,
.demo-content {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.output-text {
  font-family: monospace;
  font-size: 13px;
  color: #d4d4d4;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}

.output-text.error {
  color: #ef5350;
}

.demo-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 13px;
  text-align: center;
  padding: 20px;
}

.demo-visualization {
  padding: 10px;
  color: #d4d4d4;
  font-family: monospace;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1e1e1e;
}

::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style> 