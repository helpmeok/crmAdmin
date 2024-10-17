<template>
  <div class="dealer-tabs-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="经销商组织" name="dealerInfo">
        <dealer-info v-if="activeName === 'dealerInfo'"></dealer-info>
      </el-tab-pane>
      <el-tab-pane label="SAP银行信息" name="bankInfo">
        <bank-info v-if="activeName === 'bankInfo'"></bank-info>
      </el-tab-pane>
      <el-tab-pane label="SAP销售视图" name="saleView">
        <sale-view v-if="activeName === 'saleView'"></sale-view>
      </el-tab-pane>
      <el-tab-pane label="区域公司列表" name="regionList">
        <region-list v-if="activeName === 'regionList'"></region-list>
      </el-tab-pane>
      <el-tab-pane label="人员信息" name="userInfo">
        <user-info v-if="activeName === 'userInfo'"></user-info>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import DealerInfo from "./dealerInfo";
import BankInfo from "./bankInfo";
import SaleView from "./saleView";
import RegionList from "./regionList";
import UserInfo from "./userInfo";
const activeName = ref("dealerInfo");
const { proxy } = getCurrentInstance();
proxy.emitter.on("refreshDealerTabs", () => {
  activeName.value = "";
  nextTick(() => {
    activeName.value = "dealerInfo";
  });
});
const handleClick = (tab, event) => {};
</script>
<style lang="scss"  scoped>
.dealer-tabs-container {
  width: 100%;
  height: 100%;
}
</style>