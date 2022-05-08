<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-05-11 17:45:03
 * @Description  : 营销中心 - 商务合作
-->
<template>
  <div class="app-container">
    <el-table
      v-loading="loading"
      :data="list"
      border
      :key="key"
      :height="tableHeight + 46"
      size="mini"
    >
      <el-table-column type="selection" width="50" align="center" fixed="left"/>
      <el-table-column label="序号" type="index" width="60" align="center" />
      <template v-for="(v, index) in columns">
        <el-table-column
          :label="v.label"
          :width="v.width"
          :prop="v.prop"
          :align="v.align"
          :key="index"
          v-if="v.show"
          header-align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag v-if="v.prop === 'type'" size="mini" :type="scope.row.type == 1 ? 'success' : 'warning'">{{
              scope.row.type == 1 ? "代理商" : "品牌商"
            }}</el-tag>
            <span v-else-if="v.prop === 'createTime'">{{
              parseTime(scope.row[v.prop])
            }}</span>
            <el-tag v-else-if="v.prop === 'status'" size="mini" :type="Dict.READ_STATUS[scope.row[v.prop]].type">{{Dict.READ_STATUS[scope.row[v.prop]].value}}</el-tag>
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="180"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 0"
            icon="el-icon-edit"
            type="text"
            @click="updateStatus(scope.row)"
            >标记已查阅</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getBusinessCooperationList"
    />
  </div>
</template>

<script>
import { getBusinessCooperationList, updateStatus } from "@/api/stores";

// 默认表格展示列
const defaultColumns = [
  {
    label: "姓名",
    show: true,
    prop: "name",
    align: "center",
  },
  {
    label: "手机号码",
    show: true,
    prop: "phone",
    align: "center",
  },
  {
    label: "合作意向",
    show: true,
    prop: "type",
    align: "center",
  },

  {
    label: "留言",
    show: true,
    prop: "message",
    align: "center",
  },
  {
    label: "留言时间",
    show: true,
    prop: "createTime",
    align: "center",
    width: 180,
  },
  {
    label: "状态",
    show: true,
    prop: "status",
    align: "center",
  },
];

export default {
  name: "MarketBusinessCooperation",
  data() {
    return {
      loading: true,
      key: 1,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      columns: _.cloneDeep(defaultColumns),
      queryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
    };
  },
  mounted() {
    this.getBusinessCooperationList();
  },
  methods: {
    getBusinessCooperationList() {
      getBusinessCooperationList(this.queryParams).then((res) => {
        if (res.code == 200) {
          this.loading = false;
          this.list = res.data.list;
          this.total = +res.data.total;
        }
      });
    },
    // 更改状态
    updateStatus(row) {
      console.log(row);
      let ids = [];
      let status = row.status;
      if (status == 1) {
        status = 0;
      } else {
        status = 1;
      }
      ids.push(row.id);
      updateStatus({ ids: ids, status: status }).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "更新成功",
            type: "success",
          });
          this.getBusinessCooperationList();
        }
      });
    },
  },
};
</script>