<template>
  <div class="shopcar">
    <van-nav-bar title="购物车" left-text="返回" left-arrow @click-left="back">
      <template #right>
        <div @click="toggleEsta" v-if="shopcarData.length > 0">
          {{ !edit ? "编辑" : "完成" }}
        </div>
      </template>
    </van-nav-bar>
    <div v-if="shopcarData.length > 0">
      <div class="advertising"></div>

      <div class="carDetail">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多订单了"
          offset="100"
          @load="loadShopData"
        >
          <van-swipe-cell
            class="shopcar_cell"
            :disabled="!edit"
            v-for="(item, index) in shopcarData"
            :key="item.sid"
          >
            <div class="carDetail-item">
              <div class="checks">
                <van-checkbox
                  v-model="item.checked"
                  icon-size="22px"
                  @change="singleSel"
                ></van-checkbox>
              </div>
              <div class="cD-info">
                <div class="cD-info-img">
                  <img class="auto-img" :src="item.small_img" alt="" />
                </div>
                <div class="cD-info-txt">
                  <div class="txt-box">
                    <div class="txt_name">
                      <div class="txt_left">{{ item.name }}</div>
                      <div class="txt_right">{{ item.rule }}</div>
                    </div>
                    <div class="txt_enname">{{ item.enname }}</div>
                  </div>
                  <div class="num-box">
                    <div class="dtl_price">&yen;{{ item.price }}</div>
                    <div class="dtl_num">
                      <van-stepper
                        v-model="item.count"
                        theme="round"
                        button-size="22"
                        disable-input
                        @change="renovateShop(item.sid, item.count)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <template #right>
              <van-button
                square
                class="del_btn"
                color="#CD585E"
                text="删除"
                @click="delSingle([item.sid], index)"
              />
            </template>
          </van-swipe-cell>
        </van-list>
      </div>

      <van-submit-bar
        v-show="!edit"
        :price="total"
        button-text="提交订单"
        button-color="#CD585E"
        @submit="commit"
      >
        <van-checkbox v-model="ischeck" @click="selAll">全选</van-checkbox>
      </van-submit-bar>

      <van-submit-bar
        v-show="edit"
        button-text="删除所选"
        button-color="#CD585E"
        @submit="delSelSingle"
      >
        <van-checkbox v-model="ischeck" @click="selAll">全选</van-checkbox>
      </van-submit-bar>
    </div>

    <div v-else>
      <van-empty description="购物袋没有数据，赶紧去逛一逛！">
        <div class="guang" @click="back">去点餐</div>
      </van-empty>
    </div>
  </div>
</template>

<script>
import "../assets/less/shopcart.less";
import { mapMutations, mapState } from "vuex";
export default {
  name: "ShoppingCar",
  data() {
    return {
      //是否编辑商品
      edit: false,

      //全选或者取消全选
      ischeck: false,

      //购物车所有数据
      AllshopData: [],

      //购物车数据
      shopcarData: [],

      //开始截取下标
      start: 0,

      //每次获取7条数据
      count: 7,

      //是否加载,首次不触发
      loading: true,

      //是否全部加载完毕
      finished: false,

      //总金额
      total: 0,
    };
  },
  created() {
    this.getshopcarData();
  },
  computed: {
    ...mapState(["mapState"]),
  },
  methods: {
    ...mapMutations(["changeShopcarCount"]),

    back() {
      this.$router.go(-1);
    },
    //切换编辑状态
    toggleEsta() {
      this.edit = !this.edit;
    },

    //获取购物车商品数据
    getshopcarData() {
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
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          // console.log(res);
          this.$toast.clear();

          if (res.data.code === 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 5000) {
            res.data.result.forEach((v) => {
              v.checked = false;
            });

            this.AllshopData = res.data.result;

            this.shopcarData = this.AllshopData.slice(
              this.start,
              this.start + this.count
            );

            this.start += this.count;

            //下次触底进行懒加载
            this.loading = false;
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

    //加载数据
    loadShopData() {
      setTimeout(() => {
        console.log("加载");
        let data = this.AllshopData.slice(this.start, this.start + this.count);

        this.shopcarData.push(...data);

        // console.log(this.shopcarData)

        this.start += this.count;

        if (data.length > 0) {
          this.ischeck = false;
        }

        //如果本次截取不足this.count条数据,下次不可能有数据
        if (data.length < this.count) {
          this.finished = true;
          return;
        }

        // 下次进行触底懒加载
        this.loading = false;
      }, 800);
    },

    //修改购物车的数量
    renovateShop(sid, count) {
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
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid,
          count,
        },
      })
        .then((res) => {
          console.log(res);
          this.$toast.clear();

          if (res.data.code === 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 6000) {
            this.totalmoney();
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },

    //全选
    selAll() {
      //将所有单选状态修改为全选状态
      this.shopcarData.forEach((v) => {
        v.checked = this.ischeck;
      });
      this.totalmoney();
    },

    //单选
    singleSel() {
      this.totalmoney();

      //只要有一个是单选没有勾选,则全选不能被勾选
      for (let i = 0; i < this.shopcarData.length; i++) {
        if (!this.shopcarData[i].checked) {
          this.ischeck = false;
          return;
        }
      }
      this.ischeck = true;
    },

    //单删购物车数据
    delSingle(sids, index) {
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
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids),
        },
      })
        .then((res) => {
          console.log(res);
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code == 7000) {
            if (index !== undefined) {
              this.shopcarData.splice(index, 1);

              this.changeShopcarCount(this.shopCarcount - 1);

              this.singleSel();
            } else {
              for (let i = 0; i < this.shopcarData.length; i++) {
                if (this.shopcarData[i].checked) {
                  this.shopcarData.splice(i, 1);
                  i--;
                }
              }
              this.changeShopcarCount(this.shopcarData - sids.length);
              this.totalmoney();
            }

            this.$nextTick(() => {
              let cells = document.querySelectorAll(".shopcar_cell");

              if (
                cells.length === 0 &&
                this.shopcarData.length < this.AllshopData.length
              ) {
                this.loadShopData();
              } else {
                let cellSize = cells[cells.length - 1].getBoundingClientRect();

                let distance = cellSize.top;

                let cellHeight = cellSize.height;

                let innerHeight = window.innerHeight;

                if (distance + cellHeight - innerHeight <= 50) {
                  this.loadShopData();
                }
              }
            });
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

    //删除选择多个购物车数据
    delSelSingle() {
      let sids = [];
      this.shopcarData.forEach((v) => {
        if (v.checked) {
          sids.push(v.sid);
        }
      });

      if (sids.length === 0) {
        this.$toast({
          message: '未选择删除商品',
          forbidClick: true,
          duration: 2000,
        });

        return;
      }
      this.delSingle(sids);
    },

    //勾选商品总金额
    totalmoney() {
      let sum = 0;
      this.shopcarData.forEach((v) => {
        if (v.checked) {
          sum += v.price * v.count;
        }
      });

      this.total = sum * 100;
    },

    //提交订单
    commit(){
      let sids = [];
      this.shopcarData.forEach((v) => {
        if (v.checked) {
          sids.push(v.sid);
        }
      });

      if (sids.length === 0) {
        this.$toast({
          message: '选择下单的商品',
          forbidClick: true,
          duration: 2000,
        });

        return;
      }
      this.$router.push({name:'Pay',query:{sids:sids.join('-')}})
    }
  },
};
</script>