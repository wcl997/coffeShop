<template>
  <div class="main">
    <div>
      <router-view></router-view>
    </div>

    <!-- <BottomNav /> -->

    <van-tabbar
      v-model="activeIndex"
      active-color="#CD585E"
      inactive-color="#646566"
      route
    >
      <van-tabbar-item
        v-for="(item, index) in tabbarData"
        :key="index"
        :badge="item.badge > 0 ? item.badge : ''"
        :dot="item.dot"
        :to="item.to"
      >
        <span>{{ item.title }}</span>
        <template #icon="props">
          <img :src="props.active ? item.icon.active : item.icon.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
// import BottomNav from '../components/BottomNav'
import { mapState, mapMutations } from "vuex";

export default {
  name: "Main",
  components: {
    //  BottomNav
  },
  data() {
    return {
      activeIndex: 0,
    };
  },
  created() {
    this.getShopcarCount();
  },
  computed: {
    ...mapState(["shopCarcount","shopSign"]),

    tabbarData() {
      return [
        {
          title: "首页",
          icon: {
            active: require("../assets/images/atms.png"),
            inactive: require("../assets/images/atm.png"),
          },
          to: "/",
        },
        {
          title: "菜单",
          icon: {
            active: require("../assets/images/c2a.png"),
            inactive: require("../assets/images/c2.png"),
          },
          to: "/menu",
        },
        {
          title: "购物车",
          icon: {
            active: require("../assets/images/gwca.png"),
            inactive: require("../assets/images/gwc.png"),
          },
          badge: this.shopCarcount,
          to: "/shoppingcar",
        },
        {
          title: "我的",
          icon: {
            active: require("../assets/images/wodea.png"),
            inactive: require("../assets/images/wode.png"),
          },
          dot: false,
          to: "/me",
        },
      ];
    },
  },
  methods: {
    ...mapMutations(['changeShopcarCount','changeshopSign']),
    
    //获取购物车的数目(不是商品总数量)
    getShopcarCount() {

      if( this.shopSign ){
        console.log('已加载过购物车数量,请勿再请求')
        return
      }

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
            this.changeShopcarCount(res.data.result);

            this.changeshopSign(true)
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
  
</style>