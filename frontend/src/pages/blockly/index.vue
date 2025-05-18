<template>
  <view class="blockly-container">
    <!-- 顶部导航栏 -->
    <view class="custom-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-left" @tap="goBack">
          <text class="iconfont icon-back">←</text>
        </view>
        <text class="nav-title">图形化编程</text>
        <view class="nav-right">
          <text class="nav-btn" @tap="saveProject">保存</text>
          <text class="nav-btn" @tap="clearWorkspace">清空</text>
          <text class="nav-btn run-btn" @tap="runCode">运行</text>
        </view>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <view class="main-content">
      <!-- 工具栏 -->
      <view class="toolbar">
        <view class="tool-group">
          <text class="tool-title">常用工具</text>
          <view class="tool-buttons">
            <view class="tool-btn" @tap="undo" :class="{ disabled: !canUndo }">
              <text class="tool-icon">↩</text>
              <text class="tool-label">撤销</text>
            </view>
            <view class="tool-btn" @tap="redo" :class="{ disabled: !canRedo }">
              <text class="tool-icon">↪</text>
              <text class="tool-label">重做</text>
            </view>
            <view class="tool-btn" @tap="zoomIn">
              <text class="tool-icon">+</text>
              <text class="tool-label">放大</text>
            </view>
            <view class="tool-btn" @tap="zoomOut">
              <text class="tool-icon">-</text>
              <text class="tool-label">缩小</text>
            </view>
            <view class="tool-btn" @tap="centerWorkspace">
              <text class="tool-icon">⊙</text>
              <text class="tool-label">居中</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 工作区和预览区 -->
      <view class="workspace-container">
        <view class="workspace-panel" :style="{ flex: workspaceRatio }">
          <div id="blocklyDiv" class="blockly-workspace"></div>
        </view>
        <view class="resize-handle" 
          @mousedown="startResize" 
          @touchstart.prevent="startResize">
          <view class="resize-handle-line"></view>
        </view>
        <view class="preview-panel" :style="{ flex: 1 - workspaceRatio }">
          <view class="preview-header">
            <text class="preview-title">预览</text>
          </view>
          <canvas type="2d" class="preview-canvas"></canvas>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import '@dcloudio/uni-components/style/text.css'
import * as Blockly from 'blockly'
import 'blockly/blocks'
import 'blockly/javascript'
import { javascriptGenerator } from 'blockly/javascript'
import * as zh from 'blockly/msg/zh-hans'

export default {
  data() {
    return {
      statusBarHeight: 20,
      workspace: null,
      canUndo: false,
      canRedo: false,
      workspaceRatio: 0.7,
      isResizing: false,
      startX: 0,
      startRatio: 0
    }
  },
  async mounted() {
    try {
      // 设置语言
      Blockly.setLocale(zh)
      
      // 等待 DOM 加载完成
      await this.$nextTick()
      
      // 初始化积木块定义
      this.initBlockDefinitions()
      
      // 初始化代码生成器
      this.initCodeGenerators()
      
      // 初始化工作区
      this.initBlockly()
      
      // 加载保存的项目
      this.loadSavedProject()
    } catch (error) {
      console.error('Blockly 初始化失败:', error)
    }
  },
  onLoad() {
    // 获取状态栏高度
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight
    
    // 设置导航栏
    uni.setNavigationBarTitle({
      title: ' '  // 设置为空格，完全清除标题
    })
  },
  onReady() {
    // 如果 mounted 中没有成功初始化，这里作为备选
    if (!this.workspace) {
      this.initBlockly();
    }
    
    // 加载保存的项目
    this.loadSavedProject();
  },
  methods: {
    initBlockly() {
      const toolbox = {
        kind: 'categoryToolbox',
        contents: [
          {
            kind: 'category',
            name: '绘图',
            colour: 160,
            contents: [
              {
                kind: 'block',
                type: 'draw_rectangle'
              },
              {
                kind: 'block',
                type: 'set_stroke_color'
              }
            ]
          },
          {
            kind: 'category',
            name: '逻辑',
            colour: 210,
            contents: [
              {
                kind: 'block',
                type: 'controls_if'
              },
              {
                kind: 'block',
                type: 'logic_compare'
              }
            ]
          },
          {
            kind: 'category',
            name: '循环',
            colour: 120,
            contents: [
              {
                kind: 'block',
                type: 'controls_repeat_ext'
              },
              {
                kind: 'block',
                type: 'controls_whileUntil'
              }
            ]
          },
          {
            kind: 'category',
            name: '数学',
            colour: 230,
            contents: [
              {
                kind: 'block',
                type: 'math_number'
              },
              {
                kind: 'block',
                type: 'math_arithmetic'
              }
            ]
          }
        ]
      }

      // 初始化 Blockly 工作区
      this.workspace = Blockly.inject('blocklyDiv', {
        toolbox: toolbox,
        media: '/static/media/',  // 修改媒体文件路径
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true
        },
        move: {
          scrollbars: true,
          drag: true,
          wheel: true
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
      this.workspace.addChangeListener(() => {
        this.updateUndoState()
        console.log('工作区已更改')
      })
    },

    initBlockDefinitions() {
      if (!Blockly.Blocks) {
        console.error('Blockly.Blocks 未定义')
        return
      }

      // 移动积木块
      Blockly.Blocks['draw_move_to'] = {
        init: function() {
          this.jsonInit({
            "type": "draw_move_to",
            "message0": "移动到 X %1 Y %2",
            "args0": [
              {
                "type": "input_value",
                "name": "X",
                "check": "Number"
              },
              {
                "type": "input_value",
                "name": "Y",
                "check": "Number"
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 160,
            "tooltip": "移动到指定坐标"
          })
        }
      }

      // 画线积木块
      Blockly.Blocks['draw_line_to'] = {
        init: function() {
          this.jsonInit({
            "type": "draw_line_to",
            "message0": "画线到 X %1 Y %2",
            "args0": [
              {
                "type": "input_value",
                "name": "X",
                "check": "Number"
              },
              {
                "type": "input_value",
                "name": "Y",
                "check": "Number"
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 160,
            "tooltip": "画线到指定坐标"
          })
        }
      }

      // 矩形积木块
      Blockly.Blocks['draw_rect'] = {
        init: function() {
          this.jsonInit({
            "type": "draw_rect",
            "message0": "绘制矩形 X %1 Y %2 宽度 %3 高度 %4",
            "args0": [
              {
                "type": "input_value",
                "name": "X",
                "check": "Number"
              },
              {
                "type": "input_value",
                "name": "Y",
                "check": "Number"
              },
              {
                "type": "input_value",
                "name": "WIDTH",
                "check": "Number"
              },
              {
                "type": "input_value",
                "name": "HEIGHT",
                "check": "Number"
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 160,
            "tooltip": "绘制矩形"
          })
        }
      };

      Blockly.Blocks['draw_rectangle'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("绘制矩形");
          this.appendValueInput("X")
              .setCheck("Number")
              .appendField("X坐标");
          this.appendValueInput("Y")
              .setCheck("Number")
              .appendField("Y坐标");
          this.appendValueInput("WIDTH")
              .setCheck("Number")
              .appendField("宽度");
          this.appendValueInput("HEIGHT")
              .setCheck("Number")
              .appendField("高度");
          this.setInputsInline(true);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(160);
        }
      };

      Blockly.Blocks['set_stroke_color'] = {
        init: function() {
          this.jsonInit({
            "type": "set_stroke_color",
            "message0": "设置线条颜色 %1",
            "args0": [
              {
                "type": "field_colour",
                "name": "COLOR",
                "colour": "#000000"
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 160,
            "tooltip": "设置绘图线条的颜色"
          });
        }
      };
    },

    initCodeGenerators() {
      // 移动到
      javascriptGenerator['draw_move_to'] = function(block) {
        const x = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC) || '0';
        const y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC) || '0';
        return `context.moveTo(${x}, ${y});\n`;
      };

      // 画线到
      javascriptGenerator['draw_line_to'] = function(block) {
        const x = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC) || '0';
        const y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC) || '0';
        return `context.lineTo(${x}, ${y});\ncontext.stroke();\n`;
      };

      // 绘制矩形
      javascriptGenerator['draw_rect'] = function(block) {
        const x = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC) || '0';
        const y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC) || '0';
        const width = javascriptGenerator.valueToCode(block, 'WIDTH', javascriptGenerator.ORDER_ATOMIC) || '0';
        const height = javascriptGenerator.valueToCode(block, 'HEIGHT', javascriptGenerator.ORDER_ATOMIC) || '0';
        return `context.rect(${x}, ${y}, ${width}, ${height});\ncontext.stroke();\n`;
      };

      // 绘制矩形（新版本）
      javascriptGenerator['draw_rectangle'] = function(block) {
        const x = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC) || '0';
        const y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC) || '0';
        const width = javascriptGenerator.valueToCode(block, 'WIDTH', javascriptGenerator.ORDER_ATOMIC) || '0';
        const height = javascriptGenerator.valueToCode(block, 'HEIGHT', javascriptGenerator.ORDER_ATOMIC) || '0';
        return `api.drawRect(${x}, ${y}, ${width}, ${height});\n`;
      };

      // 设置线条颜色
      javascriptGenerator['set_stroke_color'] = function(block) {
        const color = block.getFieldValue('COLOR');
        return `api.setStrokeColor('${color}');\n`;
      };
    },

    // 运行代码
    runCode() {
      try {
        const code = javascriptGenerator.workspaceToCode(this.workspace)
        if (code) {
          this.executeCode(code)
        }
      } catch (error) {
        console.error('代码生成错误:', error)
        uni.showToast({
          title: '代码生成错误',
          icon: 'none'
        })
      }
    },
    
    // 执行代码
    async executeCode(code) {
      try {
        console.log('Generated code:', code);
        
        const query = uni.createSelectorQuery().in(this);
        const canvas = await new Promise((resolve) => {
          query.select('.preview-canvas')
            .fields({ node: true, size: true })
            .exec((res) => {
              resolve(res[0]);
            });
        });
        
        if (!canvas) {
          throw new Error('Canvas not found');
        }
        
        const ctx = canvas.node.getContext('2d', { willReadFrequently: true });
        canvas.node.width = canvas.width;
        canvas.node.height = canvas.height;
        
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 定义绘图函数
        const drawingAPI = {
          drawRect: (x, y, width, height) => {
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.stroke();
          },
          setStrokeColor: (color) => {
            ctx.strokeStyle = color;
          },
          setFillColor: (color) => {
            ctx.fillStyle = color;
          },
          fillRect: (x, y, width, height) => {
            ctx.fillRect(x, y, width, height);
          }
        };
        
        // 执行生成的代码
        const executeFn = new Function('api', code);
        executeFn(drawingAPI);
        
        ctx.restore();
      } catch (error) {
        console.error('执行代码时出错:', error);
        uni.showToast({
          title: '执行失败：' + error.message,
          icon: 'none'
        });
      }
    },
    
    // 返回上一页
    goBack() {
      uni.reLaunch({
        url: '/pages/practice/index'
      });
    },
    
    // 保存项目
    saveProject() {
      try {
        const state = Blockly.serialization.workspaces.save(this.workspace);
        uni.setStorageSync('blockly_project', state);
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        });
      } catch (error) {
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    },
    
    // 加载保存的项目
    loadSavedProject() {
      try {
        const savedState = uni.getStorageSync('blockly_project');
        if (savedState) {
          Blockly.serialization.workspaces.load(savedState, this.workspace);
        }
      } catch (error) {
        console.error('加载项目失败:', error);
      }
    },
    
    // 工具栏功能
    undo() {
      if (this.workspace && this.workspace.undo) {
        this.workspace.undo(false);
        this.updateUndoState();
      }
    },
    
    redo() {
      if (this.workspace && this.workspace.undo) {
        this.workspace.undo(true);
        this.updateUndoState();
      }
    },
    
    zoomIn() {
      if (this.workspace) {
        this.workspace.zoomCenter(1);
      }
    },
    
    zoomOut() {
      if (this.workspace) {
        this.workspace.zoomCenter(-1);
      }
    },
    
    centerWorkspace() {
      if (this.workspace) {
        this.workspace.scrollCenter();
      }
    },
    
    clearWorkspace() {
      if (this.workspace) {
        this.workspace.clear();
        this.updateUndoState();
      }
    },
    
    updateUndoState() {
      if (this.workspace && this.workspace.undo) {
        this.canUndo = this.workspace.undoStack_.length > 0;
        this.canRedo = this.workspace.redoStack_.length > 0;
      }
    },
    
    // 开始调整大小
    startResize(e) {
      this.isResizing = true;
      this.startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
      this.startRatio = this.workspaceRatio;
      
      // 添加事件监听
      if (e.type === 'mousedown') {
        document.addEventListener('mousemove', this.handleResize);
        document.addEventListener('mouseup', this.stopResize);
      } else {
        document.addEventListener('touchmove', this.handleResize);
        document.addEventListener('touchend', this.stopResize);
      }
    },
    
    // 处理调整大小
    handleResize(e) {
      if (!this.isResizing) return;
      
      const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
      const containerWidth = document.querySelector('.workspace-container').offsetWidth;
      const deltaX = currentX - this.startX;
      const deltaRatio = deltaX / containerWidth;
      
      // 计算新的比例，并限制在合理范围内
      let newRatio = this.startRatio + deltaRatio;
      newRatio = Math.max(0.3, Math.min(0.8, newRatio)); // 限制比例在30%-80%之间
      
      this.workspaceRatio = newRatio;
      
      // 调整 Blockly 工作区大小
      if (this.workspace) {
        Blockly.svgResize(this.workspace);
      }
    },
    
    // 停止调整大小
    stopResize() {
      this.isResizing = false;
      
      // 移除事件监听
      document.removeEventListener('mousemove', this.handleResize);
      document.removeEventListener('mouseup', this.stopResize);
      document.removeEventListener('touchmove', this.handleResize);
      document.removeEventListener('touchend', this.stopResize);
    }
  },
  // 组件销毁时清理事件监听
  beforeDestroy() {
    this.stopResize();
  }
}
</script>

<style>
.blockly-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.custom-nav {
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.nav-content {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.nav-left {
  width: 40px;
  display: flex;
  align-items: center;
}

.icon-back {
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.2s;
}

.icon-back:active {
  transform: scale(0.9);
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.nav-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.nav-btn {
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.15);
  transition: all 0.2s;
  cursor: pointer;
}

.nav-btn:active {
  transform: scale(0.95);
}

.run-btn {
  background-color: #fff;
  color: #4CAF50;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.run-btn:active {
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.toolbar {
  background-color: #fff;
  padding: 12px 20px;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.tool-group {
  margin-bottom: 8px;
}

.tool-title {
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tool-buttons {
  display: flex;
  gap: 20px;
}

.tool-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.tool-btn:hover {
  background-color: #f5f5f5;
}

.tool-btn:active {
  transform: scale(0.95);
}

.tool-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tool-icon {
  font-size: 22px;
  color: #4CAF50;
  margin-bottom: 6px;
}

.tool-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.workspace-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
  min-height: 0;
  user-select: none;
  background-color: #fff;
  border-radius: 8px;
  margin: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.workspace-panel {
  position: relative;
  min-width: 200px;
  display: flex;
}

.blockly-workspace {
  flex: 1;
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
}

:deep(.blocklyMainBackground) {
  stroke: none !important;
}

:deep(.blocklyToolboxDiv) {
  background-color: #f8f9fa !important;
  border-right: 1px solid #e8e8e8;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
}

:deep(.blocklyTreeRow) {
  padding: 8px 12px !important;
  margin: 0 !important;
  height: auto !important;
  border-radius: 4px;
  transition: background-color 0.2s;
}

:deep(.blocklyTreeRow:hover) {
  background-color: #f0f0f0 !important;
}

:deep(.blocklyTreeLabel) {
  font-size: 14px !important;
  color: #333 !important;
  font-weight: 500 !important;
}

.resize-handle {
  width: 8px;
  background-color: transparent;
  cursor: col-resize;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 95;
}

.resize-handle-line {
  width: 2px;
  height: 100%;
  background-color: #e0e0e0;
  transition: all 0.2s;
  border-radius: 1px;
}

.resize-handle:hover .resize-handle-line {
  background-color: #4CAF50;
  width: 3px;
}

.resize-handle:active .resize-handle-line {
  background-color: #2E7D32;
  width: 4px;
}

.preview-panel {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  min-width: 200px;
  border-left: 1px solid #e8e8e8;
}

.preview-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #f8f9fa;
}

.preview-title {
  font-size: 15px;
  color: #333;
  font-weight: 600;
}

.preview-canvas {
  flex: 1;
  width: calc(100% - 24px);
  background-color: #fff;
  border: 1px solid #e8e8e8;
  margin: 12px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

:deep(.blocklyWidgetDiv) {
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
}

:deep(.blocklyDropDownDiv) {
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
}

:deep(.blocklyToolboxDiv) {
  z-index: 90;
}

.iconfont {
  font-size: 24px;
}

body.resizing {
  cursor: col-resize;
}

:deep(.blocklyZoom) {
  filter: none !important;
}

:deep(.blocklyZoom > image) {
  opacity: 0.8;
  transition: all 0.2s;
}

:deep(.blocklyZoom:hover > image) {
  opacity: 1;
}

:deep(.blocklyZoomReset) {
  fill: #666 !important;
}

:deep(.blocklyZoomInButton), :deep(.blocklyZoomOutButton) {
  fill: #4CAF50 !important;
}

:deep(.blocklyZoom > rect) {
  fill: white;
  stroke: #e8e8e8;
  stroke-width: 1px;
  rx: 6px;
  ry: 6px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

:deep(.blocklyZoom:hover > rect) {
  stroke: #4CAF50;
}

/* 添加积木块样式 */
:deep(.blocklyBlockBackground) {
  stroke: #e0e0e0 !important;
  stroke-width: 1px !important;
  rx: 4px !important;
  ry: 4px !important;
}

:deep(.blocklyBlockBackground[fill="#4CAF50"]) {
  fill: #4CAF50 !important;
}

:deep(.blocklyBlockBackground[fill="#5C81A6"]) {
  fill: #5C81A6 !important;
}

:deep(.blocklyBlockBackground[fill="#5CA65C"]) {
  fill: #5CA65C !important;
}

:deep(.blocklyBlockBackground[fill="#5C5CA6"]) {
  fill: #5C5CA6 !important;
}

/* 添加滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 