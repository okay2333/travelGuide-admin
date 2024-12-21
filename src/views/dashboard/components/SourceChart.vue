<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chartInstance: any = null

const initChart = () => {
  chartInstance = echarts.init(chartRef.value)
  const option = {
    title: {
      text: '平台用户分布'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: ['预约景区数量', '门票景区数量', '平台用户数量', '管理员']
    },
    series: [
      {
        name: '用户数量',
        type: 'bar',
        data: [8560, 2350, 1420, 133],
        itemStyle: {
          color: function (params: any) {
            const colorList = ['#1890ff', '#ffd666', '#36cfc9', '#ff7a45']
            return colorList[params.dataIndex]
          }
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c}人'
        }
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
