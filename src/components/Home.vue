<template>
  <el-container id="homePage">
    <!-- 头部区域 -->
    <el-header>
      <div class="header-link">
        <img src="../assets/image/avatar.png" alt="logo" />
        <span>在线交易后台管理系统</span>
      </div>
      <el-button type="info" @click="logout" round>退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="elMenuWidth">
        <div ref="toggleButton" id="toggle-button" class="el-icon-s-fold" @click="toggleCollapse"></div>
        <el-menu
          background-color="#242839"
          text-color="#9ea3a8"
          active-text-color="#7e57c2"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
          @select="handleSelect"
        >
          <!-- 一级菜单 -->
          <el-submenu v-for="item in menuList" :key="item.id" :index="item.id + ''">
            <template slot="title">
              <!-- 图标 文字-->
              <i :class="icons[item.id]"></i>
              <span class="title">{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="subitem in item.children"
              :key="subitem.id"
              :index="'/' + subitem.path"
              @click="saveNavState('/' + subitem.path)"
            >
              <template slot="title">
                <!-- 图标 文字-->
                <i class="el-icon-s-grid"></i>
                <span class="title">{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容 -->
      <el-main ref="elMainRef" :class="classStr">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      icons: {
        125: 'el-icon-user-solid',
        103: 'el-icon-menu',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data',
      },
      isCollapse: true,
      elMenuWidth: '64px',
      classStr: 'elMain-padding-none',
    }
  },
  computed: {
    activePath() {
      //获取sessionStorage中的activePath
      return sessionStorage.getItem('activePath')
    },
  },
  methods: {
    logout() {
      //登出函数
      sessionStorage.clear()
      this.$router.push('/')
      this.$message({
        //登陆成功弹窗
        showClose: true,
        message: '退出成功',
        type: 'success',
      })
    },
    async getMenuList() {
      //获取左侧菜单内容
      const { data: res } = await this.$http.get('menus')
      //获取失败处理
      if (res.meta.status !== 200)
        return this.$message({
          showClose: true,
          message: res.meta.msg,
          type: 'error',
        })
      //获取成功处理
      this.menuList = res.data
    },
    toggleCollapse() {
      //侧边栏的折叠和展开
      this.isCollapse = !this.isCollapse
      // this.elMenuWidth = this.isCollapse ? '64px' : '220px'
      if (this.isCollapse) {
        this.elMenuWidth = '64px'
        this.$refs.toggleButton.setAttribute('class', 'el-icon-s-unfold')
      } else {
        this.elMenuWidth = '220px'
        this.$refs.toggleButton.setAttribute('class', 'el-icon-s-fold')
      }
    },
    handleSelect() {
      //导航栏发生切换时，修改el-main的padding
      this.classStr = 'elMain-padding-normal'
    },
    saveNavState(activePath) {
      //保存链接的激活状态
      sessionStorage.setItem('activePath', activePath)
    },
  },
  created() {
    this.getMenuList()
  },
}
</script>

<style lang="less" scoped>
.elMain-padding-none {
  padding: 0;
}

.elMain-padding-normal {
  padding: 20;
}

.el-container {
  height: 100%;
  background-color: #e9edf0;

  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    background-color: #25293a;

    .header-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      cursor: default;

      img {
        height: 45px;
        border-radius: 50%;
        border: 2px solid #7e57c2;
      }

      span {
        margin-left: 10px;
        color: #7e57c2;
        font-size: 30px;
        font-weight: 500;
        -webkit-box-reflect: below 1px linear-gradient(transparent, rgba(0, 0, 0, 0.8));
        line-height: 0.7em;
        animation: light 5s 1 forwards;
      }
    }
  }
  .el-aside {
    border-top: 0.5px solid #3a3b3d;
    background-color: #242839;
    transition: all 200ms ease;

    #toggle-button {
      width: 100%;
      height: 30px;
      font-size: 24px;
      text-align: center;
      line-height: 30px;
      color: #9ea3a8;
      background-color: #404764;
      cursor: pointer;
    }

    .el-menu {
      border-right: none;

      .title {
        font-size: 20px;
      }
    }
  }
}
@keyframes light {
  0%,
  18%,
  20%,
  50.1%,
  60%,
  65.1%,
  80%,
  90.1%,
  92% {
    color: #0e3742;
  }

  18.1%,
  20.1%,
  50.1%,
  60%,
  65.1%,
  80%,
  90.1%,
  100% {
    border-color: #fff;
    color: #fff;
    text-shadow: 0 0 10px #a057c2, 0 0 20px #a057c2, 0 0 30px #a057c2, 0 0 80px #a057c2,
      0 0 160px #a057c2;
  }
}
</style>