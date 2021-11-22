<template>
    <div>
        <el-button type="danger" @click="logout">退出</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    methods: {
        logout() {
            sessionStorage.clear()
        },
    },
}
</script>

<style lang="less" scoped>
</style>