import Vue from 'vue'
// login
import {Button, Form,FormItem,Input,Message} from 'element-ui'

// home
import {Container,Header,Aside,Main} from 'element-ui'
// 侧边栏
import {Menu,Submenu,MenuItemGroup,MenuItem} from 'element-ui'
// users
import {Breadcrumb,BreadcrumbItem,Card,Row,
  Col,Table,TableColumn,Switch,Tooltip,
  Pagination,Dialog,MessageBox,Tag,Tree,
  Select,Option,Cascader,Alert,Tabs,TabPane,
  Steps,Step,CheckboxGroup,Checkbox,Upload,Timeline,TimelineItem} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)

Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)