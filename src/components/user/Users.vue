<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片式图区 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入姓名进行搜索"
            clearable
            v-model="queryInfo.query"
            @keyup.enter.native="getUserList"
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="userList" style="width: 100%" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column label="创建日期">
          <template v-slot="receivedData">
            {{ $moment(receivedData.row.create_time, 'X').format('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column prop="role_name" label="权限"> </el-table-column>
        <el-table-column label="用户状态" width="180px">
          <template v-slot="receivedData">
            <el-switch
              v-model="receivedData.row.mg_state"
              active-text="启用"
              inactive-text="禁用"
              @change="userStateChange(receivedData.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="receivedData">
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(receivedData.row.id)"
                plain
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改权限" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                plain
                @click="setUserRight(receivedData.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(receivedData.row.id)"
                plain
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页控件区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
        :page-size="queryInfo.pagesize"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!--添加用户 对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      @close="resetAddForm"
      @keyup.enter.native="addUser"
      width="50%"
    >
      <!-- 对话框内容主体区 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑用户 对话框 -->

    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      @close="editDialogClose"
      @keyup.enter.native="editUserInfo"
      width="50%"
    >
      <!-- 对话框内容主体区 -->
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
        <el-form-item label="id">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户权限对话框 -->
    <el-dialog
      title="修改权限"
      :visible.sync="setUserDialogVisible"
      width="30%"
      @close="setRoleDialogClose"
    >
      <div>
        <p>
          当前用户：<a class="fake_a" href="JavaScript:;">{{ userInfo.username }}</a>
        </p>
        <p>
          当前权限：<a class="fake_a" href="JavaScript:;">{{ userInfo.role_name }}</a>
        </p>
        <p>
          修改权限：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //自定义表单邮箱校验规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    //自定义表单手机号验证规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (regMobile.test(value)) {
        return callback()
      }

      callback(new Error('请输入合法的11位手机号'))
    }
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      userList: [],
      //控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      //添加用户的表单对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      //添加用户表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '用户名长度需在3到12位之间', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度需在6到16位之间', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      //控制编辑用户对话框的显示与隐藏
      editDialogVisible: false,
      //编辑用户对象
      editForm: {},
      //编辑用户表单验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      //控制修改权限对话框的显示与隐藏
      setUserDialogVisible: false,
      //正在被修改权限的用户信息
      userInfo: '',
      //权限列表
      rolesList: '',
      //选中的权限id
      selectedRoleId: '',
    }
  },
  methods: {
    async getUserList() {
      //获取用户列表
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      this.total = res.data.total
      this.userList = res.data.users
    },
    handleSizeChange(newSize) {
      //监听pageSize改变的事件
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      //监听页码改变的事件
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChange(userInfo) {
      //监听用户状态的改变，并更新数据库
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      }
    },
    resetAddForm() {
      //重置添加用户表单
      this.$refs.addFormRef.resetFields()
      this.addForm = {
        username: '',
        password: '',
        email: '',
        mobile: '',
      }
    },
    addUser() {
      //添加用户
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        //发起添加用户网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status != 201)
          return this.$message({
            showClose: true,
            message: res.meta.msg,
            type: 'error',
          })
        this.$message({
          showClose: true,
          message: '用户添加成功',
          type: 'success',
        })
        //隐藏对话框
        this.addDialogVisible = false
        //重新获取用户列表
        this.getUserList()
      })
    },
    async showEditDialog(id) {
      //获取续编辑的用户信息
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status != 200)
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      this.editForm = res.data
      //展示用户编辑对话框
      this.editDialogVisible = true
    },
    editDialogClose() {
      //关闭editDialog时重置验证结果
      this.$refs.editFormRef.resetFields()
      this.editForm = {}
    },
    editUserInfo() {
      //修改用户信息并提交
      this.$refs.editFormRef.validate(async (valid) => {
        //判断用户输入信息是否合法
        if (!valid) return
        //进行后台用户信息的修改
        const { data: res } = await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        })
        if (res.meta.status != 200)
          return this.$message({
            showClose: true,
            message: res.meta.msg,
            type: 'error',
          })
        this.editDialogVisible = false
        this.getUserList()
        return this.$message({
          showClose: true,
          message: '更改用户信息成功',
          type: 'success',
        })
      })
    },
    async removeUserById(id) {
      //根据id删除用户信息
      const confirmResult = await this.$confirm('这将会永久删除用户信息，是否继续？', '确认信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }) //点击确认后进入then
        .then(async () => {
          const { data: res } = await this.$http.delete(`users/${id}`)
          if (res.meta.status != 200)
            return this.$message({
              showClose: true,
              message: res.meta.msg,
              type: 'error',
            })
          this.$message({
            showClose: true,
            message: '用户信息删除成功',
            type: 'success',
          })
          this.getUserList()
        })
        //点击取消后进入catch
        .catch((err) => {
          this.$message('取消删除')
        })
    },
    async setUserRight(userInfo) {
      //修改用户权限
      this.userInfo = userInfo
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status != 200)
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      this.rolesList = res.data
      this.setUserDialogVisible = true
    },
    async saveRoleInfo() {
      //点击按钮分配角色
      if (!this.selectedRoleId) return

      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId,
      })
      if (res.meta.status != 200)
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      this.$message({
        showClose: true,
        message: '用户权限更新成功',
        type: 'success',
      })
      this.getUserList()
      this.setUserDialogVisible = false
    },
    setRoleDialogClose() {
      //分配权限对话框关闭前的操作
      this.userInfo = ''
      this.rolesList = ''
      this.selectedRoleId = ''
    },
  },
  created() {
    this.getUserList()
  },
}
</script>

<style lang="less" scoped>
.fake_a {
  text-decoration: none;
  color: #a057c2;
}
p {
  margin-bottom: 10px;
}
</style>