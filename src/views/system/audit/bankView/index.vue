<template>
  <div class='app-container'>
    <base-table-search :queryFormItems="queryFormItems" :queryParams="queryParams" @handleQuery="handleQuery" @resetQuery="resetQuery">
    </base-table-search>
    <base-table :columns="columns" :loading="loading" :data="tableData">
      <template #file="{scope}">
        <div v-if="scope.row.file.length">
          <el-button link type="primary" @click="downFileRow(scope.row)">文件下载</el-button>
        </div>
        <div v-else>
          暂无文件
        </div>
      </template>
      <template #operations="{scope}">
        <el-button link type="primary" :disabled="scope.row.auditStatus!='0'" @click="auditRow(scope.row)">审核</el-button>
        <el-button link type="primary" @click="auditRecordRow(scope.row)">审核记录</el-button>
      </template>
    </base-table>
    <bank-record-dialog ref="bankRecordDialogRef"></bank-record-dialog>
    <pagination :total="total" v-model:page="queryParams.pageIndex" v-model:limit="queryParams.pageSize" @pagination="getList" />
    <base-dialog :title="title" ref="baseDialogRef" isSoltFooter>
      <template #footer>
        <div class="flex flex-r-center">
          <el-button type="success" icon="Select" @click="confirm('1')">通过</el-button>
          <el-button type="danger" icon="CloseBold" @click="confirm('2')">拒绝</el-button>
          <el-button icon="SwitchButton" @click="cancel">取消</el-button>
        </div>
      </template>
      <base-form ref="baseFormRef" :formItems="formItems" :form="form" labelWidth="150px"></base-form>
    </base-dialog>
  </div>
</template>

<script setup name="BankView">
import { listBankView, saveBankAuditRecord } from "@/api/system/audit/bankView";
import bankRecordDialog from "./bankRecordDialog.vue";
const { proxy } = getCurrentInstance();
const queryFormItems = reactive({
  bankHead: { label: "银行户主", type: "input" },
  bankAccount: { label: "银行账号", type: "input" },
  auditStatus: { label: "审核状态", type: "select", dictType: "AUDIT_STATUS" },
});
const loading = ref(false);
const total = ref(0);
const title = ref("");
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
  auditStatus: "0",
});

const columns = reactive({
  sapCustomerName: { label: "SAP客户主数据名称" },
  bankCode: { label: "银行", dictType: "SAP_BANK_CODE" },
  bankHead: { label: "银行户主" },
  bankAccount: { label: "银行账号" },
  openingBank: { label: "开户行" },
  file: { label: "附件", slot: "file" },
  auditStatus: { label: "审核状态", dictType: "AUDIT_STATUS" },
  remark: { label: "备注" },
  operations: { label: "操作", slot: "operations", width: 150, fixed: "right" },
});
const tableData = ref([]);
const formData = reactive({
  formItems: {
    sapCustomerName: {
      label: "SAP客户主数据名称",
      type: "text",
      text: "中国",
      span: 12,
    },
    bankHead: {
      label: "银行户主",
      type: "text",
      span: 12,
    },
    bankAccount: {
      label: "银行账号",
      type: "text",
      span: 12,
    },
    openingBank: {
      label: "开户行",
      type: "text",
      span: 12,
    },
    expireDate: {
      label: "过期时间",
      type: "date",
      span: 12,
    },
    remark: { label: "备注", type: "textarea", span: 24 },
  },
  form: {},
});
const { formItems, form } = toRefs(formData);
const handleQuery = (data) => {
  queryParams.pageIndex = 1;
  getList();
};
const resetQuery = (data) => {
  getList();
};
const getList = () => {
  loading.value = true;
  listBankView(queryParams)
    .then((res) => {
      tableData.value = res.data.items;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const auditRow = (row) => {
  title.value = "审核";
  proxy.$refs["baseDialogRef"].open();
  formItems.value.sapCustomerName.text = row.sapCustomerName;
  formItems.value.bankHead.text = row.bankHead;
  formItems.value.bankAccount.text = row.bankAccount;
  formItems.value.openingBank.text = row.openingBank;
  form.value.bankInfoId = row.id;
};
const auditRecordRow = (row) => {
  proxy.$refs["bankRecordDialogRef"].open();
  proxy.$refs["bankRecordDialogRef"].bankInfoId = row.id;
  proxy.$refs["bankRecordDialogRef"].getList();
};
const downFileRow = (row) => {
  proxy.download([row.file[0].id], row.file[0].fileName);
};
const confirm = (auditStatus) => {
  proxy.$refs["baseFormRef"].validate((valid) => {
    if (valid) {
      form.value.auditStatus = auditStatus;
      saveBankAuditRecord(form.value).then((res) => {
        proxy.$modal.msgSuccess("审核成功");
        cancel();
        getList();
      });
    }
  });
};
const cancel = () => {
  proxy.$refs["baseFormRef"].resetForm();
  proxy.$refs["baseDialogRef"].close();
};
getList();
</script>

<style lang='scss' scoped>
.all-org-container {
  padding-bottom: 10px;
}
</style>