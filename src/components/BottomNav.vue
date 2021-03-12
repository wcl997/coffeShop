<template>
  <div class="BottomNav">
    <van-tabbar
      v-model="active"
      active-color="#FE5021"
      inactive-color="#000"
      route
    >
      <van-tabbar-item icon="home-o" to="/"> 首页 </van-tabbar-item>
      <van-tabbar-item icon="bag-o" to="/menu"> 菜单 </van-tabbar-item>
      <van-tabbar-item
        icon="shopping-cart-o"
        to="/shoppingcar"
        :badge="badges > 0 ? badges : ''"
      >
        购物车
      </van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/me"> 我的 </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState,mapMutations } from "vuex";
export default {
  name: "BottomNav",
  data() {
    return {
      active: "",
      badges: this.shopCarcount,
    };
  },
  created(){
      this.getShopcarCount();
  },
  computed: {
    ...mapState(["shopCarcount"]),
  },
  methods: {

    ...mapMutations(['changeShopcarCount']),
    //获取购物车的数目(不是商品总数量)
    getShopcarCount() {
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        console.log("浏览器token不存在");
        return;
      }
      // console.log(tokenString)
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/shopcartRows",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          // console.log(res)
          this.$toast.clear();

          //没有登录
          if (res.data.code === 700) {
            return;
          }

          if (res.data.code === 8000) {
            this.changeShopcarCount(res.data.result)
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },

  },
};
</script>

<style lang="less" scoped>
a {
  color: black;
}
</style>