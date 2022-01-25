module.exports = {
    chainWebpack: config => {
        //发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')
            //externals节点
            config.set("externals", {
                vue: 'Vue',
                'vue-router': "vueRouter",
                axios: 'axios1',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                "vue-quill-editor": 'vueQuillEditor',
                moment: 'moment'
            })
            //使用插件
            config.plugin('html').tap(args => {
                //添加参数isProd
                args[0].isProd = true
                return args
            })
        })
        //开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
            //使用插件
            config.plugin('html').tap(args => {
                //添加参数isProd
                args[0].isProd = false
                return args
            })
        })
    },
}