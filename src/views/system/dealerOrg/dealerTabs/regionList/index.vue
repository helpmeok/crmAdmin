<template>
  <div class='region-list-container'>
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
  getAreaCompanyById,
  saveAreaCompany,
  listDealerOrg,
  delDealerOrg,
  getGenerateOrgCode,
  getDealerOrgById,
} from "@/api/system/dealerOrg/index";
import { nextTick } from "vue";
const { proxy } = getCurrentInstance();
const title = ref("");
const loading = ref(false);
const total = ref(0);
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
  orgType: "COMPANY",
});
const columns = reactive({
  orgCode: { label: "组织编码" },
  orgName: { label: "组织名称" },
  orgType: { label: "组织类型", dictType: "ORG_TYPE" },
  operations: { label: "操作", slot: "operations", width: 150, fixed: "right" },
});
const tableData = ref([]);
const parentOrgId = inject("orgId");
const parentOrgName = inject("orgName");
const formData = reactive({
  formItems: {
    orgName: {
      type: "input",
      label: "区域公司名称",
      rule: [{ required: true }],
    },
    orgCode: {
      type: "input",
      label: "区域公司编码",
      inputAttrs: { disabled: true, placeholder: "" },
    },
    parentOrgName: {
      type: "input",
      label: "上级组织",
      inputAttrs: { disabled: true, placeholder: "" },
    },
    alias: {
      type: "input",
      label: "别名",
      rule: [{ required: true }],
    },
    status: {
      type: "select",
      label: "状态",
      dictType: "SYS_STATUS",

      rule: [{ required: true }],
    },
    empty: {},
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
  },
  form: {
    orgType: "COMPANY",
    parentOrgId: parentOrgId.value,
    parentOrgName: parentOrgName.value,
  },
});
const { formItems, form } = toRefs(formData);
const addBankInfo = (row) => {
  title.value = "添加区域公司";
  proxy.$refs["baseDialogRef"].open();
  nextTick(() => {
    delete form.value.id;
    // getGenerateOrgCode({ id: parentOrgId.value }).then((res) => {
    //   form.value.orgCode = res.data;
    // });
    getDealerOrgById({ id: parentOrgId.value }).then((res) => {
      form.value.province = res.data.province;
      form.value.city = res.data.city;
      form.value.town = res.data.town;
      form.value.address = res.data.address;
    });
  });
};
const editRow = (row) => {
  title.value = "修改区域公司";
  proxy.$refs["baseDialogRef"].open();
  nextTick(() => {
    getAreaCompanyById({ id: row.id }).then((res) => {
      form.value = res.data;
    });
  });
};
const delRow = (row) => {
  proxy.$modal.confirm("确认删除？").then(() => {
    delDealerOrg({ id: row.id }).then((res) => {
      proxy.$modal.msgSuccess("删除成功");
      refreshDealerTreeNode();
      getList();
    });
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
const cancel = () => {
  proxy.$refs["baseFormRef"].resetForm();
};
const confirm = () => {
  proxy.$refs["baseFormRef"].validate((valid) => {
    if (valid) {
      saveAreaCompany(form.value).then((res) => {
        proxy.$modal.msgSuccess(form.value.id ? "修改成功" : "添加成功");
        proxy.$refs["baseDialogRef"].close();
        refreshDealerTreeNode();
        getList();
      });
    }
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