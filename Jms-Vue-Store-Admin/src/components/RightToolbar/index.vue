<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-25 12:15:05
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-04-14 14:57:52
 * @FilePath    : \src\components\RightToolbar\index.vue
 * @Description : 表格 - 右上角 - 自定义工具栏
-->
<template>
  <div class="top-right-btn">
    <el-row>
      <el-tooltip
        class="item"
        effect="dark"
        :content="showSearch ? '隐藏高级搜索' : '显示高级搜索'"
        placement="top"
        v-if="showSearchBar"
      >
        <el-button size="mini" circle icon="el-icon-search" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top" v-if="showRefreshBar">
        <el-button size="mini" circle icon="el-icon-refresh" @click="refresh()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="自定义列表" placement="top" v-if="showCustom">
        <el-button size="mini" circle icon="el-icon-s-operation" @click="handleShowCustomDisplay" />
      </el-tooltip>
      <!-- 自定义列表 CheckBox -->
      <!-- <div class="custom-dialog" v-if="showCustomDisplay">
        <div class="custom-dialog-list">
          <div class="item title">当前展示的信息</div>
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkedAll"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <div style="margin: 10px 0;"></div>
          <el-checkbox-group v-model="checkedCustoms" @change="handleCheckedCustomChange" :min="5">
            <el-checkbox
              v-for="(item, index) in list"
              :label="item.prop"
              :key="index"
            >{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="model" @click="showCustomDisplay = false"></div>
      </div>-->
      <!-- 自定义列表 table -->
      <el-dialog
        title="列表设置"
        :visible="showCustomDisplay"
        width="700px"
        append-to-body
        v-el-dialog-drag
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="showCustomDisplay = false"
        class="goods-dialog"
      >
        <el-table
          :data="list"
          border
          size="mini"
          height="450"
          row-key="prop"
          id="customTable"
          style="cursor: move;"
        >
          <el-table-column width="50" type="index" label="序号" align="center" />
          <el-table-column prop="show" label="显示" width="50" align="center">
            <template slot-scope="{row}">
              <el-checkbox v-model="row.show" />
            </template>
          </el-table-column>
          <el-table-column prop="label" label="默认文本" width="100"></el-table-column>
          <el-table-column prop="cstLabel" label="自定义文本">
            <template slot-scope="{row}">
              <el-input v-model="row.cstLabel"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="width" label="自定义宽度">
            <template slot-scope="{row}">
              <el-input v-model="row.width"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="info"
            icon="el-icon-refresh-right"
            @click="resetToDefault"
            size="mini"
          >初始默认值</el-button>
          <el-button type="primary" @click="saveCustomGrid" size="mini">确 定</el-button>
          <el-button @click="showCustomDisplay = false" size="mini">取 消</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import Sortable from "sortablejs";
export default {
  name: "RightToolbar",
  data() {
    return {
      // 是否显示列表
      showCustomDisplay: false,
      // 是否全选
      checkedAll: true,
      // 选择一部分
      isIndeterminate: false,
      // 选中的自定义列
      checkedCustoms: [],
      // 自定义列表
      list: [],
    };
  },
  props: {
    // 是否显示搜索
    showSearch: {
      type: Boolean,
      default: true,
    },
    // 是否显示搜索按钮
    showSearchBar: {
      type: Boolean,
      default: true,
    },
    // 是否显示刷新按钮
    showRefreshBar: {
      type: Boolean,
      default: false,
    },
    // 是否显示自定义列
    showCustom: {
      type: Boolean,
      default: false,
    },
    // 自定义列数组
    cols: Array,
    // 当前存自定义列的key(唯一) 暂时使用：路由名字 goodsIndex
    grid: {
      type: String,
      default: "",
    },
    // 当前路由下的分页条件
    page: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    Sortable,
  },
  created() {},
  methods: {
    //搜索
    toggleSearch() {
      this.$emit("update:showSearch", !this.showSearch);
    },
    //刷新
    refresh() {
      this.$emit("queryTable");
    },
    // 全选
    handleCheckAllChange(val) {
      let _listOptions = _.map(this.list, (o) => {
        return o.prop;
      });
      this.checkedCustoms = val ? _listOptions : [];
      this.isIndeterminate = false;
      this.$emit("updateCustom", this.checkedCustoms);
    },
    // 单选
    handleCheckedCustomChange(value) {
      let checkedCount = value.length;
      this.checkedAll = checkedCount === this.list.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.list.length;
      this.$emit("updateCustom", this.checkedCustoms);
    },
    // 显示列
    handleShowCustomDisplay() {
      this.showCustomDisplay = true;
      const _list = JSON.parse(JSON.stringify(this.cols));
      // 勾选废弃（使用数据库存储）
      // this.checkedCustoms = _.map(this.list, (o) => {
      //   return o.prop;
      // });
      // 自定义列表
      this.list = _.each(_list, (o) => {
        o.cstLabel = o.label;
      });
      // 实例化拖拽
      this.$nextTick(() => {
        const table = document.querySelector("#customTable tbody");
        const self = this;
        const _Sortable = Sortable.create(table, {
          onEnd({ newIndex, oldIndex }) {
            const targetRow = self.list.splice(oldIndex, 1)[0];
            self.list.splice(newIndex, 0, targetRow);
          },
        });
      });
    },
    /** 保存自定义列 */
    saveCustomGrid() {
      if (this.grid) {
        let _list = _.cloneDeep(this.list);
        _.each(_list, (o) => {
          o.label = o.cstLabel;
          delete o.cstLabel;
        });
        this.page.queryConditions = [];
        let _data = {
          gridType: this.grid,
          gridSetup: JSON.stringify({
            cols: _list,
            page: this.page,
          }),
        };
        saveGridSetup(_data).then((res) => {
          this.msgSuccess("保存设置成功!");
          setTimeout(() => {
            this.showCustomDisplay = false;
            this.$emit("updateCustom");
          }, 500);
        });
      }
    },
    /** 重置默认列表 */
    resetToDefault() {
      if (this.grid) {
        // 1、删除远程数据
        resetGridSetup({ gridType: this.grid }).then((res) => {
          // 2、重置列表数据
          this.msgSuccess("初始化默认列成功!");
          setTimeout(() => {
            this.showCustomDisplay = false;
            this.$emit("updateCustom");
          }, 500);
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.custom-dialog {
  position: relative;
  z-index: 2200;
  .custom-dialog-list {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 998;
    padding: 10px 20px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.15);
    list-style: none;
    .item {
      margin: 2px 0;
      .el-checkbox {
        display: block;
      }
    }
    .title {
      font-size: 16px;
      white-space: nowrap;
      margin-bottom: 10px;
      color: #888;
      padding-right: 5px;
    }
  }
  .model {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 997;
  }
}
</style>