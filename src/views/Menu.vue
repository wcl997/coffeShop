<template>
    <div class="menu">
        <van-search v-model="Svalue" placeholder="请输入搜索关键词" @input='getsearch' />
        <van-popup v-model="show">
            <div class="plate">
                <ul class="theul">
                    <comDetail class="theitem w" v-for="(v,i) in searchdetail" :key="i" :item='v' :id='v.id'></comDetail>
                </ul>
            </div>
        </van-popup>

        <van-tabs 
        animated
        v-model="active"
        @change="changedetail">
            <van-tab v-for="(item,index) in menus" :key="index" :title="item.title">
                <div class="plate">
                    <ul class="theul">
                        <ComItem class="theitem" v-for="(v,i) in details" :key="i" :item='v' :id='v.id'></ComItem>
                    </ul>
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
    import ComItem from "../components/Commodityitem";
    import comDetail from '../components/comitem.vue'
    import '../assets/less/menu.less'
    export default {
        name:'Menu',
        data() {
            return {
                Svalue:'',
                menus:[
                    {title:'推荐',key:'isHot',value:'1'},
                    {title:'拿铁',key:'type',value:"latte"},
                    {title:'咖啡',key:'type',value:"coffee"},
                    {title:"瑞纳冰",key:'type',value:"rena_ice"},
                ],
                details:[],
                active:0,
                show:false,
                searchdetail:[]
            }
        },
        components:{
            ComItem,
            comDetail
        },
        created() {
            this.getmenu('isHot','1')
        },
        methods: {
            //切换标签
            changedetail(name){
                console.log(name)
                this.getmenu(this.menus[name].key,this.menus[name].value)
            },
            //获取菜单
            getmenu(key,value) {
            this.$toast.loading({
                message: "加载中...",
                forbidClick: true,
                duration: 0,
            });

            this.axios({
                method: "GET",
                url: "/typeProducts",
                params: {
                appkey: this.appkey,
                key,
                value,
                },
            })
                .then((res) => {
                console.log(res)
                this.$toast.clear();

                if (res.data.code === 500) {
                    this.details = res.data.result
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
            //搜索商品
            getsearch(value){

                this.$toast.loading({
                message: "加载中...",
                forbidClick: true,
                duration: 0,
            });

            this.axios({
                method: "GET",
                url: "/search",
                params: {
                appkey: this.appkey,
                name:value
                },
            })
                .then((res) => {
                console.log(res)
                this.$toast.clear();

                if (res.data.code === "Q001") {
                    
                    this.searchdetail = res.data.result 
                    if(this.Svalue!=""){
                        this.show = true
                    }else{
                        this.show = false
                    }
                    
                    
                
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
            }
        },
    }
</script>

<style lang="less" scoped>

</style>