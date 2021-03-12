<template>
    <div class="alike">
        <van-nav-bar
        title="我的收藏"
        left-text="返回"
        left-arrow
        @click-left="back"
        />
        <Bg>
            <ul class="theul">
                <ComItem class="theitem w" v-for="(v,i) in likedetl" :key="i" :item='v' :id='v.id'>
                </ComItem>
            </ul>
        </Bg>
    </div>
</template>

<script>
    import '../assets/less/alike.less'
    import Bg from '../components/Bg.vue'
    import ComItem from '../components/comitem.vue'
    export default {
        name:'Allike',
        data() {
            return {
                likedetl:[]
            }
        },
        components:{
            Bg,
            ComItem
        },
        created() {
            this.getAlike()
        },
        methods: {
            back() {
                this.$router.back(-1);
            },

            getAlike(){
                let tokenString = this.$cookies.get("tokenString");
                if (!tokenString) {
                    console.log("浏览器token不存在");
                    return this.$router.push({ name: "Login" });
                }
                // console.log(tokenString)
                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    method: "GET",
                    url: "/findAllLike",
                    params: {
                    appkey: this.appkey,
                    tokenString,
                    },
                })
                    .then((res) => {
                    console.log(res)
                    this.$toast.clear();

                    if (res.data.code === 700) {
                        this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 3000,
                        });
                        return this.$router.push({ name: "Login" });
                    }

                    if (res.data.code === 2000) {
                        this.likedetl = res.data.result;
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
                    console.log(err);
                    });
            },

            
        },
    }
</script>

<style lang="less" scoped>

</style>