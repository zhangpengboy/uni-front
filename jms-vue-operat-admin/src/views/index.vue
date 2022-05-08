<template>
  <div class="dashboard-editor-container">
    <panel-group
      @handleSetLineChartData="handleSetLineChartData"
      :numObj="numObj"
    />

    <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from "./dashboard/PanelGroup";
import LineChart from "./dashboard/LineChart";
import RaddarChart from "./dashboard/RaddarChart";
import PieChart from "./dashboard/PieChart";
import BarChart from "./dashboard/BarChart";
import { getBackstageDataExhibition } from "@/api/user";

const lineChartData = {
  sumUser: {
    // expectedData: [0, 0, 0, 0, 0, 0, 11],
    // actualData: [120, 82, 91, 154, 162, 140, 145],
  },
  newVisitis: {
    // expectedData: [0, 0, 0, 0, 0, 0, 11],
    // actualData: [120, 82, 91, 154, 162, 140, 145],
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130],
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130],
  },
};

export default {
  name: "Index",
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      numObj: [],
    };
  },
  created() {
    this.getBackstageDataExhibition();
  },
  methods: {
    handleSetLineChartData(type) {
      console.log("type", type);
      this.lineChartData = lineChartData[type];
    },
    getBackstageDataExhibition() {
      getBackstageDataExhibition().then((res) => {
        if (res.code == 200) {
          this.numObj.push(
            +res.data.sumUser[res.data.sumUser.length - 1].number
          );
          this.numObj.push(
            +res.data.sumNewUser[res.data.sumNewUser.length - 1].number
          );
          this.numObj.push(+res.data.sumPv[res.data.sumPv.length - 1].number);
          this.numObj.push(
            res.data.sumOrderAmount[res.data.sumOrderAmount.length - 1].number
          );
          this.numObj.push(
            +res.data.sumOrder[res.data.sumOrder.length - 1].number
          );
          lineChartData.sumUser = this.getMap(res.data.sumUser);
          lineChartData.newVisitis = this.getMap(res.data.sumNewUser);
          lineChartData.messages = this.getMap(res.data.sumPv);
          lineChartData.purchases = this.getMap(res.data.sumOrderAmount);
          lineChartData.shoppings = this.getMap(res.data.sumOrder);
          this.lineChartData = lineChartData.sumUser;
        }
      });
    },
    getMap(arr) {
      let obj = {};
      let actualDataarr = [];
      let timearr = [];
      arr.map((item) => {
        actualDataarr.push(+item.number);
        timearr.push(this.parseTime(item.datetime).split(" ")[0]);
      });
      obj.actualData = actualDataarr;
      obj.timearr = timearr;
      return obj;
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
