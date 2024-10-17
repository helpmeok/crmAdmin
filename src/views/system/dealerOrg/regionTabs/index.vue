<template>
  <div class="">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="区域公司列表" name="regionList">
        <region-list v-if="activeName==='regionList'"></region-list>
      </el-tab-pane>
      <el-tab-pane label="门店列表" name="storeList">
        <store-list v-if="activeName==='storeList'"></store-list>
      </el-tab-pane>
      <el-tab-pane label="人员信息" name="userInfo">
        <user-info v-if="activeName==='userInfo'"></user-info>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import RegionList from "./regionList";
import StoreList from "./storeList";
import UserInfo from "./userInfo";

const activeName = ref("regionList");
const { proxy } = getCurrentInstance();
proxy.emitter.on("refreshDealerTabs", () => {
  activeName.value = "";
  nextTick(() => {
    activeName.value = "regionList";
  });
});
const handleClick = (tab, event) => {};
</script>
<style lang="scss"  scoped>
</style>