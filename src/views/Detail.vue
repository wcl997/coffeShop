<template>
  <div class="detail">
    <van-nav-bar
      title="商品详情"
      left-text="返回"
      left-arrow
      @click-left="back"
    />

    <div>
      <img :src="detailData.large_img" alt="" />
    </div>

    <div class="detail-info">
      <div class="detail-box">
        <div class="detail-name">
          <div class="ch_name">{{ detailData.name }}</div>
          <div class="en_name">{{ detailData.enname }}</div>
        </div>
        <div class="detail-price">&yen;{{ detailData.price }}</div>
      </div>

      <div class="detail-size">
        <div class="d-size" v-for="(v1, i1) in detailData.rulesData" :key="i1">
          <div class="d-title">{{ v1.title }}</div>
          <div class="d-item">
            <div
              :class="{ active: v1.currentIndex == i2 }"
              v-for="(v2, i2) in v1.rule"
              :key="i2"
              @click="selRule(v1, i2)"
            >
              {{ v2.title }}
            </div>
          </div>
        </div>
      </div>

      <div class="detail-count">
        <div class="sel-count">选择数量</div>
        <div class="d-count">
          <van-stepper
            v-model="counts"
            theme="round"
            button-size="22"
            disable-input
          />
        </div>
      </div>

      <div class="d-desc">
        <div class="d-desc-tit">商品描述</div>
        <div class="d-desc-txt">
          <div v-for="(item, index) in detailData.desc" :key="index">
            {{ index + 1 }}丶{{ item }}
          </div>
        </div>
      </div>

      <van-goods-action>
        <van-goods-action-icon
          icon="cart"
          text="购物车"
          color="#666"
          @click="gotoShopcar"
          :badge="shopCarcount > 0 ? shopCarcount : ''"
        />
        <van-goods-action-icon
          icon="star"
          :text="likeSta ? '已收藏' : '收藏'"
          :color="likeSta ? '#CD585E' : '#666'"
          @click="NoYlike"
        />
        <van-goods-action-button
          class="addcart"
          color="#e8e8e8"
          type="warning"
          text="加入购物车"
          @click="addShopcar(false)"
        />
        <van-goods-action-button
          color="#CD585E"
          type="danger"
          text="立即购买"
          @click="getBuy"
        />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import "../assets/less/detail.less";
import {mapState,mapMutations} from 'vuex'
export default {
  name: "Detail",
  data() {
    return {
      // 赋值id
      id: "",

      //商品详情数据
      detailData: {},

      //收藏状态
      likeSta: false,

      //购物车商品数量记录
    //   shopCartCount: 0,

      //选择数量
      counts: 1,
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getDtldate();
    this.findLikeSta();
    this.getShopcarCount();
  },
  computed:{
      ...mapState(['shopCarcount','shopSign'])
  },
  methods: {
    back() {
      this.$router.back(-1);
    },
    //处理商品详情数据
    getDtldate() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          appkey: this.appkey,
          pid: this.id,
        },
      })
        .then((res) => {
          // console.log(res)
          this.$toast.clear();

          if (res.data.code === 600) {
            let data = res.data.result[0];
            //先处理数据res
            let rules = ["cream", "tem", "sugar", "milk"];

            data.rulesData = [];
            rules.forEach((v) => {
              //如果不存在规格,则不添加到data.rulesData
              if (!data[v]) {
                return;
              }

              let rulesText = data[v].split("/");

              let currentRule = {
                title: data[v + "_desc"],
                currentIndex: 0,
                rule: [],
              };

              rulesText.forEach((item) => {
                let o = {
                  title: item,
                };
                currentRule.rule.push(o);
              });

              data.rulesData.push(currentRule);
            });

            // console.log(data)
            data.desc = data.desc.split(/\n/);
            this.detailData = data;
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
    //选择规格
    selRule(item, index) {
      if (item.currentIndex === index) {
        return;
      }

      item.currentIndex = index;
    },

    //收藏
    like() {
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
        method: "POST",
        url: "/like",
        data: {
          appkey: this.appkey,
          pid: this.id,
          tokenString,
        },
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

          if (res.data.code === 800) {
            this.likeSta = true;
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

    //查询当前商品是否被收藏
    findLikeSta() {
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
        url: "/findlike",
        params: {
          appkey: this.appkey,
          pid: this.id,
          tokenString,
        },
      })
        .then((res) => {
          // console.log(res)
          this.$toast.clear();

          if (res.data.code === 700) {
            return;
          }

          if (res.data.code === 1000) {
            if (res.data.result.length > 0) {
              this.likeSta = true;
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },

    //取消收藏
    donLike() {
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
        method: "POST",
        url: "/notlike",
        data: {
          appkey: this.appkey,
          pid: this.id,
          tokenString,
        },
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

          if (res.data.code === 900) {
            if (res.data.result === 1) {
              this.likeSta = false;
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
    },

    //收藏与取消收藏
    NoYlike() {
      if (this.likeSta) {
        //取消收藏
        this.donLike();
      } else {
        // 收藏
        this.like();
      }
    },

    ...mapMutations(['changeShopcarCount','changeshopSign']),

    //添加购物车
    addShopcar(isBuy) {
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        console.log("浏览器token不存在");
        return;
      }
      // console.log(tokenString)

      let rules = [];

      this.detailData.rulesData.forEach((v) => {
        rules.push(v.rule[v.currentIndex].title);
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/addShopcart",
        data: {
          appkey: this.appkey,
          pid: this.id,
          tokenString,
          count: this.counts,
          rule: rules.join("/"),
        },
      })
        .then((res) => {
          console.log(res);
          this.$toast.clear();

          //没有登录
          if (res.data.code === 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 3000) {
            if (res.data.status === 1) {
              this.changeShopcarCount(this.shopCarcount + 1)
              this.$toast({
                message: res.data.msg,
                forbidClick: true,
                duration: 3000,
              });
            }

            if(isBuy){
              this.$router.push({name:'Pay',query:{sids:res.data.sid}})
            }
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

    //跳到购物车页面
    gotoShopcar(){
        this.$router.push({name:'ShoppingCar'});
    },

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

    //立即购买
    getBuy(){
      this.addShopcar(true)
    }
  },
};
</script>
