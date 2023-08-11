<template>
  <div class="container">
      <select name="" id="" class="select" @change="changeSelectAll">
        <option :value="item" v-for="(item, index) in allOptions" :key="index">{{ item }}</option>
      </select>
      <!-- <head>龙华山咀头3张中八</head> -->
      <div class="con-item">
        <div id="echartAllMoney" style="width: 100%; height:400px"></div>
          总计收入：<b>{{ allCount }}</b> RMB; &nbsp; 总计时长：<b>{{ allTime }}</b> 分钟 <br>
          x轴为爬取单日<br>
          y轴为单店当日入<br>
      </div>

      切换日期查看
      <select name="" id="" class="select" @change="changeSelect">
        <option :value="item.value" v-for="(item, index) in options" :key="index">{{ item.value }}</option>
      </select>
      <div class="con-item">
        <div id="echartStoreMoney" style="width: 100%; height:400px"></div>
          x轴为爬时间点<br>
          y轴为当前店所有设备总和<br>
      </div>
      <div class="con-item">
        <div id="echartsDeviceMoney" style="width: 100%; height:400px"></div>
          x轴为爬时间点<br>
          y轴为单个设备的和 <br>
          每条柱状图代表一台设备
      </div>
      <div class="con-item">
        <div id="echartTime" style="width: 100%; height:400px"></div>
          x轴为爬时间点<br>
          y轴为当前已经在线使用时间 <br>
          每条柱状图代表一台设备
      </div>
  </div>
</template>
<script>
import * as echarts from 'echarts';
import { onMounted, reactive, toRefs, ref } from 'vue'
import data1 from '../new-data/f105f21d-2d80-4695-a9e2-490a5e3b069f.json'
import data from '../utils/tool.ts'
import { dataToMap, dealEverydayData, dealXData, dealTimeSeriesData, dealMoneySeriesData, dealDeviceEverydayData } from '../utils/common'
export default {
  name: 'Echarts1',
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  setup() {
    const state = reactive({
      allOptions: data,
      options: [],
      xData: [],
      legendData: [],
      allCount: 0,
      allTime: 0,
      selectedData: data1,
    })

    const moneyChart = ref(null)
    const timeChart = ref(null)
    const deviceEverydayChart = ref(null)
    const dayMoneyEchart = ref(null)

    const dealOptions = (title, yName, seriesData) => ({
      title: {
        text: title,
        subtext: ''
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data:  ['A01', 'A02', 'A03']
      },
      // calculable: true,
      dataZoom: [
        {
          type: 'inside'
        },
        {
          type: 'slider'
        }
      ],
      xAxis: [
        {
          type: 'category',
          name: '爬取时间',
          axisLabel: { interval: 0, rotate: 45 },
          // prettier-ignore
          data: state.xData,
          // data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: yName
        }
      ],
      series: seriesData,
      // series:[
      //   {
      //     name: 'A01',
      //     type: 'bar',
      //     data: [
      //       2, 49, 70, 232, 256, 767, 1356, 162, 326, 200, 64, 33
      //     ],
      //     markPoint: {
      //       data: [
      //         { type: 'max', name: 'Max' },
      //         { type: 'min', name: 'Min' }
      //       ]
      //     }
      //   },
      //   {
      //     name: 'A02',
      //     type: 'bar',
      //     data: [
      //       2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
      //     ],
      //     markPoint: {
      //       data: [
      //         { type: 'max', name: 'Max' },
      //         { type: 'min', name: 'Min' }
      //       ]
      //     }
      //   },
      //   {
      //     name: 'A03',
      //     type: 'bar',
      //     data: [
      //       2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
      //     ],
      //     markPoint: {
      //       data: [
      //         { type: 'max', name: 'Max' },
      //         { type: 'min', name: 'Min' }
      //       ]
      //     }
      //   }
      // ]
    });

    const dealOptions3 = (title, yName, xData, seriesData) => ({
      title: {
        text: title,
        subtext: ''
      },
      tooltip: {
        trigger: 'axis'
      },
      // calculable: true,
      dataZoom: [
        {
          type: 'inside'
        },
        {
          type: 'slider'
        }
      ],
      xAxis: [
        {
          type: 'category',
          name: '爬取时间',
          axisLabel: { interval: 0, rotate: 45 },
          // prettier-ignore
          data: xData,
          // data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: yName
        }
      ],
      series: seriesData
    });

    const dealOptions2 = (title, yName, xData, seriesData) => ({
      title: {
        text: title,
        subtext: ''
      },
      tooltip: {
        trigger: 'axis'
      },
      // calculable: true,
      dataZoom: [
        {
          type: 'inside'
        },
        {
          type: 'slider'
        }
      ],
      xAxis: [
        {
          type: 'category',
          name: '设备',
          axisLabel: { interval: 0, rotate: 45 },
          // prettier-ignore
          data: xData,
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: yName
        }
      ],
      series: seriesData
    });

    // 绘制消費金额走勢图表
    const initMoneyEcharts = (mapData) => {
      const seriesData = dealMoneySeriesData(mapData)
      // 基于准备好的dom，初始化echarts实例
      const option =  dealOptions('单日每时间段多个设备趋势图', '(RMB)', seriesData)
      moneyChart.value.setOption(option);
    }

    // 绘制消費時間走勢图表
    const initTimeEcharts = (mapData) => {
      const seriesData = dealTimeSeriesData(mapData)
      // 基于准备好的dom，初始化echarts实例
      const option = dealOptions('单日每时间段使用时间趋势图', '使用时间(minutes)', seriesData)
      timeChart.value.setOption(option);
    }

    // TODO 以设备为单位的店里的每日消费图
    const initDeviceEverydayData = (mapData) => {
      const data = dealDeviceEverydayData(mapData)
      const xData = data.xData
      const seriesData = data.seriesData
      // 基于准备好的dom，初始化echarts实例
      const option = dealOptions2('单日各个设备使用图', '(RMB)', xData, seriesData)
      deviceEverydayChart.value.setOption(option);
    }

    const initOptions = () => {
      const options = dataToMap(state.selectedData)
      state.options = []
      options.forEach((val, key) => {
        state.options.push({
          value: key,
          data: val
        })
      })
      const mapData = options.get(state.options[0].value)
      console.log('mapData: ', mapData);
      state.xData = dealXData(mapData)
      initDeviceEverydayData(mapData)
      initMoneyEcharts(mapData)
      initTimeEcharts(mapData)
    }
    
    const changeSelectAll = (e) => {
      import(e.target.value).then(data =>{
        state.selectedData = data.default
        initDayMoneyEcharts()
        initOptions()
      })
    }

    const changeSelect = (e) => {
      const options = dataToMap(state.selectedData)
      const mapData = options.get(e.target.value)
      state.xData = dealXData(mapData)
      initDeviceEverydayData(mapData)
      initMoneyEcharts(mapData)
      initTimeEcharts(mapData)
    }

    const initDayMoneyEcharts = () => {
      const data = dealEverydayData(state.selectedData)
      const xData = data.xData
      const allData = data.seriesData
      state.allCount = data.allCount
      state.allTime = data.allTime
      const option =  dealOptions3('爬取至今每日的消费趋势图', '消费金额(元)', xData, allData)
      dayMoneyEchart.value.setOption(option);
    }

    onMounted(() => {
      moneyChart.value = echarts.init(document.getElementById('echartsDeviceMoney'));
      timeChart.value = echarts.init(document.getElementById('echartTime'));
      deviceEverydayChart.value = echarts.init(document.getElementById('echartStoreMoney'));
      dayMoneyEchart.value = echarts.init(document.getElementById('echartAllMoney'));
      initDayMoneyEcharts()
      initOptions()
      
    })

    return {
      ...toRefs(state),
      changeSelect,
      changeSelectAll
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  // height: 500px;
  display: flex;
  flex-direction: column;

  .con-item {
    width: 100%;
    margin: 20px auto;
  }
  
  .header {
    font-weight: bold;
    margin-bottom: 1rem;
    .link {
      float: right;
      text-decoration: none;
      font-size: 0.9rem;
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
  .content {
    flex-grow: 1;
  }
}

.select {
  border: 1px solid #d9d9d9;
  background-color: #eee;
}
</style>