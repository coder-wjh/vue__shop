<template>
  <div class="all">
    <div class="roles">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb  separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

   

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加区 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '' , 'vcenter']" 
            v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag  closable  @close="removeRightById(scope.row,item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二、三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环  嵌套渲染二级权限 -->
                <el-row :class="[i2 !== 0 ? 'bdtop' : '' , 'vcenter']" 
                  v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success"  closable 
                    @close="removeRightById(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3,) in item2.children" 
                      :key="item3.id" type="warning" closable 
                      @close="removeRightById(scope.row,item3.id)">
                      {{item3.authName}} 
                    </el-tag>
                  </el-col>  
                </el-row>
              </el-col> 
            </el-row>
          </template>
        </el-table-column>
        
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>  

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="deitDialogClosed"
      >
      <!-- 内容主体区域 -->
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="editForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
      >
      <!-- 内容主体区域 -->
      <el-form :model="addForm" ref="addFormRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配添加权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
      >
      <!-- 树形空间 -->
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        ref="treeRef">
      </el-tree>
      
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    </div>
  </div>
</template>

<script>
import { getRolesList } from 'network/root/roles' 
import { editUserInfo } from 'network/root/editInfo'
import { getFormById } from 'network/root/formById'
import { deleteUserInfo } from 'network/root/removeUserById'
import { addUsers } from 'network/root/addUser'
import { deleteRightInfo } from 'network/root/removeRightById'
import { getRightList } from 'network/root/rightTree' 
import { editRoles } from 'network/root/editRoles' 

export default {
  name: 'Roles',
  data(){
    return {
      rolesList: [],
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 控制分配权限的对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightList: [],
      // 这是树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认选中的节点id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  created(){
    this.getRolesInfo()
  },
  methods:{
    getRolesInfo(){
      getRolesList().then((res) => {
          console.log(res);
          if(res.meta.status !== 200){
            return this.$message.error('获取角色列表失败！')
          }else{
            this.rolesList = res.data
          }
      })
    },
    // 展示编辑用户的对话框
    showEditDialog(id){
      console.log(id);
      this.editDialogVisible = true
      getFormById(id).then((res) => {
        console.log(res);
        if(res.meta.status !== 200){
          return this.$message.error('获取数据失败！')
        }else{
          // this.$message.success('获取数据成功！')
          this.editForm = res.data
        } 
        
      })
    },
    // 修改用户信息并提交
    editUserForm(){
      this.$refs.editFormRef.validate(valid => {
        console.log(valid);
        if(!valid) return
        // 可以发起添加用户的网络请求

        // 提交数据的网络请求
        editUserInfo(this.editForm.roleId,this.editForm).then((res) => {
          console.log(res);
          if(res.meta.status !== 200){
            return this.$message.error('修改数据失败！')
          }else{
            this.$message.success('修改数据成功！')
            // 隐藏添加用户的对话框
            this.editDialogVisible = false
            // 重新获取用户列表数据
            this.getRolesInfo()
          } 
          
        })
      })
    },
    // 监听修改用户对话框的关闭事件
    deitDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    // 根据ID删除用户信息
    removeUserById(id){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {    
        deleteUserInfo(id).then( res => {
          console.log(res);
          if(res.meta.status !== 200){
            return this.$message.error('删除失败！')
          }else{
            this.getRolesInfo()
            return this.$message.success('删除成功!！')
          } 
        })
      }).catch(() => {
        this.$message.info('已取消删除');          
      });
    },
    // 根据id删除对应的权限
    removeRightById(role,rightId){
      // 弹框提示用户是否删除
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {    
        deleteRightInfo(role.id,rightId).then( res => {
          console.log(res);
          if(res.meta.status !== 200){
            return this.$message.error('删除权限失败！')
          }else{
            // this.getRolesInfo()
            role.children = res.data
            return this.$message.success('删除权限成功!！')
          } 
        })
      }).catch(() => {
        this.$message.info('已取消删除');          
      });
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加新用户
    addUser(){
      console.log(this.addForm.roleName,this.addForm.roleDesc);
      addUsers(this.addForm.roleName,this.addForm.roleDesc).then((res) => {
        console.log(res);
        if(res.meta.status !== 201){
          return this.$message.error('添加用户失败！')
        }else{
          this.$message.success('添加用户成功！')
          // 隐藏添加用户的对话框
          this.addDialogVisible = false
          // 重新获取用户列表数据
          this.getRolesInfo()
        }     
      })     
    },
    // 展示分配权限的对话框
    showSetRightDialog(role){
      this.roleId = role.id
      
      getRightList('tree').then((res) => {
          console.log(res);
          if(res.meta.status !== 200){
            return this.$message.error('获取权限失败！')
          }else{
            this.rightList = res.data
            this.$message.success('获取权限成功！')

            // 递归获取三级节点的id
            this.getLeafKeys(role,this.defKeys)

            this.setRightDialogVisible = true
          } 
          
      })
    },
    // 通过递归的形式获取角色下所有三级权限的id并保存到defKeys数组中
    getLeafKeys(node,arr){
      // 如果当前node不包含children属性，则是三级节点
      if(!node.children){
        return arr.push(node.id)
      }

      node.children.forEach(item => {
        this.getLeafKeys(item,arr)
      });
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed(){
      this.defKeys = []
    },
    // 点击为角色分配权限
    allotRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')

      editRoles(this.roleId,idStr).then((res) => {
          if(res.meta.status !== 200){
            return this.$message.error('分配权限失败！')
          }else{
            this.$message.success('分配权限成功！')

            // 重新获取用户列表数据
            this.getRolesInfo()

            this.setRightDialogVisible = false
          }     
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

.roles {
  left: 20px;
  margin: 20px 20px;
}

.el-tag {
  margin: 7PX;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}

</style>