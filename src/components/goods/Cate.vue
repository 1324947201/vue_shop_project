<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        border
        show-index
        index-text="#"
        :data="cateList"
        :columns="columns"
        :expand-type="false"
        :show-row-hover="false"
        :selection-type="false"
      >
        <!-- isOk模板列 -->
        <template v-slot:isOk="receivedData">
          <i
            v-if="!receivedData.row.cat_deleted"
            class="el-icon-success"
            style="color: rgb(134, 193, 125)"
          ></i>
          <i
            v-if="receivedData.row.cat_deleted"
            class="el-icon-error"
            style="color: rgb(247, 88, 116)"
          ></i>
        </template>

        <!-- 等级模板列 -->
        <template v-slot:order="receivedData">
          <el-tag v-if="receivedData.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="receivedData.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>

        <!-- opt模板列 -->
        <template v-slot:opt="receivedData">
          <el-button
            class="centrol-button"
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="showEditDialog(receivedData.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            class="centrol-button"
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="removeCateById(receivedData.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
        :page-size="queryInfo.pagesize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        background
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加分类"
      :visible.sync="addCatedailogVisiable"
      width="35%"
      @close="addDialogClose"
      @keyup.enter.native="addCate"
    >
      <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRulse" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- options指定数据源 -->
          <!-- props指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="props"
            :clearable="true"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedailogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editDialogVisiable"
      width="35%"
      @close="editDialogClose"
      @keyup.enter.native="editCate"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editCateFormRulse" label-width="80px">
        <el-form-item label="名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类数据列表，默认为空
      cateList: [],
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          width: '500px',
        },
        {
          label: '是否有效',
          //表示将当前列定义为模板列
          type: 'template',
          //对应模板列的名称
          template: 'isOk',
        },
        {
          label: '排序',
          //表示将当前列定义为模板列
          type: 'template',
          //对应模板列的名称
          template: 'order',
        },
        {
          label: '操作',
          //表示将当前列定义为模板列
          type: 'template',
          //对应模板列的名称
          template: 'opt',
        },
      ],
      addCatedailogVisiable: false,
      addCateForm: {
        //父级分类的id
        cat_pid: 0,
        //分类名称
        cat_name: '',
        //默认添加一级分类
        cat_level: 0,
      },
      addCateFormRulse: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      },
      //级联选择器数据源
      parentCateList: [],
      //级联选择器配置对象
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
      },
      //级联选择器被选中的父级分类的id
      selectedKeys: [],
      //编辑分类对话框
      editDialogVisiable: false,
      editForm: {
        cat_name: '',
        cat_id: 0,
      },
      editCateFormRulse: {
        cat_name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
      },
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      //监听pagesize的改变
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      //监听页码改变
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddDialog() {
      this.getParentCateList()
      this.addCatedailogVisiable = true
    },
    async getParentCateList() {
      //获取父级分类的数据列表
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200)
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      this.parentCateList = res.data
    },
    parentCateChange() {
      //选择项变化触发该函数
      if (this.selectedKeys.length > 0) {
        //父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        //为当前分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        //为当前分类等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    addCate() {
      //点击添加新分类
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201)
          return this.$message({
            showClose: true,
            message: res.meta.msg,
            type: 'error',
          })
      })
      this.addCatedailogVisiable = false
      this.getCateList()
      return this.$message({
        showClose: true,
        message: '添加分类成功',
        type: 'success',
      })
    },
    addDialogClose() {
      this.cat_name = ''
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.selectedKeys = []
      this.$refs.addCateFormRef.resetFields()
    },
    async showEditDialog(id) {
      //展示编辑对话框
      const { data: res } = await this.$http.get(`categories/${id}`)
      if (res.meta.status !== 200)
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      this.editForm.cat_name = res.data.cat_name
      this.editForm.cat_id = id
      this.editDialogVisiable = true
    },
    async editCate() {
      //编辑提交分类
      const { data: res } = await this.$http.put(`categories/${this.editForm.cat_id}`, {
        cat_name: this.editForm.cat_name,
      })
      if (res.meta.status !== 200)
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      this.editDialogVisiable = false
      this.getCateList()
      return this.$message({
        showClose: true,
        message: '编辑分类成功',
        type: 'success',
      })
    },
    editDialogClose() {
      this.editForm.cat_name = ''
      this.editForm.cat_id = 0
      this.$refs.editFormRef.resetFields()
    },
    async removeCateById(id) {
      //删除分类
      await this.$confirm('这将会永久删除分类，是否继续？', '确认信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }) //点击确认后进入then
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${id}`)
          if (res.meta.status != 200)
            return this.$message({
              showClose: true,
              message: res.meta.msg,
              type: 'error',
            })
          this.$message({
            showClose: true,
            message: '分类信息成功',
            type: 'success',
          })
          this.getCateList()
        })
        //点击取消后进入catch
        .catch((err) => {
          this.$message('取消删除')
        })
    },
  },
  created() {
    this.getCateList()
  },
}
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 20px;
  font-size: 16px;
}

.el-cascader {
  width: 100%;
}
</style>