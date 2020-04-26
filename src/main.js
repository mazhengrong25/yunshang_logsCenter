import Vue from 'vue'
import App from './App.vue'
import router from './router'

import '../public/base.less'
import '../src/utlis/tools'

import 'element-ui/lib/theme-chalk/base.css';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';

Vue.config.productionTip = false
import {
  Button,
  Input,
  Main,
  Container,
  Footer,
  Header,
  Select,
  DatePicker,
  Option,
  Table,
  TableColumn,
  Tag,
  Card,
  Dialog,
  Form,
  FormItem,
  OptionGroup,
  Message } from 'element-ui';

Vue.use(Button)
Vue.use(Input)
Vue.use(Main)
Vue.use(Container)
Vue.use(Footer)
Vue.use(Header)
Vue.use(Select)
Vue.use(DatePicker)
Vue.use(Option)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag)
Vue.use(Card)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(OptionGroup)

Vue.component(CollapseTransition.name, CollapseTransition)

Vue.prototype.$message = Message;
Vue.prototype.$ELEMENT = { size: 'small' };

import axios from "axios";
Vue.prototype.$axios = axios;

import VueClipboard  from 'vue-clipboard2'

Vue.use( VueClipboard )


// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
