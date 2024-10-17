<template>
  <div class="dealer-edit-dialog">
    <base-dialog title="审核记录" ref="baseDialogRef" size="large" hideFooter>
      <base-table :columns="columns" :loading="loading" :data="tableData">
        <template #file="{scope}">
          <div v-if="scope.row.file.length">
            <el-button link type="primary" @click="downFileRow(scope.row)">文件下载</el-button>
          </div>
          <div v-else>
            暂无文件
          </div>
        </template>
      </base-table>
      <pagination :total="total" v-model:page="queryParams.pageIndex" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </base-dialog>
  </div>
</template>
<script setup>
import { listBankAuditRecord } from "@/api/system/audit/bankView";
const { proxy } = getCurrentInstance();
const loading = ref(false);
const total = ref(0);
const title = ref("");
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
});
const columns = reactive({
  sapCustomerName: { label: "SAP客户主数据名称" },
  bankHead: { label: "银行户主" },
  bankAccount: { label: "银行账号" },
  auditUser: { label: "审核人" },
  auditStatus: { label: "审核状态", dictType: "AUDIT_STATUS" },
  createdDate: { label: "审核时间", width: 180 },
  file: { label: "附件", slot: "file" },
  remark: { label: "备注" },
});
const tableData = ref([]);
const bankInfoId = ref("");
const getList = () => {
  loading.value = true;
  queryParams.bankInfoId = bankInfoId.value;
  listBankAuditRecord(queryParams)
    .then((res) => {
      tableData.value = res.data.items;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const open = () => {
  proxy.$refs["baseDialogRef"].open();
};
const downFileRow = (row) => {
  proxy.download([row.file[0].id], row.file[0].fileName);
};
defineExpose({ open, getList, bankInfoId });
</script>
<style lang="scss"  scoped>
.dealer-edit-dialog {
  .form-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }
}
</style>