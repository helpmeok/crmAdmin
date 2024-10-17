<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24" style="border-right: 1px solid #f1f1f1;">
        <div class="head-container">
          <el-input v-model="dealerName" placeholder="经销商名称" clearable prefix-icon="el-icon-search" style="margin-bottom: 20px" />
        </div>
        <div class="tree-container">
          <el-tree ref="treeRef" :props="defaultProps" :data="treeData" default-expand-all :expand-on-click-node="false" :filter-node-method="filterNode"
                   node-key="dealerId" highlight-current @node-click="handleNodeClick">
          </el-tree>
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="财务明细" name="financeDetail">
            <finance-detail v-if="activeName==='financeDetail'"></finance-detail>
          </el-tab-pane>
          <el-tab-pane label="预存款" name="preDeposit">
            <pre-deposit v-if="activeName==='preDeposit'"></pre-deposit>
          </el-tab-pane>
          <el-tab-pane label="授信款" name="creditQuota">
            <credit-quota v-if="activeName==='creditQuota'"></credit-quota>
          </el-tab-pane>
          <el-tab-pane label="资金池" name="fundRecord">
            <fund-record v-if="activeName==='fundRecord'"></fund-record>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script setup name="">
import { getDealerOrgTree } from "@/api/system/dealerOrg/index";
import financeDetail from "./financeDetail/index.vue";
import preDeposit from "./preDeposit/index.vue";
import creditQuota from "./creditQuota/index.vue";
import fundRecord from "./fundRecord/index.vue";
const { proxy } = getCurrentInstance();
const route = useRoute();
const dealerName = ref("");
const currentData = ref({});
const activeName = ref("financeDetail");
const treeData = ref([{ orgName: "总部经销商组织", dealerId: "0" }]);
const dealerType = ref("");
const defaultProps = reactive({
  children: "children",
  label: "orgName",
  value: "dealerId",
  isLeaf: "isLeaf",
});
watch(dealerName, (val) => {
  proxy.$refs["treeRef"].filter(val);
});
const handleClick = (tab, event) => {
  activeName.value = tab.paneName;
};

const handleNodeClick = (data) => {
  currentData.value = data;
};
const filterNode = (value, data) => {
  if (!value) return true;
  return data.orgName.indexOf(value) !== -1;
};
const initPage = () => {
  getDealerOrgTree({ id: "" }).then((res) => {
    treeData.value[0].children = res.data.filter((item) =>
      item.dealerType.split(",").includes(dealerType.value)
    );
    nextTick(() => {
      if (res.data.length) {
        proxy.$refs["treeRef"].setCurrentKey(res.data[0].dealerId);
        currentData.value = res.data[0];
      }
    });
  });
};
onMounted(() => {
  // 零售
  if (route.path === "/finance/retailFinance") {
    dealerType.value = "0";
  }
  // 工程
  if (route.path === "/finance/projectFinance") {
    dealerType.value = "1";
  }
  initPage();
});
provide("financeDealerData", currentData);
provide("financeDealerType", dealerType);
</script>

<style lang="scss"  scoped>
.app-container {
  height: 100%;
  .tree-container {
    height: calc(100vh - 160px);
    overflow: auto;
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>