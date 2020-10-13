<template>
  <el-aside :width="iscollapse ? '64px' : '200px'">
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <!-- 侧边栏菜单区 -->
    <el-menu background-color="#333744" text-color="#fff"
    active-text-color="#409eff" :unique-opened="true" 
    :collapse="iscollapse" :collapse-transition="false"
    :router="true" :default-active="activePath "> <!-- :default-active="$route.path"这种更简便但是没有history -->
      <!-- 一级菜单 -->
      <el-submenu :index="item.id + ''" v-for="(item) in menuInfo" :key="item.id">
        <!-- 一级菜单的模板区 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
        
        <!-- 二级菜单 -->            
        <el-menu-item :index="'/' + subItem.path " v-for="(subItem) in item.children" 
        :key='subItem.id' @click="saveNavState('/' + subItem.path)">
          <template slot="title">
            <!-- 图标 -->
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>{{subItem.authName}}</span>
          </template>
        </el-menu-item>
          
      </el-submenu>
      
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name:'homeLeft',
  data(){
    return {
      iscollapse:false,
      activePath:''
    }
  },
  props: {
    menuInfo: {
      type: Array,
      default() {
        return [];
      }
    },
    iconsObj: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  created(){
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse(){
      this.iscollapse = !this.iscollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  },
  
}
</script>

<style lang="less" scoped>
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.iconfont {
  margin-right: 10px;
}
</style>