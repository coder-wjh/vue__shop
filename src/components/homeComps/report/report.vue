<template>
  <div class="all">
    <div class="Report">
      <!-- 面包屑导航区域 -->
      <el-breadcrumb  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区 -->
      <el-card>
        <!-- 2.为 Echarts 准备一个具备大小（宽高）的Dom -->
        <div id="main" style="width:750px;height:400px;"></div>

      </el-card>
    </div>
  </div>
</template>

<script>
// 1.导入 echarts
import echarts from 'echarts'
import { getReport } from 'network/report/report'
import _ from 'lodash'

export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created(){
  },
  // 此时页面上的元素已经被渲染完毕
  mounted(){
    this.getReportInfo()
  },
  methods:{
    getReportInfo(){
      // 3.基于准备好的Dom，初始化Echarts实例
      var myChart = echarts.init(document.getElementById('main')) 
      getReport().then(res => {
        console.log(res);
        if(res.meta.status !== 200){
          return this.$message.error('获取折线图数据失败！')
        }else{
          // 4.准备数据和配置项
          const result = _.merge(res.data,this.options)
          // 5.展示数据
          myChart.setOption(result);
          this.$message.success('获取折线图数据成功！')
        }     
      })
    }
  }
}
</script>

<style lang="less" scoped>
.all {
  width: 100%;
  background-color: #eaedf1;
  height: calc(100vh - 60px);
  overflow: scroll;
}

.Report {
  left: 20px;
  margin: 20px 20px;
}
</style>