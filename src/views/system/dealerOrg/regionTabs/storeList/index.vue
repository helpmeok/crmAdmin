<template>
  <div class='store-list-container'>
    <div class="pb10">
      <el-button type="primary" icon="Plus" @click="addBankInfo">增加</el-button>
    </div>
    <base-dialog :title="title" ref="baseDialogRef" size="large" @confirm="confirm" @cancel="cancel">
      <base-form ref="baseFormRef" :formItems="formItems" :form="form">
      </base-form>
    </base-dialog>
    <base-table :columns="columns" :loading="loading" :data="tableData">
      <template #operations="{scope}">
        <el-button link type="primary" @click="editRow(scope.row)">编辑</el-button>
        <el-button link type="primary" @click="delRow(scope.row)">删除</el-button>
      </template>
    </base-table>
    <pagination :total="total" v-model:page="queryParams.pageIndex" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </div>
</template>

<script setup name=''>
import {
  getStoreById,
  saveStore,
  listDealerOrg,
  delDealerOrg,
  getGenerateOrgCode,
  getAreaCompanyById,
} from "@/api/system/dealerOrg/index";
const { proxy } = getCurrentInstance();
const title = ref("");
const loading = ref(false);
const total = ref(0);
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
  orgType: "STORE",
});
const columns = reactive({
  orgCode: { label: "组织编码" },
  orgName: { label: "组织名称" },
  orgType: { label: "组织类型", dictType: "ORG_TYPE" },
  operations: { label: "操作", slot: "operations", width: 150, fixed: "right" },
});
let parentOrgId = inject("orgId");
let parentOrgName = inject("orgName");
const tableData = ref([]);
const formData = reactive({
  formItems: {
    dealerInfoTitle: { isTitleBar: true, label: "经销商组织信息", span: 24 },
    orgName: { type: "input", label: "门店名称", rule: [{ required: true }] },
    orgCode: {
      type: "input",
      label: "门店编码",
      inputAttrs: { disabled: true, placeholder: "" },
    },
    parentOrgName: {
      type: "input",
      label: "上级组织",
      inputAttrs: { disabled: true, placeholder: "" },
    },
    alias: { type: "input", label: "别名", rule: [{ required: true }] },
    dealerChannel: {
      type: "select",
      label: "经销商渠道",
      dictType: "CHANNEL_ORG",
      rule: [{ required: true }],
    },
    status: {
      type: "select",
      label: "状态",
      dictType: "SYS_STATUS",

      rule: [{ required: true }],
    },
    province: {
      type: "select",
      label: "省",
      span: 8,
      optionLabelKey: "name",
      optionValueKey: "code",
      rule: [{ required: true }],
    },
    city: {
      type: "select",
      label: "市",
      span: 8,
      optionLabelKey: "name",
      optionValueKey: "code",
      rule: [{ required: true }],
    },
    town: {
      type: "select",
      label: "县区镇",
      span: 8,
      optionLabelKey: "name",
      optionValueKey: "code",
    },
    address: {
      type: "input",
      label: "地址",
      span: 24,
      rule: [{ required: true }],
    },
    square: {
      type: "number",
      label: "面积",
      precision: 2,
      step: 100,
    },
    SAPInfoTitle: { isTitleBar: true, label: "SAP信息", span: 24 },
    businessLicence: { type: "input", label: "营业执照号", span: 12 },
    idCard: { type: "input", label: "身份证号", span: 12 },
    storeChannel: {
      type: "select",
      label: "门店分销渠道",
      showLabelTip: true,
      span: 12,
      dictType: "DISTRIBUTION_CHANNEL",
      rule: [{ required: true }],
    },
    storeProductGroup: {
      type: "select",
      label: "门店产品组",
      span: 12,
      dictType: "PRODUCT_GROUP",
      rule: [{ required: true }],
    },
  },
  form: {
    orgType: "STORE",
    parentOrgId: parentOrgId.value,
    parentOrgName: parentOrgName.value,
  },
});
const { formItems, form } = toRefs(formData);

const addBankInfo = (row) => {
  title.value = "添加门店";
  proxy.$refs["baseDialogRef"].open();
  nextTick(() => {
    delete form.value.id;
    // getGenerateOrgCode({ id: parentOrgId.value }).then((res) => {
    //   form.value.orgCode = res.data;
    // });
    getAreaCompanyById({ id: parentOrgId.value }).then((res) => {
      form.value.province = res.data.province;
      form.value.city = res.data.city;
      form.value.town = res.data.town;
      form.value.address = res.data.address;
    });
  });
};
const editRow = (row) => {
  title.value = "修改门店";
  proxy.$refs["baseDialogRef"].open();
  nextTick(() => {
    getStoreById({ id: row.id }).then((res) => {
      form.value = res.data;
    });
  });
};
const delRow = (row) => {
  proxy.$modal.confirm("确认删除？").then(function () {
    delDealerOrg({ id: row.id }).then((res) => {
      proxy.$modal.msgSuccess("删除成功");
      refreshDealerTreeNode();
      getList();
    });
  });
};
const cancel = () => {
  proxy.$refs["baseFormRef"].resetForm();
};
const confirm = () => {
  proxy.$refs["baseFormRef"].validate((valid) => {
    if (valid) {
      saveStore(form.value).then((res) => {
        proxy.$modal.msgSuccess(form.value.id ? "修改成功" : "添加成功");
        proxy.$refs["baseDialogRef"].close();
        refreshDealerTreeNode();
        getList();
      });
    }
  });
};
const getList = () => {
  loading.value = true;
  listDealerOrg({ id: parentOrgId.value, ...queryParams })
    .then((res) => {
      tableData.value = res.data.items;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const refreshDealerTreeNode = () => {
  proxy.emitter.emit("refreshDealerTreeNode", {
    id: parentOrgId.value,
    currentId: parentOrgId.value,
  });
};
getList();
</script>

<style lang='scss' scoped>
</style>