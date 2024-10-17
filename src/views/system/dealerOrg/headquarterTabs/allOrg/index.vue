<template>
  <div class='all-org-container'>
    <base-table-search :queryFormItems="queryFormItems" :queryParams="queryParams" @handleQuery="handleQuery" @resetQuery="resetQuery">
    </base-table-search>
    <base-table :columns="columns" :loading="loading" :data="tableData">
    </base-table>
    <pagination :total="total" v-model:page="queryParams.pageIndex" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </div>
</template>

<script setup>
import { listDealerOrg } from "@/api/system/dealerOrg/index";
const queryFormItems = reactive({
  sapOrgCode: { label: "SAP组织编码", type: "input" },
  orgName: { label: "组织名称", type: "input" },
  orgCode: { label: "组织编码", type: "input" },
  orgType: {
    label: "组织类型",
    type: "select",
    dictType: "ORG_TYPE",
    options: [],
  },
  status: {
    label: "机构状态",
    type: "select",
    dictType: "SYS_STATUS",

    options: [],
  },
});
const loading = ref(false);
const total = ref(0);
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
});
const columns = reactive({
  sapOrgCode: { label: "SAP组织编码" },
  orgCode: { label: "组织编码" },
  orgName: { label: "组织名称" },
  orgType: { label: "组织类型", dictType: "ORG_TYPE" },
});
const tableData = ref([]);
const handleQuery = (data) => {
  queryParams.pageIndex = 1;
  getList();
};
const resetQuery = (data) => {
  getList();
};

const getList = () => {
  loading.value = true;
  listDealerOrg(queryParams)
    .then((res) => {
      tableData.value = res.data.items;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
getList();
</script>

<style lang='scss' scoped>
.all-org-container {
  padding-bottom: 10px;
}
</style>