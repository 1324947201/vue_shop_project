<template>
  <div>
    <!-- 面包屑高航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入关键字"
            clearable
            v-model="queryInfo.query"
            @clear="getGoodsList"
            @keyup.native.enter="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="商品名称" prop="goods_name"> </el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="120px"> </el-table-column>
        <el-table-column label="商品重量(kg)" prop="goods_weight" width="120px"> </el-table-column>
        <el-table-column label="商品创建时间" width="220px" v-slot="receiveData">
          <template>
            {{ receiveData.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px" v-slot="receiveData">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="getEditData(receiveData.row.goods_id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeGood(receiveData.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑商品信息"
      :visible.sync="editDialogVisiable"
      width="50%"
      @keyup.enter.native="editGoods"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRulse">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格(元)" prop="goods_price">
          <el-input v-model="editForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量(kg)" prop="goods_weight">
          <el-input v-model="editForm.goods_weight" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editForm.goods_number" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //请求列表的相关参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 11,
      },
      //获取到的商品列表
      goodsList: [],
      //总数据条数
      total: 0,
      editForm: {},
      editFormRulse: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
      },
      editDialogVisiable: false,
    }
  },
  methods: {
    async getGoodsList() {
      //根据分页数据获取列表
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      //pagesize更改时触发函数
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      //pagenum更改时触发函数
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    removeGood(id) {
      //根据id删除商品
      this.$confirm(`这将会永久删除该商品, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        //点击确认进入then
        .then(async () => {
          const { data: res } = await this.$http.delete(`goods/${id}`)
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
          this.getGoodsList()
        })
        //点击取消进入catch
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除',
          })
        })
    },
    goAddPage() {
      //点击添加按钮跳转到添加商品界面
      this.$router.push('/goods/add')
    },
    async getEditData(id) {
      //获取商品信息
      const { data: res } = await this.$http.get(`goods/${id}`)
      if (res.meta.status != 200)
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      this.editForm = res.data
      this.editDialogVisiable = true
    },
    editGoods(id) {
      //提交编辑商品
      this.$refs.editFormRef.validate(async (valid) => {
        const { data: res } = await this.$http.put(`goods/${this.editForm.goods_id}`, this.editForm)
        if (res.meta.status != 200)
          return this.$message({
            showClose: true,
            message: res.meta.msg,
            type: 'error',
          })
        this.$message({
          showClose: true,
          message: '编辑成功',
          type: 'success',
        })
        this.editDialogVisiable = false
        this.getGoodsList()
      })
    },
  },
  created() {
    this.getGoodsList()
  },
}
</script>

<style lang='less' scoped>
</style>