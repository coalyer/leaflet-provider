<template>
  <div class="menu-box">
    <div>
      <img class="logo-img" src="@/assets/images/home_header_logo_deep.svg" alt />
      <span>无线网络数字化运营平台</span>
    </div>
    <div class="menu-list">
      <div class="menu-item" v-for="(item, index) in menu" :key="index">{{ item }}</div>
    </div>
    <div class="logout-box">
      <img class="user-img" src="@/assets/images/home_user.svg" alt />
      <span>用户名</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      menu: [],
    }
  },
  mounted () { },
  methods: {},
};
</script>

<style lang="scss" scoped>
.menu-box {
  height: 64px;
  line-height: 64px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: #0b1224;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo-img {
    height: 50px;
    margin: 0 8px 0 20px;
  }
  .menu-list {
    display: flex;
    align-items: center;
    margin-left: 144px;
    .menu-item {
      margin-right: 82px;
      cursor: pointer;
    }
  }
  .logout-box {
    font-size: 12px;
    font-weight: 400;
    color: #455a74;
    margin-right: 20px;
    .user-img {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }
  }
}
</style>
