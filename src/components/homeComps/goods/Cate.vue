<template>
  <div class="all">
    <div class="Cate">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb  separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="20">
        <el-col>
          <el-button type="primary" style="margin-bottom: 16px" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table :data="CateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text='#' border :show-row-hover="false">
          <!-- 是否有效 -->
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted == false" style="color: lightgreen"></i>
            <i class="el-icon-error" v-else style="color: red"></i>
          </template>
          <!-- 排序 -->
          <template slot="order" slot-scope="scope">
            <el-tag size='mini' v-if="scope.row.cat_level == 0">一级</el-tag>
            <el-tag size='mini' type="success" v-else-if="scope.row.cat_level == 1">二级</el-tag>
            <el-tag size='mini' type="warning" v-else>三级</el-tag>
          </template>
          <!-- 操作 -->
          <template slot="opt"  slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"   @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row.cat_id)">删除</el-button>
          </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>  

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称：">
          <!-- option用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            :clearable="true"></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类的对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="deitDialogClosed"
      >
      <!-- 内容主体区域 -->
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateForm">确 定</el-button>
      </span>
    </el-dialog>

    </div>
  </div>
</template>

<script>
import { getGoodsList } from 'network/goods/goodslist'
import { getParentGoodsList } from 'network/goods/getParent'
import { addCateList } from 'network/goods/addCate'
import { FromById } from 'network/goods/getFromById'
import { editFrom } from 'network/goods/editFrom'
import { deleteCateInfo } from 'network/goods/removeCateById'

export default {
  name: 'Cate',
  data(){
    return {
      queryInfo:{
        type: 3,
        pagenum: 1,  
        pagesize: 5,
      },
      // 商品分类的数据列表，默认为空
      CateList: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns:[{
        label:'分类名称',
        prop:'cat_name'
      },{
        label:'是否有效',
        // 表示将当前列定义为模本列
        type:'template',
        // 表示当前列使用的模板名称
        template:'isok'
      },{
        label:'排序',
        // 表示将当前列定义为模本列
        type:'template',
        // 表示当前列使用的模板名称
        template:'order'
      },{
        label:'操作',
        // 表示将当前列定义为模本列
        type:'template',
        // 表示当前列使用的模板名称
        template:'opt'
      }],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible:false,
      // 添加分类的表单数据对象
      addCateForm:{
        // 将要添加分类的名称
        cat_name:'',
        // 父级分类的id
        cat_pid: 0,
        // 分类等级，默认添加一级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则
      addCateFormRules:{
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps:{
        checkStrictly:true,
        expandTrigger: 'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      // 选中的父级分类的id数组
      selectedKeys:[],
      // 查询到的分类信息对象
      editForm: {},
      // 控制修改分类对话框的显示与隐藏
      editDialogVisible: false
    }
    
  },
  created(){
    this.getCateList()
  },
  methods:{
    // 获取商品分类数据
    getCateList(){
      getGoodsList(this.queryInfo.type,this.queryInfo.pagenum,this.queryInfo.pagesize).then(res => {
        console.log(res);
        if(res.meta.status !== 200){
          return this.$message.error('获取商品分类失败！')
        }else{
          this.CateList = res.data.result
          this.total = res.data.total
          this.$message.success('获取商品分类成功！')
        }     
      })
    },
    // 监听 pagesize 改变的
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 handleCurrentChange 改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 展示添加分类对话框
    showAddCateDialog(){
      // 先获取父级分类的数据列表，在展示对话框
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获得父级分类的数据列表
    getParentCateList(){
      getParentGoodsList(2).then(res => {
        console.log(res);
        if(res.meta.status !== 200){
          return this.$message.error('获取父级分类数据失败！')
        }else{
          this.parentCateList = res.data
          this.$message.success('获取父级分类数据成功！')
        }     
      })
    },
    // 监听添加f分类对话框的关闭事件
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 选择项发生变化触发事件
    parentCateChange(){
      console.log(this.selectedKeys);
      // 如果selectedKeys数组中的length大于0则选中了父级分类，反之没有选择任何父级分类
      if(this.selectedKeys.length>0){
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }else{
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前分类等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮添加新的分类
    addCate(){
      this.$refs.addCateFormRef.validate(vaild => {
        if(!vaild) return
        addCateList(this.addCateForm).then(res => {
          console.log(res);
          if(res.meta.status !== 201){
            return this.$message.error('添加商品分类失败！')
          }else{
            this.$message.success('添加商品分类成功！')
            this.addCateDialogVisible = false
            this.getCateList()
          }     
        })
      }) 
    },
    // 展示编辑用户的对话框
    showEditDialog(id){
      console.log(id);
      this.editDialogVisible = true
      FromById(id).then((res) => {
        console.log(res);
        if(res.meta.status !== 200){
          return this.$message.error('获取数据失败！')
        }else{
          // this.$message.success('获取数据成功！')
          this.editForm = res.data
        } 
      })
    },
    // 监听修改分类对话框的关闭事件
    deitDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    // 修改分类信息并提交
    editCateForm(){
      // 提交数据的网络请求
      editFrom(this.editForm.cat_id,this.editForm.cat_name).then((res) => {
        console.log(res);
        if(res.meta.status !== 200){
          return this.$message.error('修改分类失败！')
        }else{
          this.$message.success('修改分类成功！')
          // 隐藏添加分类的对话框
          this.editDialogVisible = false
          // 重新获取分类列表数据
          this.getCateList()
        } 
        
      })
    },
    // 根据ID删除分类信息
    removeCateById(id){
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {    
        deleteCateInfo(id).then( res => {
          console.log(res);
          if(res.meta.status !== 200){
            return this.$message.error('删除失败！')
          }else{
            this.getCateList()
            return this.$message.success('删除成功!！')
          } 
        })
      }).catch(() => {
        this.$message.info('已取消删除');          
      });
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

.Cate {
  left: 20px;
  margin: 20px 20px;
}

.el-pagination{
  margin-top: 15px;
}

.el-cascader{
  width: 100%;
}
</style>