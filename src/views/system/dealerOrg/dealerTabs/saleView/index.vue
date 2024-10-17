<template>
  <div class='sale-view-container'>
    <div class="pb10">
      <el-button type="primary" icon="Plus" @click="addSaleView">增加</el-button>
    </div>
    <base-dialog :title="title" ref="baseDialogRef" @confirm="confirm" @cancel="cancel">
      <base-form ref="baseFormRef" labelWidth="130px" :formItems="formItems" :form="form"></base-form>
    </base-dialog>
    <base-table :columns="columns" :loading="loading" :data="tableData">
      <template #operations="{scope}">
        <el-button link type="primary" @click="editRow(scope.row)">编辑</el-button>
        <el-button link type="primary" :disabled="scope.row.status==1" @click="freeze(scope.row)">冻结</el-button>
        <el-button link type="primary" :disabled="scope.row.status==0" @click="unfreeze(scope.row)">解冻</el-button>
      </template>
    </base-table>
    <pagination :total="total" v-model:page="queryParams.pageIndex" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </div>
</template>

<script setup name=''>
import {
  listSaleView,
  updateSaleViewStatus,
  saveSaleView,
  getSaleViewById,
} from "@/api/system/dealerOrg/sapSaleView.js";
const { proxy } = getCurrentInstance();
const title = ref("");
const loading = ref(false);
const total = ref(0);
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
});
const columns = reactive({
  sapOrgCode: { label: "SAP组织编码" },
  saleOrg: { label: "销售组织" },
  channel: { label: "渠道", dictType: "DISTRIBUTION_CHANNEL" },
  productGroup: { label: "产品组", dictType: "PRODUCT_GROUP" },
  currency: { label: "订单货币" },
  saleGroup: { label: "销售组", dictType: "SALES_GROUP" },
  interCommercialTerms: {
    label: "国际贸易条件",
    dictType: "INTER_COMMERCIAL_TERMS",
  },
  interCommercialDescribe: { label: "国际贸易条件描述" },
  taxCategory: { label: "税分类", dictType: "TAX_CATEGORY" },
  status: { label: "状态", dictType: "FREEZE_STATUS" },
  operations: { label: "操作", slot: "operations", width: 150, fixed: "right" },
});
const tableData = ref([]);
const formData = reactive({
  formItems: {
    channel: {
      type: "select",
      label: "渠道",
      span: 12,
      dictType: "DISTRIBUTION_CHANNEL",
      rule: [{ required: true }],
    },
    productGroup: {
      type: "select",
      label: "产品组",
      span: 12,
      dictType: "PRODUCT_GROUP",
      rule: [{ required: true }],
    },
    currency: {
      type: "text",
      label: "订单货币",
      span: 12,
      text: "CNY",
    },
    saleGroup: {
      type: "select",
      label: "销售组",
      dictType: "SALES_GROUP",
      span: 12,
      rule: [{ required: true }],
    },
    interCommercialTerms: {
      type: "select",
      label: "国际贸易条件",
      dictType: "INTER_COMMERCIAL_TERMS",
      span: 12,
    },
    interCommercialDescribe: {
      type: "input",
      label: "国际贸易条件描述",
      span: 12,
    },
    taxCategory: {
      type: "select",
      label: "税分类",
      span: 12,
      dictType: "TAX_CATEGORY",
      rule: [{ required: true }],
    },
  },
  form: {
    currency: "CNY",
    status: "0",
  },
});
const { formItems, form } = toRefs(formData);
let dealerId = inject("orgId");
const cancel = () => {
  proxy.$refs["baseFormRef"].resetForm();
};
const confirm = () => {
  proxy.$refs["baseFormRef"].validate((valid) => {
    if (valid) {
      form.value.dealerId = dealerId.value;
      saveSaleView(form.value).then((res) => {
        proxy.$modal.msgSuccess(form.value.id ? "修改成功" : "添加成功");
        proxy.$refs["baseDialogRef"].close();
        getList();
      });
    }
  });
};
const addSaleView = (row) => {
  title.value = "添加销售视图";
  proxy.$refs["baseDialogRef"].open();
  delete form.value.id;
};
const editRow = (row) => {
  title.value = "修改销售视图";
  proxy.$refs["baseDialogRef"].open();
  proxy.$refs["baseDialogRef"].isLoading(true);
  getSaleViewById({ id: row.id })
    .then((res) => {
      proxy.setFormData(formItems.value, form.value, res.data);
    })
    .finally(() => {
      proxy.$refs["baseDialogRef"].isLoading(false);
    });
};
const freeze = (row) => {
  proxy.$modal.confirm("确认冻结？").then(function () {
    updateStatus({ id: row.id, status: "1" });
  });
};
const unfreeze = (row) => {
  proxy.$modal.confirm("确认解冻？").then(function () {
    updateStatus({ id: row.id, status: "0" });
  });
};
const updateStatus = (data) => {
  updateSaleViewStatus(data).then((res) => {
    proxy.$modal.msgSuccess("操作成功");
    getList();
  });
};
const getList = () => {
  loading.value = true;
  listSaleView({ dealerId: dealerId.value, ...queryParams })
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
</style>