<template>
  <div class='user-info-container'>
    <base-table-search :queryFormItems="queryFormItems" :queryParams="queryParams" @handleQuery="handleQuery" @resetQuery="resetQuery">
    </base-table-search>
    <div class="pb10">
      <el-button type="primary" icon="Plus" @click="addUserInfo">增加</el-button>
    </div>
    <base-dialog :title="title" ref="baseDialogRef" size="large" @confirm="confirm" @cancel="cancel">
      <user-form ref="userFormRef"></user-form>
    </base-dialog>
    <base-table :columns="columns" :loading="loading" :data="tableData">
      <template #operations="{scope}">
        <el-button link type="primary" @click="editRow(scope.row)">编辑</el-button>
        <el-button link type="primary" disabled>权限配置</el-button>
        <el-button link type="primary" @click="resetPwd(scope.row)">重置密码</el-button>
        <el-button link type="primary" @click="showPwd(scope.row)">显示密码</el-button>
      </template>
    </base-table>
    <pagination :total="total" v-model:page="queryParams.pageIndex" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </div>
</template>

<script setup name=''>
import userForm from "@/views/system/factoryOrg/userForm.vue";
import useUser from "@/views/system/factoryOrg/hooks/useUser";
const queryFormItems = reactive({
  name: { label: "姓名", type: "input" },
  userName: { label: "账号", type: "input" },
  status: {
    label: "状态",
    type: "select",
    dictType: "SYS_STATUS",
    options: [],
  },
});
const columns = reactive({
  name: { label: "姓名" },
  userName: { label: "账号" },
  // role: { label: "角色" },
  status: { label: "状态", dictType: "SYS_STATUS" },
  operations: { label: "操作", slot: "operations", width: 400, fixed: "right" },
});
const {
  tableData,
  title,
  loading,
  total,
  queryParams,
  handleQuery,
  resetQuery,
  showPwd,
  addUserInfo,
  editRow,
  resetPwd,
  cancel,
  confirm,
  getList,
} = useUser();
getList();
</script>

<style lang='scss' scoped>
</style>