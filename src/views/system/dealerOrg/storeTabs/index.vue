<template>
  <div class="">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="门店信息" name="storeInfo">
        <store-info v-if="activeName === 'storeInfo'"></store-info>
      </el-tab-pane>
      <el-tab-pane label="人员信息" name="userInfo">
        <user-info v-if="activeName === 'userInfo'"></user-info>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import StoreInfo from "./storeInfo";
import UserInfo from "./userInfo";
const activeName = ref("storeInfo");
const { proxy } = getCurrentInstance();
proxy.emitter.on("refreshDealerTabs", () => {
  activeName.value = "";
  nextTick(() => {
    activeName.value = "storeInfo";
  });
});
const handleClick = (tab, event) => {};
</script>
<style lang="scss"  scoped>
</style>