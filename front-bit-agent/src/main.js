import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import store from "./store";
import {
  Button,
  Toast,
  Field,
  Icon,
  Checkbox,
  Image as VanImage,
  Cell,
  CellGroup,
  Tabbar,
  TabbarItem,
  NavBar,
  ActionSheet,
  Popup,
  Tab,
  Tabs,
  RadioGroup,
  Radio,
  List,
  PullRefresh,
  Tag,
  Dialog,
} from "vant";
const app = createApp(App);
app.component(Button.name, Button);
app.component(Checkbox.name, Checkbox);
app.component(VanImage.name, VanImage);
app.component(Cell.name, Cell);
app.component(CellGroup.name, CellGroup);
app.use(Toast);
app.component(Field.name, Field);
app.component(Icon.name, Icon);
app.component(Tabbar.name, Tabbar);
app.component(TabbarItem.name, TabbarItem);
app.component(NavBar.name, NavBar);
app.component(ActionSheet.name, ActionSheet);
app.component(Popup.name, Popup);
app.component(Tab.name, Tab);
app.component(Tabs.name, Tabs);
app.component(RadioGroup.name, RadioGroup);
app.component(Radio.name, Radio);
app.component(List.name, List);
app.component(PullRefresh.name, PullRefresh);
app.component(Tag.name, Tag);
app.use(Dialog);

// 导入自定义包

import baseUtils from "./utils/baseUtils";
import lance from "./utils/lance";

app.config.globalProperties.$baseUtils = baseUtils;
app.config.globalProperties.$lance = lance;

app.use(router);
app.use(store);
app.mount("#app");
