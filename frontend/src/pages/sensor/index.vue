<template>
  <view class="sensor-page">
    <view class="page-header">
      <text class="header-title">传感器监控</text>
    </view>
    
    <view class="sensor-grid">
      <!-- 温度传感器卡片 -->
      <view class="sensor-card">
        <view class="sensor-icon">🌡️</view>
        <view class="sensor-info">
          <text class="sensor-title">温度</text>
          <text class="sensor-value">{{temperature}}°C</text>
          <text class="sensor-status" :class="getStatusClass(temperature, 'temperature')">
            {{getStatusText(temperature, 'temperature')}}
          </text>
        </view>
      </view>

      <!-- 湿度传感器卡片 -->
      <view class="sensor-card">
        <view class="sensor-icon">💧</view>
        <view class="sensor-info">
          <text class="sensor-title">湿度</text>
          <text class="sensor-value">{{humidity}}%</text>
          <text class="sensor-status" :class="getStatusClass(humidity, 'humidity')">
            {{getStatusText(humidity, 'humidity')}}
          </text>
        </view>
      </view>

      <!-- 光照传感器卡片 -->
      <view class="sensor-card">
        <view class="sensor-icon">☀️</view>
        <view class="sensor-info">
          <text class="sensor-title">光照</text>
          <text class="sensor-value">{{light}} lux</text>
          <text class="sensor-status" :class="getStatusClass(light, 'light')">
            {{getStatusText(light, 'light')}}
          </text>
        </view>
      </view>
    </view>

    <!-- 图表区域 -->
    <view class="chart-section">
      <view class="chart-header">
        <text class="chart-title">历史数据趋势</text>
        <view class="chart-controls">
          <picker :value="sensorIndex" :range="sensorTypes" @change="onSensorChange">
            <view class="picker">
              当前选择：{{sensorTypes[sensorIndex]}}
            </view>
          </picker>
          <picker :value="timeRangeIndex" :range="timeRanges" @change="onTimeRangeChange">
            <view class="picker">
              {{timeRanges[timeRangeIndex]}}
            </view>
          </picker>
        </view>
      </view>
      <view class="chart-container">
        <qiun-data-charts 
          type="line"
          :opts="chartOpts"
          :chartData="chartData"
        />
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue'

export default {
  data() {
    return {
      temperature: 25,
      humidity: 60,
      light: 500,
      sensorTypes: ['温度', '湿度', '光照'],
      sensorIndex: 0,
      timeRanges: ['最近1小时', '最近24小时', '最近7天'],
      timeRangeIndex: 0,
      chartData: {
        categories: [],
        series: [{
          name: '温度',
          data: []
        }]
      },
      chartOpts: {
        color: ['#4CAF50'],
        padding: [15, 15, 15, 15],
        enableScroll: true,
        legend: {
          show: false
        },
        xAxis: {
          scrollShow: true,
          itemCount: 20
        },
        yAxis: {
          gridType: 'dash',
          dashLength: 2,
          data: {
            min: 0,
            max: 100
          }
        },
        extra: {
          line: {
            type: 'curve',
            width: 2
          }
        }
      },
      timer: null
    }
  },
  computed: {
    thresholds() {
      return {
        temperature: { min: 18, max: 28 },
        humidity: { min: 40, max: 70 },
        light: { min: 300, max: 800 }
      }
    }
  },
  methods: {
    getStatusClass(value, type) {
      const { min, max } = this.thresholds[type]
      if (value < min) return 'status-low'
      if (value > max) return 'status-high'
      return 'status-normal'
    },
    getStatusText(value, type) {
      const { min, max } = this.thresholds[type]
      if (value < min) return '偏低'
      if (value > max) return '偏高'
      return '正常'
    },
    updateData() {
      // 模拟数据更新
      this.temperature = Math.round((20 + Math.random() * 10) * 10) / 10
      this.humidity = Math.round((50 + Math.random() * 20) * 10) / 10
      this.light = Math.round(400 + Math.random() * 400)
      this.updateChart()
    },
    updateChart() {
      const now = new Date()
      const timeStr = `${now.getHours()}:${now.getMinutes()}`
      
      // 更新图表数据
      const newCategories = [...this.chartData.categories, timeStr]
      const newData = [...this.chartData.series[0].data]
      
      if (newCategories.length > 20) {
        newCategories.shift()
        newData.shift()
      }
      
      const sensorValues = {
        0: this.temperature,
        1: this.humidity,
        2: this.light
      }
      
      newData.push(sensorValues[this.sensorIndex])
      
      this.chartData = {
        categories: newCategories,
        series: [{
          name: this.sensorTypes[this.sensorIndex],
          data: newData
        }]
      }
    },
    onSensorChange(e) {
      this.sensorIndex = e.detail.value
      // 清空图表数据重新开始
      this.chartData.categories = []
      this.chartData.series[0].data = []
      this.chartData.series[0].name = this.sensorTypes[this.sensorIndex]
    },
    onTimeRangeChange(e) {
      this.timeRangeIndex = e.detail.value
      // 这里可以根据时间范围调整数据
    }
  },
  onLoad() {
    // 启动定时更新
    this.timer = setInterval(() => {
      this.updateData()
    }, 5000)
  },
  onUnload() {
    // 清理定时器
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>

<style>
.sensor-page {
  padding: 30rpx;
  background-color: #f5f5f5;
}

.page-header {
  margin-bottom: 30rpx;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.sensor-grid {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.sensor-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.sensor-icon {
  font-size: 48rpx;
  margin-right: 30rpx;
}

.sensor-info {
  flex: 1;
}

.sensor-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
  display: block;
}

.sensor-value {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.sensor-status {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  display: inline-block;
}

.status-normal {
  background: #e8f5e9;
  color: #4caf50;
}

.status-high {
  background: #ffebee;
  color: #f44336;
}

.status-low {
  background: #e3f2fd;
  color: #2196f3;
}

.chart-section {
  margin-top: 30rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.chart-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.chart-controls {
  display: flex;
  gap: 20rpx;
}

.picker {
  background: #f5f5f5;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #666;
}

.chart-container {
  height: 400rpx;
  width: 100%;
}
</style> 