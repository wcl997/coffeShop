<template>
  <div class="home">
    <!-- <Topnav /> -->
    <van-swipe @change="changeIndex" :autoplay="3000"> 
        <van-swipe-item v-for="(item,index) in bannerDate" :key="index">
          <img class="auto-img" :src="item.bannerImg" alt="" @click="getviewProduct(item.pid)"/>
        </van-swipe-item>

        <template #indicator>
          <div class="indicator-box">
            <div :class="['indicator-item', { active: current === i }]" v-for="(v,i) in bannerDate.length" :key="i"></div>
          </div>
        </template>
      </van-swipe>
    <div class="plate">
      

      <div class="hotRecommend">
        <div class="hot-title">
          <span>热门推荐</span>
        </div>
      </div>

      <ul class="hotcom">
        <ComItem
          v-for="(item, index) in this.hotProducts"
          class="h_items"
          :key="index"
          :item="item"
          :id="item.id"
        ></ComItem>
      </ul>
    </div>
  </div>
</template>

<script>
// import Topnav from "../components/Topnav";
import ComItem from "../components/Commodityitem";
export default {
  name: "Home",
  components: {
    // Topnav,
    ComItem,
  },
  data() {
    return {
      bannerDate: [],
      hotProducts: [],
      current: 0,
    };
  },

  created() {
    this.getbanners();
    this.getHotproducts();
  },
  methods: {
    //切换轮播图
    changeIndex(index) {
      this.current = index;
    },
    getbanners() {
      this.$toast.loading({
        duration: 3000,
        forbidClick: true,
        message: "加载中...",
      });

      this.axios({
        method: "GET",
        url: "/banner",
        params: {
          appkey: this.appkey,
        },
      })
        .then((res) => {
          this.$toast.clear();
          if (res.data.code === 300) {
            this.bannerDate = res.data.result;
          } else {
            this.$toast({
              duration: 3000,
              forbidClick: true,
              message: res.data.result,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    getHotproducts() {
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
          key: "isHot",
          value: 1,
        },
      })
        .then((res) => {
          // console.log(res)
          this.$toast.clear();

          if (res.data.code === 500) {
            this.hotProducts = res.data.result;
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
    //查看商品详情
    getviewProduct(id) {
      this.$router.push({ name: "Detail", params: { id } });
    },
  },
};
</script>

<style lang='less' scoped>
body{
  background-color: #e8e8e8 !important;
}
.plate {
  background-color: #fff;
  .my-swipe {
    height: 100%;
    width: 350px;
    border-radius: 10px;
    overflow: hidden;
  }
  width: 350px;
  margin: 0 auto;
  position: relative;
  top: -50px;
  // background: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  .hotRecommend {
    margin-top: 30px;
    // background: #FE5021;
    padding: 10px;
  }
  .hot-title {
    margin-top: 10px;
    // border-top: 1px solid #e8e8e8;
    span {
      position: relative;
      top: -11px;
      padding: 0px 5px;
      font-size: 17px;
      font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
      color: black;
      font-weight: bold;
    }
  }
  .hotcom {
    // background: #ddd;
    // width: 350px;
    padding-bottom: 50px;
    display: flex;
    flex-wrap: wrap;
  }
  .h_items {
    width: calc(50% - 30px);
    margin-right: 10px;
    margin-bottom: 10px;
    margin-left: 3px;
    &:nth-child(2n) {
      margin-right: 0px;
    }
  }

  
}
.indicator-box {
    position: absolute;
    right: 150px;
    bottom: 30px;
    display: flex;
  }
  .indicator-item {
    // border-radius: 50%;
    height: 4px;
    width: 10px;
    background: #fff;
    margin: 0 3px;
    transition: all 0.3s linear;
  }
  .indicator-item.active {
    background-color: #CD585E;
    width: 16px;
  }
</style>
