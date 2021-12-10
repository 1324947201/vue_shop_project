<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片式图 -->
    <!-- 添加角色按钮 -->
    <el-card>
      <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>

      <!-- 角色列表 -->
      <el-table :data="rolesList" style="width: 100%" stripe border>
        <el-table-column type="expand">
          <template v-slot="receivedData">
            <div class="expand-content">
              <el-row
                :class="['ycenter', 'bdbottom', index1 === 0 ? 'bdtop' : '']"
                :gutter="20"
                v-for="(value1, index1) in receivedData.row.children"
                :key="value1.id"
              >
                <!-- 渲染一级权限 -->
                <el-col :span="5">
                  <el-tag closable @close="removeById(receivedData.row, value1)">
                    {{ value1.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>

                <!-- 渲染二级权限 -->
                <el-col :span="20">
                  <el-row
                    :class="['ycenter', index2 === 0 ? '' : 'bdtop']"
                    :gutter="20"
                    v-for="(value2, index2) in value1.children"
                    :key="value2.id"
                  >
                    <el-col :span="6">
                      <el-tag type="success" closable @close="removeById(receivedData.row, value2)">
                        {{ value2.authName }}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>

                    <!-- 渲染三级权限 -->
                    <el-col :span="18">
                      <el-tag
                        v-for="value3 in value2.children"
                        :key="value3.id"
                        type="warning"
                        closable
                        @close="removeById(receivedData.row, value3)"
                      >
                        {{ value3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="320px">
          <template v-slot="receivedData">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showEditDialog(receivedData.row.id)"
              >编辑</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small"
              @click="showSetRightDialog(receivedData.row)"
              >权限</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeRoleById(receivedData.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="resetAddForm"
      @keyup.enter.native="addRoleInfo"
    >
      <!-- 对话框内容主体区 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="resetEditForm"
      @keyup.enter.native="editRoleInfo"
    >
      <!-- 对话框内容主体区 -->
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
        <el-form-item label="ID">
          <el-input v-model="editForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisiable"
      width="30%"
      @close="setRightDialogClosed"
    >
      <span>
        <el-tree
          ref="treeRef"
          :data="rightsList"
          :props="rightsTreeProps"
          :default-checked-keys="defKeys"
          node-key="id"
          show-checkbox
          default-expand-all
        ></el-tree>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      addFormRules: {
        roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
      },
      setRightDialogVisiable: false,
      rightsList: [],
      //树形图的嵌套规则
      rightsTreeProps: {
        //嵌套属性
        children: 'children',
        //文本属性
        label: 'authName',
      },
      //树形图中默认选中的节点
      defKeys: [],
      //正在编辑的角色id
      settingRoleId: '',
    }
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200)
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      this.rolesList = res.data
    },
    resetAddForm() {
      //重置添加用户表单
      this.$refs.addFormRef.resetFields()
      this.addForm = {
        roleName: '',
        roleDesc: '',
      }
    },
    addRoleInfo() {
      //添加级角色
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        //发起添加用户网络请求
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status != 201)
          return this.$message({
            showClose: true,
            message: res.meta.msg,
            type: 'error',
          })
        this.$message({
          showClose: true,
          message: '用户角色成功',
          type: 'success',
        })
        //隐藏对话框
        this.addDialogVisible = false
        //重新获取用户列表
        this.getRolesList()
      })
    },
    async showEditDialog(id) {
      //获取续编辑的用户信息
      const { data: res } = await this.$http.get(`roles/${id}`)
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
    resetEditForm() {
      this.$refs.editFormRef.resetFields()
      this.editForm = {}
    },
    editRoleInfo() {
      //修改用户信息并提交
      this.$refs.editFormRef.validate(async (valid) => {
        //判断用户输入信息是否合法
        if (!valid) return
        //进行后台用户信息的修改
        const { data: res } = await this.$http.put(`roles/${this.editForm.roleId}`, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc,
        })
        if (res.meta.status != 200)
          return this.$message({
            showClose: true,
            message: res.meta.msg,
            type: 'error',
          })
        this.editDialogVisible = false
        this.getRolesList()
        return this.$message({
          showClose: true,
          message: '编辑角色成功',
          type: 'success',
        })
      })
    },
    async removeRoleById(id) {
      //根据id删除用户信息
      await this.$confirm('这将会永久删除角色信息，是否继续？', '确认信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }) //点击确认后进入then
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${id}`)
          if (res.meta.status != 200)
            return this.$message({
              showClose: true,
              message: res.meta.msg,
              type: 'error',
            })
          this.$message({
            showClose: true,
            message: '角色信息删除成功',
            type: 'success',
          })
          this.getRolesList()
        })
        //点击取消后进入catch
        .catch((err) => {
          this.$message('取消删除')
        })
    },
    async removeById(role, right) {
      //根据id删除角色权限
      await this.$confirm(`确认移除<${role.roleName}>的<${right.authName}>权限吗`, '确认信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }) //点击确认后进入then
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${right.id}`)
          if (res.meta.status != 200)
            return this.$message({
              showClose: true,
              message: res.meta.msg,
              type: 'error',
            })
          this.$message({
            showClose: true,
            message: '角色权限移除成功',
            type: 'success',
          })
          role.children = res.data
        })
        //点击取消后进入catch
        .catch((err) => {
          this.$message('取消移除权限')
        })
    },
    async showSetRightDialog(role) {
      //展示分配权限的对话框
      //获取权限列表
      this.settingRoleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200)
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisiable = true
    },
    getLeafKeys(node, arr) {
      //通过递归获取角色全部的三级权限，将其保存在数组中
      //如果当前节点不包含children属性，则证明其是三级节点，则将id压入数组中
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    setRightDialogClosed() {
      //监听分配权限对话框的关闭
      this.defKeys = []
      this.settingRoleId = ''
    },
    async allotRights() {
      //点击为角色分配权限
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const { data: res } = await this.$http.post(`roles/${this.settingRoleId}/rights`, {
        rids: keys.join(','),
      })
      if (res.meta.status !== 200)
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      this.$message({
        showClose: true,
        message: '角色权限分配成功',
        type: 'success',
      })
      this.getRolesList()
      this.setRightDialogVisiable = false
    },
  },
  created() {
    this.getRolesList()
  },
}
</script>

<style lang="less" scoped>
.expand-content {
  width: 85%;
  margin: 0 auto;
}
.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.ycenter {
  display: flex;
  align-items: center;
}

.el-tag {
  margin: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>