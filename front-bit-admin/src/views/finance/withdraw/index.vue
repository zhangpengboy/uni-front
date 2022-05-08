<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-11 15:39:22
 * @Description : 提现管理
-->
<template>
  <div class="app-container">
    <el-form
      class="mb-8"
      :model="queryParams"
      ref="queryForm"
      label-width="60px"
      inline
      size="mini"
    >
      <el-form-item label="类型:">
        <el-select
          v-model="queryParams.bitType"
          clearable
          filterable
          @change="handleQuery"
        >
          <el-option
            v-for="(item, index) in Dict.BIT_TYPE"
            :key="index"
            :label="item.value"
            :value="item.key"
            v-show="index > 0"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select
          v-model="queryParams.status"
          clearable
          filterable
          @change="handleQuery"
        >
          <el-option
            v-for="(item, index) in Dict.WITHDRAW_STATUS"
            :key="index"
            :label="item.value"
            :value="item.key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入关键字进行查询"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>

      <right-toolbar
        @queryTable="getList"
        :showSearchBar="false"
        showRefreshBar
      ></right-toolbar>
    </el-form>

    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
      border
      :height="tableHeight"
    >
      <!-- <el-table-column type="selection" width="50" align="center" /> -->
      <el-table-column label="序号" type="index" width="60" align="center" />
      <el-table-column label="订单号" header-align="center">
        <template slot-scope="{ row }">
          <div class="fs-12">{{ row.orderNo }}</div>
        </template>
      </el-table-column>
      <el-table-column label="收款人信息" header-align="center">
        <template slot-scope="{ row }">
          <div class="fs-12">收 款 人: {{ row.cardName }}</div>
          <div class="fs-12">收款卡号: {{ row.cardNo }}</div>
        </template>
      </el-table-column>
      <el-table-column label="银行信息" header-align="center">
        <template slot-scope="{ row }">
          <div class="fs-12">开户行: {{ row.bankName }}</div>
          <div class="fs-12">地 址: {{ row.bankAddress }}</div>
        </template>
      </el-table-column>
      <el-table-column label="提现数量" header-align="center">
        <template slot-scope="{ row }">
          <div class="fs-12">
            {{ filterKeyToValue(row.bitType, "BIT_TYPE") }}: {{ row.money }}
          </div>
          <div class="fs-12">CNY: {{ row.moneyCny }}</div>
        </template>
      </el-table-column>
      <el-table-column label="提现类型" header-align="center">
        <template slot-scope="{ row }">
          <div class="fs-12">
            {{ filterKeyToValue(row.drawType, "DRAW_TYPE_ENUM") }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="手续费" header-align="center">
        <template slot-scope="{ row }">
          <div class="fs-12">
            {{ filterKeyToValue(row.bitType, "BIT_TYPE") }}: {{ row.feiMoney }}
          </div>
          <div class="fs-12">CNY: {{ row.feiMoneyCny }}</div>
        </template>
      </el-table-column>
      <el-table-column label="币价" header-align="center">
        <template slot-scope="{ row }">
          <div class="fs-12">USDT: {{ row.usdt }}</div>
          <div class="fs-12">CNY: {{ row.cnyTrans }}</div>
        </template>
      </el-table-column>
      <el-table-column label="实际到账" header-align="center">
        <template slot-scope="{ row }">
          <div class="fs-12">
            {{ filterKeyToValue(row.bitType, "BIT_TYPE") }}: {{ row.actMoney }}
          </div>
          <div class="fs-12">CNY: {{ row.actMoneyCny }}</div>
        </template>
      </el-table-column>
      <el-table-column label="币种/状态" align="center" width="80">
        <template slot-scope="{ row }">
          <div class="fs-12">
            <el-link :type="Dict.BIT_TYPE[row.bitType].type" :underline="false">
              {{ filterKeyToValue(row.bitType, "BIT_TYPE") }}
            </el-link>
          </div>
          <div class="fs-12">
            <el-tag :type="Dict.WITHDRAW_STATUS[row.status].type" size="small">
              {{ Dict.WITHDRAW_STATUS[row.status].value }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding"
        width="180"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleAgree(scope.row)"
            v-hasPermi="['']"
            :disabled="scope.row.status !== 0"
            >同意提现</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-close"
            @click="handleReject(scope.row)"
            :disabled="scope.row.status !== 0"
            v-hasPermi="['']"
            >拒绝提现</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 打款凭证上传 -->
    <el-dialog title="上传打款凭证" :visible.sync="open">
      <el-form :model="form">
        <el-form-item>
          <el-upload
            class="card-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="uploadImg"
          >
            <img v-if="form.img" :src="form.img" class="image" />
            <i v-else class="el-icon-plus card-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过1M
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRrawOrderList, checkInRraw } from "@/api/finance";
import { uploadImg } from "@/api/upload";

export default {
  name: "FinanceRecharge",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 弹窗标题
      title: "",
      // 表单
      form: {},
      // 是否显示弹出层
      open: false,
      // 是否是修改弹出层
      isEdit: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      getRrawOrderList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams = _.cloneDeep(this.Dict.QUERY_PARAMS);
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 同意打款按钮操作 */
    handleAgree(row) {
      this.$confirm(
        '请确认,是否已转账到"' + row.cardNo + '"卡号上?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return checkInRraw({ orderNo: row.orderNo, status: 1 });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("已打款成功到用户账上");
        })
        .catch(function () {});
    },
    /** 拒绝打款按钮操作 */
    handleReject(row) {
      this.$confirm(
        '请确认,是否未转账到"' + row.cardNo + '"卡号上?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return checkInRraw({ orderNo: row.orderNo, status: 4 });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("打款已拒绝");
        })
        .catch(function () {});
    },
    /** 图片上传之前判断 */
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error("上传图片只能是JPG、PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过1MB!");
      }
      return isJPG && isLt2M;
    },
    /** 自定义上传图片 */
    uploadImg(e) {
      uploadImg(e.file).then((res) => {
        if (res.code == 200) {
          this.$set(this.form, "img", res.data);
        } else {
          this.$msgError("上传图片失败,请重新上传!");
        }
      });
    },
  },
};
</script>