<template>
  <div class='all-org-container'>
    <div class="pb10 flex">
      <!-- <div>当前余额：{{depositRecordData.balance}}</div> -->
      <div class="ml10">授信款余额：{{depositRecordData.overDraftLimit}}</div>
      <el-button class="ml10" type="primary" icon="Plus" @click="add()">配置</el-button>
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
  listCreditQuota,
  getPreDepositRecordInfo,
  saveCreditQuota,
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
  balance: "0.00",
  frozenAmount: "0.00",
  fundPoolAmount: "0.00",
  overDraftLimit: "0.00",
});
const columns = reactive({
  dealerName: { label: "经销商" },
  createdDate: { label: "时间", width: 180 },
  oldQuota: { label: "旧额度" },
  newQuota: { label: "新额度" },
  operator: { label: "操作人" },
  remark: { label: "备注" },
});
const tableData = ref([]);
const formData = reactive({
  formItems: {
    dealerName: {
      label: "经销商",
      type: "input",
      span: 12,
      inputAttrs: {
        disabled: true,
      },
    },
    overDraftLimit: {
      label: "透支金额/元",
      type: "number",
      rule: [{ required: true }],
      span: 12,
    },
    remark: { label: "备注", type: "textarea", span: 24 },
  },
  form: {},
});
const { formItems, form } = toRefs(formData);
const getList = () => {
  loading.value = true;
  listCreditQuota(queryParams)
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
const add = () => {
  title.value = "授信款余额配置";
  proxy.$refs["baseDialogRef"].open();
  form.value.overDraftLimit = depositRecordData.value.overDraftLimit;
};
const confirm = () => {
  proxy.$refs["baseFormRef"].validate((valid) => {
    if (valid) {
      saveCreditQuota(form.value).then((res) => {
        proxy.$modal.msgSuccess("保存成功");
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
.all-org-container {
  padding-bottom: 10px;
}
</style>