<template>
  <el-dialog
    :title="title"
    :visible="openList"
    :width="width"
    append-to-body
    v-el-dialog-drag
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
  >
    <el-table
      v-loading="loading"
      :data="lookList"
      border
      :key="key"
      :height="tableHeight - 35"
    >
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
            <span v-if="v.prop === 'createTime'">{{
              parseTime(scope.row[v.prop])
            }}</span>
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <pagination
      :total="lookTotal"
      :page.sync="listParams.pageNum"
      :limit.sync="listParams.pageSize"
      @pagination="getList"
    />
  </el-dialog>
</template>
<script>
import { addActCommonPack, updateActCommonPack } from "@/api/goods";

// 默认表格展示列
const defaultColumns = [
  {
    label: "手机号",
    show: true,
    prop: "phone",
    align: "left",
    width: 120,
  },
  {
    label: "结算金额",
    show: true,
    prop: "amount",
    align: "center",
    width: 100,
  },
  {
    label: "描述",
    show: true,
    prop: "des",
    align: "center",
  },
  {
    label: "创建时间",
    show: true,
    prop: "createTime",
    align: "center",
    width: 180,
  },
];
export default {
  name: "MarketModuleDialog",
  props: {
    // 是否打开
    openList: {
      type: Boolean,
      default: false,
    },
    // 绑定的表单对象
    lookList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 是否是修改
    isEdit: {
      type: Boolean,
      default: false,
    },
    lookTotal: {
      type: Number,
      default: 0,
    },
    // 弹窗宽度
    width: {
      type: String,
      default: "800px",
    },
  },
  data() {
    return {
      loading: false,
      // 弹窗标题
      title: "",
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      listParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      // 表单参数
      // form: {},
      // 表格key
      key: 1,
      // 自定义表格列表
      columns: _.cloneDeep(defaultColumns),
      // 表单校验
      rules: {
        phone: [{ required: true, message: "手机号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "请选择用户等级", trigger: "blur" }],
        userLevel: [
          { required: true, message: "理由不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.title = "结算记录";
  },
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["MarketModuleForm"].validate((valid) => {
        if (valid) {
          const _params = _.assign({}, this.form);
          if (_params.id != undefined) {
            updateActCommonPack(_params).then((response) => {
              this.msgSuccess("修改成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          } else {
            addActCommonPack(_params).then((response) => {
              this.msgSuccess("新增成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          }
        }
      });
    },
    getList(v) {
      console.log(v);
      this.$emit("getSettlementDes", v);
    },
    // 取消按钮
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>