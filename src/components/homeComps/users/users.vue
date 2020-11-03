<template>
  <div class="all">
    <div class="users">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb  separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getUserList'>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <el-switch
            slot-scope="scope"
            v-model="scope.row.mg_state"
            @change="userStateChanged(scope.row)">
          </el-switch>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" 
            size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" 
            @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" 
                size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
            
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!-- 添加用户的对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
        >
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="deitDialogClosed"
        >
        <!-- 内容主体区域 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserForm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配添加权限的对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%"
        @close="setRoleDialogClosed"
        >
        <!-- 主内容区 -->
        <div>
          <p>当前的用户：{{usersInfo.username}}</p>
          <p>当前的角色：{{usersInfo.role_name}}</p>
          <div>
            <p>
              分配新角色：
              <el-select  v-model="selectedRoleId" placeholder="请选择">
                <el-option v-for="(item) in rolesList" 
                :key="item.id" :label="item.roleName" :value="item.id"></el-option>
              </el-select>
            </p>
          </div>
        </div>
        
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
  </div>
</template>

<script>
import { getUserForm } from 'network/home/userInfo'
import { changeInfo } from 'network/home/switchChange'
import { addUsers } from 'network/home/addUser'
import { getFormById } from 'network/home/formById'
import { editUserInfo } from 'network/home/editUser'
import { deleteUserInfo } from 'network/home/removeUserById'
import { saveUsersInfo } from 'network/home/saveUserInfo'
import { getRolesList } from 'network/root/roles'

export default {
  name: 'Users',
  data(){
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      var regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if(regEmail.test(value)){
        return cb()
      }else{
        cb(new Error('请输入合法的邮箱'))
      }

    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      var regMobile = /^1[3|4|5|7|8|9][0-9]{9}$/

      if(regMobile.test(value)){
        return cb()
      }else{
        cb(new Error('请输入合法的手机号'))
      }
    }

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改按钮的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      usersInfo: {},
      // 角色列表数据
      rolesList: [],
      // 已选中的角色ID值
      selectedRoleId: ''
    }
  },
  created(){
    this.getUserList()
  },
  methods: {
    getUserList(){
      getUserForm(this.queryInfo).then((res) => {
        console.log(res);
        if(res.meta.status !== 200) return this.$message.error('获取用户列表失败！');
        this.userList = res.data.users
        this.total = res.data.total
      })
    },
    // 监听pagesize改变
    handleSizeChange(newSize){
      console.log(newSize);
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch开关状态的改变
    userStateChanged(userinfo){
      console.log(userinfo);
      changeInfo(userinfo.id,userinfo.mg_state).then((res) => {
        console.log(res);
        if(res.meta.status !== 200){
          userinfo.mg_state = !userinfo.mg_state
          return this.$message.error('更新用户状态失败！')
        }else{
          return this.$message.success('更新用户状态成功！')
        } 
        
      })
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加新用户
    addUser(){
      this.$refs.addFormRef.validate(valid => {
        console.log(valid);
        if(!valid) return
        // 可以发起添加用户的网络请求

        // console.log(this.addForm);
        addUsers(this.addForm).then((res) => {
          console.log(res);
          if(res.meta.status !== 201){
            return this.$message.error('添加用户失败！')
          }else{
            this.$message.success('添加用户成功！')
            // 隐藏添加用户的对话框
            this.addDialogVisible = false
            // 重新获取用户列表数据
            this.getUserList()
          } 
          
        })
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
        editUserInfo(this.editForm.id,this.editForm).then((res) => {
          console.log(res);
          if(res.meta.status !== 200){
            return this.$message.error('修改数据失败！')
          }else{
            this.$message.success('修改数据成功！')
            // 隐藏添加用户的对话框
            this.editDialogVisible = false
            // 重新获取用户列表数据
            this.getUserList()
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
            this.getUserList()
            return this.$message.success('删除成功!！')
          } 
        })
      }).catch(() => {
        this.$message.info('已取消删除');          
      });
    },
    // 展示分配角色的对话框
    setRole(usersInfo){
      this.usersInfo = usersInfo

      getRolesList().then((res) => {
        console.log(res);
        if(res.meta.status !== 200){
          return this.$message.error('获取角色列表失败！')
        }else{
          this.rolesList = res.data
          this.$message.success('获取角色列表成功！')
        } 
      })

      this.setRoleDialogVisible = true
    },
    // 点击按钮分配角色
    saveRoleInfo(){
      if(!this.selectedRoleId){
        return this.$message.error('请选择要分配的角色！')
      }

      saveUsersInfo(this.usersInfo.id,this.selectedRoleId).then((res) => {
        console.log(res);
        if(res.meta.status !== 200){
          return this.$message.error('设置角色失败！')
        }else{
          this.$message.success('设置角色成功！')
          this.getUserList()
          this.setRoleDialogVisible = false
        } 
      })    
    },
    //监听分配角色对话框的关闭事件 
    setRoleDialogClosed(){
      this.selectedRoleId = '',
      this.userinfo = {}
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

.users {
  left: 20px;
  margin: 20px 20px;
}

.el-pagination{
  margin-top: 15px;
}

</style>