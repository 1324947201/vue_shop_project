//自定义element ui主题-按需引入
import './css/button.css'
import './css/switch.css'
import './css/pagination.css'
import './css/breadcrumb.css'
import './css/tree.css'
import Vue from 'vue'

//按需引入element组件
import {
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Header,
    Aside,
    main,
    Menu,
    Submenu,
    MenuItemGroup,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    select,
    Option
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
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
Vue.use(select)
Vue.use(Option)


//向Vue原型上进行挂载
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm