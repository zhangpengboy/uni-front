/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-25 10:53:47
 * @Description  : Vue 混合模式
 */
import store from '../store'
import { getStoreAreaList } from "@/api/stores";
export default {
  data() {
    return {
      // 省
      areaOption1: [],
      // 市
      areaOption2: [],
      // 区
      areaOption3: [],
    }
  },
  created() {
    this.getStoreAreaList();
  },
  methods: {
    /** 获取区域列表 */
    getStoreAreaList(workId, level) {
      getStoreAreaList({ workId }).then((res) => {
        if (level == 1) {
          this.areaOption1 = res.data;
        } else if (level == 2) {
          this.areaOption2 = res.data;
        } else if (level == 3) {
          this.areaOption3 = res.data;
        } else {
          this.areaOption1 = res.data;
        }
      });
    },
    /** 省选择 */
    handleChangeArea1(value) {
      this.$set(this.queryParams, "area1Id", value);
      this.$set(
        this.queryParams,
        "area1Name",
        this.areaOption1
          .filter((v) => v.id === value)
          .map((v) => v.name)
          .toString()
      );
      this.resetAreaSelect(1);
      this.getStoreAreaList(value, 2);
    },
    /** 市选择 */
    handleChangeArea2(value) {
      this.$set(this.queryParams, "area2Id", value);
      this.$set(
        this.queryParams,
        "area2Name",
        this.areaOption2
          .filter((v) => v.id === value)
          .map((v) => v.name)
          .toString()
      );
      this.resetAreaSelect(2);
      this.getStoreAreaList(value, 3);
    },
    /** 区选择 */
    handleChangeArea3(value) {
      this.$set(this.queryParams, "area3Id", value);
      this.$set(
        this.queryParams,
        "area3Name",
        this.areaOption3
          .filter((v) => v.id === value)
          .map((v) => v.name)
          .toString()
      );
    },
    /** 重置数据 */
    resetAreaSelect(level) {
      if (level === 1) {
        this.areaOption2 = [];
        this.queryParams.area2Id = null;
        delete this.queryParams.area2Name
        this.areaOption3 = [];
        this.queryParams.area3Id = null;
        delete this.queryParams.area3Name
      } else if (level === 2) {
        this.areaOption3 = [];
        this.queryParams.area3Id = null;
        delete this.queryParams.area3Name
      }
    },
  }
}
