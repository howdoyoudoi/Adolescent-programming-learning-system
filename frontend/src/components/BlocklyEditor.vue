<template>
  <view class="blockly-editor">
    <view class="toolbar">
      <view class="tool-group">
        <button class="tool-btn" @tap="runCode">
          <text class="btn-icon">▶</text>
          <text class="btn-text">运行</text>
        </button>
        <button class="tool-btn" @tap="saveCode">
          <text class="btn-icon">💾</text>
          <text class="btn-text">保存</text>
        </button>
        <button class="tool-btn" @tap="resetWorkspace">
          <text class="btn-icon">🔄</text>
          <text class="btn-text">重置</text>
        </button>
      </view>
    </view>

    <view class="workspace-container">
      <view class="blockly-workspace" id="blocklyDiv"></view>
      <view class="output-panel" v-show="showOutput">
        <view class="output-header">
          <text class="output-title">运行结果</text>
          <text class="close-btn" @tap="closeOutput">×</text>
        </view>
        <scroll-view class="output-content" scroll-y="true">
          <text :class="['output-text', { error: hasError }]">{{ output }}</text>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import * as Blockly from 'blockly'
import 'blockly/python'
import { pythonApi } from '@/api'

export default {
  name: 'BlocklyEditor',
  data() {
    return {
      workspace: null,
      output: '',
      showOutput: false,
      hasError: false,
      toolbox: {
        kind: 'categoryToolbox',
        contents: [
          {
            kind: 'category',
            name: '逻辑',
            colour: '#5C81A6',
            contents: [
              {
                kind: 'block',
                type: 'controls_if'
              },
              {
                kind: 'block',
                type: 'logic_compare'
              },
              {
                kind: 'block',
                type: 'logic_operation'
              }
            ]
          },
          {
            kind: 'category',
            name: '循环',
            colour: '#5CA65C',
            contents: [
              {
                kind: 'block',
                type: 'controls_repeat_ext'
              },
              {
                kind: 'block',
                type: 'controls_whileUntil'
              },
              {
                kind: 'block',
                type: 'controls_for'
              }
            ]
          },
          {
            kind: 'category',
            name: '数学',
            colour: '#5C68A6',
            contents: [
              {
                kind: 'block',
                type: 'math_number'
              },
              {
                kind: 'block',
                type: 'math_arithmetic'
              },
              {
                kind: 'block',
                type: 'math_single'
              }
            ]
          },
          {
            kind: 'category',
            name: '文本',
            colour: '#A65C81',
            contents: [
              {
                kind: 'block',
                type: 'text'
              },
              {
                kind: 'block',
                type: 'text_print'
              },
              {
                kind: 'block',
                type: 'text_join'
              }
            ]
          }
        ]
      }
    }
  },
  mounted() {
    this.initBlockly()
  },
  methods: {
    initBlockly() {
      // 初始化 Blockly 工作区
      this.workspace = Blockly.inject('blocklyDiv', {
        toolbox: this.toolbox,
        media: '/static/media/',  // 修改媒体文件路径
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        },
        trashcan: true
      })

      // 添加工作区变化监听器
      this.workspace.addChangeListener(this.onWorkspaceChange)
      
      // 加载上次保存的代码
      const savedXml = uni.getStorageSync('blocklyWorkspace')
      if (savedXml) {
        this.loadWorkspace(savedXml)
      }
    },
    async runCode() {
      try {
        const code = Blockly.Python.workspaceToCode(this.workspace)
        console.log('生成的Python代码：', code)
        
        const response = await pythonApi.execute({ code })
        
        this.output = response.data.output || '程序执行完成'
        this.hasError = false
        this.showOutput = true
      } catch (error) {
        console.error('代码执行错误：', error)
        this.output = error.message || '程序执行出错'
        this.hasError = true
        this.showOutput = true
      }
    },
    saveCode() {
      try {
        const xml = Blockly.Xml.workspaceToDom(this.workspace)
        const xmlText = Blockly.Xml.domToText(xml)
        
        // 保存到本地存储
        uni.setStorageSync('blocklyWorkspace', xmlText)
        
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('保存失败：', error)
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    },
    loadWorkspace(xmlText) {
      try {
        const xml = Blockly.Xml.textToDom(xmlText)
        Blockly.Xml.domToWorkspace(xml, this.workspace)
      } catch (error) {
        console.error('加载工作区失败：', error)
      }
    },
    resetWorkspace() {
      uni.showModal({
        title: '确认重置',
        content: '确定要清空当前工作区吗？',
        success: (res) => {
          if (res.confirm) {
            this.workspace.clear()
            this.output = ''
            this.showOutput = false
          }
        }
      })
    },
    onWorkspaceChange(event) {
      // 可以在这里处理工作区变化事件
      console.log('工作区变化：', event)
    },
    closeOutput() {
      this.showOutput = false
    }
  },
  beforeUnmount() {
    // 清理 Blockly 工作区
    if (this.workspace) {
      this.workspace.dispose()
    }
  }
}
</script>

<style>
.blockly-editor {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.toolbar {
  padding: 20rpx;
  background: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.tool-group {
  display: flex;
  gap: 20rpx;
}

.tool-btn {
  display: flex;
  align-items: center;
  padding: 15rpx 30rpx;
  border: none;
  border-radius: 8rpx;
  background: #4CAF50;
  color: white;
  font-size: 28rpx;
  transition: all 0.3s;
}

.tool-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.btn-icon {
  margin-right: 10rpx;
  font-size: 32rpx;
}

.workspace-container {
  flex: 1;
  position: relative;
  display: flex;
}

.blockly-workspace {
  flex: 1;
  height: 100%;
}

.output-panel {
  position: absolute;
  right: 20rpx;
  bottom: 20rpx;
  width: 600rpx;
  max-height: 400rpx;
  background: white;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
  z-index: 100;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.output-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  font-size: 40rpx;
  color: #999;
  padding: 10rpx;
  cursor: pointer;
}

.output-content {
  padding: 20rpx;
  max-height: 300rpx;
}

.output-text {
  font-size: 26rpx;
  color: #333;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
}

.output-text.error {
  color: #f44336;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .blockly-editor {
    background: #1a1a1a;
  }
  
  .toolbar {
    background: #2d2d2d;
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.2);
  }
  
  .tool-btn {
    background: #2E7D32;
  }
  
  .output-panel {
    background: #2d2d2d;
    box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.2);
  }
  
  .output-header {
    border-bottom-color: #444;
  }
  
  .output-title {
    color: #fff;
  }
  
  .close-btn {
    color: #777;
  }
  
  .output-text {
    color: #fff;
  }
  
  .output-text.error {
    color: #ef5350;
  }
}
</style> 