<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="~assets/img/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!-- 页面主题区 -->
    <el-container>
      <!-- 侧边栏 -->
      <home-left :menuInfo="menuList" :iconsObj="iconsObj"/>

      <!-- 右侧内容主体 -->
      <router-view></router-view>

    </el-container>
  </el-container>   
</template>

<script>
import homeLeft from './homeComps/home-left.vue'

import {getMenuForm} from 'network/home/menuList.js'

export default {
  name: 'Home',
  components: {
    homeLeft,
  },
  data(){
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        '125':'iconfont icon-users',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',
      }
    }
  },
  created(){
    this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('./login')
    },
    // 获取所有的菜单
    getMenuList() {
      // const {data:res} = await this.$http.get('menus')
      getMenuForm().then( res => {
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.menuList = res.data
        // console.log(res);
        
      })
      
    }
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-container {
  display: flex;
}

.el-main {
  background-color: #eaedf1;
}
</style>