<template>
  <div class="all">
    <div class="List">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb  separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable 
            v-model="queryInfo.query" @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" 
              @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table border stripe :data="goodsList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width=90px></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width=90px></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width=150px>
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" 
            size="mini"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" 
              size="mini" @click="removeById(scope.row)"></el-button>         
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15,20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background>
      </el-pagination>

    </el-card>
  </div>
  </div>
</template>

<script>
import { GoodsList } from 'network/goods/goods_list/getGoodsList'
import { deletedGoods } from 'network/goods/goods_list/deleteGoods'

export default {
  name: 'List',
  data(){
    return {
      // 查询参数对象
      queryInfo:{
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodsList: [],
      // 总数据条数
      total: 0
    }
  },
  created(){
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取商品列表
    getGoodsList(){
      GoodsList(this.queryInfo).then((res) => {
        console.log(res);
        if(res.meta.status !== 200){
          return this.$message.error('获取商品列表失败！')
        }else{
          this.goodsList = res.data.goods
          this.total = res.data.total
          this.$message.success('获取商品列表成功！')
        } 
      })
    },
    // pagesize 发生改变触发事件
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // pagenum 发生改变触发事件
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 删除商品
    removeById(row){
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {    
        deletedGoods(row.goods_id).then((res) => {
          console.log(res);
          if(res.meta.status !== 200){
            return this.$message.error('删除商品失败！')
          }else{
            this.$message.success('删除商品成功！')
            this.getGoodsList()
          } 
        })
      }).catch(() => {
        this.$message.info('已取消删除');          
      });
    },
    // 
    goAddPage(){
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
.all {
  width: 100%;
  background-color: #eaedf1;
  height: calc(100vh - 60px);
  overflow: scroll;
}

.List {
  left: 20px;
  margin: 20px 20px;
}

.el-pagination{
  margin-top: 15px;
}

</style>