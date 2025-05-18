<template>
  <div class="sensor-monitor">
    <div class="monitor-header">
      <h2>传感器监控面板</h2>
      <div class="refresh-control">
        <span>自动刷新: </span>
        <el-switch v-model="autoRefresh" />
      </div>
    </div>

    <div class="sensor-grid">
      <!-- 温度传感器卡片 -->
      <div class="sensor-card">
        <div class="sensor-icon">🌡️</div>
        <div class="sensor-info">
          <h3>温度</h3>
          <div class="sensor-value">{{ temperature }}°C</div>
          <div class="sensor-status" :class="getStatusClass(temperature, 'temperature')">
            {{ getStatusText(temperature, 'temperature') }}
          </div>
        </div>
      </div>

      <!-- 湿度传感器卡片 -->
      <div class="sensor-card">
        <div class="sensor-icon">💧</div>
        <div class="sensor-info">
          <h3>湿度</h3>
          <div class="sensor-value">{{ humidity }}%</div>
          <div class="sensor-status" :class="getStatusClass(humidity, 'humidity')">
            {{ getStatusText(humidity, 'humidity') }}
          </div>
        </div>
      </div>

      <!-- 距离传感器卡片 -->
      <div class="sensor-card">
        <div class="sensor-icon">📏</div>
        <div class="sensor-info">
          <h3>距离</h3>
          <div class="sensor-value">{{ distance }} cm</div>
          <div class="sensor-status" :class="getStatusClass(distance, 'distance')">
            {{ getStatusText(distance, 'distance') }}
          </div>
        </div>
      </div>
    </div>

    <!-- 图表展示区域 -->
    <div class="chart-container">
      <div class="chart-header">
        <h3>历史数据趋势</h3>
        <div class="chart-controls">
          <el-select v-model="selectedSensor" placeholder="选择传感器">
            <el-option label="温度" value="temperature" />
            <el-option label="湿度" value="humidity" />
            <el-option label="距离" value="distance" />
          </el-select>
          <el-select v-model="timeRange" placeholder="时间范围">
            <el-option label="最近1小时" value="1h" />
            <el-option label="最近24小时" value="24h" />
            <el-option label="最近7天" value="7d" />
          </el-select>
        </div>
      </div>
      <div class="chart" ref="chartRef"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// 状态变量
const temperature = ref(25)
const humidity = ref(60)
const distance = ref(100)
const autoRefresh = ref(true)
const selectedSensor = ref('temperature')
const timeRange = ref('1h')
const chartRef = ref(null)
let chart = null
let timer = null

// 阈值配置
const thresholds = {
  temperature: { min: 18, max: 28 },
  humidity: { min: 40, max: 70 },
  distance: { min: 20, max: 200 }
}

// 获取状态类名
const getStatusClass = (value, type) => {
  const { min, max } = thresholds[type]
  if (value < min) return 'status-low'
  if (value > max) return 'status-high'
  return 'status-normal'
}

// 获取状态文本
const getStatusText = (value, type) => {
  const { min, max } = thresholds[type]
  if (value < min) return '偏低'
  if (value > max) return '偏高'
  return '正常'
}

// 模拟数据更新
const updateData = () => {
  temperature.value = Math.round((20 + Math.random() * 10) * 10) / 10
  humidity.value = Math.round((50 + Math.random() * 20) * 10) / 10
  distance.value = Math.round(30 + Math.random() * 170)
  updateChart()
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  const option = {
    grid: {
      top: 40,
      right: 20,
      bottom: 40,
      left: 50
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [{
      name: '数值',
      type: 'line',
      smooth: true,
      data: []
    }]
  }
  
  chart.setOption(option)
}

// 更新图表数据
const updateChart = () => {
  if (!chart) return
  
  const now = new Date()
  const data = {
    temperature: temperature.value,
    humidity: humidity.value,
    distance: distance.value
  }
  
  chart.setOption({
    series: [{
      data: [...(chart.getOption().series[0].data || []), [now, data[selectedSensor.value]]]
    }]
  })
}

// 生命周期钩子
onMounted(() => {
  initChart()
  if (autoRefresh.value) {
    timer = setInterval(updateData, 5000)
  }
  window.addEventListener('resize', () => chart?.resize())
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  chart?.dispose()
  window.removeEventListener('resize', () => chart?.resize())
})
</script>

<style scoped>
.sensor-monitor {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.monitor-header h2 {
  margin: 0;
  color: #333;
}

.refresh-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sensor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.sensor-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s;
}

.sensor-card:hover {
  transform: translateY(-2px);
}

.sensor-icon {
  font-size: 2.5em;
  margin-right: 20px;
}

.sensor-info {
  flex: 1;
}

.sensor-info h3 {
  margin: 0 0 10px 0;
  color: #666;
}

.sensor-value {
  font-size: 1.8em;
  font-weight: bold;
  color: #333;
}

.sensor-status {
  margin-top: 5px;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  font-size: 0.9em;
}

.status-normal {
  background: #e1f5e1;
  color: #4caf50;
}

.status-high {
  background: #ffe1e1;
  color: #f44336;
}

.status-low {
  background: #e3f2fd;
  color: #2196f3;
}

.chart-container {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  margin: 0;
  color: #333;
}

.chart-controls {
  display: flex;
  gap: 10px;
}

.chart {
  height: 400px;
  width: 100%;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .sensor-monitor {
    background: #1a1a1a;
  }
  
  .monitor-header h2 {
    color: #fff;
  }
  
  .sensor-card {
    background: #2d2d2d;
  }
  
  .sensor-info h3 {
    color: #bbb;
  }
  
  .sensor-value {
    color: #fff;
  }
  
  .chart-container {
    background: #2d2d2d;
  }
  
  .chart-header h3 {
    color: #fff;
  }
}
</style> 