<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-alert title="注意: 只允许为三级参数设置相关信息" type="warning" :closable="false" show-icon>
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类: </span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            :disabled="!isCascaderSelect"
            @click="addDialogVisiable = true"
            >添加参数
          </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <img class="no-data" slot="empty" src="../../assets/no-data.jpg" alt="暂无数据" />
            <el-table-column type="expand">
              <!-- 具体参数值tag标签 -->
              <template v-slot="receiveData">
                <el-tag
                  closable
                  v-for="(item, i) in receiveData.row.attr_vals"
                  :key="i"
                  @close="handleClose(i, receiveData)"
                >
                  {{ item }}
                </el-tag>
                <!-- 动态添加标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="receiveData.row.inputVisiable"
                  v-model="receiveData.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(receiveData)"
                  @blur="handleInputConfirm(receiveData)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" @click="showInput(receiveData)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" align="center"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name"> </el-table-column>
            <el-table-column label="操作" width="300px" align="center">
              <template v-slot="receiveData">
                <el-button
                  class="centrol-button"
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(receiveData.row.attr_id)"
                  >修改参数</el-button
                >
                <el-button
                  class="centrol-button"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(receiveData.row.attr_id)"
                  >删除参数</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            :disabled="!isCascaderSelect"
            @click="addDialogVisiable = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <img class="no-data" slot="empty" src="../../assets/no-data.jpg" alt="暂无数据" />
            <el-table-column type="expand">
              <!-- 具体参数值tag标签 -->
              <template v-slot="receiveData">
                <el-tag
                  closable
                  v-for="(item, i) in receiveData.row.attr_vals"
                  :key="i"
                  @close="handleClose(i, receiveData)"
                >
                  {{ item }}
                </el-tag>
                <!-- 动态添加标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="receiveData.row.inputVisiable"
                  v-model="receiveData.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(receiveData)"
                  @blur="handleInputConfirm(receiveData)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" @click="showInput(receiveData)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" align="center"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name"> </el-table-column>
            <el-table-column label="操作" width="300px" align="center">
              <template v-slot="receiveData">
                <el-button
                  class="centrol-button"
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(receiveData.row.attr_id)"
                  >修改属性</el-button
                >
                <el-button
                  class="centrol-button"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(receiveData.row.attr_id)"
                  >删除属性</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态参数/静态属性对话框 -->
    <el-dialog
      :title="'添加' + focusTitle"
      :visible.sync="addDialogVisiable"
      width="30%"
      @keyup.enter.native="addParams"
      @close="addDialogClosed"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRulse" label-width="80px">
        <el-form-item :label="focusTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改动态参数/静态属性对话框 -->
    <el-dialog
      :title="'修改' + focusTitle"
      :visible.sync="editDialogVisiable"
      width="50%"
      @keyup.enter.native="editParams"
      @close="editDialogClosed"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRulse" label-width="100px">
        <el-form-item :label="focusTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类列表
      cateList: [],
      //级联选择框配置项
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //级联选择框双向绑定数组
      selectedKeys: [],
      //tab被激活的页签名称
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      //添加对话框相关属性
      addDialogVisiable: false,
      addForm: {
        attr_name: '',
      },
      addFormRulse: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      },
      //编辑对话框相关属性
      editDialogVisiable: false,
      editForm: {
        attr_id: '',
        attr_name: '',
      },
      editFormRulse: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      },
    }
  },
  methods: {
    async getCateList() {
      //获取商品列表
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200)
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      this.cateList = res.data
    },
    handleChange() {
      //级联选择框变化会触发该函数
      this.getParamsData()
    },
    handleTabClick() {
      //tab页签点击处理函数
      this.getParamsData()
    },
    async getParamsData() {
      //获取参数列表
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return this.$message({
          showClose: true,
          message: '仅限选择三级分类进行编辑',
          type: 'warning',
        })
      }
      //根据所选分类的id和当前所处的面板发起请求
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName },
      })
      if (res.meta.status !== 200)
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      res.data.forEach((item) => {
        //判断数据行的attr——vals是否为空
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        //控制每个文本框的显示与隐藏
        item.inputVisiable = false
        //保存input值
        item.inputValue = ''
      })
      //判断获取到的数据是哪个表格
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    addDialogClosed() {
      //添加属性/参数对话框关闭
      this.$refs.addFormRef.resetFields()
    },
    addParams() {
      //点击确认，添加参数
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName,
        })
        if (res.meta.status !== 201) {
          return this.$message({
            showClose: true,
            message: res.meta.msg,
            type: 'error',
          })
        }
        this.$message({
          showClose: true,
          message: `添加${this.focusTitle}成功`,
          type: 'success',
        })
        this.addDialogVisiable = false
        this.getParamsData()
      })
    },
    async showEditDialog(id) {
      //点击按钮，展示编辑对话框
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
        params: { attr_sel: this.activeName },
      })
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      }
      this.editForm = res.data
      this.editDialogVisiable = true
    },
    editDialogClosed() {
      //重置表单
      this.$refs.editFormRef.resetFields()
    },
    editParams() {
      //点击确认，修改参数信息
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message({
            showClose: true,
            message: res.meta.msg,
            type: 'error',
          })
        }
        this.$message({
          showClose: true,
          message: `修改${this.focusTitle}成功`,
          type: 'success',
        })
        this.editDialogVisiable = false
        this.getParamsData()
      })
    },
    removeParams(id) {
      //根据id删除属性/参数
      this.$confirm(`这将会永久删除该${this.focusTitle}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        //点击确认进入then
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
          if (res.meta.status != 200)
            return this.$message({
              showClose: true,
              message: res.meta.msg,
              type: 'error',
            })
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          this.getParamsData()
        })
        //点击取消进入catch
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除',
          })
        })
    },
    showInput(receiveData) {
      //展示动态添加标签
      receiveData.row.inputVisiable = true
      this.$nextTick((_) => {
        //this.$refs.saveTagInput获取到了el-input组件，$refs.input获取到了原生input节点
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm(receiveData) {
      //提交修改内容
      if (receiveData.row.inputValue.trim().length === 0) {
        //如果输入的内容在清空前后空格后，长度为空，则表示内容为空，不做任何操作return
        receiveData.row.inputValue = ''
        receiveData.row.inputVisiable = false
        return
      }
      receiveData.row.attr_vals.push(receiveData.row.inputValue)
      receiveData.row.inputValue = ''
      //进行添加tag操作
      this.saveAttrValuse(receiveData)
      receiveData.row.inputVisiable = false
    },
    //添加/删除tag请求函数
    async saveAttrValuse(receiveData) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${receiveData.row.attr_id}`,
        {
          attr_name: receiveData.row.attr_name,
          attr_sel: receiveData.row.attr_sel,
          attr_vals: receiveData.row.attr_vals.join(' '),
        }
      )
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      }
      this.$message({
        showClose: true,
        message: `修改tag成功`,
        type: 'success',
      })
    },
    //删除tag
    handleClose(i, receiveData) {
      receiveData.row.attr_vals.splice(i, 1)
      //进行删除tag操作
      this.saveAttrValuse(receiveData)
    },
  },
  computed: {
    isCascaderSelect() {
      //根据是否选择了三级分类，来控制按钮是否可用
      if (this.selectedKeys.length === 3) return true
      else return false
    },
    cateId() {
      //当前选中的三级分类的id
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    focusTitle() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
  },
  created() {
    this.getCateList()
  },
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0px;
}
.el-tag {
  margin: 0 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 200px;
  margin-left: 10px;
  vertical-align: bottom;
}
.no-data {
  margin: 15px;
}
</style>