<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片式图 -->
    <el-card>
      <el-table :data="rightsList" style="width: 100%" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template v-slot="receivedDate">
            <el-tag effect="dark" v-if="receivedDate.row.level === '0'">一级</el-tag>
            <el-tag effect="dark" type="success" v-else-if="receivedDate.row.level === '2'">二级</el-tag>
            <el-tag effect="dark" type="info" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //权限列表
      rightsList: [],
    }
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200)
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      this.rightsList = res.data
    },
  },
  created() {
    this.getRightsList()
  },
}
</script>

<style lang="less" scoped>
</style>