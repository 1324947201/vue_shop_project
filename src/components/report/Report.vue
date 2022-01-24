<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main" style="width: 1600px; height: 600px"></div>
    </el-card>
  </div>
</template>

<script>
//导入ECharts
import * as echarts from 'echarts'
import _ from 'lodash'

export default {
  data() {
    return {
      //需要合并的对象
      option: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  methods: {},
  async mounted() {
    //使用ECharts的init函数，获取DOM节点
    let myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200)
      return this.$message({
        showClose: true,
        message: res.meta.msg,
        type: 'error',
      })

    const result = _.merge(res.data, this.option)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  },
}
</script>

<style lang="less" scoped>
</style>