<template>
  <li class="items" @click="getDetail(item.pid)">
    <div class="topimg">
      <img class="auto-img" :src="item.smallImg" alt="" />
    </div>
    <div class="pro_title">
      <div class="price">
        <i v-show="item.isHot === 1" class="small-hot">
          <img src="../assets/images/hotitem.png" alt="" />
        </i>
        <div :class="['pro_price',{center:item.isHot !== 1}]">&yen;{{ item.price }}</div>
        <div class="remove-icon">
          <slot name="remove"></slot>
        </div>
      </div>
      <div class="name">{{ item.name }}</div>
      <div class="enname">{{ item.enname }}</div>
    </div>
  </li>
</template>

<script>
export default {
  props: ["item", "index", "id"],
  name: "Commodityitem",
  created() {},
  methods: {
    getDetail(id) {
      this.$router.push({ name: "Detail", params: { id } });
    },
  },
};
</script>

<style lang="less" scoped>
.pro_title {
  font-size: 16px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.center{
  // text-align: center;
  margin: 0 auto;
}
.items {
  // border-radius: 50%;
  padding: 10px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  // box-shadow: 0 2px 6px rgba(0,0,0,.3);
  .price {
    color: #CD585E;
    font-size: 20px !important;
    display: flex;
    // text-align: center;
  }
  .remove-icon {
    margin-left: auto;
  }
  .name {
    text-align: center;
    margin: 5px 10px;
    font-size: 17px !important;
    font-weight: bold;
    color: #666;
  }
  .enname {
    text-align: center;
    margin: 5px 10px;
    font-size: 15px !important;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .price {
    margin: 5px 10px;
    // text-align: center;
  }
  .topimg {
    position: relative;
    border-radius: 50%;
    overflow: hidden;
  }
  .small-hot {
    // position: absolute;
    // top: 5px;
    // left: 5px;
  }
  .small-hot,
  .small-hot img {
    width: 44px;
    height: 20px;
  }
}
</style>