<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chartInstance: any = null

const initChart = () => {
  chartInstance = echarts.init(chartRef.value)
  const option = {
    title: {
      text: '近7天访问趋势'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['预约人数', '购票人数', '实际到访']
    },
    xAxis: {
      type: 'category',
      data: ['4-22', '4-23', '4-24', '4-25', '4-26', '4-27', '4-28']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '预约人数',
        type: 'line',
        smooth: true,
        data: [150, 230, 224, 218, 135, 147, 260]
      },
      {
        name: '购票人数',
        type: 'line',
        smooth: true,
        data: [140, 210, 190, 200, 120, 130, 220]
      },
      {
        name: '实际到访',
        type: 'line',
        smooth: true,
        data: [120, 200, 180, 180, 120, 132, 230]
      }
    ]
  }
  chartInstance.setOption(option)
}

const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 300px"></div>
</template>
