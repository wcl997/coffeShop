<template>
  <div class="address_list">
    <van-nav-bar
      title="地址管理"
      left-text="返回"
      left-arrow
      @click-left="back"
      @add='add'
    />
    <Bg>
      <van-address-list
        :list="list"
        default-tag-text="默认"
        :switchable = false
        @add='add'
        @edit='edit'
      />
    </Bg>
  </div>
</template>

<script>
import "../assets/less/addresslist.less";
import Bg from "../components/Bg.vue";
export default {
  name: "AddressList",
  components: {
    Bg,
  },
  created(){
    this.getAddlistData();
  },
  data() {
    return {
      //地址列表数据
      list: [],
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    add(){
      this.$router.push({name:'Address'})
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
    //编辑
    edit(aid){
      this.$router.push({name:'Address',params:{aid}})
    },
  },
};
</script>