<template>
  <div>
    <base-table-search :queryFormItems="queryFormItems" :queryParams="queryParams" @handleQuery="handleQuery" @resetQuery="resetQuery">
    </base-table-search>
    <div class="pb10 flex">
      <div>
        <el-tooltip class="box-item" effect="dark" content="账户可用余额=预存款余额+授信款余额-预存款冻结" placement="bottom">
          <span>账户可用余额：</span>
        </el-tooltip>
        {{depositRecordData.balance}}
      </div>
      <div class="ml10">预存款余额：{{depositRecordData.preDepositBalance}}</div>
      <div class="ml10">预存款冻结：{{depositRecordData.frozenAmount}}</div>
      <div class="ml10">授信款余额：{{depositRecordData.overDraftLimit}}</div>
      <div class="ml10">资金池余额：{{depositRecordData.fundPoolAmount}}</div>
      <el-button class="ml10" type="warning" icon="Download" @click="exportFile" plain>导出</el-button>
    </div>
    <base-table :columns="columns" :loading="loading" :data="tableData">
    </base-table>
    <pagination :total="total" v-model:page="queryParams.pageIndex" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </div>
</template>

<script setup>
import {
  listFinancialDetail,
  getPreDepositRecordInfo,
} from "@/api/system/financeManage/index";
const { proxy } = getCurrentInstance();
const route = useRoute();
const queryFormItems = reactive({
  orderNo: { label: "订单编号", type: "input" },
  subOrderNo: { label: "子订单编号", type: "input" },
  date: { label: "时间", type: "datetimerange" },
});
const loading = ref(false);
const total = ref(0);
const financeDealerData = inject("financeDealerData");
const financeDealerType = inject("financeDealerType");
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
  dealerType: financeDealerType,
});
const exportQueryParams = ref({});
const depositRecordData = ref({
  balance: "0.00",
  frozenAmount: "0.00",
  fundPoolAmount: "0.00",
  preDepositBalance: "0.00",
  preDepositAvailable: "0.00",
  overDraftLimit: "0.00",
});
const columns = reactive({
  dealerName: { label: "经销商" },
  date: { label: "时间", width: 180 },
  type: { label: "类型", dictType: "ACCOUNT_TYPE" },
  amount: { label: "订单金额/元" },
  balance: { label: "账户可用余额/元" },
  preDepositBalance: { label: "预存款余额" },
  frozenAmount: { label: "预存款冻结" },
  thisDeduction: { label: "此次扣除金额" },
  residualAmount: { label: "未扣金额" },
  fundBalance: { label: "资金池余额" },
  fundDeduction: { label: "资金池变动" },
  depositDeduction: { label: "预存款变动" },
  resourceType: { label: "来源类型", dictType: "ACCOUNT_RESOURCE_TYPE" },
  orderNo: { label: "订单编号" },
  subOrderNo: { label: "子订单编号" },
  accountVoucher: { label: "会计凭证号" },
  remark: { label: "备注" },
});
const tableData = ref([]);
const getList = () => {
  loading.value = true;
  exportQueryParams.value = {
    ...proxy.addDateRange(queryParams, queryParams.date),
  };
  listFinancialDetail(proxy.addDateRange(queryParams, queryParams.date))
    .then((res) => {
      tableData.value = res.data.items;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
onMounted(() => {
  // 零售
  if (route.path === "/finance/retailFinance") {
    columns.residualAmount.isHide = true;
    columns.thisDeduction.isHide = true;
  }
  // 工程
  if (route.path === "/finance/projectFinance") {
    columns.residualAmount.isHide = false;
    columns.thisDeduction.isHide = false;
  }
});
watch(
  financeDealerData,
  (data) => {
    if (data.dealerId) {
      queryParams.dealerId = data.dealerId;
      getList();
      getPreDepositRecordInfo({
        dealerId: data.dealerId,
        dealerType: financeDealerType.value,
      }).then((res) => {
        depositRecordData.value = res.data;
      });
    }
  },
  { immediate: true }
);
const exportFile = () => {
  proxy.exportFileDown(
    "/api/FinancialDetail/Export",
    exportQueryParams.value,
    proxy.creatFileName("财务明细")
  );
};
const handleQuery = (data) => {
  queryParams.pageIndex = 1;
  getList();
};
const resetQuery = (data) => {
  getList();
};
</script>

<style lang='scss' scoped>
</style>