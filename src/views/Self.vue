<template>
    <div class="self">
        <van-nav-bar
        title="个人资料"
        left-text="返回"
        left-arrow
        @click-left="back"
        />
        <Bg>
            <van-cell title="头像">
                <template #right-icon>
                    <div class="my_images">
                        <img class="auto-img" :src="userInfo.userImg">
                    </div>
                </template>
            </van-cell>
            <van-cell title="用户id" :value="userInfo.userId" />
            <van-cell title="昵称" :value="userInfo.nickName" />
            <van-cell title="简介" :value="userInfo.desc" />
        </Bg>
    </div>
</template>

<script>
    import '../assets/less/self.less'
    import Bg from '../components/Bg.vue'
    export default {
        name:'Self',
        components:{
            Bg
        },
        data() {
            return {
                userInfo:{}
            }
        },
        created() {
            this.getSelf()
        },
        methods: {
            back() {
                this.$router.back(-1);
            },
            getSelf(){
                let tokenString = this.$cookies.get("tokenString");

                if (!tokenString) {
                    console.log("浏览器token不存在");
                    return this.$router.push({ name: "Login" });
                }

                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    //请求方式
                    method: "GET",
                    url:"/findAccountInfo",
                    params: {
                        appkey: this.appkey,
                        tokenString,
                    },
                })
                    .then((res) => {
                      console.log(res);
                    this.$toast.clear();

                    if (res.data.code == 700) {
                        this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 3000,
                        });
                        return this.$router.push({ name: "Login" });
                    }

                    if (res.data.code === "B001") {
                        this.userInfo = res.data.result[0]
                        console.log(this.userInfo)
                    } else {
                        this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 3000,
                        });
                    }
                    })
                    .catch((err) => {
                    this.$toast.clear();
                    console.log("err ==> ", err);
                    });
            }
        },
    }
</script>
