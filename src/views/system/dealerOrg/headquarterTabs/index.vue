<template>
  <div class="headquarter-tabs-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部组织" name="allOrg">
        <all-org v-if="activeName==='allOrg'"></all-org>
      </el-tab-pane>
      <el-tab-pane label="人员查询" name="userSearch">
        <user-search v-if="activeName==='userSearch'"></user-search>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import AllOrg from "./allOrg";
import UserSearch from "./userSearch";
const activeName = ref("allOrg");
const { proxy } = getCurrentInstance();
proxy.emitter.on("refreshDealerTabs", () => {
  activeName.value = "";
  nextTick(() => {
    activeName.value = "allOrg";
  });
});
const handleClick = (tab, event) => {};
</script>
<style lang="scss"  scoped>
.headquarter-tabs-container {
  width: 100%;
  height: 100%;
}
</style>