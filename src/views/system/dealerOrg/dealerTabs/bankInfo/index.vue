<template>
  <div class='bank-info-container'>
    <div class="pb10">
      <el-button type="primary" icon="Plus" @click="addBankInfo">增加</el-button>
    </div>
    <base-dialog :title="title" ref="baseDialogRef" size="large" @confirm="confirm" @cancel="cancel">
      <base-form ref="baseFormRef" :formItems="formItems" :form="form">
        <template #uploadFile>
          <file-upload ref="fileUploadRef" btnText="上传文件" :apiData="{type:1}" :limit="1" :isLimitSizeType="false"
                       @uploadedSuccessfully="uploadedSuccessfully"></file-upload>
        </template>
        <template #filesTable>
          <div class="files-table-box">
            <base-table :columns="filesColumns" :isAutoHeight="false" :data="filesTableData">
              <template #fileName="{scope}">
                <el-image ref="imgViewRef" style="display: none" :initial-index="1" :preview-teleported="true" :src="imageUrls[0]"
                          :preview-src-list="imageUrls" />
                <div v-if="isImage(scope.row.fileName)">
                  <span class="link-type" @click="showImage(scope.row.linkUrl)">{{scope.row.fileName}}</span>
                </div>
                <div v-else>{{scope.row.fileName}}</div>
              </template>
              <template #sizeToKb="{scope}">
                {{Math.ceil(scope.row.size/1024)}}
              </template>
              <template #operations="{scope}">
                <el-button link type="primary" @click="delFileRow(scope.row,scope.$index)">删除</el-button>
                <el-button link type="primary" @click="downFileRow(scope.row)">下载</el-button>
              </template>
            </base-table>
          </div>
        </template>
      </base-form>
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
  listBankInfo,
  updateBankInfoStatus,
  updateBankInfoAudit,
  saveBankInfo,
  getBankInfoById,
} from "@/api/system/dealerOrg/sapBankInfo.js";
import { delFile, getFileList, downLoadFile } from "@/api/common";
import { isImage } from "@/utils/index";
const { proxy } = getCurrentInstance();
const title = ref("");
const loading = ref(false);
const total = ref(0);
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
});
const columns = reactive({
  bankCode: { label: "银行代码", dictType: "SAP_BANK_CODE" },
  bankHead: { label: "银行户主" },
  openingBank: { label: "开户行", width: 200 },
  bankAccount: { label: "银行账号", width: 200 },
  bankCountry: { label: "银行国家" },
  status: { label: "状态", dictType: "SYS_STATUS" },
  auditStatus: { label: "审核状态", dictType: "AUDIT_STATUS" },
  operations: { label: "操作", slot: "operations", width: 150, fixed: "right" },
});
const filesColumns = reactive({
  fileName: { label: "附件名称", slot: "fileName" },
  size: { label: "附件大小(KB)", slot: "sizeToKb" },
  upLoadUser: { label: "上传者" },
  createdDate: { label: "上传时间", width: 180 },
  operations: { label: "操作", slot: "operations", width: 120, fixed: "right" },
});
const tableData = ref([]);
const filesTableData = ref([]);
let dealerId = inject("orgId");
let dealerName = inject("orgName");
const formData = reactive({
  formItems: {
    openingBank: {
      type: "input",
      label: "开户行",
      span: 16,
      rule: [{ required: true }],
    },
    tip: {
      type: "text",
      label: "",
      text: "例:xxx银行xxx省xxx市xxx网点",
      span: 8,
      dangerText: true,
    },
    bankCode: {
      type: "select",
      label: "银行代码",
      span: 12,
      dictType: "SAP_BANK_CODE",
      rule: [{ required: true }],
    },
    bankHead: {
      type: "input",
      label: "银行户主",
      span: 12,
      rule: [{ required: true }],
    },
    bankAccount: {
      type: "input",
      label: "银行账号",
      span: 12,
      rule: [{ required: true }],
    },
    bankCountry: { type: "text", label: "银行国家", text: "CN", span: 12 },
    uploadFile: { label: "附件", span: 24 },
    filesTable: { label: "", span: 24 },
  },
  form: {
    bankCountry: "CN",
    dealerId: dealerId.value,
  },
});
const { formItems, form } = toRefs(formData);

const cancel = () => {
  filesTableData.value = [];
  proxy.$refs["baseFormRef"].resetForm();
};
const confirm = () => {
  proxy.$refs["baseFormRef"].validate((valid) => {
    if (valid) {
      if (
        dealerName.value !== form.value.bankHead &&
        !filesTableData.value.length
      ) {
        proxy.$modal.msgWarning("银行户主名称与经销商名称不一致，请上传附件！");
        return;
      }
      if (filesTableData.value.length) {
        if (filesTableData.value.length > 1) {
          proxy.$modal.msgWarning("只能上传一个附件！");
          return;
        }
        form.value.fileId = filesTableData.value.map((el) => el.id);
      }
      saveBankInfo(form.value).then((res) => {
        proxy.$modal.msgSuccess(form.value.id ? "修改成功" : "添加成功");
        proxy.$refs["baseDialogRef"].close();
        getList();
      });
    }
  });
};
const addBankInfo = (row) => {
  title.value = "添加银行信息";
  proxy.$refs["baseDialogRef"].open();
  delete form.value.id;
};
const editRow = (row) => {
  title.value = "修改银行信息";
  proxy.$refs["baseDialogRef"].open();
  proxy.$refs["baseDialogRef"].isLoading(true);
  getBankInfoById({ id: row.id })
    .then((res) => {
      proxy.setFormData(formItems.value, form.value, res.data);
      getFileList({ linkId: row.id, isAll: true }).then((response) => {
        filesTableData.value = response.data.items;
      });
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
  updateBankInfoStatus(data).then((res) => {
    proxy.$modal.msgSuccess("操作成功");
    getList();
  });
};
const getList = () => {
  loading.value = true;
  listBankInfo({ dealerId: dealerId.value, ...queryParams })
    .then((res) => {
      tableData.value = res.data.items;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const uploadedSuccessfully = (fileList) => {
  filesTableData.value = [
    ...filesTableData.value,
    ...fileList.map((el) => el.fileRow),
  ];
  proxy.$refs["fileUploadRef"].clearFileList();
};
const delFileRow = (row, index) => {
  proxy.$modal.confirm("确认删除？").then(function () {
    delFile({ ids: row.id }).then((res) => {
      proxy.$modal.msgSuccess("删除成功");
      filesTableData.value.splice(index, 1);
    });
  });
};
const downFileRow = (row) => {
  proxy.download([row.id], row.fileName);
};
const imageUrls = ref([]);
const imgViewRef = ref(null);
const showImage = (img) => {
  imageUrls.value = [img];
  setTimeout(() => {
    imgViewRef.value.$el.children[0].click();
  }, 0);
};
getList();
</script>

<style lang='scss' scoped>
.bank-info-container {
  .files-table-box {
    width: calc(100% - 110px);
    margin-left: 110px;
  }
}
</style>