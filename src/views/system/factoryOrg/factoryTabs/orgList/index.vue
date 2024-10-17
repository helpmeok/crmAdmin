<template>
  <div class='org-list-container'>
    <div class="pb10">
      <el-button type="primary" icon="Plus" @click="addBankInfo">增加</el-button>
    </div>
    <base-dialog :title="title" ref="baseDialogRef" size="large" @confirm="confirm" @cancel="cancel">
      <dept-form ref="deptFormRef"></dept-form>
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
import deptForm from "../../deptForm";
import {
  listFactoryOrg,
  saveFactoryOrg,
  delFactoryOrg,
  getFactoryOrgById,
} from "@/api/system/factoryOrg/index";
const { proxy } = getCurrentInstance();
const title = ref("");
const deptFormRef = ref(null);
const loading = ref(false);
const total = ref(0);
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 10,
  orgType: "DEPARTMENT",
});
const columns = reactive({
  orgCode: { label: "组织编码" },
  orgName: { label: "组织名称" },
  orgType: { label: "组织类型", dictType: "FACTORY_TYPE" },
  operations: { label: "操作", slot: "operations", width: 150, fixed: "right" },
});
const tableData = ref([]);
let orgId = inject("orgId");
let orgName = inject("orgName");
const addBankInfo = (row) => {
  title.value = "添加部门";
  proxy.$refs["baseDialogRef"].open();
  nextTick(() => {
    deptFormRef.value.form.parentOrgName = orgName.value;
    deptFormRef.value.formItems.orgCode.inputAttrs.disabled = false;
  });
};
const editRow = (row) => {
  title.value = "修改部门";
  proxy.$refs["baseDialogRef"].open();
  nextTick(() => {
    deptFormRef.value.formItems.orgCode.inputAttrs.disabled = true;
    getFactoryOrgById({ id: row.id }).then((res) => {
      deptFormRef.value.form = res.data;
    });
  });
};
const delRow = (row) => {
  proxy.$modal.confirm("确认删除？").then((res) => {
    delFactoryOrg({ id: row.id }).then((res) => {
      proxy.$modal.msgSuccess("删除成功");
      refreshFactoryTreeNode();
      getList();
    });
  });
};
const getList = () => {
  loading.value = true;
  listFactoryOrg({ id: orgId.value, ...queryParams })
    .then((res) => {
      tableData.value = res.data.items;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const cancel = () => {
  deptFormRef.value.baseFormRef.resetForm();
};
const confirm = () => {
  deptFormRef.value.baseFormRef.validate((valid) => {
    if (valid) {
      deptFormRef.value.form.parentOrgId = orgId.value;
      deptFormRef.value.form.orgType = "DEPARTMENT";
      saveFactoryOrg(deptFormRef.value.form).then((res) => {
        proxy.$modal.msgSuccess(
          deptFormRef.value.form.id ? "修改成功" : "添加成功"
        );
        proxy.$refs["baseDialogRef"].close();
        refreshFactoryTreeNode();
        getList();
      });
    }
  });
};
const refreshFactoryTreeNode = () => {
  proxy.emitter.emit("refreshFactoryTreeNode", {
    id: orgId.value,
    currentId: orgId.value,
  });
};
getList();
</script>

<style lang='scss' scoped>
</style>