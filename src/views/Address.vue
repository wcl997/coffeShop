<template>
  <div class="address">
    <van-nav-bar
      :title="aid?'编辑地址':'新增地址'"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <Bg>
      <van-address-edit
        :area-list="areaList"
        show-postal
        :show-delete="!!aid"
        show-set-default
        show-search-result
        :detail-maxlength="30"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        :address-info="originAdsInfo"
        @save="save"
        @delete='removeAddress'
      />
    </Bg>
  </div>
</template>

<script>
import "../assets/less/address.less";
import Bg from "../components/Bg.vue";
import areaList from "../assets/js/area";
export default {
  name: "Address",
  data() {
    return {
      //省市区数据
      areaList,
      //编辑地址的aid
      aid:"",
      //编辑地址初始值
      originAdsInfo:{}
    };
  },
  components: {
    Bg,
  },
  created() {
    this.aid = this.$route.params.aid

    this.gotAdsDateAid()
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    //保存地址
    save(value) {
      if(this.aid){
        this.edit(value)
      }else{
        this.newadd(value)
      }
    },
    edit(value){

      let isEd =false

      for(let k in this.originAdsInfo){
        if(this.originAdsInfo[k]!==value[k]){
          isEd = true;
          break;
        }
      }

      if(isEd){

      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
      }

      let ads = {}
        ads.aid = this.aid
        ads.name = value.name
        ads.tel = value.tel
        ads.province = value.province
        ads.city = value.city
        ads.county = value.county
        ads.addressDetail = value.addressDetail
        ads.areaCode = value.areaCode
        ads.postalCode = value.postalCode
        ads.isDefault = Number(value.isDefault) 
        console.log(ads)

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/editAddress",
        data:{
          appkey:this.appkey,
          tokenString,
          ...ads
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

          if (res.data.code === 30000) {
            this.$router.push({name:'AddressList'});
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


        
      }else{
        this.$router.push({name:'AddressList'});
      }
    },
    newadd(value){
      console.log(value)
      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
      }

      let data = {
        ...value,
        tokenString,
        appkey: this.appkey,
      };

      data.isDefault = Number(data.isDefault);

      delete data.country;

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/addAddress",
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

          if (res.data.code === 9000) {
            this.$router.push({name:'AddressList'});
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

    //根据aid获取地址数据
    gotAdsDateAid(){
      if(!this.aid){
        return
      }

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
        url: "/findAddressByAid",
        params:{
          appkey:this.appkey,
          tokenString,
          aid:this.aid
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

          if (res.data.code === 40000) {
            // res.data.result.forEach(v=>{
            //   //转布尔值 =>  !! = Boolean()
            //   v.isDefault = !!v.isDefault
            // })
            let data = res.data.result[0];
            data.isDefault = !!data.isDefault

            this.originAdsInfo = data
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

    //删除地址
    removeAddress(value){

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
        url: "/deleteAddress",
        data:{
          tokenString,
          appkey: this.appkey,
          aid:value.aid
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

          if (res.data.code === 10000) {
            this.$router.push({name:'AddressList'});
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
    }
  },
};
</script>