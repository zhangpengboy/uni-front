<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu select-stores">
      <!-- <el-select v-model="storeid" placeholder="请先选择店铺" size="small">
        <el-option
          v-for="item in list"
          :key="item.id"
          :label="item.storeName"
          :value="item.id"
        >
        </el-option>
      </el-select> -->
      <template v-if="device !== 'mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>店铺中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 提示框 -->
    <v-tour name="myTour" :steps="steps" :options="myOptions"></v-tour>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";

import { getStoreInfoPageList } from "@/api/stores";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
  },
  data() {
    return {
      // 店铺列表
      list: [],
      myOptions: {
        useKeyboardNavigation: false, //不使用←、→和ESC键来导航tour
        labels: {
          buttonSkip: "跳过",
          buttonPrevious: "上一步",
          buttonNext: "下一步",
          buttonStop: "我已知晓",
        },
      },
      steps: [
        {
          target: ".select-stores",
          content: "请先选择店铺后进行其他操作。",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device", "store"]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
    // storeid: {
    //   get() {
    //     const store = this.$store.state.user.store;
    //     if (store) {
    //       return store.id;
    //     }
    //     return "";
    //   },
    //   set(val) {
    //     const _data = _.find(this.list, (v) => {
    //       return v.id == val;
    //     });
    //     console.log(321,_data);
    //     this.$store.dispatch("SetStore", _data);
    //     // 重新刷新页面，避免赋值未生效
    //     window.location.reload();
    //   },
    // },
  },
  watch : {
    '$route' (to, from) {
      if(from.path == '/index') {
        window.location.reload();
      }
    }
},
  created() {
    // this.getStoreInfoPageList();
  },
  mounted() {
    // if (window.performance.navigation.type == 1) {
    //   console.log("页面被刷新");
    // } else {
    //   console.log("首次被加载");
    //   // window.location.reload();
    // }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    /** 获取店铺列表 */
    getStoreInfoPageList() {
      let queryParams = _.assign({}, this.Dict.QUERY_PARAMS);
      queryParams.pageSize = 1000;
      queryParams.status = 0; // 查询正常的通过的店铺
      getStoreInfoPageList(queryParams).then((res) => {
        this.list = res.data;
        if (this.store == null && this.list.length > 0) {
          this.$tours["myTour"].start();
        }
      });
    },
    /** 退出登录 */
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // LogOut 正常使用这个接口
        this.$store.dispatch("FedLogOut").then(() => {
          location.href = "/index";
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  // overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
