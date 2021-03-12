<template>
    <div class="pay">
        <van-nav-bar
        title="结算"
        left-text="返回"
        left-arrow
        @click-left="back"
        />
        <div class="pay_box">
            <div class="selBox">
                <div class="select">
                    <div class="sel_ads" @click="showAdsList">选择地址</div>
                    <van-icon name="arrow" />
                </div>
                <div class="ads_box" v-if="currentAds.aid">
                    <div class="userinfo">
                        <div class="username">{{currentAds.name}}</div>
                        <div class="userphone">{{currentAds.tel}}</div>
                        <div class="userdefault" v-if="currentAds.isDefault">默认</div>
                    </div>
                    <div class="ads_detail">{{currentAds.address}}</div>
                </div>
            </div>

            <div class="pay_info">
                <Payitem :pro-info="proInfo">
                    <template #proitem>
                        <Proitem v-for="(item,index) in payShopData" :key='index'
                        :product='item'></Proitem>
                    </template>
                </Payitem>
            </div>
        </div>

        <van-popup 
        v-model="show" 
        position="bottom"
        closeable>
            <div class="ads_boxing">
                <van-address-list
                    v-model="chosenAddressId"
                    :list="list"
                    default-tag-text="默认"
                    @add='add'
                    @select="selAds"
                    />
            </div>
        </van-popup>

        <div class="p-btn">
            <van-button 
            color="#EB891A" 
            block 
            round
            @click='pay'>立即结算</van-button>
        </div>
    </div>
</template>

<script>
    import '../assets/less/pay.less'
    import Payitem from '../components/Payitem.vue'
    import Proitem from '../components/Proitem.vue'
    import {mapState,mapMutations} from 'vuex'
    export default {
        name:'Pay',
        data() {
            return {
                show:false,
                chosenAddressId: '',
                list: [],

                //当前地址信息
                currentAds:{},
                
                //购物车sids集合
                sids:[],

                //需要购买的购物车商品数据
                payShopData:[],

                //商品总数量和总价
                proInfo:{
                    count:0,
                    total:0
                }
            }
        },
        components:{
            Payitem,
            Proitem
        },
        created() {
            this.sids = this.$route.query.sids.split('-');




            this.getAddlistData()
            this.getShopcDate()
        },
        computed:{
            ...mapState(['shopCarcount'])
        },
        methods: {
            ...mapMutations(['changeShopcarCount']),
            back(){
                this.$router.go(-1)
            },
            //显示选择地址列表
            showAdsList(){
                this.show = true
            },

            //跳转到新增地址页面
            add(){
                this.$router.push({name:'Address'})
            },
            //选择地址
            selAds(item){
                this.chosenAddressId = item.id
                this.currentAds = {...item}
                this.show=false
            },

            //查询用户地址列表信息
            getAddlistData(){
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
                url: "/findAddress",
                params:{
                appkey:this.appkey,
                tokenString
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

                if (res.data.code === 20000) {
                    res.data.result.forEach(v=>{
                    v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`
                    v.isDefault = !!v.isDefault
                    if(v.isDefault){
                        this.chosenAddressId = v.id
                        this.currentAds = {...v}
                    }
                    })
                    
                    this.list = res.data.result
        
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

            //获取购物车订单结算的商品数据
            getShopcDate(){
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
                url: "/commitShopcart",
                params:{
                    appkey:this.appkey,
                    tokenString,
                    sids:JSON.stringify(this.sids)
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

                if (res.data.code === 50000) {

                    if(res.data.result.length===0){
                        return this.$router.push({path:'/'})
                    }

                    res.data.result.forEach(v=>{
                        this.proInfo.count += v.count
                        this.proInfo.total += v.count * v.price
                    })

                    this.payShopData = res.data.result

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

            //结算订单
            pay(){
                if(!this.currentAds.aid){
                    return this.$toast({
                        message: "选择收货地址",
                        forbidClick: true,
                        duration: 2000,
                    });
                }

                let tokenString = this.$cookies.get("tokenString");

                if (!tokenString) {
                    console.log("浏览器token不存在");
                    return this.$router.push({ name: "Login" });
                }

                let data = {
                    appkey:this.appkey,
                    tokenString,
                    sids:JSON.stringify(this.sids),
                    phone:this.currentAds.tel,
                    address:this.currentAds.address,
                    receiver:this.currentAds.name
                };

                this.axios({
                method: "POST",
                url: "/pay",
                data
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

                if (res.data.code === 60000) {

                    //修改vuex购物袋数量
                    this.changeShopcarCount(this.shopCarcount - this.sids.length)
                    this.$router.push({name:'Order'})

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
                
            }
        },
    }
</script>