<template>
  <div>
    <div class="pb10 flex">
      <div>
        <el-tooltip class="box-item" effect="dark" content="预存款余额=预存款可用+预存款冻结" placement="bottom">
          <span>预存款余额：</span>
        </el-tooltip>
        {{depositRecordData.preDepositBalance}}
      </div>
      <div class="ml10">预存款可用：{{depositRecordData.preDepositAvailable}}</div>
      <div class="ml10">预存款冻结：{{depositRecordData.frozenAmount}}</div>
      <el-button class="ml10" type="primary" icon="Plus" @click="add(1)">录入</el-button>
      <el-button class="ml10" type="info" icon="Close" @click="add(2)">冻结</el-button>
      <el-button class="ml10" type="success" icon="Check" @click="add(3)">解冻</el-button>
      <el-button class="ml10" type="warning" icon="Download" @click="exportFile" plain>导出</el-button>
    </div>
    <base-table :columns="columns" :loading="loading" :data="tableData">
    </base-table>
    <pagination :total="total" v-model:page="queryParams.pageIndex" v-model:limit="queryParams.pageSize" @pagination="getList" />
    <base-dialog :title="title" ref="baseDialogRef" @confirm="confirm" @cancel="cancel">
      <base-form ref="baseFormRef" :formItems="formItems" :form="form"></base-form>
    </base-dialog>
  </div>
</template>

<script setup>
import {
  listPreDepositRecord,
  getPreDepositRecordInfo,
  savePreDepositRecord,
} from "@/api/system/financeManage/index";
const { proxy } = getCurrentInstance();
const queryFormItems = reactive({
  date: { label: "时间", type: "datetimerange" },
});
const loading = ref(false);
const total = ref(0);
const title = ref("");
const financeDealerData = inject("financeDealerData");
const financeDealerType = inject("financeDealerType");
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
  dealerType: financeDealerType,
});
const exportQueryParams = ref({});
const depositRecordData = ref({
  preDepositBalance: "0.00",
  preDepositAvailable: "0.00",
  frozenAmount: "0.00",
});
const columns = reactive({
  dealerName: { label: "经销商" },
  date: { label: "录入时间", width: 180 },
  payment: { label: "打款账号" },
  amount: { label: "录入金额/元" },
  balance: { label: "余额/元" },
  operationTypeName: { label: "操作类型" },
  accountVoucher: { label: "会计凭证号" },
  rechargetype: { label: "充值类型" },
  paymentName: { label: "对方银行账号名称" },
  operator: { label: "录入人" },
  remark: { label: "备注" },
});
const tableData = ref([]);
const formData = reactive({
  formItems: {},
  form: {},
});
const { formItems, form } = toRefs(formData);
const getList = () => {
  loading.value = true;
  listPreDepositRecord(queryParams)
    .then((res) => {
      tableData.value = res.data.items;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const initPage = () => {
  getList();
  getPreDepositRecordInfo({
    dealerId: queryParams.dealerId,
    dealerType: financeDealerType.value,
  }).then((res) => {
    depositRecordData.value = res.data;
  });
};
watch(
  financeDealerData,
  (data) => {
    if (data.dealerId) {
      queryParams.dealerId = data.dealerId;
      form.value.dealerName = data.orgName;
      form.value.dealerId = data.dealerId;
      form.value.dealerType = financeDealerType.value;
      initPage();
    }
  },
  { immediate: true }
);
const exportFile = () => {
  proxy.exportFileDown(
    "/api/PreDepositRecord/Export",
    queryParams,
    proxy.creatFileName("预存款")
  );
};
const add = (type) => {
  if (type === 1) {
    title.value = "预存款录入";
    formItems.value = {
      dealerName: {
        label: "经销商",
        type: "input",
        span: 12,
        inputAttrs: {
          disabled: true,
        },
      },
      amount: {
        label: "存款金额/元",
        type: "number",
        rule: [{ required: true }],
        inputAttrs: {
          min: -Infinity,
        },
        span: 12,
      },
      date: { label: "存款日期", type: "date", span: 12 },
      remark: { label: "备注", type: "textarea", span: 24 },
    };
  }
  if (type === 2) {
    title.value = "冻结金额录入";
    formItems.value = {
      dealerName: {
        label: "经销商",
        type: "input",
        span: 12,
        inputAttrs: {
          disabled: true,
        },
      },
      amount: {
        label: "冻结金额/元",
        type: "number",
        rule: [{ required: true }],
        span: 12,
      },
      remark: { label: "备注", type: "textarea", span: 24 },
    };
  }
  if (type === 3) {
    title.value = "解冻金额录入";
    formItems.value = {
      dealerName: {
        label: "经销商",
        type: "input",
        span: 12,
        inputAttrs: {
          disabled: true,
        },
      },
      amount: {
        label: "解冻金额/元",
        rule: [{ required: true }],
        type: "number",
        span: 12,
      },
      remark: { label: "备注", type: "textarea", span: 24 },
    };
  }
  form.value.operationType = type;
  proxy.$refs["baseDialogRef"].open();
};
const confirm = () => {
  proxy.$refs["baseFormRef"].validate((valid) => {
    if (valid) {
      savePreDepositRecord(form.value).then((res) => {
        proxy.$modal.msgSuccess("录入成功");
        proxy.$refs["baseDialogRef"].close();
        initPage();
      });
    }
  });
};
const cancel = () => {
  proxy.$refs["baseFormRef"].resetForm();
};
</script>

<style lang='scss' scoped>
</style>