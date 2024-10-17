<template>
  <div class="">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane :label="type==='FACTORY'?'工厂信息':'部门信息'" name="factoryInfo">
        <factory-info v-if="activeName==='factoryInfo'"></factory-info>
      </el-tab-pane>
      <el-tab-pane label="组织列表" name="orgList">
        <org-list v-if="activeName==='orgList'"></org-list>
      </el-tab-pane>
      <el-tab-pane label="人员信息" name="userInfo">
        <user-info v-if="activeName==='userInfo'"></user-info>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import factoryInfo from "./factoryInfo";
import orgList from "./orgList";
import UserInfo from "./userInfo";
const { proxy } = getCurrentInstance();
const props = defineProps({
  type: { type: String, default: () => "" },
});
const activeName = ref("factoryInfo");
proxy.emitter.on("refreshFactoryTabs", () => {
  activeName.value = "";
  nextTick(() => {
    activeName.value = "factoryInfo";
  });
});
const handleClick = (tab, event) => {};
</script>
<style lang="scss"  scoped>
</style>