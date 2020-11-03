<template>
  <div class="all">
    <div class="rights">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb  separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限管理" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级权限</el-tag>
            <el-tag type="warning" v-else>三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>  

    </div>
  </div>
</template>

<script>
import {getRootList} from 'network/root/rootList'

export default {
  name: 'rights',
  data(){
    return {
      type: 'list',
      // 权限列表
      rightsList:[]
    }
  },
  created(){
    // 获取所有权限
    this.getRootInfo()
  },
  methods:{
    // 获得权限列表
    getRootInfo(){
      getRootList(this.type).then((res) => {
        console.log(res);
        if(res.meta.status !== 200) return this.$message.error('获取权限列表失败！');
        this.rightsList = res.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
.all {
  width: 100%;
  height: calc(100vh - 60px);
  background-color: #eaedf1;
  overflow: scroll;
}

.rights {
  left: 20px;
  height: calc(100% - 40px);
  margin: 0 20px;
  margin-top: 20px;
  padding: 0;
  padding-bottom: 20px;
}

</style>