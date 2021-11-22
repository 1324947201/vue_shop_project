<template>
    <div id="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/image/avatar_image.png" alt="logo" />
            </div>
            <!-- 表单区域 -->
            <el-form
                ref="loginFormRef"
                :model="loginForm"
                :rules="rules"
                class="login_form"
                label-width="80px"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input
                        v-model="loginForm.username"
                        prefix-icon="el-icon-user-solid"
                    ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        type="password"
                        v-model="loginForm.password"
                        prefix-icon="el-icon-lock"
                        @keyup.enter.native="login"
                    ></el-input>
                </el-form-item>
                <el-form-item class="login_button">
                    <el-button type="primary" @click="login">登陆</el-button>
                    <el-button @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            loginForm: {
                username: 'admin',
                password: '123456',
            },
            rules: {
                username: [
                    {
                        message: '请输入用户名',
                        trigger: 'blur',
                    },
                    {
                        min: 3,
                        max: 12,
                        message: '长度在 3 到 12 个字符',
                        trigger: 'blur',
                    },
                ],
                password: [
                    {
                        message: '请输入密码',
                        trigger: 'blur',
                    },
                    {
                        min: 6,
                        max: 16,
                        message: '长度在 6 到 16 个字符',
                        trigger: 'blur',
                    },
                ],
            },
        }
    },

    methods: {
        resetLoginForm() {
            //重置表单
            this.$refs.loginFormRef.resetFields()
        },
        login() {
            //登陆
            this.$refs.loginFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: res } = await this.$http.post(
                    '/login',
                    this.loginForm
                )
                if (res.meta.status !== 200)
                    return this.$message({
                        //登陆成功弹窗
                        showClose: true,
                        message: '用户名或密码错误，登陆失败',
                        type: 'error',
                    })
                this.$message({
                    //登陆失败弹窗
                    showClose: true,
                    message: '登陆成功',
                    type: 'success',
                })
                sessionStorage.setItem('token', res.data.token) //向sessionStorage中存入token
                this.$router.push('/home') //路由跳转
            })
        },
    },
    mounted() {
        // 背景粒子特效
        !(function () {
            function n(n, e, t) {
                return n.getAttribute(e) || t
            }

            function e(n) {
                return document.getElementsByTagName(n)
            }

            function t() {
                var t = e('script'),
                    o = t.length,
                    i = t[o - 1]
                return {
                    l: o,
                    z: n(i, 'zIndex', 0),
                    o: n(i, 'opacity', 0.7),
                    c: n(i, 'color', '255,255,255'),
                    n: n(i, 'count', 150),
                }
            }

            function o() {
                ;(a = m.width =
                    window.innerWidth ||
                    document.documentElement.clientWidth ||
                    document.body.clientWidth),
                    (c = m.height =
                        window.innerHeight ||
                        document.documentElement.clientHeight ||
                        document.body.clientHeight)
            }

            function i() {
                r.clearRect(0, 0, a, c)
                var n, e, t, o, m, l
                s.forEach(function (i, x) {
                    for (
                        i.x += i.xa,
                            i.y += i.ya,
                            i.xa *= i.x > a || i.x < 0 ? -1 : 1,
                            i.ya *= i.y > c || i.y < 0 ? -1 : 1,
                            r.fillRect(i.x - 0.5, i.y - 0.5, 1, 1),
                            e = x + 1;
                        e < u.length;
                        e++
                    )
                        (n = u[e]),
                            null !== n.x &&
                                null !== n.y &&
                                ((o = i.x - n.x),
                                (m = i.y - n.y),
                                (l = o * o + m * m),
                                l < n.max &&
                                    (n === y &&
                                        l >= n.max / 2 &&
                                        ((i.x -= 0.03 * o), (i.y -= 0.03 * m)),
                                    (t = (n.max - l) / n.max),
                                    r.beginPath(),
                                    (r.lineWidth = t / 2),
                                    (r.strokeStyle =
                                        'rgba(' + d.c + ',' + (t + 0.2) + ')'),
                                    r.moveTo(i.x, i.y),
                                    r.lineTo(n.x, n.y),
                                    r.stroke()))
                }),
                    x(i)
            }
            var a,
                c,
                u,
                m = document.createElement('canvas'),
                d = t(),
                l = 'c_n' + d.l,
                r = m.getContext('2d'),
                x =
                    window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function (n) {
                        window.setTimeout(n, 1e3 / 45)
                    },
                w = Math.random,
                y = {
                    x: null,
                    y: null,
                    max: 2e4,
                }
            m.id = l
            m.style.cssText =
                'position:fixed;top:0;left:0;z-index:' + d.z + ';opacity:' + d.o
            document.getElementById('login_container').appendChild(m),
                o(),
                (window.onresize = o),
                (window.onmousemove = function (n) {
                    ;(n = n || window.event),
                        (y.x = n.clientX),
                        (y.y = n.clientY)
                }),
                (window.onmouseout = function () {
                    ;(y.x = null), (y.y = null)
                })
            for (var s = [], f = 0; d.n > f; f++) {
                var h = w() * a,
                    g = w() * c,
                    v = 2 * w() - 1,
                    p = 2 * w() - 1
                s.push({
                    x: h,
                    y: g,
                    xa: v,
                    ya: p,
                    max: 6e3,
                })
            }
            ;(u = s.concat([y])),
                setTimeout(function () {
                    i()
                }, 100)
        })()
    },
    beforeDestroy() {
        console.log('help!!!')
    },
}
</script>

<style lang="less" scoped>
#login_container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: radial-gradient(
        farthest-side at 50% 100%,
        #137c7e,
        #2b4b6b
    );
    height: 100%;

    .login_box {
        position: relative;
        z-index: 1;
        width: 600px;
        height: 350px;
        background-color: #fff;
        border-radius: 10px;

        .avatar_box {
            position: absolute;
            left: 300px;
            top: -85px;
            transform: translate(-50%);
            padding: 1px;
            width: 150px;
            height: 150px;
            background-color: #fff;
            border: 2px solid #eee;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

            img {
                height: 100%;
                width: 100%;
                border-radius: 50%;
            }
        }

        .login_form {
            box-sizing: border-box;
            position: absolute;
            top: 130px;
            padding: 0 40px 0 0;
            width: 100%;
        }

        .login_button {
            float: right;
        }
    }
}
</style>