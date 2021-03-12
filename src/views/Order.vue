<template>
    <div class="order">
        <van-nav-bar
        title="我的订单"
        left-text="返回"
        left-arrow
        @click-left="back"
        />
        <Bg>
            <van-tabs 
            v-model="activeTabs" 
            swipeable 
            :line-height='2'
            color='#FE5021'
            title-active-color='#FE5021'
            title-inactive-color='#666'
            @change="changeOrderSta">
                <van-tab v-for='(item,index) in tabs' :key="index" :title="item.title">
                    <div class="tab_content">

                    <div v-if="orderData.length>0">
                        <div class="tb_box" v-for="(v1,i1) in orderData" :key="i1">
                            <Payitem :pro-info="v1.proInfo">
                                <template #paytitle>
                                    <div class="paytitle_box">
                                        <div class="pay_t">{{v1.oid}}</div>
                                        <div class="pay_s" v-if="v1.status === 2">
                                            <div class="pay_txt">已完成</div>
                                            <div class="pay_icon" @click="delOrder(v1.oid,i1)">
                                                <van-icon name='delete-o' />
                                            </div>
                                        </div>

                                        <div class="pay_s" v-if="v1.status === 1">
                                            <div class="pay_txt" @click="confirmOrder(v1,i1)">确认订单</div>
                                        </div>
                                    </div>
                                </template>
                                <template #proitem>
                                    <Proitem v-for="(v2,i2) in v1.data" :key='i2' :product='v2'></Proitem>
                                </template>
                            </Payitem>
                        </div>
                    </div>
                    <div v-else>
                        <van-empty description="没有该状态的订单" />
                    </div>

                    </div>
                </van-tab>
            </van-tabs>
        </Bg>
    </div>
</template>

<script>
    import '../assets/less/order.less'
    import Bg from '../components/Bg.vue'
    import Payitem from '../components/Payitem.vue'
    import Proitem from '../components/Proitem.vue'
    export default {
        name:'Order',
        data() {
            return {
                activeTabs:0,
                tabs:[
                    {
                        title:'全部',
                        status:0
                    },
                    {
                        title:'进行中',
                        status:1
                    },
                    {
                        title:'已完成',
                        status:2
                    }
                ],

                //订单数据
                orderData:[]
            }
        },
        created() {
            this.getOrderDate(0)
        },
        components:{
            Bg,
            Payitem,
            Proitem
        },
        methods: {
            back() {
                this.$router.go(-1);
            },

            //获取订单数据
            getOrderDate(status){
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
                    method: "GET",
                    url: "/findOrder",
                    params:{
                        appkey:this.appkey,
                        tokenString,
                        status
                    }
                })
                    .then((res) => {
                    // console.log(res)
                    this.$toast.clear();

                    if (res.data.code === 700) {
                        this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 3000,
                        });
                        return this.$router.push({ name: "Login" });
                    }

                    if (res.data.code === 70000) {

                        let products=[]

                        let oids=[]

                        
                        res.data.result.forEach(v=>{
                            v.small_img = v.smallImg
                            if(oids.indexOf(v.oid)=== -1){
                                let o = {
                                oid:v.oid,
                                status:v.status,
                                proInfo:{
                                    date:v.updatedAt,
                                    count:0,
                                    total:0
                                },
                                data:[]
                            };
                                oids.push(v.oid)
                                products.push(o)
                            }
                        })
                        
                        products.forEach(value=>{
                            res.data.result.forEach(item=>{
                                if(value.oid === item.oid){
                                    value.data.push(item)
                                    value.proInfo.count += item.count
                                    value.proInfo.total += item.count * item.price
                                }
                            })
                        })

                        this.orderData = products
                        console.log(this.orderData)
                    }else{
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

            //切换订单状态
            changeOrderSta(name,title){
                this.getOrderDate(name)
            },

            //确认订单
            confirmOrder(item,index){
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
                    method: "POST",
                    url: "/receive",
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        oid:item.oid
                    }
                })
                    .then((res) => {
                    // console.log(res)
                    this.$toast.clear();

                    if (res.data.code === 700) {
                        this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 3000,
                        });
                        return this.$router.push({ name: "Login" });
                    }

                    if (res.data.code === 80000) {

                        item.status = 2

                        if(this.activeTabs === 1){
                            //移除当前tab的订单数据
                            this.orderData.splice(index,1)
                        }
                    }
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });
                    
                    })
                    .catch((err) => {
                    this.$toast.clear();
                    console.log(err);
                    });
            },

            //删除订单
            delOrder(oid,index){
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
                    method: "POST",
                    url: "/removeOrder",
                    data: {
                    appkey: this.appkey,
                    tokenString,
                    oid
                    },
                })
                    .then((res) => {
                    // console.log(res);
                    this.$toast.clear();

                    if (res.data.code == 700) {
                        this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 3000,
                        });
                        return this.$router.push({ name: "Login" });
                    }

                    if (res.data.code === 90000) {
                        this.orderData.splice(index, 1);
                    }

                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 3000,
                    });
                    })
                    .catch((err) => {
                    this.$toast.clear();
                    console.log("err ==> ", err);
                    });
            }
        },
    }
</script>