<template>
  <div>
    <!-- 面包屑高航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 步骤条 -->
      <el-steps :space="300" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息" icon="el-icon-tickets"></el-step>
        <el-step title="商品参数" icon="el-icon-edit"></el-step>
        <el-step title="商品属性" icon="el-icon-news"></el-step>
        <el-step title="商品图片" icon="el-icon-picture"></el-step>
        <el-step title="商品内容" icon="el-icon-document-remove"></el-step>
        <el-step title="完成" icon="el-icon-document-checked"></el-step>
      </el-steps>

      <!-- 表单区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
        <!-- tab栏区 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabChanged"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格(元)" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量(kg)" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单item项 -->
            <el-form-item
              class="checkbox"
              v-for="value in manyTableData"
              :key="value.attr_id"
              :label="value.attr_name + ':'"
            >
              <!-- 参数复选框组 -->
              <el-checkbox-group v-model="value.attr_vals">
                <el-checkbox
                  v-for="(item, index) in value.attr_checked"
                  :label="item"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              class="checkbox"
              v-for="value in this.onlyTableData"
              :label="value.attr_name + ':'"
              :key="value.attr_id"
            >
              <!-- 属性复选框组 -->
              <el-checkbox-group v-model="value.attr_vals">
                <el-checkbox
                  v-for="(item, index) in value.attr_checked"
                  :label="item"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headers"
              drag
              multiple
              list-type="picture"
              :on-success="handleSuccess"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <el-button type="primary" @click="add" class="btnAdd">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="this.previewPath" alt="预览图片" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        //商品图片数组
        pics: [],
        goods_introduce: '',
        attrs: [],
      },
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
      },
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      //动态参数列表
      manyTableData: [],
      //静态属性列表
      onlyTableData: [],
      //图片上传地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      //图片请求头配置对象
      headers: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      //图片预览url
      previewPath: '',
      previewDialogVisible: false,
    }
  },
  methods: {
    async getCateList() {
      //获取所有商品分类数据
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
      //级联选择器选中项变化触发函数
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      //清空属性、参数列表
      this.manyTableData = []
      this.onlyTableData = []
    },
    beforeTabLeave(activeName, oldActiveName) {
      //tab跳转之前的钩子函数
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        //return false 可以阻止标签页切换
        this.$message({
          showClose: true,
          message: '请先选择商品分类',
          type: 'warning',
        })
        return false
      }
    },
    async tabChanged() {
      //切换标签页时触发
      if (this.activeIndex === '1' && this.manyTableData.length === 0) {
        //访问商品参数标签页
        const { data: res } = await this.$http.get(`categories/${this.checkedId}/attributes`, {
          params: { sel: 'many' },
        })
        if (res.meta.status !== 200) {
          this.$message({
            showClose: true,
            message: res.meta.msg,
            type: 'error',
          })
        }
        res.data.forEach((item) => {
          item.attr_checked = item.attr_vals.length !== 0 ? item.attr_vals.split(' ') : []
          item.attr_vals = []
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2' && this.onlyTableData.length === 0) {
        //访问商品属性标签页
        const { data: res } = await this.$http.get(`categories/${this.checkedId}/attributes`, {
          params: { sel: 'only' },
        })
        if (res.meta.status !== 200) {
          this.$message({
            showClose: true,
            message: res.meta.msg,
            type: 'error',
          })
        }
        res.data.forEach((item) => {
          item.attr_checked = item.attr_vals.length !== 0 ? item.attr_vals.split(' ') : []
          item.attr_vals = []
        })
        this.onlyTableData = res.data
      }
    },
    handlePreview(file) {
      //图片预览函数
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    handleRemove(file) {
      //移除图片函数
      //1.获取移除图片的临时路径
      const filePath = file.response.data.tmp_path
      //2.从addForm.pics中找到对应图片对象的索引值
      const index = this.addForm.pics.findIndex((x) => x.pic === filePath)
      //调用splice方法移除对应图片对象
      this.addForm.pics.splice(index, 1)
    },
    handleSuccess(response) {
      //图片上传成功的钩子函数
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
    },
    add() {
      //添加商品函数
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请完整填写必要的表单项!')
        //执行添加逻辑
        //处理动态参数和静态属性
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addForm.attrs.push(newInfo)
        })
        //进行深拷贝
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')

        //发起添加商品请求
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          this.$message({
            showClose: true,
            message: res.meta.msg,
            type: 'error',
          })
        }
        this.$message({
          showClose: true,
          message: '商品添加成功!',
          type: 'success',
        })
        this.$router.push('/goods')
      })
    },
  },
  computed: {
    checkedId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
  },
  created() {
    this.getCateList()
  },
}
</script>

<style lang="less" scoped>
.el-form-item__label {
  font-size: 16px;
  padding: 0px 10px;
  text-align: left;
}

.checkbox {
  background-color: #fbf7ff;
  padding: 15px;
  padding-bottom: 13px;
  border-radius: 5px;

  .el-checkbox {
    margin: 0 10px;
  }
}

.el-upload {
  display: block;
  margin-left: 500px !important;
}

#pane-3 {
  border-radius: 7px;
  padding: 15px;
  background-color: #fbf7ff;
}

.el-dialog__body {
  display: flex;
  justify-content: center;
}

.btnAdd {
  margin-top: 15px;
}
</style>
