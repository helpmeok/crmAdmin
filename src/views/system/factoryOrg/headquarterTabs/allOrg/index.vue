<template>
  <div class='all-org-container'>
    <div class="pb10">
      <el-button type="primary" icon="Plus" @click="addFactory">增加</el-button>
    </div>
    <base-dialog :title="title" ref="addfactoryDialogRef" size="large" @confirm="addFactoryConfirm" @cancel="addFactoryCancel">
      <dept-form ref="factoryFormRef"></dept-form>
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

<script setup>
import {
  listFactoryOrg,
  saveFactoryOrg,
  delFactoryOrg,
  getFactoryOrgById,
} from "@/api/system/factoryOrg/index";
import deptForm from "../../deptForm";
const { proxy } = getCurrentInstance();
const loading = ref(false);
const total = ref(0);
const addfactoryDialogRef = ref(null);
const factoryFormRef = ref(null);
const title = ref("");
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15,
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
const getList = () => {
  loading.value = true;
  listFactoryOrg(queryParams)
    .then((res) => {
      tableData.value = res.data.items;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
// 新增工厂
const addFactory = () => {
  title.value = "添加分厂";
  addfactoryDialogRef.value.open();
  nextTick(() => {
    factoryFormRef.value.form.parentOrgName = orgName.value;
    factoryFormRef.value.formItems.orgCode.inputAttrs.disabled = false;
  });
};
const editRow = (row) => {
  title.value = "修改组织信息";
  addfactoryDialogRef.value.open();
  nextTick(() => {
    factoryFormRef.value.formItems.orgCode.inputAttrs.disabled = true;
    getFactoryOrgById({ id: row.id }).then((res) => {
      res.data.parentOrgName = res.data.parentOrgName || "总部工厂组织";
      factoryFormRef.value.form = res.data;
    });
  });
};
const delRow = (row) => {
  proxy.$modal.confirm("确认删除？").then(() => {
    delFactoryOrg({ id: row.id }).then((res) => {
      proxy.$modal.msgSuccess("删除成功");
      refreshFactoryTreeNode();
      getList();
    });
  });
};
const addFactoryConfirm = () => {
  factoryFormRef.value.baseFormRef.validate((valid) => {
    if (valid) {
      saveFactoryOrg(factoryFormRef.value.form).then((res) => {
        proxy.$modal.msgSuccess(
          factoryFormRef.value.form.id ? "修改成功" : "添加成功"
        );
        addfactoryDialogRef.value.close();
        refreshFactoryTreeNode();
        getList();
      });
    }
  });
};
const addFactoryCancel = () => {
  factoryFormRef.value.baseFormRef.resetForm();
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
.all-org-container {
  padding-bottom: 10px;
}
</style>